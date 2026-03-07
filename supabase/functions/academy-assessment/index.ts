import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { requireAuthenticatedUser } from "../_shared/auth.ts";
import { buildCorsHeaders, rejectDisallowedOrigin } from "../_shared/cors.ts";
import { masteryLevelFromScore, nextDifficulty, dueDateFromStep } from "../_shared/academy.ts";

type AssessmentAction = "start" | "answer" | "complete";

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
    const action = (body.action ?? "start") as AssessmentAction;

    if (action === "start") {
      const completed = await getLatestCompletedRun(admin, userId);
      if (completed) {
        return json({ assessment_completed: true, run_id: completed.id }, 200, corsHeaders);
      }

      let run = await getLatestInProgressRun(admin, userId);
      if (!run) {
        const created = await admin
          .from("user_assessment_runs")
          .insert({ user_id: userId, status: "in_progress", current_step: 0, total_steps: 12, current_difficulty: 2 })
          .select("id, current_step, total_steps, current_difficulty")
          .single();

        if (created.error || !created.data) {
          return json({ error: created.error?.message ?? "Unable to create assessment run" }, 500, corsHeaders);
        }
        run = created.data;
      }

      const nextQuestion = await pickNextQuestion(admin, run.id, run.current_difficulty);
      if (!nextQuestion) {
        return json({ error: "No assessment questions available" }, 409, corsHeaders);
      }

      return json({
        assessment_completed: false,
        run_id: run.id,
        step: run.current_step + 1,
        total_steps: run.total_steps,
        question: sanitizeQuestion(nextQuestion),
      }, 200, corsHeaders);
    }

    if (action === "answer") {
      const runId = String(body.run_id ?? "");
      const questionId = String(body.question_id ?? "");
      const selectedOption = Number(body.selected_option);

      if (!runId || !questionId || Number.isNaN(selectedOption)) {
        return json({ error: "run_id, question_id and selected_option are required" }, 400, corsHeaders);
      }

      const runRes = await admin
        .from("user_assessment_runs")
        .select("id, user_id, status, current_step, total_steps, current_difficulty")
        .eq("id", runId)
        .maybeSingle();

      if (runRes.error) return json({ error: runRes.error.message }, 500, corsHeaders);
      if (!runRes.data || runRes.data.user_id !== userId) return json({ error: "Run not found" }, 404, corsHeaders);
      if (runRes.data.status !== "in_progress") return json({ error: "Run is not in progress" }, 409, corsHeaders);

      const questionRes = await admin
        .from("academy_assessment_questions")
        .select("id, skill_id, correct_option, difficulty")
        .eq("id", questionId)
        .eq("is_active", true)
        .maybeSingle();

      if (questionRes.error) return json({ error: questionRes.error.message }, 500, corsHeaders);
      if (!questionRes.data) return json({ error: "Question not found" }, 404, corsHeaders);

      const alreadyRes = await admin
        .from("user_assessment_answers")
        .select("id")
        .eq("run_id", runId)
        .eq("question_id", questionId)
        .maybeSingle();

      if (alreadyRes.error) return json({ error: alreadyRes.error.message }, 500, corsHeaders);
      if (alreadyRes.data) return json({ error: "Question already answered in this run" }, 409, corsHeaders);

      const isCorrect = selectedOption === questionRes.data.correct_option;
      const insertAnswer = await admin.from("user_assessment_answers").insert({
        run_id: runId,
        user_id: userId,
        question_id: questionId,
        skill_id: questionRes.data.skill_id,
        selected_option: selectedOption,
        is_correct: isCorrect,
        difficulty_at_answer: runRes.data.current_difficulty,
      });

      if (insertAnswer.error) return json({ error: insertAnswer.error.message }, 500, corsHeaders);

      const updatedStep = runRes.data.current_step + 1;
      const updatedDifficulty = nextDifficulty(runRes.data.current_difficulty, isCorrect);

      const runUpdate = await admin
        .from("user_assessment_runs")
        .update({ current_step: updatedStep, current_difficulty: updatedDifficulty })
        .eq("id", runId)
        .eq("user_id", userId);

      if (runUpdate.error) return json({ error: runUpdate.error.message }, 500, corsHeaders);

      if (updatedStep >= runRes.data.total_steps) {
        return json({ done: true, run_id: runId }, 200, corsHeaders);
      }

      const nextQuestion = await pickNextQuestion(admin, runId, updatedDifficulty);
      if (!nextQuestion) {
        return json({ done: true, run_id: runId }, 200, corsHeaders);
      }

      return json({
        done: false,
        run_id: runId,
        step: updatedStep + 1,
        total_steps: runRes.data.total_steps,
        question: sanitizeQuestion(nextQuestion),
      }, 200, corsHeaders);
    }

    if (action === "complete") {
      const runId = String(body.run_id ?? "");
      if (!runId) return json({ error: "run_id is required" }, 400, corsHeaders);

      const runRes = await admin
        .from("user_assessment_runs")
        .select("id, user_id, status, current_step, total_steps")
        .eq("id", runId)
        .maybeSingle();

      if (runRes.error) return json({ error: runRes.error.message }, 500, corsHeaders);
      if (!runRes.data || runRes.data.user_id !== userId) return json({ error: "Run not found" }, 404, corsHeaders);
      if (runRes.data.status !== "in_progress") return json({ error: "Run already completed" }, 409, corsHeaders);
      if (runRes.data.current_step < runRes.data.total_steps) {
        return json({ error: "Assessment has not reached 12 answers yet" }, 409, corsHeaders);
      }

      const answersRes = await admin
        .from("user_assessment_answers")
        .select("skill_id, is_correct, difficulty_at_answer")
        .eq("run_id", runId)
        .eq("user_id", userId);

      if (answersRes.error) return json({ error: answersRes.error.message }, 500, corsHeaders);
      const answers = answersRes.data ?? [];
      if (answers.length === 0) return json({ error: "No answers found for this run" }, 409, corsHeaders);

      const bySkill = new Map<string, { weightedCorrect: number; weightedTotal: number }>();
      for (const answer of answers) {
        const weight = Math.max(1, Math.min(5, Number(answer.difficulty_at_answer ?? 1)));
        const entry = bySkill.get(answer.skill_id) ?? { weightedCorrect: 0, weightedTotal: 0 };
        entry.weightedTotal += weight;
        if (answer.is_correct) entry.weightedCorrect += weight;
        bySkill.set(answer.skill_id, entry);
      }

      const masteryRows = Array.from(bySkill.entries()).map(([skillId, agg]) => {
        const score = agg.weightedTotal > 0 ? Math.round((agg.weightedCorrect / agg.weightedTotal) * 100) : 0;
        return {
          user_id: userId,
          skill_id: skillId,
          mastery_score: score,
          mastery_level: masteryLevelFromScore(score),
          last_event_at: new Date().toISOString(),
        };
      });

      if (masteryRows.length > 0) {
        const upsertMastery = await admin
          .from("user_skill_mastery")
          .upsert(masteryRows, { onConflict: "user_id,skill_id", ignoreDuplicates: false });
        if (upsertMastery.error) return json({ error: upsertMastery.error.message }, 500, corsHeaders);

        const dueAt = dueDateFromStep(1);
        const reviewRows = masteryRows
          .filter((row) => row.mastery_score >= 30)
          .map((row) => ({
            user_id: userId,
            skill_id: row.skill_id,
            step_day: 1,
            due_at: dueAt,
            status: "pending",
          }));

        if (reviewRows.length > 0) {
          await admin
            .from("user_review_queue")
            .upsert(reviewRows as never, { onConflict: "user_id,skill_id,step_day,status", ignoreDuplicates: true });
        }
      }

      const completeRun = await admin
        .from("user_assessment_runs")
        .update({ status: "completed", completed_at: new Date().toISOString() })
        .eq("id", runId)
        .eq("user_id", userId);

      if (completeRun.error) return json({ error: completeRun.error.message }, 500, corsHeaders);

      return json({ completed: true, run_id: runId, mastery: masteryRows }, 200, corsHeaders);
    }

    return json({ error: "Unsupported action" }, 400, corsHeaders);
  } catch (error) {
    console.error("academy-assessment error", error);
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 500, buildCorsHeaders(req));
  }
});

