import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { chatCompletion, extractAssistantContent } from "../_shared/ai.ts";
import { buildCorsHeaders, rejectDisallowedOrigin } from "../_shared/cors.ts";
import { requireAuthenticatedUser } from "../_shared/auth.ts";

type OnboardingStep =
  | "welcome"
  | "goals"
  | "patrimonio_setup"
  | "first_salvadanaio"
  | "suggested_lesson";

type OnboardingAction =
  | { action: "start" }
  | { action: "next"; step: OnboardingStep; data?: Record<string, unknown> }
  | { action: "get_status" }
  | { action: "generate_welcome" }
  | { action: "generate_goals_suggestions" }
  | { action: "generate_salvadanaio_suggestion"; goals?: string[] }
  | { action: "generate_lesson_suggestion"; goals?: string[] };

type OnboardingState = {
  welcomeCompleted?: boolean;
  goals?: string[];
  patrimonioSetup?: boolean;
  firstSalvadanaio?: { nome: string; obiettivo: number } | null;
  suggestedLesson?: string | null;
};

serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const originBlocked = rejectDisallowedOrigin(req, corsHeaders);
  if (originBlocked) return originBlocked;

  try {
    const authResult = await requireAuthenticatedUser(req, corsHeaders);
    if (!authResult.ok) return authResult.response;

    const { action, ...params } = (await req.json()) as OnboardingAction & Record<string, unknown>;

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const client = createClient(supabaseUrl, supabaseServiceKey);
    const AI_API_KEY = Deno.env.get("AI_API_KEY") ?? Deno.env.get("OPENAI_API_KEY");

    // Get user profile
    const { data: profile } = await client
      .from("profiles")
      .select("name")
      .eq("id", authResult.user.id)
      .single();

    const userName = profile?.name || "Utente";

    switch (action) {
      case "start": {
        // Check if onboarding already exists and is active
        const { data: existing } = await client
          .from("mark_workflows")
          .select("*")
          .eq("user_id", authResult.user.id)
          .eq("workflow_type", "onboarding")
          .eq("status", "active")
          .maybeSingle();

        if (existing) {
          return new Response(JSON.stringify({ workflow: existing }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Check if already completed
        const { count } = await client
          .from("mark_workflows")
          .select("*", { count: "exact", head: true })
          .eq("user_id", authResult.user.id)
          .eq("workflow_type", "onboarding")
          .eq("status", "completed");

        if (count && count > 0) {
          return new Response(
            JSON.stringify({ error: "Onboarding già completato", alreadyCompleted: true }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Create new onboarding workflow
        const { data: workflow, error } = await client
          .from("mark_workflows")
          .insert({
            user_id: authResult.user.id,
            workflow_type: "onboarding",
            current_step: 0,
            total_steps: 5,
            state: {},
            status: "active",
          })
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify({ workflow }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "get_status": {
        const { data: workflow } = await client
          .from("mark_workflows")
          .select("*")
          .eq("user_id", authResult.user.id)
          .eq("workflow_type", "onboarding")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        const { count } = await client
          .from("mark_workflows")
          .select("*", { count: "exact", head: true })
          .eq("user_id", authResult.user.id)
          .eq("workflow_type", "onboarding")
          .eq("status", "completed");

        return new Response(
          JSON.stringify({
            workflow,
            hasCompleted: (count ?? 0) > 0,
            needsOnboarding: !workflow && (count ?? 0) === 0,
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "next": {
        const step = params.step as OnboardingStep;
        const data = params.data as Record<string, unknown> | undefined;

        const { data: workflow } = await client
          .from("mark_workflows")
          .select("*")
          .eq("user_id", authResult.user.id)
          .eq("workflow_type", "onboarding")
          .eq("status", "active")
          .single();

        if (!workflow) {
          return new Response(
            JSON.stringify({ error: "Nessun onboarding attivo" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const currentState = (workflow.state as OnboardingState) || {};
        let newState: OnboardingState = { ...currentState };
        let newStep = workflow.current_step;

        switch (step) {
          case "welcome":
            newState.welcomeCompleted = true;
            newStep = 1;
            break;

          case "goals":
            if (data?.goals && Array.isArray(data.goals)) {
              newState.goals = data.goals as string[];
            }
            newStep = 2;
            break;

          case "patrimonio_setup":
            newState.patrimonioSetup = true;
            newStep = 3;
            break;

          case "first_salvadanaio":
            if (data?.salvadanaio) {
              newState.firstSalvadanaio = data.salvadanaio as { nome: string; obiettivo: number };
            } else if (data?.skip) {
              newState.firstSalvadanaio = null;
            }
            newStep = 4;
            break;

          case "suggested_lesson":
            if (data?.lessonId) {
              newState.suggestedLesson = data.lessonId as string;
            }
            newStep = 5;
            break;
        }

        const isCompleted = newStep >= 5;

        const { data: updated, error } = await client
          .from("mark_workflows")
          .update({
            current_step: newStep,
            state: newState,
            status: isCompleted ? "completed" : "active",
          })
          .eq("id", workflow.id)
          .select()
          .single();

        if (error) throw error;

        // If onboarding completed, store in mark_memory
        if (isCompleted) {
          await client.from("mark_memory").upsert({
            user_id: authResult.user.id,
            key: "onboarding_completed",
            value: { completedAt: new Date().toISOString(), state: newState },
          });
        }

        return new Response(
          JSON.stringify({ workflow: updated, completed: isCompleted }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "generate_welcome": {
        if (!AI_API_KEY) {
          return new Response(
            JSON.stringify({
              message: `Ciao ${userName}! Benvenuto in Finance Flow. Sono Mark, il tuo coach finanziario personale. Ti guiderò passo passo per configurare la tua app e iniziare il tuo percorso verso la libertà finanziaria.`,
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const response = await chatCompletion({
          apiKey: AI_API_KEY,
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `Sei Mark, un coach finanziario amichevole. Genera un breve messaggio di benvenuto (max 80 parole) per un nuovo utente chiamato "${userName}" che sta iniziando a usare l'app Finance Flow.

Includi:
- Saluto caloroso con il nome
- Breve spiegazione di cosa farete insieme (configurare patrimonio, obiettivi)
- Tono incoraggiante ma non troppo enfatico

NON usare emoji all'inizio del messaggio. Puoi usarne 1-2 nel corpo del testo.`,
            },
            { role: "user", content: "Genera il messaggio di benvenuto" },
          ],
          stream: false,
        });

        if (!response.ok) {
          return new Response(
            JSON.stringify({
              message: `Ciao ${userName}! Sono Mark, il tuo coach finanziario. Insieme configureremo la tua app Finance Flow per aiutarti a raggiungere i tuoi obiettivi finanziari. Iniziamo!`,
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const json = await response.json();
        const message = extractAssistantContent(json);

        return new Response(JSON.stringify({ message }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "generate_goals_suggestions": {
        // Return predefined goal options (no AI needed for this)
        const goals = [
          { id: "risparmio", label: "Risparmiare di più", emoji: "💰" },
          { id: "debiti", label: "Eliminare i debiti", emoji: "🎯" },
          { id: "investimenti", label: "Iniziare a investire", emoji: "📈" },
          { id: "emergenza", label: "Creare un fondo emergenza", emoji: "🛡️" },
          { id: "casa", label: "Comprare casa", emoji: "🏠" },
          { id: "pensione", label: "Pianificare la pensione", emoji: "👴" },
          { id: "vacanze", label: "Risparmiare per viaggi/vacanze", emoji: "✈️" },
          { id: "educazione", label: "Imparare la finanza personale", emoji: "📚" },
        ];

        return new Response(JSON.stringify({ goals }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "generate_salvadanaio_suggestion": {
        const userGoals = (params.goals as string[]) || [];

        // Map goals to salvadanaio suggestions
        const suggestions: Array<{ nome: string; obiettivo: number; motivo: string }> = [];

        if (userGoals.includes("emergenza")) {
          suggestions.push({
            nome: "Fondo Emergenza",
            obiettivo: 3000,
            motivo: "3 mesi di spese per dormire tranquillo",
          });
        }
        if (userGoals.includes("vacanze")) {
          suggestions.push({
            nome: "Prossima Vacanza",
            obiettivo: 1500,
            motivo: "Per goderti il meritato riposo",
          });
        }
        if (userGoals.includes("casa")) {
          suggestions.push({
            nome: "Anticipo Casa",
            obiettivo: 20000,
            motivo: "Per il tuo futuro nido",
          });
        }
        if (userGoals.includes("investimenti")) {
          suggestions.push({
            nome: "Primo Investimento",
            obiettivo: 1000,
            motivo: "Per iniziare a far lavorare i tuoi soldi",
          });
        }

        // Default suggestion if no specific goals
        if (suggestions.length === 0) {
          suggestions.push({
            nome: "Obiettivo Risparmio",
            obiettivo: 1000,
            motivo: "Un primo traguardo per prendere l'abitudine",
          });
        }

        return new Response(JSON.stringify({ suggestions }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "generate_lesson_suggestion": {
        const userGoals = (params.goals as string[]) || [];

        // Map goals to suggested lessons
        let lessonId = "fin-lit-1"; // Default: Prima lezione di Financial Literacy
        let lessonTitle = "Le Basi della Finanza Personale";
        let reason = "Inizia dalle fondamenta per costruire una solida base finanziaria";

        if (userGoals.includes("investimenti")) {
          lessonId = "inv-1";
          lessonTitle = "Introduzione agli Investimenti";
          reason = "Impara i concetti base per iniziare a investire con consapevolezza";
        } else if (userGoals.includes("debiti")) {
          lessonId = "debt-1";
          lessonTitle = "Gestire i Debiti";
          reason = "Strategie efficaci per eliminare i debiti";
        } else if (userGoals.includes("risparmio")) {
          lessonId = "save-1";
          lessonTitle = "L'Arte del Risparmio";
          reason = "Tecniche pratiche per risparmiare senza rinunciare alla qualità della vita";
        }

        return new Response(
          JSON.stringify({ lessonId, lessonTitle, reason }),
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
    console.error("mark-onboarding error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Errore sconosciuto" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
