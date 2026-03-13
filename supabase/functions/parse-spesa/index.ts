import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { chatCompletion } from "../_shared/ai.ts";
import { buildCorsHeaders, rejectDisallowedOrigin } from "../_shared/cors.ts";
import { requireAuthenticatedUser } from "../_shared/auth.ts";
import {
  enforceQuota,
  estimateRequestTokens,
  inferUsageFromResponse,
  resolveModelForFeature,
  trackUsageAsync,
} from "../_shared/ai_gateway.ts";

serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const originBlocked = rejectDisallowedOrigin(req, corsHeaders);
  if (originBlocked) return originBlocked;

  try {
    const authResult = await requireAuthenticatedUser(req, corsHeaders);
    if (!authResult.ok) return authResult.response;

    const { text, categorie } = await req.json() as {
      text?: string;
      categorie?: Array<{ id?: string; nome?: string; emoji?: string }>;
    };
    const AI_API_KEY = Deno.env.get("AI_API_KEY") ?? Deno.env.get("OPENAI_API_KEY");
    if (!AI_API_KEY) throw new Error("AI_API_KEY is not configured");

    const estimatedTokens = estimateRequestTokens({ base: 250, text: text ?? "" });
    const quotaGuard = await enforceQuota({
      userId: authResult.user.id,
      estimatedTokens,
      corsHeaders,
    });
    if (!quotaGuard.ok) return quotaGuard.response;

    const modelUsed = resolveModelForFeature("parse-spesa", quotaGuard.quota.plan);

    const categorieList = categorie?.map((c) => `${c.id}: ${c.nome} (${c.emoji})`).join(", ") || "";

    const response = await chatCompletion({
      apiKey: AI_API_KEY,
      model: modelUsed,
      messages: [
        {
          role: "system",
          content: `Sei un parser di spese. L'utente scriverà una spesa in linguaggio naturale in italiano. Devi estrarre importo, categoria e nota. Categorie disponibili: ${categorieList}. Usa la tool calling per restituire il risultato strutturato.`,
        },
        { role: "user", content: text },
      ],
      extraBody: {
        tools: [
          {
            type: "function",
            function: {
              name: "parse_expense",
              description: "Parse una spesa dal testo naturale",
              parameters: {
                type: "object",
                properties: {
                  importo: { type: "number", description: "Importo in euro" },
                  categoriaId: { type: "string", description: "ID della categoria" },
                  nota: { type: "string", description: "Nota descrittiva breve" },
                },
                required: ["importo", "categoriaId"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "parse_expense" } },
      },
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Troppe richieste" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Crediti AI esauriti" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const t = await response.text();
      console.error("parse-spesa error:", response.status, t);
      return new Response(JSON.stringify({ error: "Errore AI" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const data = await response.json();
    const rawArguments = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments ?? "";
    const usage = inferUsageFromResponse(data, rawArguments, text ?? "");
    await trackUsageAsync({
      userId: authResult.user.id,
      feature: "parse-spesa",
      modelUsed,
      promptTokens: usage.promptTokens,
      completionTokens: usage.completionTokens,
    });

    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      return new Response(JSON.stringify({ error: "Nessun risultato" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const parsed = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("parse-spesa error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Errore" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
