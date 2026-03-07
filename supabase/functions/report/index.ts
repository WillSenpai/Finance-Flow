import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { chatCompletion, extractAssistantContent } from "../_shared/ai.ts";
import { buildCorsHeaders, rejectDisallowedOrigin } from "../_shared/cors.ts";
import { requireAuthenticatedUser } from "../_shared/auth.ts";
import {
  consumeAiTokens,
  estimateTokensFromText,
  quotaExceededResponse,
} from "../_shared/quota.ts";

serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const originBlocked = rejectDisallowedOrigin(req, corsHeaders);
  if (originBlocked) return originBlocked;

  try {
    const authResult = await requireAuthenticatedUser(req, corsHeaders);
    if (!authResult.ok) return authResult.response;

    const { context } = await req.json();
    const AI_API_KEY = Deno.env.get("AI_API_KEY") ?? Deno.env.get("OPENAI_API_KEY");
    if (!AI_API_KEY) throw new Error("AI_API_KEY is not configured");

    const estimatedTokens = 700 + estimateTokensFromText(JSON.stringify(context ?? {}));
    const quota = await consumeAiTokens(authResult.user.id, estimatedTokens, "report");
    if (!quota.allowed) return quotaExceededResponse(quota, corsHeaders);

    const prompt = `Genera un report finanziario settimanale personalizzato in italiano per l'utente. 
Sii incoraggiante ma onesto. Usa emoji con moderazione. Formatta con markdown.
Includi: riepilogo spese, progresso verso gli obiettivi, consigli personalizzati.
Max 200 parole.

Contesto utente:
- Nome: ${context?.name || "Utente"}
- Patrimonio: €${context?.patrimonio || 0}
- Salvadanai: ${context?.salvadanai?.map((s: any) => `${s.nome}: €${s.attuale}/${s.obiettivo}`).join(", ") || "Nessuno"}
- Spese settimana: €${context?.speseThisWeek || 0}
- Top categorie spesa: ${context?.topCategories || "N/A"}
- Punti: ${context?.points || 0}
- Streak: ${context?.streak || 0} giorni`;

    const response = await chatCompletion({
      apiKey: AI_API_KEY,
      model: Deno.env.get("AI_BASE_MODEL"),
      messages: [
        { role: "system", content: "Sei un consulente finanziario personale che scrive report settimanali chiari e motivanti." },
        { role: "user", content: prompt },
      ],
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Troppe richieste" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Crediti AI esauriti" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const t = await response.text();
      console.error("report error:", response.status, t);
      return new Response(JSON.stringify({ error: "Errore AI" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const data = await response.json();
    const content = extractAssistantContent(data) || "Nessun report generato.";

    return new Response(JSON.stringify({ report: content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("report error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Errore" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
