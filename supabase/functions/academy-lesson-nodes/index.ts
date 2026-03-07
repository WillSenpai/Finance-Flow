import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { buildCorsHeaders, rejectDisallowedOrigin } from "../_shared/cors.ts";

type NodeStatus = "locked" | "available" | "completed" | "skipped";
type LessonNodeKey = "concept" | "widget" | "challenge" | "feedback";
type Action = "get" | "advance" | "skip" | "submit_optional_quiz";

type NodeRow = {
  id: string;
  lesson_id: string;
  node_key: LessonNodeKey;
  title: string;
  description: string;
  sort_order: number;
};

type ProgressRow = {
  lesson_node_id: string;
  status: NodeStatus;
};

serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const originBlocked = rejectDisallowedOrigin(req, corsHeaders);
  if (originBlocked) return originBlocked;

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) {
      return json({ error: "Supabase env missing" }, 500, corsHeaders);
    }

    const admin = createClient(supabaseUrl, serviceRoleKey);
    const body = await req.json().catch(() => ({}));
    const action = String(body.action ?? "get") as Action;
    const lessonId = String(body.lesson_id ?? "").trim();
    const userId = String(body.user_id ?? "").trim();

    if (!lessonId) return json({ error: "lesson_id is required" }, 400, corsHeaders);
    if (!userId) return json({ error: "user_id is required" }, 400, corsHeaders);

    const lessonNodesRes = await admin
      .from("academy_lesson_nodes")
      .select("id, lesson_id, node_key, title, description, sort_order")
      .eq("lesson_id", lessonId)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (lessonNodesRes.error) return json({ error: lessonNodesRes.error.message }, 500, corsHeaders);
    const lessonNodes = (lessonNodesRes.data ?? []) as NodeRow[];
    if (lessonNodes.length === 0) return json({ error: "No nodes configured for this lesson" }, 404, corsHeaders);

    const planRes = await admin
      .from("user_ai_plans")
      .select("plan")
      .eq("user_id", userId)
      .maybeSingle();

    const plan = planRes.data?.plan === "pro" ? "pro" : "free";

    await ensureProgressRows(admin, userId, lessonId, lessonNodes);

    if (action === "advance") {
      const nodeKey = String(body.node_key ?? "") as LessonNodeKey;
      const eventId = String(body.event_id ?? `advance:${lessonId}:${nodeKey}:${Date.now()}`);
      if (!isNodeKey(nodeKey)) return json({ error: "Invalid node_key" }, 400, corsHeaders);

      const progress = await getProgressMap(admin, userId, lessonId);
      const targetNode = lessonNodes.find((node) => node.node_key === nodeKey);
      if (!targetNode) return json({ error: "Node not found" }, 404, corsHeaders);

      const currentStatus = progress.get(targetNode.id) ?? "locked";
      if (currentStatus === "locked") return json({ error: "Node is locked" }, 409, corsHeaders);

      if (currentStatus !== "completed") {
        const updateRes = await admin
          .from("user_lesson_node_progress")
          .update({ status: "completed", completed_at: new Date().toISOString(), skipped_at: null })
          .eq("user_id", userId)
          .eq("lesson_node_id", targetNode.id);

        if (updateRes.error) return json({ error: updateRes.error.message }, 500, corsHeaders);

        await admin
          .from("user_lesson_node_events")
          .insert({
            user_id: userId,
            lesson_id: lessonId,
            node_key: nodeKey,
            event_id: eventId,
            event_type: "advance",
            payload: body.payload ?? {},
          });
      }

      const snapshot = await recomputeAndFetch(admin, userId, lessonId, lessonNodes);
      return json(snapshot, 200, corsHeaders);
    }

    if (action === "skip") {
      const nodeKey = String(body.node_key ?? "") as LessonNodeKey;
      const eventId = String(body.event_id ?? `skip:${lessonId}:${nodeKey}:${Date.now()}`);
      if (!isNodeKey(nodeKey)) return json({ error: "Invalid node_key" }, 400, corsHeaders);

      if (plan !== "pro") {
        return json({ error: "PRO_REQUIRED_FOR_SKIP", code: "PRO_REQUIRED_FOR_SKIP" }, 403, corsHeaders);
      }

      const progress = await getProgressMap(admin, userId, lessonId);
      const targetNode = lessonNodes.find((node) => node.node_key === nodeKey);
      if (!targetNode) return json({ error: "Node not found" }, 404, corsHeaders);

      const currentStatus = progress.get(targetNode.id) ?? "locked";
      if (currentStatus === "locked") return json({ error: "Node is locked" }, 409, corsHeaders);
      if (currentStatus === "completed") return json({ error: "Completed node cannot be skipped" }, 409, corsHeaders);

      if (currentStatus !== "skipped") {
        const updateRes = await admin
          .from("user_lesson_node_progress")
          .update({ status: "skipped", skipped_at: new Date().toISOString() })
          .eq("user_id", userId)
          .eq("lesson_node_id", targetNode.id);

        if (updateRes.error) return json({ error: updateRes.error.message }, 500, corsHeaders);

        await admin
          .from("user_lesson_node_events")
          .insert({
            user_id: userId,
            lesson_id: lessonId,
            node_key: nodeKey,
            event_id: eventId,
            event_type: "skip",
            payload: body.payload ?? {},
          });
      }

      const snapshot = await recomputeAndFetch(admin, userId, lessonId, lessonNodes);
      return json(snapshot, 200, corsHeaders);
    }

    if (action === "submit_optional_quiz") {
      const score = Math.max(0, Math.min(100, Number(body.score ?? 0)));
      const passed = Boolean(body.passed ?? score >= 70);
      const eventId = String(body.event_id ?? `quiz:${lessonId}:${Date.now()}`);

      const quizInsert = await admin.from("user_lesson_optional_quiz_runs").insert({
        user_id: userId,
        lesson_id: lessonId,
        score,
        passed,
        payload: body.payload ?? {},
      });
      if (quizInsert.error) return json({ error: quizInsert.error.message }, 500, corsHeaders);

      await admin
        .from("user_lesson_node_events")
        .insert({
          user_id: userId,
          lesson_id: lessonId,
          node_key: "feedback",
          event_id: eventId,
          event_type: "optional_quiz",
          payload: { score, passed, ...(body.payload ?? {}) },
        });

      const snapshot = await recomputeAndFetch(admin, userId, lessonId, lessonNodes);
      return json({ ...snapshot, optional_quiz: { score, passed } }, 200, corsHeaders);
    }

    const snapshot = await recomputeAndFetch(admin, userId, lessonId, lessonNodes);
    return json(snapshot, 200, corsHeaders);
  } catch (error) {
    console.error("academy-lesson-nodes error", error);
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 500, buildCorsHeaders(req));
  }
});

