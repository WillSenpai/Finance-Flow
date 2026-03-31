import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { buildCorsHeaders, rejectDisallowedOrigin } from "../_shared/cors.ts";
import { requireAuthenticatedUser } from "../_shared/auth.ts";

type MissionsAction =
  | { action: "generate_daily" }
  | { action: "complete_mission"; missionId: string }
  | { action: "skip_mission"; missionId: string };

serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const originBlocked = rejectDisallowedOrigin(req, corsHeaders);
  if (originBlocked) return originBlocked;

  try {
    const authResult = await requireAuthenticatedUser(req, corsHeaders);
    if (!authResult.ok) return authResult.response;

    const body = (await req.json()) as MissionsAction;

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const client = createClient(supabaseUrl, serviceRoleKey);

    const { data: campaign } = await client
      .from("game_campaigns")
      .select("id")
      .eq("user_id", authResult.user.id)
      .eq("status", "active")
      .maybeSingle();

    if (!campaign) {
      return new Response(JSON.stringify({ error: "No active campaign" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const today = new Date().toISOString().split("T")[0];

    if (body.action === "generate_daily") {
      const { data: existing } = await client
        .from("game_missions")
        .select("*")
        .eq("user_id", authResult.user.id)
        .eq("mission_date", today)
        .order("created_at", { ascending: true });

      if (existing && existing.length > 0) {
        return new Response(JSON.stringify({ missions: existing, generated: false }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const weekAgo = new Date(Date.now() - 7 * 86_400_000).toISOString().split("T")[0];
      const { data: topCategories } = await client
        .from("spese")
        .select("importo, categorie_spese(nome)")
        .eq("user_id", authResult.user.id)
        .gte("data", weekAgo)
        .lte("data", today);

      const byCategory = new Map<string, number>();
      (topCategories ?? []).forEach((row) => {
        const raw = row.categorie_spese as { nome?: string } | null;
        const category = raw?.nome ?? "Altro";
        byCategory.set(category, (byCategory.get(category) ?? 0) + (Number(row.importo) || 0));
      });

      const sortedCategories = Array.from(byCategory.entries()).sort((a, b) => b[1] - a[1]);
      const topCategory = sortedCategories[0]?.[0] ?? "Altro";
      const topTotal = sortedCategories[0]?.[1] ?? 100;

      const missions = [
        {
          campaign_id: campaign.id,
          user_id: authResult.user.id,
          mission_date: today,
          title: "Spendi con intenzione",
          description: `Riduci del 15% la categoria ${topCategory} rispetto alla tua media recente.`,
          status: "active",
          mission_spec: { type: "reduce_category", category: topCategory, target_amount: Math.max(1, Math.floor(topTotal * 0.85)) },
          reward_coins: 20,
        },
        {
          campaign_id: campaign.id,
          user_id: authResult.user.id,
          mission_date: today,
          title: "Micro-risparmio automatico",
          description: "Registra almeno 1 azione di risparmio oggi.",
          status: "active",
          mission_spec: { type: "log_saving_action", count: 1 },
          reward_coins: 15,
        },
        {
          campaign_id: campaign.id,
          user_id: authResult.user.id,
          mission_date: today,
          title: "Review veloce",
          description: "Completa una run giornaliera e leggi il riepilogo finale.",
          status: "active",
          mission_spec: { type: "complete_daily_run" },
          reward_coins: 10,
        },
      ];

      const { data: inserted, error } = await client.from("game_missions").insert(missions).select("*");
      if (error) throw error;

      return new Response(JSON.stringify({ missions: inserted ?? [], generated: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (body.action === "complete_mission") {
      const missionId = body.missionId;
      if (!missionId) {
        return new Response(JSON.stringify({ error: "missionId is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: mission, error: readError } = await client
        .from("game_missions")
        .select("*")
        .eq("id", missionId)
        .eq("user_id", authResult.user.id)
        .single();

      if (readError || !mission) {
        return new Response(JSON.stringify({ error: "Mission not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (mission.status !== "active") {
        return new Response(JSON.stringify({ mission, alreadyHandled: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: updated, error: updateError } = await client
        .from("game_missions")
        .update({ status: "completed", completed_at: new Date().toISOString() })
        .eq("id", missionId)
        .eq("user_id", authResult.user.id)
        .select("*")
        .single();

      if (updateError) throw updateError;

      await client.from("game_rewards").insert({
        campaign_id: campaign.id,
        mission_id: missionId,
        user_id: authResult.user.id,
        reward_type: "mission",
        amount_coins: Number(updated.reward_coins) || 0,
        metadata: { mission_title: updated.title },
      });

      return new Response(JSON.stringify({ mission: updated }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (body.action === "skip_mission") {
      const missionId = body.missionId;
      if (!missionId) {
        return new Response(JSON.stringify({ error: "missionId is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: mission, error } = await client
        .from("game_missions")
        .update({ status: "skipped" })
        .eq("id", missionId)
        .eq("user_id", authResult.user.id)
        .select("*")
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ mission }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unsupported action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("game-missions error", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unexpected error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
