import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { chatCompletion, extractAssistantContent } from "../_shared/ai.ts";
import { buildCorsHeaders, rejectDisallowedOrigin } from "../_shared/cors.ts";
import { requireAuthenticatedUser } from "../_shared/auth.ts";
import {
  enforceQuota,
  estimateRequestTokens,
  paymentRequiredResponse,
  resolveModelForFeature,
  trackUsageAsync,
} from "../_shared/ai_gateway.ts";

type WeeklyReviewAction =
  | { action: "generate" }
  | { action: "get_latest" }
  | { action: "mark_read"; reviewId: string }
  | { action: "cron_trigger"; userId?: string }; // For scheduled jobs

type SpesaCategoria = {
  categoria: string;
  totale: number;
  count: number;
};

type WeeklyData = {
  speseSettimana: number;
  speseSettimanaScorsa: number;
  spesePerCategoria: SpesaCategoria[];
  anomalie: Array<{ descrizione: string; importo: number; categoria: string }>;
  salvadanai: Array<{ nome: string; attuale: number; obiettivo: number; percentuale: number }>;
  trend: "up" | "down" | "stable";
};

type WeeklyReview = {
  id: string;
  user_id: string;
  week_start: string;
  week_end: string;
  data: WeeklyData;
  summary: string;
  suggestions: string[];
  read_at: string | null;
  created_at: string;
};

serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const originBlocked = rejectDisallowedOrigin(req, corsHeaders);
  if (originBlocked) return originBlocked;

  try {
    const authResult = await requireAuthenticatedUser(req, corsHeaders);
    if (!authResult.ok) return authResult.response;

    const body = (await req.json()) as WeeklyReviewAction & Record<string, unknown>;
    const { action } = body;

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const client = createClient(supabaseUrl, supabaseServiceKey);
    const AI_API_KEY = Deno.env.get("AI_API_KEY") ?? Deno.env.get("OPENAI_API_KEY");

    // Check Pro subscription for this feature
    const estimatedTokens = estimateRequestTokens({ base: 600 });
    const quotaGuard = await enforceQuota({
      userId: authResult.user.id,
      estimatedTokens,
      corsHeaders,
    });
    if (!quotaGuard.ok) return quotaGuard.response;

    if (quotaGuard.quota.plan !== "pro") {
      return paymentRequiredResponse(
        corsHeaders,
        "Le review settimanali sono disponibili solo per il piano Pro."
      );
    }

    // Helper to get weekly data
    const getWeeklyData = async (userId: string): Promise<WeeklyData> => {
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

      // Get current week expenses
      const { data: speseSettimana } = await client
        .from("spese")
        .select("importo, nome, categoria_id, categorie_spese(nome)")
        .eq("user_id", userId)
        .gte("data", weekAgo.toISOString().split("T")[0])
        .lte("data", now.toISOString().split("T")[0]);

      // Get last week expenses
      const { data: speseSettimanaScorsa } = await client
        .from("spese")
        .select("importo")
        .eq("user_id", userId)
        .gte("data", twoWeeksAgo.toISOString().split("T")[0])
        .lt("data", weekAgo.toISOString().split("T")[0]);

      // Get salvadanai
      const { data: salvadanai } = await client
        .from("salvadanai")
        .select("nome, attuale, obiettivo")
        .eq("user_id", userId);

      // Calculate totals
      const totaleSettimana = (speseSettimana || []).reduce(
        (sum, s) => sum + (Number(s.importo) || 0),
        0
      );
      const totaleSettimanaScorsa = (speseSettimanaScorsa || []).reduce(
        (sum, s) => sum + (Number(s.importo) || 0),
        0
      );

      // Group by category
      const categorieMap = new Map<string, { totale: number; count: number }>();
      for (const spesa of speseSettimana || []) {
        const cat = (spesa.categorie_spese as { nome: string } | null)?.nome || "Altro";
        const existing = categorieMap.get(cat) || { totale: 0, count: 0 };
        categorieMap.set(cat, {
          totale: existing.totale + (Number(spesa.importo) || 0),
          count: existing.count + 1,
        });
      }

      const spesePerCategoria = Array.from(categorieMap.entries())
        .map(([categoria, data]) => ({
          categoria,
          totale: data.totale,
          count: data.count,
        }))
        .sort((a, b) => b.totale - a.totale);

      // Detect anomalies (expenses > 2x average for that category)
      const anomalie: Array<{ descrizione: string; importo: number; categoria: string }> = [];
      for (const spesa of speseSettimana || []) {
        const importo = Number(spesa.importo) || 0;
        const cat = (spesa.categorie_spese as { nome: string } | null)?.nome || "Altro";
        const catData = categorieMap.get(cat);
        if (catData && catData.count > 1) {
          const media = catData.totale / catData.count;
          if (importo > media * 2 && importo > 50) {
            anomalie.push({
              descrizione: spesa.nome || "Spesa",
              importo,
              categoria: cat,
            });
          }
        }
      }

      // Calculate trend
      let trend: "up" | "down" | "stable" = "stable";
      if (totaleSettimanaScorsa > 0) {
        const diff = ((totaleSettimana - totaleSettimanaScorsa) / totaleSettimanaScorsa) * 100;
        if (diff > 10) trend = "up";
        else if (diff < -10) trend = "down";
      }

      // Format salvadanai
      const salvadanaiFormatted = (salvadanai || []).map((s) => ({
        nome: s.nome,
        attuale: Number(s.attuale) || 0,
        obiettivo: Number(s.obiettivo) || 0,
        percentuale: s.obiettivo > 0 ? Math.round((Number(s.attuale) / Number(s.obiettivo)) * 100) : 0,
      }));

      return {
        speseSettimana: totaleSettimana,
        speseSettimanaScorsa: totaleSettimanaScorsa,
        spesePerCategoria,
        anomalie: anomalie.slice(0, 3), // Max 3 anomalies
        salvadanai: salvadanaiFormatted,
        trend,
      };
    };

    switch (action) {
      case "generate": {
        const weeklyData = await getWeeklyData(authResult.user.id);

        // Generate AI summary and suggestions
        let summary = "";
        let suggestions: string[] = [];

        if (AI_API_KEY) {
          const modelUsed = resolveModelForFeature("weekly_review", quotaGuard.quota.plan);

          const reviewPrompt = `Sei Mark, un coach finanziario. Genera una review settimanale delle spese.

Dati della settimana:
- Spese totali: €${weeklyData.speseSettimana.toLocaleString("it-IT")}
- Settimana scorsa: €${weeklyData.speseSettimanaScorsa.toLocaleString("it-IT")}
- Trend: ${weeklyData.trend === "up" ? "in aumento" : weeklyData.trend === "down" ? "in diminuzione" : "stabile"}
- Top categorie: ${weeklyData.spesePerCategoria.slice(0, 3).map((c) => `${c.categoria}: €${c.totale.toLocaleString("it-IT")}`).join(", ")}
- Anomalie rilevate: ${weeklyData.anomalie.length > 0 ? weeklyData.anomalie.map((a) => `${a.descrizione}: €${a.importo.toLocaleString("it-IT")}`).join(", ") : "Nessuna"}
- Salvadanai: ${weeklyData.salvadanai.map((s) => `${s.nome}: ${s.percentuale}%`).join(", ") || "Nessuno"}

Rispondi in JSON:
{
  "summary": "riassunto di 2-3 frasi della settimana finanziaria",
  "suggestions": ["suggerimento1", "suggerimento2", "suggerimento3"]
}

Sii specifico e azionabile nei suggerimenti.`;

          const response = await chatCompletion({
            apiKey: AI_API_KEY,
            model: modelUsed,
            messages: [
              { role: "system", content: "Sei Mark, un coach finanziario amichevole e pratico." },
              { role: "user", content: reviewPrompt },
            ],
            stream: false,
          });

          if (response.ok) {
            const json = await response.json();
            const content = extractAssistantContent(json);

            await trackUsageAsync({
              userId: authResult.user.id,
              feature: "weekly_review:generate",
              modelUsed,
              promptTokens: Math.ceil(reviewPrompt.length / 4),
              completionTokens: Math.ceil(content.length / 4),
            });

            try {
              const cleanContent = content
                .replace(/```json\n?/g, "")
                .replace(/```\n?/g, "")
                .trim();
              const parsed = JSON.parse(cleanContent);
              summary = parsed.summary || "";
              suggestions = parsed.suggestions || [];
            } catch {
              // Fall through to fallback
            }
          }
        }

        // Fallback summary
        if (!summary) {
          const diff = weeklyData.speseSettimana - weeklyData.speseSettimanaScorsa;
          const diffPercent = weeklyData.speseSettimanaScorsa > 0
            ? Math.round((diff / weeklyData.speseSettimanaScorsa) * 100)
            : 0;

          summary = `Questa settimana hai speso €${weeklyData.speseSettimana.toLocaleString("it-IT")}, `;
          if (diff > 0) {
            summary += `€${diff.toLocaleString("it-IT")} in più rispetto alla settimana scorsa (+${diffPercent}%).`;
          } else if (diff < 0) {
            summary += `€${Math.abs(diff).toLocaleString("it-IT")} in meno rispetto alla settimana scorsa (${diffPercent}%).`;
          } else {
            summary += "in linea con la settimana scorsa.";
          }

          suggestions = [
            "Controlla le spese più alte della settimana",
            "Valuta se puoi ridurre le spese nella categoria principale",
          ];
        }

        // Store the review
        const now = new Date();
        const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Store in mark_memory (we could also create a dedicated table)
        const reviewData = {
          week_start: weekStart.toISOString().split("T")[0],
          week_end: now.toISOString().split("T")[0],
          data: weeklyData,
          summary,
          suggestions,
          created_at: now.toISOString(),
        };

        await client.from("mark_memory").upsert({
          user_id: authResult.user.id,
          key: `weekly_review_${reviewData.week_start}`,
          value: reviewData,
          expires_at: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        });

        // Also create a notification
        await client.from("mark_notifications").insert({
          user_id: authResult.user.id,
          type: "important",
          title: "Review Settimanale",
          body: summary,
          action_url: "/coach",
          metadata: { reviewKey: `weekly_review_${reviewData.week_start}` },
        });

        return new Response(
          JSON.stringify({
            review: reviewData,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "get_latest": {
        // Get the latest weekly review from memory
        const { data: memories } = await client
          .from("mark_memory")
          .select("*")
          .eq("user_id", authResult.user.id)
          .like("key", "weekly_review_%")
          .order("created_at", { ascending: false })
          .limit(1);

        if (!memories || memories.length === 0) {
          return new Response(
            JSON.stringify({ review: null }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({ review: memories[0].value }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "mark_read": {
        const { reviewId } = body as { reviewId: string };

        await client
          .from("mark_memory")
          .update({
            value: client.sql`value || '{"read_at": "${new Date().toISOString()}"}'::jsonb`,
          })
          .eq("user_id", authResult.user.id)
          .eq("key", reviewId);

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "cron_trigger": {
        // This action is meant to be called by a cron job
        // It generates reviews for all Pro users who haven't received one this week
        // For security, this should be called with a service key, not user auth

        // For now, just generate for the current user
        const weeklyData = await getWeeklyData(authResult.user.id);

        return new Response(
          JSON.stringify({
            triggered: true,
            userId: authResult.user.id,
            dataPreview: {
              speseSettimana: weeklyData.speseSettimana,
              trend: weeklyData.trend,
            },
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: "Azione non riconosciuta" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
  } catch (e) {
    console.error("mark-weekly-review error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Errore sconosciuto" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