function isNodeKey(value: string): value is LessonNodeKey {
  return value === "concept" || value === "widget" || value === "challenge" || value === "feedback";
}

async function ensureProgressRows(admin: ReturnType<typeof createClient>, userId: string, lessonId: string, lessonNodes: NodeRow[]) {
  const rows = lessonNodes.map((node, index) => ({
    user_id: userId,
    lesson_node_id: node.id,
    lesson_id: lessonId,
    node_key: node.node_key,
    status: index === 0 ? "available" : "locked",
  }));

  await admin
    .from("user_lesson_node_progress")
    .upsert(rows, { onConflict: "user_id,lesson_node_id", ignoreDuplicates: true });
}

async function getProgressMap(admin: ReturnType<typeof createClient>, userId: string, lessonId: string) {
  const res = await admin
    .from("user_lesson_node_progress")
    .select("lesson_node_id, status")
    .eq("user_id", userId)
    .eq("lesson_id", lessonId);

  if (res.error) throw new Error(res.error.message);

  const map = new Map<string, NodeStatus>();
  for (const row of (res.data ?? []) as ProgressRow[]) {
    map.set(row.lesson_node_id, row.status);
  }
  return map;
}

async function recomputeAndFetch(
  admin: ReturnType<typeof createClient>,
  userId: string,
  lessonId: string,
  lessonNodes: NodeRow[],
) {
  const progressMap = await getProgressMap(admin, userId, lessonId);
  const updates: Array<{ lesson_node_id: string; status: NodeStatus }> = [];

  for (let i = 0; i < lessonNodes.length; i += 1) {
    const node = lessonNodes[i];
    const current = progressMap.get(node.id) ?? (i === 0 ? "available" : "locked");
    if (current === "completed" || current === "skipped") continue;

    if (i === 0) {
      if (current !== "available") updates.push({ lesson_node_id: node.id, status: "available" });
      continue;
    }

    const prevNode = lessonNodes[i - 1];
    const prevStatus = progressMap.get(prevNode.id) ?? "locked";
    const shouldBeAvailable = prevStatus === "completed" || prevStatus === "skipped";
    const nextStatus: NodeStatus = shouldBeAvailable ? "available" : "locked";

    if (current !== nextStatus) updates.push({ lesson_node_id: node.id, status: nextStatus });
  }

  for (const update of updates) {
    const updateRes = await admin
      .from("user_lesson_node_progress")
      .update({ status: update.status })
      .eq("user_id", userId)
      .eq("lesson_node_id", update.lesson_node_id);

    if (updateRes.error) throw new Error(updateRes.error.message);
    progressMap.set(update.lesson_node_id, update.status);
  }

  const nodes = lessonNodes.map((node) => ({
    lesson_node_id: node.id,
    node_key: node.node_key,
    title: node.title,
    description: node.description,
    sort_order: node.sort_order,
    status: progressMap.get(node.id) ?? "locked",
  }));

  const completedCount = nodes.filter((node) => node.status === "completed").length;
  const skippedCount = nodes.filter((node) => node.status === "skipped").length;

  return {
    lesson_id: lessonId,
    total_nodes: nodes.length,
    completed_nodes: completedCount,
    skipped_nodes: skippedCount,
    lesson_completed: completedCount === nodes.length,
    nodes,
  };
}

function json(payload: unknown, status: number, corsHeaders: HeadersInit) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
