import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  chatCompletion,
  extractAssistantContent,
} from "../_shared/ai.ts";
import { buildCorsHeaders, rejectDisallowedOrigin } from "../_shared/cors.ts";
import {
  enforceQuota,
  estimateRequestTokens,
  inferUsageFromResponse,
  resolveModelForFeature,
  trackUsageAsync,
} from "../_shared/ai_gateway.ts";

function extractText(html: string): string {
  const text = html
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
    const { titolo, link } = await req.json();
    const AI_API_KEY = Deno.env.get("AI_API_KEY") ?? Deno.env.get("OPENAI_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
    if (!AI_API_KEY) throw new Error("AI_API_KEY is not configured");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error("Supabase environment is not configured");
    if (!titolo) throw new Error("Titolo mancante");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Read-only shared cache: images and summaries are generated only by news-generate-cache.
    const { data: initialCached, error: cacheReadError } = await supabase
      .from("news_cache")
      .select("summary, image")
      .eq("titolo", titolo)
      .maybeSingle();
    let cached = initialCached;

    if (cacheReadError) {
      console.error("news-summary cache read error:", cacheReadError);
    }

    if (!cached?.summary) {
      let articleContent = "";
      if (link) {
        try {
          const res = await fetch(link, {
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
            redirect: "follow",
          });
          if (res.ok) {
            articleContent = extractText(await res.text());
          }
        } catch (error) {
          console.error("news-summary fetch article error:", error);
        }
      }

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

      let userId: string | null = null;
      const authHeader = req.headers.get("Authorization");
      if (authHeader && SUPABASE_ANON_KEY) {
        const token = authHeader.replace(/^Bearer\\s+/i, "").trim();
        if (token) {
          const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            global: { headers: { Authorization: `Bearer ${token}` } },
          });
          const { data: authData } = await authClient.auth.getUser();
          userId = authData.user?.id ?? null;
        }
      }

      if (userId) {
        const estimatedTokens = estimateRequestTokens({
          base: 900,
          text: prompt,
        });
        const quotaGuard = await enforceQuota({
          userId,
          estimatedTokens,
          corsHeaders,
        });
        if (!quotaGuard.ok) return quotaGuard.response;
      }

      const modelUsed = resolveModelForFeature("news-summary", "free");
      const summaryResponse = await chatCompletion({
        apiKey: AI_API_KEY,
        model: modelUsed,
        messages: [{ role: "user", content: prompt }],
        stream: false,
      });

      if (summaryResponse.ok) {
        const summaryData = await summaryResponse.json();
        const generatedSummary = extractAssistantContent(summaryData) || null;
        if (generatedSummary && userId) {
          const usage = inferUsageFromResponse(summaryData, generatedSummary, prompt);
          await trackUsageAsync({
            userId,
            feature: "news-summary",
            modelUsed,
            promptTokens: usage.promptTokens,
            completionTokens: usage.completionTokens,
          });
        }
        if (generatedSummary) {
          const { error: cacheWriteError } = await supabase
            .from("news_cache")
            .update({ summary: generatedSummary })
            .eq("titolo", titolo);

          if (cacheWriteError) {
            console.error("news-summary cache write error:", cacheWriteError);
          } else {
            cached = { summary: generatedSummary, image: cached?.image ?? null };
          }
        }
      } else {
        console.error("news-summary summary generation failed:", summaryResponse.status, await summaryResponse.text());
      }
    }

    return new Response(JSON.stringify({
      summary: cached?.summary ?? null,
      image: cached?.image ?? null,
      cached: Boolean(cached?.summary || cached?.image),
      pending: !cached?.summary,
      link: link ?? null,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("news-summary error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Errore sconosciuto" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
