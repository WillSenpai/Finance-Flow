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

type FinancialPlanAction =
  | { action: "analyze" }
  | { action: "create_plan"; salvadanaiId: string; goalAmount: number; timelineMonths: number }
  | { action: "get_active_plans" }
  | { action: "get_plan"; planId: string }
  | { action: "checkin"; planId: string }
  | { action: "update_plan"; planId: string; updates: Record<string, unknown> }
  | { action: "abandon_plan"; planId: string };

type UserFinancialData = {
  patrimonio: number;
  speseUltimoMese: number;
  salvadanai: Array<{ id: string; nome: string; attuale: number; obiettivo: number }>;
  investimenti: Array<{ nome: string; valore: number }>;
};

serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const originBlocked = rejectDisallowedOrigin(req, corsHeaders);
  if (originBlocked) return originBlocked;

  try {
    const authResult = await requireAuthenticatedUser(req, corsHeaders);
    if (!authResult.ok) return authResult.response;

    const body = (await req.json()) as FinancialPlanAction & Record<string, unknown>;
    const { action } = body;

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const client = createClient(supabaseUrl, supabaseServiceKey);
    const AI_API_KEY = Deno.env.get("AI_API_KEY") ?? Deno.env.get("OPENAI_API_KEY");

    // Check Pro subscription for this feature
    const estimatedTokens = estimateRequestTokens({ base: 500 });
    const quotaGuard = await enforceQuota({
      userId: authResult.user.id,
      estimatedTokens,
      corsHeaders,
    });
    if (!quotaGuard.ok) return quotaGuard.response;

    if (quotaGuard.quota.plan !== "pro") {
      return paymentRequiredResponse(
        corsHeaders,
        "I piani finanziari personalizzati sono disponibili solo per il piano Pro."
      );
    }

    // Helper to get user financial data
    const getUserFinancialData = async (): Promise<UserFinancialData> => {
      const [patrimonioRes, speseRes, salvadanaiRes, investimentiRes] = await Promise.all([
        client
          .from("patrimonio")
          .select("valore")
          .eq("user_id", authResult.user.id),
        client
          .from("spese")
          .select("importo")
          .eq("user_id", authResult.user.id)
          .gte("data", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]),
        client
          .from("salvadanai")
          .select("id, nome, attuale, obiettivo")
          .eq("user_id", authResult.user.id),
        client
          .from("investimenti")
          .select("nome, valore")
          .eq("user_id", authResult.user.id),
      ]);

      const patrimonio = (patrimonioRes.data || []).reduce(
        (sum, p) => sum + (Number(p.valore) || 0),
        0
      );
      const speseUltimoMese = (speseRes.data || []).reduce(
        (sum, s) => sum + (Number(s.importo) || 0),
        0
      );
      const salvadanai = (salvadanaiRes.data || []).map((s) => ({
        id: s.id,
        nome: s.nome,
        attuale: Number(s.attuale) || 0,
        obiettivo: Number(s.obiettivo) || 0,
      }));
      const investimenti = (investimentiRes.data || []).map((i) => ({
        nome: i.nome,
        valore: Number(i.valore) || 0,
      }));

      return { patrimonio, speseUltimoMese, salvadanai, investimenti };
    };

    switch (action) {
      case "analyze": {
        const data = await getUserFinancialData();

        // Calculate savings capacity estimate
        const stimaCapacitaRisparmio = Math.max(0, data.patrimonio * 0.1 - data.speseUltimoMese * 0.3);

        // Use AI to generate analysis
        if (AI_API_KEY) {
          const modelUsed = resolveModelForFeature("financial_plan", quotaGuard.quota.plan);

          const analysisPrompt = `Sei Mark, un coach finanziario. Analizza brevemente la situazione finanziaria dell'utente e suggerisci un obiettivo di risparmio realistico.

Dati utente:
- Patrimonio totale: €${data.patrimonio.toLocaleString("it-IT")}
- Spese ultimo mese: €${data.speseUltimoMese.toLocaleString("it-IT")}
- Salvadanai attivi: ${data.salvadanai.length > 0 ? data.salvadanai.map((s) => `${s.nome} (${Math.round((s.attuale / s.obiettivo) * 100)}%)`).join(", ") : "Nessuno"}
- Investimenti: €${data.investimenti.reduce((s, i) => s + i.valore, 0).toLocaleString("it-IT")}

Rispondi in JSON con questo formato:
{
  "analisi": "breve analisi in 2-3 frasi",
  "capacitaRisparmio": numero_mensile_stimato,
  "suggerimenti": ["suggerimento1", "suggerimento2"],
  "pianiConsigliati": [
    { "nome": "nome_piano", "obiettivo": importo, "mesi": durata, "motivazione": "perché" }
  ]
}`;

          const response = await chatCompletion({
            apiKey: AI_API_KEY,
            model: modelUsed,
            messages: [
              { role: "system", content: analysisPrompt },
              { role: "user", content: "Analizza la mia situazione finanziaria" },
            ],
            stream: false,
          });

          if (response.ok) {
            const json = await response.json();
            const content = extractAssistantContent(json);

            await trackUsageAsync({
              userId: authResult.user.id,
              feature: "financial_plan:analyze",
              modelUsed,
              promptTokens: Math.ceil(analysisPrompt.length / 4),
              completionTokens: Math.ceil(content.length / 4),
            });

            try {
              const cleanContent = content
                .replace(/```json\n?/g, "")
                .replace(/```\n?/g, "")
                .trim();
              const parsed = JSON.parse(cleanContent);
              return new Response(
                JSON.stringify({
                  ...parsed,
                  rawData: data,
                }),
                { headers: { ...corsHeaders, "Content-Type": "application/json" } }
              );
            } catch {
              // Fall through to fallback
            }
          }
        }

        // Fallback analysis without AI
        return new Response(
          JSON.stringify({
            analisi: `Il tuo patrimonio è di €${data.patrimonio.toLocaleString("it-IT")}. Con spese mensili di €${data.speseUltimoMese.toLocaleString("it-IT")}, hai margine per risparmiare.`,
            capacitaRisparmio: stimaCapacitaRisparmio,
            suggerimenti: [
              "Imposta un budget mensile per le spese variabili",
              "Automatizza il risparmio a inizio mese",
            ],
            pianiConsigliati: [
              {
                nome: "Fondo Emergenza",
                obiettivo: data.speseUltimoMese * 6,
                mesi: 12,
                motivazione: "6 mesi di spese per sicurezza",
              },
            ],
            rawData: data,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "create_plan": {
        const { salvadanaiId, goalAmount, timelineMonths } = body as {
          salvadanaiId: string;
          goalAmount: number;
          timelineMonths: number;
        };

        if (!salvadanaiId || !goalAmount || !timelineMonths) {
          return new Response(
            JSON.stringify({ error: "Parametri mancanti" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const monthlyTarget = Math.ceil(goalAmount / timelineMonths);

        // Create checkpoints (every month)
        const checkpoints = Array.from({ length: timelineMonths }, (_, i) => ({
          month: i + 1,
          targetAmount: monthlyTarget * (i + 1),
          checked: false,
          checkedAt: null,
        }));

        const { data: plan, error } = await client
          .from("user_financial_plans")
          .insert({
            user_id: authResult.user.id,
            salvadanaio_id: salvadanaiId,
            goal_amount: goalAmount,
            monthly_target: monthlyTarget,
            timeline_months: timelineMonths,
            checkpoints,
            status: "active",
          })
          .select()
          .single();

        if (error) throw error;

        // Store plan creation in memory
        await client.from("mark_memory").upsert({
          user_id: authResult.user.id,
          key: `financial_plan_${plan.id}`,
          value: { createdAt: new Date().toISOString(), goalAmount, timelineMonths },
        });

        return new Response(JSON.stringify({ plan }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "get_active_plans": {
        const { data: plans, error } = await client
          .from("user_financial_plans")
          .select("*, salvadanai(nome, attuale, obiettivo)")
          .eq("user_id", authResult.user.id)
          .eq("status", "active")
          .order("created_at", { ascending: false });

        if (error) throw error;

        return new Response(JSON.stringify({ plans: plans || [] }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "get_plan": {
        const { planId } = body as { planId: string };

        const { data: plan, error } = await client
          .from("user_financial_plans")
          .select("*, salvadanai(nome, attuale, obiettivo)")
          .eq("id", planId)
          .eq("user_id", authResult.user.id)
          .single();

        if (error) throw error;

        return new Response(JSON.stringify({ plan }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "checkin": {
        const { planId } = body as { planId: string };

        const { data: plan } = await client
          .from("user_financial_plans")
          .select("*, salvadanai(nome, attuale, obiettivo)")
          .eq("id", planId)
          .eq("user_id", authResult.user.id)
          .single();

        if (!plan) {
          return new Response(
            JSON.stringify({ error: "Piano non trovato" }),
            { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const salvadanaio = plan.salvadanai as { attuale: number; obiettivo: number } | null;
        const currentAmount = salvadanaio?.attuale ?? 0;
        const targetAmount = plan.goal_amount;
        const progress = Math.round((currentAmount / targetAmount) * 100);

        // Update checkpoints
        const checkpoints = (plan.checkpoints as Array<{
          month: number;
          targetAmount: number;
          checked: boolean;
          checkedAt: string | null;
        }>) || [];

        const currentMonth = checkpoints.findIndex(
          (c) => !c.checked && currentAmount >= c.targetAmount
        );

        if (currentMonth >= 0) {
          checkpoints[currentMonth].checked = true;
          checkpoints[currentMonth].checkedAt = new Date().toISOString();
        }

        // Check if completed
        const isCompleted = currentAmount >= targetAmount;

        await client
          .from("user_financial_plans")
          .update({
            checkpoints,
            last_checkin_at: new Date().toISOString(),
            status: isCompleted ? "completed" : "active",
          })
          .eq("id", planId);

        // Generate AI feedback if available
        let feedback = `Hai raggiunto il ${progress}% del tuo obiettivo.`;
        if (AI_API_KEY && quotaGuard.quota.plan === "pro") {
          const modelUsed = resolveModelForFeature("financial_plan", quotaGuard.quota.plan);

          const feedbackPrompt = `Genera un breve messaggio di check-in (max 50 parole) per un piano di risparmio.
Progresso: ${progress}%
Importo attuale: €${currentAmount.toLocaleString("it-IT")}
Obiettivo: €${targetAmount.toLocaleString("it-IT")}
Completato: ${isCompleted ? "Sì!" : "No"}

Sii incoraggiante ma realistico. Se completato, congratulati!`;

          const response = await chatCompletion({
            apiKey: AI_API_KEY,
            model: modelUsed,
            messages: [
              { role: "system", content: "Sei Mark, un coach finanziario amichevole." },
              { role: "user", content: feedbackPrompt },
            ],
            stream: false,
          });

          if (response.ok) {
            const json = await response.json();
            feedback = extractAssistantContent(json);
          }
        }

        return new Response(
          JSON.stringify({
            progress,
            currentAmount,
            targetAmount,
            isCompleted,
            feedback,
            checkpoints,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "update_plan": {
        const { planId, updates } = body as { planId: string; updates: Record<string, unknown> };

        const allowedUpdates: Record<string, unknown> = {};
        if ("monthly_target" in updates) allowedUpdates.monthly_target = updates.monthly_target;
        if ("timeline_months" in updates) allowedUpdates.timeline_months = updates.timeline_months;

        const { data: plan, error } = await client
          .from("user_financial_plans")
          .update(allowedUpdates)
          .eq("id", planId)
          .eq("user_id", authResult.user.id)
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify({ plan }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "abandon_plan": {
        const { planId } = body as { planId: string };

        const { error } = await client
          .from("user_financial_plans")
          .update({ status: "abandoned" })
          .eq("id", planId)
          .eq("user_id", authResult.user.id);

        if (error) throw error;

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      default:
        return new Response(
          JSON.stringify({ error: "Azione non riconosciuta" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
  } catch (e) {
    console.error("mark-financial-plan error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Errore sconosciuto" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
