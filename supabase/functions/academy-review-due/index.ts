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

    const body = await req.json().catch(() => ({}));
    const limit = Math.max(1, Math.min(50, Number(body.limit ?? 20)));

    const dueRes = await admin
      .from("user_review_queue")
      .select("id, skill_id, step_day, due_at, status")
      .eq("user_id", userId)
      .eq("status", "pending")
      .lte("due_at", new Date().toISOString())
      .order("due_at", { ascending: true })
      .limit(limit);

    if (dueRes.error) return json({ error: dueRes.error.message }, 500, corsHeaders);

    const rows = dueRes.data ?? [];
    const skillIds = Array.from(new Set(rows.map((row) => row.skill_id)));

    let skillMap = new Map<string, { title: string; slug: string; lesson_id: string | null }>();
    if (skillIds.length > 0) {
      const skillsRes = await admin
        .from("academy_skills")
        .select("id, title, slug, lesson_id")
        .in("id", skillIds);

      if (!skillsRes.error) {
        skillMap = new Map(
          (skillsRes.data ?? []).map((s) => [s.id, { title: s.title, slug: s.slug, lesson_id: s.lesson_id }]),
        );
      }
    }

    const items = rows.map((row) => ({
      id: row.id,
      skill_id: row.skill_id,
      skill_title: skillMap.get(row.skill_id)?.title ?? "Skill",
      skill_slug: skillMap.get(row.skill_id)?.slug ?? null,
      lesson_id: skillMap.get(row.skill_id)?.lesson_id ?? null,
      step_day: row.step_day,
      due_at: row.due_at,
      status: row.status,
    }));

    return json({ count: items.length, items }, 200, corsHeaders);
  } catch (error) {
    console.error("academy-review-due error", error);
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 500, buildCorsHeaders(req));
  }
});

function json(payload: unknown, status: number, corsHeaders: HeadersInit) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
