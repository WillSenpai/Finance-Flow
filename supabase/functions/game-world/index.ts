import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { buildCorsHeaders, rejectDisallowedOrigin } from "../_shared/cors.ts";
import { requireAuthenticatedUser } from "../_shared/auth.ts";
import {
  WORLD_NODES,
  WORLD_ZONE_CODE,
  computeNodeStatus,
  evaluateLevelNode,
  normalizeCompletedNodes,
  scaleReward,
} from "../_shared/game_world.ts";

type GameWorldAction =
  | { action: "get_world_state" }
  | { action: "start_world_run" }
  | { action: "submit_level_result"; runId: string; nodeCode: string; answers?: Record<string, unknown>; durationMs?: number }
  | { action: "finish_world_run"; runId: string };

function jsonResponse(payload: unknown, corsHeaders: HeadersInit, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const originBlocked = rejectDisallowedOrigin(req, corsHeaders);
  if (originBlocked) return originBlocked;

  try {
    const authResult = await requireAuthenticatedUser(req, corsHeaders);
    if (!authResult.ok) return authResult.response;

    const body = (await req.json()) as GameWorldAction;

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const client = createClient(supabaseUrl, serviceRoleKey);

    const { data: campaign } = await client
      .from("game_campaigns")
      .select("id")
      .eq("user_id", authResult.user.id)
      .eq("status", "active")
      .maybeSingle();

    const ensureProfile = async () => {
      const { data: existing } = await client
        .from("game_world_profiles")
        .select("*")
        .eq("user_id", authResult.user.id)
        .maybeSingle();

      if (existing) return existing;

      const { data: inserted, error } = await client
        .from("game_world_profiles")
        .insert({
          user_id: authResult.user.id,
          campaign_id: campaign?.id ?? null,
          current_zone_code: WORLD_ZONE_CODE,
          xp: 0,
          completed_nodes: [],
        })
        .select("*")
        .single();

      if (error) throw error;
      return inserted;
    };

    const profile = await ensureProfile();
    const completedNodes = normalizeCompletedNodes(profile.completed_nodes);

    if (body.action === "get_world_state") {
      const today = new Date().toISOString().split("T")[0];

      const [{ data: activeRun }, { data: finishedToday }] = await Promise.all([
        client
          .from("game_world_runs")
          .select("*")
          .eq("user_id", authResult.user.id)
          .eq("status", "active")
          .maybeSingle(),
        client
          .from("game_world_runs")
          .select("id")
          .eq("user_id", authResult.user.id)
          .eq("run_date", today)
          .eq("status", "finished")
          .limit(1),
      ]);

      const zoneNodes = WORLD_NODES.map((node) => ({
        ...node,
        status: computeNodeStatus(completedNodes, node.code),
      }));

      return jsonResponse(
        {
          profile: {
            id: profile.id,
            xp: profile.xp,
            currentZoneCode: profile.current_zone_code,
            completedNodes,
          },
          activeRun,
          zone: {
            code: WORLD_ZONE_CODE,
            title: "Quartiere della Finanza",
            objective: "Completa 3 mini-livelli e raggiungi l'uscita zona.",
            nodes: zoneNodes,
          },
          canClaimMainRewardToday: !(finishedToday && finishedToday.length > 0),
        },
        corsHeaders,
      );
    }

    if (body.action === "start_world_run") {
      const existingActive = await client
        .from("game_world_runs")
        .select("*")
        .eq("user_id", authResult.user.id)
        .eq("status", "active")
        .maybeSingle();

      if (existingActive.data) {
        return jsonResponse({ run: existingActive.data, created: false }, corsHeaders);
      }

      const today = new Date().toISOString().split("T")[0];
      const { data: finishedToday } = await client
        .from("game_world_runs")
        .select("id")
        .eq("user_id", authResult.user.id)
        .eq("run_date", today)
        .eq("status", "finished")
        .limit(1);

      const rewardMultiplier = finishedToday && finishedToday.length > 0 ? 0.35 : 1;

      const { data: run, error } = await client
        .from("game_world_runs")
        .insert({
          user_id: authResult.user.id,
          profile_id: profile.id,
          campaign_id: campaign?.id ?? null,
          run_date: today,
          zone_code: WORLD_ZONE_CODE,
          status: "active",
          reward_multiplier: rewardMultiplier,
          state: { checkpointVisited: false, completedNodesInRun: [] },
        })
        .select("*")
        .single();

      if (error) throw error;

      return jsonResponse({ run, created: true }, corsHeaders);
    }

    if (body.action === "submit_level_result") {
      if (!body.runId || !body.nodeCode) {
        return jsonResponse({ error: "runId and nodeCode are required" }, corsHeaders, 400);
      }

      const { data: run, error: runError } = await client
        .from("game_world_runs")
        .select("*")
        .eq("id", body.runId)
        .eq("user_id", authResult.user.id)
        .single();

      if (runError || !run || run.status !== "active") {
        return jsonResponse({ error: "Active run not found" }, corsHeaders, 404);
      }

      const node = WORLD_NODES.find((entry) => entry.code === body.nodeCode);
      if (!node) return jsonResponse({ error: "Unknown node" }, corsHeaders, 400);

      const nodeStatus = computeNodeStatus(completedNodes, node.code);
      if (nodeStatus === "locked") {
        return jsonResponse({ error: "Node locked" }, corsHeaders, 409);
      }

      const { data: previousAttempts } = await client
        .from("game_world_node_attempts")
        .select("attempt_no")
        .eq("run_id", run.id)
        .eq("node_code", node.code)
        .order("attempt_no", { ascending: false })
        .limit(1);

      const nextAttempt = (previousAttempts?.[0]?.attempt_no ?? 0) + 1;
      const rewardMultiplier = Number(run.reward_multiplier) || 1;

      let outcome: "success" | "fail" | "invalid" = "invalid";
      let reason = "validation_failed";
      let coinsDelta = 0;
      let energyDelta = 0;
      let xpDelta = 0;
      let resultMetadata: Record<string, unknown> = {};

      if (node.type === "level") {
        const evaluated = evaluateLevelNode(node.code, body.answers ?? {});
        outcome = evaluated.success ? "success" : "fail";
        reason = evaluated.reason;

        if (evaluated.success) {
          coinsDelta = scaleReward(node.reward.coins, rewardMultiplier);
          xpDelta = scaleReward(node.reward.xp, rewardMultiplier);
          energyDelta = -node.reward.energyCost;
        } else {
          coinsDelta = -6;
          energyDelta = -1;
          xpDelta = 2;
        }
      } else if (node.type === "checkpoint") {
        const state = (run.state ?? {}) as { checkpointVisited?: boolean };
        if (state.checkpointVisited) {
          outcome = "fail";
          reason = "checkpoint_already_collected";
        } else {
          outcome = "success";
          reason = "checkpoint_collected";
          coinsDelta = scaleReward(node.reward.coins, rewardMultiplier);
          xpDelta = scaleReward(node.reward.xp, rewardMultiplier);
          energyDelta = 1;
          resultMetadata = { checkpointVisited: true };
        }
      } else {
        return jsonResponse({ error: "Use finish_world_run for exit node" }, corsHeaders, 400);
      }

      const { data: attempt, error: attemptError } = await client
        .from("game_world_node_attempts")
        .insert({
          run_id: run.id,
          user_id: authResult.user.id,
          node_code: node.code,
          attempt_no: nextAttempt,
          outcome,
          coins_delta: coinsDelta,
          energy_delta: energyDelta,
          xp_delta: xpDelta,
          duration_ms: Number(body.durationMs) || null,
          submitted_payload: body.answers ?? {},
          result_metadata: { reason, ...resultMetadata },
        })
        .select("*")
        .single();

      if (attemptError) throw attemptError;

      const completedAfter = [...completedNodes];
      if (node.type === "level" && outcome === "success" && !completedAfter.includes(node.code)) {
        completedAfter.push(node.code);
      }

      const nextXp = Math.max(0, Number(profile.xp) + xpDelta);
      const { error: profileError } = await client
        .from("game_world_profiles")
        .update({ xp: nextXp, completed_nodes: completedAfter })
        .eq("id", profile.id)
        .eq("user_id", authResult.user.id);

      if (profileError) throw profileError;

      const runState = (run.state ?? {}) as {
        checkpointVisited?: boolean;
        completedNodesInRun?: string[];
      };
      const completedNodesInRun = Array.isArray(runState.completedNodesInRun) ? [...runState.completedNodesInRun] : [];
      if (node.type === "level" && outcome === "success" && !completedNodesInRun.includes(node.code)) {
        completedNodesInRun.push(node.code);
      }

      const { data: updatedRun, error: updateRunError } = await client
        .from("game_world_runs")
        .update({
          total_coins_delta: Number(run.total_coins_delta) + coinsDelta,
          total_energy_delta: Number(run.total_energy_delta) + energyDelta,
          total_xp_delta: Number(run.total_xp_delta) + xpDelta,
          state: {
            checkpointVisited: runState.checkpointVisited || resultMetadata.checkpointVisited === true,
            completedNodesInRun,
          },
        })
        .eq("id", run.id)
        .eq("user_id", authResult.user.id)
        .select("*")
        .single();

      if (updateRunError) throw updateRunError;

      const freshCompletedNodes = normalizeCompletedNodes(completedAfter);
      const nodeStatuses = WORLD_NODES.map((entry) => ({
        code: entry.code,
        status: computeNodeStatus(freshCompletedNodes, entry.code),
      }));

      return jsonResponse(
        {
          attempt,
          updatedRun,
          outcome,
          reason,
          deltas: { coinsDelta, energyDelta, xpDelta },
          nodeStatuses,
        },
        corsHeaders,
      );
    }

    if (body.action === "finish_world_run") {
      if (!body.runId) return jsonResponse({ error: "runId is required" }, corsHeaders, 400);

      const { data: run, error: runError } = await client
        .from("game_world_runs")
        .select("*")
        .eq("id", body.runId)
        .eq("user_id", authResult.user.id)
        .single();

      if (runError || !run || run.status !== "active") {
        return jsonResponse({ error: "Active run not found" }, corsHeaders, 404);
      }

      const completedNow = normalizeCompletedNodes(profile.completed_nodes);
      const levelCompletedCount = WORLD_NODES
        .filter((entry) => entry.type === "level")
        .filter((entry) => completedNow.includes(entry.code)).length;

      if (levelCompletedCount < 3) {
        return jsonResponse({ error: "Complete at least 3 level nodes before exiting" }, corsHeaders, 409);
      }

      const completionCoins = scaleReward(30, Number(run.reward_multiplier) || 1);
      const completionXp = scaleReward(35, Number(run.reward_multiplier) || 1);

      const { data: finalRun, error: finishError } = await client
        .from("game_world_runs")
        .update({
          status: "finished",
          finished_at: new Date().toISOString(),
          total_coins_delta: Number(run.total_coins_delta) + completionCoins,
          total_xp_delta: Number(run.total_xp_delta) + completionXp,
        })
        .eq("id", run.id)
        .eq("user_id", authResult.user.id)
        .select("*")
        .single();

      if (finishError) throw finishError;

      const nextXp = Math.max(0, Number(profile.xp) + completionXp);
      await client.from("game_world_profiles").update({ xp: nextXp }).eq("id", profile.id).eq("user_id", authResult.user.id);

      await client.from("game_telemetry_events").insert({
        user_id: authResult.user.id,
        campaign_id: campaign?.id ?? null,
        event_name: "world_session_finished",
        payload: {
          run_id: run.id,
          reward_multiplier: Number(run.reward_multiplier) || 1,
          completion_coins: completionCoins,
          completion_xp: completionXp,
        },
      });

      return jsonResponse({ run: finalRun, completion: { completionCoins, completionXp } }, corsHeaders);
    }

    return jsonResponse({ error: "Unsupported action" }, corsHeaders, 400);
  } catch (error) {
    console.error("game-world error", error);
    return jsonResponse({ error: error instanceof Error ? error.message : "Unexpected error" }, corsHeaders, 500);
  }
});

