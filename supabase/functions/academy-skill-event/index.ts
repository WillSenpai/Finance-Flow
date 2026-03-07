import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { requireAuthenticatedUser } from "../_shared/auth.ts";
import { buildCorsHeaders, rejectDisallowedOrigin } from "../_shared/cors.ts";
import { clampMastery, dueDateFromStep, eventDelta, masteryLevelFromScore, nextReviewStep } from "../_shared/academy.ts";

serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const originBlocked = rejectDisallowedOrigin(req, corsHeaders);
  if (originBlocked) return originBlocked;

  try {
    const authResult = await requireAuthenticatedUser(req, corsHeaders);
    if (!authResult.ok) return authResult.response;

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) {
      return json({ error: "Supabase env missing" }, 500, corsHeaders);
    }

    const admin = createClient(supabaseUrl, serviceRoleKey);
    const userId = authResult.user.id;
    const body = await req.json().catch(() => ({}));

    const skillId = String(body.skill_id ?? "");
    const eventId = String(body.event_id ?? "");
    const eventType = String(body.event_type ?? "");
    const challengeResult = body.challenge_result ? String(body.challenge_result) : undefined;
    const reviewSuccess = typeof body.review_success === "boolean" ? body.review_success : undefined;

    if (!skillId || !eventId || !eventType) {
      return json({ error: "skill_id, event_id and event_type are required" }, 400, corsHeaders);
    }

    const skillRes = await admin
      .from("academy_skills")
      .select("id")
      .eq("id", skillId)
      .eq("is_active", true)
      .maybeSingle();

    if (skillRes.error) return json({ error: skillRes.error.message }, 500, corsHeaders);
    if (!skillRes.data) return json({ error: "Skill not found" }, 404, corsHeaders);

    const existingEvent = await admin
      .from("user_skill_events")
      .select("id, delta")
      .eq("user_id", userId)
      .eq("event_id", eventId)
      .maybeSingle();

    if (existingEvent.error) return json({ error: existingEvent.error.message }, 500, corsHeaders);
    if (existingEvent.data) {
      const mastery = await admin
        .from("user_skill_mastery")
        .select("mastery_score, mastery_level")
        .eq("user_id", userId)
        .eq("skill_id", skillId)
        .maybeSingle();

      return json({
        idempotent: true,
        event_id: eventId,
        mastery_score: mastery.data?.mastery_score ?? 0,
        mastery_level: mastery.data?.mastery_level ?? "base",
      }, 200, corsHeaders);
    }

    const delta = eventDelta(eventType, { challengeResult, reviewSuccess });

    const currentMastery = await admin
      .from("user_skill_mastery")
      .select("mastery_score")
      .eq("user_id", userId)
      .eq("skill_id", skillId)
      .maybeSingle();

    if (currentMastery.error) return json({ error: currentMastery.error.message }, 500, corsHeaders);

    const nextScore = clampMastery((currentMastery.data?.mastery_score ?? 0) + delta);
    const nextLevel = masteryLevelFromScore(nextScore);

    const insertEvent = await admin
      .from("user_skill_events")
      .insert({
        user_id: userId,
        skill_id: skillId,
        event_id: eventId,
        event_type: eventType,
        delta,
        payload: {
          challenge_result: challengeResult,
          review_success: reviewSuccess,
        },
      });

    if (insertEvent.error) return json({ error: insertEvent.error.message }, 500, corsHeaders);

    const upsertMastery = await admin
      .from("user_skill_mastery")
      .upsert({
        user_id: userId,
        skill_id: skillId,
        mastery_score: nextScore,
        mastery_level: nextLevel,
        last_event_at: new Date().toISOString(),
      }, { onConflict: "user_id,skill_id" });

    if (upsertMastery.error) return json({ error: upsertMastery.error.message }, 500, corsHeaders);

    if (eventType === "challenge") {
      const existingPending = await admin
        .from("user_review_queue")
        .select("id")
        .eq("user_id", userId)
        .eq("skill_id", skillId)
        .eq("status", "pending")
        .limit(1)
        .maybeSingle();

      if (!existingPending.data) {
        await admin.from("user_review_queue").insert({
          user_id: userId,
          skill_id: skillId,
          step_day: 1,
          due_at: dueDateFromStep(1),
          status: "pending",
        });
      }
    }

    if (eventType === "review") {
      const success = Boolean(reviewSuccess);
      const latestPending = await admin
        .from("user_review_queue")
        .select("id, step_day")
        .eq("user_id", userId)
        .eq("skill_id", skillId)
        .eq("status", "pending")
        .order("due_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      const currentStep = (latestPending.data?.step_day ?? 1) as 1 | 3 | 7 | 14;

      if (latestPending.data?.id) {
        await admin
          .from("user_review_queue")
          .update({
            status: success ? "completed" : "failed",
            last_result: success,
            last_reviewed_at: new Date().toISOString(),
          })
          .eq("id", latestPending.data.id)
          .eq("user_id", userId);
      }

      const newStep = nextReviewStep(currentStep, success);
      await admin.from("user_review_queue").insert({
        user_id: userId,
        skill_id: skillId,
        step_day: newStep,
        due_at: dueDateFromStep(newStep),
        status: "pending",
      });
    }

    return json({
      idempotent: false,
      delta,
      mastery_score: nextScore,
      mastery_level: nextLevel,
    }, 200, corsHeaders);
  } catch (error) {
    console.error("academy-skill-event error", error);
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 500, buildCorsHeaders(req));
  }
});

function json(payload: unknown, status: number, corsHeaders: HeadersInit) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
