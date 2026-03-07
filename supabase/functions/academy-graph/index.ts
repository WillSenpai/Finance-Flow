import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { requireAuthenticatedUser } from "../_shared/auth.ts";
import { buildCorsHeaders, rejectDisallowedOrigin } from "../_shared/cors.ts";

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

    const [skillsRes, edgesRes, masteryRes, reviewDueRes, runRes] = await Promise.all([
      admin
        .from("academy_skills")
        .select("id, slug, title, description, lesson_id, min_mastery_required, unlock_mastery_threshold, position_x, position_y")
        .eq("is_active", true)
        .order("position_y", { ascending: true }),
      admin.from("academy_skill_edges").select("from_skill_id, to_skill_id"),
      admin.from("user_skill_mastery").select("skill_id, mastery_score, mastery_level").eq("user_id", userId),
      admin
        .from("user_review_queue")
        .select("skill_id")
        .eq("user_id", userId)
        .eq("status", "pending")
        .lte("due_at", new Date().toISOString()),
      admin
        .from("user_assessment_runs")
        .select("id")
        .eq("user_id", userId)
        .eq("status", "completed")
        .limit(1)
        .maybeSingle(),
    ]);

    if (skillsRes.error) return json({ error: skillsRes.error.message }, 500, corsHeaders);
    if (edgesRes.error) return json({ error: edgesRes.error.message }, 500, corsHeaders);
    if (masteryRes.error) return json({ error: masteryRes.error.message }, 500, corsHeaders);
    if (reviewDueRes.error) return json({ error: reviewDueRes.error.message }, 500, corsHeaders);

    const assessmentCompleted = Boolean(runRes.data?.id);
    const skills = skillsRes.data ?? [];
    const edges = edgesRes.data ?? [];
    const masteryRows = masteryRes.data ?? [];
    const dueSkillIds = new Set((reviewDueRes.data ?? []).map((row) => row.skill_id));

    const masteryMap = new Map<string, { mastery_score: number; mastery_level: string }>();
    for (const row of masteryRows) {
      masteryMap.set(row.skill_id, {
        mastery_score: Number(row.mastery_score ?? 0),
        mastery_level: String(row.mastery_level ?? "base"),
      });
    }

    const incoming = new Map<string, string[]>();
    for (const edge of edges) {
      const list = incoming.get(edge.to_skill_id) ?? [];
      list.push(edge.from_skill_id);
      incoming.set(edge.to_skill_id, list);
    }

    const nodes = skills.map((skill) => {
      const mastery = masteryMap.get(skill.id);
      const score = mastery?.mastery_score ?? 0;
      const prereqs = incoming.get(skill.id) ?? [];

      const prereqScores = prereqs.map((id) => masteryMap.get(id)?.mastery_score ?? 0);
      const allPrereqPass = prereqScores.every((value) => value >= skill.min_mastery_required);
      const prereqAvg = prereqScores.length > 0
        ? prereqScores.reduce((sum, value) => sum + value, 0) / prereqScores.length
        : 100;
      const thresholdPass = prereqAvg >= skill.unlock_mastery_threshold;

      const rootAvailable = prereqs.length === 0;
      const unlocked = assessmentCompleted && ((rootAvailable) || (allPrereqPass && thresholdPass));

      let state: "locked" | "available" | "mastered" | "fading" = "locked";
      if (score >= 80) state = "mastered";
      else if (dueSkillIds.has(skill.id) && unlocked) state = "fading";
      else if (unlocked) state = "available";

      return {
        skill_id: skill.id,
        slug: skill.slug,
        title: skill.title,
        description: skill.description,
        lesson_id: skill.lesson_id,
        mastery_score: score,
        mastery_level: mastery?.mastery_level ?? "base",
        state,
        position_x: skill.position_x,
        position_y: skill.position_y,
        prereq_count: prereqs.length,
      };
    });

    return json({
      assessment_completed: assessmentCompleted,
      review_due_count: dueSkillIds.size,
      nodes,
      edges,
    }, 200, corsHeaders);
  } catch (error) {
    console.error("academy-graph error", error);
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 500, buildCorsHeaders(req));
  }
});

function json(payload: unknown, status: number, corsHeaders: HeadersInit) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