async function getLatestCompletedRun(admin: ReturnType<typeof createClient>, userId: string) {
  const res = await admin
    .from("user_assessment_runs")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "completed")
    .order("completed_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return res.data ?? null;
}

async function getLatestInProgressRun(admin: ReturnType<typeof createClient>, userId: string) {
  const res = await admin
    .from("user_assessment_runs")
    .select("id, current_step, total_steps, current_difficulty")
    .eq("user_id", userId)
    .eq("status", "in_progress")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return res.data ?? null;
}

async function pickNextQuestion(admin: ReturnType<typeof createClient>, runId: string, targetDifficulty: number) {
  const answersRes = await admin
    .from("user_assessment_answers")
    .select("question_id")
    .eq("run_id", runId);

  const answeredIds = new Set((answersRes.data ?? []).map((row) => row.question_id));
  const idList = Array.from(answeredIds);

  let query = admin
    .from("academy_assessment_questions")
    .select("id, skill_id, prompt, options, difficulty")
    .eq("is_active", true)
    .eq("difficulty", targetDifficulty)
    .limit(1);

  if (idList.length > 0) query = query.not("id", "in", `(${idList.map((id) => `\"${id}\"`).join(",")})`);

  const sameDiff = await query;
  if (!sameDiff.error && sameDiff.data && sameDiff.data.length > 0) {
    return sameDiff.data[0];
  }

  let fallbackQuery = admin
    .from("academy_assessment_questions")
    .select("id, skill_id, prompt, options, difficulty")
    .eq("is_active", true)
    .order("difficulty", { ascending: true })
    .limit(1);

  if (idList.length > 0) fallbackQuery = fallbackQuery.not("id", "in", `(${idList.map((id) => `\"${id}\"`).join(",")})`);

  const fallback = await fallbackQuery;
  if (fallback.error || !fallback.data || fallback.data.length === 0) return null;
  return fallback.data[0];
}

function sanitizeQuestion(row: { id: string; prompt: string; options: unknown; difficulty: number }) {
  const options = Array.isArray(row.options) ? row.options : [];
  return {
    id: row.id,
    prompt: row.prompt,
    options,
    difficulty: row.difficulty,
  };
}

function json(payload: unknown, status: number, corsHeaders: HeadersInit) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
