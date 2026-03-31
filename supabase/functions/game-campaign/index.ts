import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { buildCorsHeaders, rejectDisallowedOrigin } from "../_shared/cors.ts";
import { requireAuthenticatedUser } from "../_shared/auth.ts";
import {
  applyRun,
  buildDailyRunEvents,
  computeFinancialModifier,
  isPreviousUtcDay,
  isSameUtcDay,
} from "../_shared/game.ts";

type CampaignAction =
  | { action: "start_campaign" }
  | { action: "get_state" }
  | { action: "play_daily_run" }
  | { action: "claim_rewards" };

serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const originBlocked = rejectDisallowedOrigin(req, corsHeaders);
  if (originBlocked) return originBlocked;

  try {
    const authResult = await requireAuthenticatedUser(req, corsHeaders);
    if (!authResult.ok) return authResult.response;

    const body = (await req.json()) as CampaignAction;

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const client = createClient(supabaseUrl, serviceRoleKey);

    const { data: activeCampaign } = await client
      .from("game_campaigns")
      .select("*")
      .eq("user_id", authResult.user.id)
      .eq("status", "active")
      .maybeSingle();

    if (body.action === "start_campaign") {
      if (activeCampaign) {
        return new Response(JSON.stringify({ campaign: activeCampaign, created: false }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: campaign, error } = await client
        .from("game_campaigns")
        .insert({ user_id: authResult.user.id, status: "active", coins: 50, energy: 3, board_position: 0 })
        .select("*")
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ campaign, created: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!activeCampaign) {
      return new Response(JSON.stringify({ error: "No active campaign" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (body.action === "get_state") {
      const now = new Date();
      const today = now.toISOString().split("T")[0];

      const [{ data: missions }, { data: unclaimedRewards }] = await Promise.all([
        client
          .from("game_missions")
          .select("*")
          .eq("user_id", authResult.user.id)
          .eq("mission_date", today)
          .order("created_at", { ascending: true }),
        client
          .from("game_rewards")
          .select("amount_coins")
          .eq("user_id", authResult.user.id)
          .is("claimed_at", null),
      ]);

      return new Response(
        JSON.stringify({
          campaign: activeCampaign,
          canPlayDailyRun:
            !activeCampaign.last_run_at || !isSameUtcDay(new Date(activeCampaign.last_run_at), now),
          missions: missions ?? [],
          unclaimedCoins: (unclaimedRewards ?? []).reduce((sum, row) => sum + (row.amount_coins ?? 0), 0),
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (body.action === "play_daily_run") {
      const now = new Date();
      const today = now.toISOString().split("T")[0];

      if (activeCampaign.last_run_at && isSameUtcDay(new Date(activeCampaign.last_run_at), now)) {
        return new Response(JSON.stringify({ error: "Daily run already completed" }), {
          status: 409,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const weekAgo = new Date(now.getTime() - 7 * 86_400_000).toISOString().split("T")[0];
      const twoWeeksAgo = new Date(now.getTime() - 14 * 86_400_000).toISOString().split("T")[0];

      const [{ data: currentWeek }, { data: previousWeek }] = await Promise.all([
        client
          .from("spese")
          .select("importo")
          .eq("user_id", authResult.user.id)
          .gte("data", weekAgo)
          .lte("data", today),
        client
          .from("spese")
          .select("importo")
          .eq("user_id", authResult.user.id)
          .gte("data", twoWeeksAgo)
          .lt("data", weekAgo),
      ]);

      const currentWeekTotal = (currentWeek ?? []).reduce((sum, row) => sum + (Number(row.importo) || 0), 0);
      const previousWeekTotal = (previousWeek ?? []).reduce((sum, row) => sum + (Number(row.importo) || 0), 0);
      const modifier = computeFinancialModifier(currentWeekTotal, previousWeekTotal);

      const events = buildDailyRunEvents(`${activeCampaign.id}:${today}`, modifier);
      const runResult = applyRun(activeCampaign, events);

      const lastRunDate = activeCampaign.last_run_at ? new Date(activeCampaign.last_run_at) : null;
      const nextStreak = !lastRunDate
        ? 1
        : isPreviousUtcDay(lastRunDate, now)
          ? activeCampaign.streak_days + 1
          : 1;

      const { data: run, error: runError } = await client
        .from("game_runs")
        .insert({
          campaign_id: activeCampaign.id,
          user_id: authResult.user.id,
          run_date: today,
          events,
          result: {
            modifier,
            currentWeekTotal,
            previousWeekTotal,
            totals: runResult.totals,
          },
          reward_coins: runResult.rewardCoins,
        })
        .select("*")
        .single();

      if (runError) throw runError;

      const { data: updatedCampaign, error: campaignError } = await client
        .from("game_campaigns")
        .update({
          board_position: runResult.nextPosition,
          coins: runResult.nextCoins,
          energy: runResult.nextEnergy,
          current_level: runResult.nextLevel,
          streak_days: nextStreak,
          last_run_at: now.toISOString(),
        })
        .eq("id", activeCampaign.id)
        .eq("user_id", authResult.user.id)
        .select("*")
        .single();

      if (campaignError) throw campaignError;

      await client.from("game_rewards").insert({
        campaign_id: activeCampaign.id,
        run_id: run.id,
        user_id: authResult.user.id,
        reward_type: "daily_run",
        amount_coins: runResult.rewardCoins,
        metadata: { streak_days: nextStreak },
      });

      if (runResult.nextLevel > activeCampaign.current_level) {
        await client.from("game_rewards").insert({
          campaign_id: activeCampaign.id,
          run_id: run.id,
          user_id: authResult.user.id,
          reward_type: "level_up",
          amount_coins: 25,
          metadata: { from: activeCampaign.current_level, to: runResult.nextLevel },
        });
      }

      return new Response(JSON.stringify({ campaign: updatedCampaign, run, events }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (body.action === "claim_rewards") {
      const { data: rewards } = await client
        .from("game_rewards")
        .select("id, amount_coins")
        .eq("user_id", authResult.user.id)
        .is("claimed_at", null);

      const total = (rewards ?? []).reduce((sum, row) => sum + (row.amount_coins ?? 0), 0);
      const ids = (rewards ?? []).map((row) => row.id);

      if (ids.length > 0) {
        await client.from("game_rewards").update({ claimed_at: new Date().toISOString() }).in("id", ids);
      }

      return new Response(JSON.stringify({ claimedCoins: total, rewardsCount: ids.length }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unsupported action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("game-campaign error", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unexpected error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
