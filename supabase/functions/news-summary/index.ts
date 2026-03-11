import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  chatCompletionWithComplexFallback,
  extractAssistantContent,
} from "../_shared/ai.ts";
import { buildCorsHeaders, rejectDisallowedOrigin } from "../_shared/cors.ts";
import { requireAuthenticatedUser } from "../_shared/auth.ts";
import {
  consumeAiTokens,
  estimateTokensFromText,
  quotaExceededResponse,
} from "../_shared/quota.ts";
import { generateNewsIllustration } from "../_shared/news.ts";

function extractText(html: string): string {
  let text = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[\s\S]*?<\/nav>/gi, "")
    .replace(/<header[\s\S]*?<\/header>/gi, "")
    .replace(/<footer[\s\S]*?<\/footer>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.slice(0, 8000);
}

serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const originBlocked = rejectDisallowedOrigin(req, corsHeaders);
  if (originBlocked) return originBlocked;

  try {
    const authResult = await requireAuthenticatedUser(req, corsHeaders);
    if (!authResult.ok) return authResult.response;

    const { titolo, link } = await req.json();
    const AI_API_KEY = Deno.env.get("AI_API_KEY") ?? Deno.env.get("OPENAI_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!AI_API_KEY) throw new Error("AI_API_KEY is not configured");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error("Supabase environment is not configured");
    if (!titolo) throw new Error("Titolo mancante");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Shared cache check: if summary already exists, return it without regenerating.
    const { data: cached, error: cacheReadError } = await supabase
      .from("news_cache")
      .select("summary, image")
      .eq("titolo", titolo)
      .maybeSingle();

    if (cacheReadError) {
      console.error("news-summary cache read error:", cacheReadError);
    }

    if (cached?.summary) {
      return new Response(JSON.stringify({ summary: cached.summary, image: cached.image, cached: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const estimatedTokens = 900 + estimateTokensFromText(String(titolo ?? ""));
    const quota = await consumeAiTokens(authResult.user.id, estimatedTokens, "news-summary");
    if (!quota.allowed) return quotaExceededResponse(quota, corsHeaders);

    let articleContent = "";
    if (link) {
      try {
        const res = await fetch(link, {
          headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
          redirect: "follow",
        });
        if (res.ok) {
          const html = await res.text();
          articleContent = extractText(html);
        }
      } catch (e) {
        console.error("Failed to fetch article:", e);
      }
    }

    // 1. Generate summary
    const prompt = `Sei un giornalista finanziario esperto. Scrivi un riassunto DETTAGLIATO e APPROFONDITO di questo articolo finanziario in italiano.

Il riassunto deve essere di 8-12 frasi e deve coprire:
1. Il contesto e lo sfondo della notizia
2. I dati chiave, numeri e cifre menzionati
3. Le cause e i fattori che hanno portato a questa situazione
4. Le implicazioni pratiche per i risparmiatori e investitori italiani
5. Le prospettive future e cosa aspettarsi
6. Eventuali opinioni di esperti o analisti citati

Titolo: ${titolo}
${articleContent ? `\nContenuto dell'articolo:\n${articleContent}` : "\nNon è stato possibile recuperare il contenuto completo. Genera un riassunto basandoti sul titolo e sulle tue conoscenze finanziarie."}

Scrivi SOLO il riassunto, senza titoli o prefissi. Usa un tono professionale ma accessibile.`;

    const { response: summaryResponse, modelUsed } = await chatCompletionWithComplexFallback({
      apiKey: AI_API_KEY,
      isComplexTask: true,
      validateContent: isArticleSummaryAcceptable,
      messages: [{ role: "user", content: prompt }],
    });

    if (!summaryResponse.ok) {
      if (summaryResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Troppe richieste, riprova tra qualche secondo." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (summaryResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Crediti AI esauriti." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await summaryResponse.text();
      console.error("AI gateway error:", summaryResponse.status, t);
      throw new Error("AI gateway error");
    }

    const summaryData = await summaryResponse.json();
    const summary = extractAssistantContent(summaryData) || "Riassunto non disponibile.";
    console.log(`news-summary model used: ${modelUsed}`);

    // 2. Generate image (best-effort, don't block on failure)
    const image = await generateNewsIllustration(AI_API_KEY, titolo);

    // Persist once in shared cache so all users reuse the same summary.
    const { error: cacheWriteError } = await supabase
      .from("news_cache")
      .update({ summary, image })
      .eq("titolo", titolo);

    if (cacheWriteError) {
      console.error("news-summary cache write error:", cacheWriteError);
    }

    return new Response(JSON.stringify({ summary, image, cached: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("news-summary error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Errore sconosciuto" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function isArticleSummaryAcceptable(content: string): boolean {
  const sentences = content
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return sentences.length >= 7;
}
