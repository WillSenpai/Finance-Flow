import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { buildCorsHeaders, rejectDisallowedOrigin } from "../_shared/cors.ts";
import { requireAdminUser, requireAuthenticatedUser } from "../_shared/auth.ts";

type PlanRow = {
  user_id: string;
  plan_type: "free" | "pro" | null;
  plan: "free" | "pro" | null;
  monthly_token_limit: number | null;
  tokens_used_this_month: number | null;
};

type UsageRow = {
  user_id: string;
  feature: string;
  prompt_tokens: number;
  completion_tokens: number;
};

type ProfileRow = {
  id: string;
  name: string | null;
  email: string | null;
};

serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const blocked = rejectDisallowedOrigin(req, corsHeaders);
  if (blocked) return blocked;

  const authResult = await requireAuthenticatedUser(req, corsHeaders);
  if (!authResult.ok) return authResult.response;

  const isAdmin = await requireAdminUser(authResult.user.id);
  if (!isAdmin) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    return new Response(JSON.stringify({ error: "Supabase environment is not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const admin = createClient(supabaseUrl, serviceRoleKey);

    const now = new Date();
    const periodStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();

    const { data: plans, error: plansError } = await admin
      .from("user_ai_plans")
      .select("user_id, plan_type, plan, monthly_token_limit, tokens_used_this_month");

    if (plansError) throw plansError;

    const { data: usageRows, error: usageError } = await admin
      .from("user_ai_usage_logs")
      .select("user_id, feature, prompt_tokens, completion_tokens")
      .gte("created_at", periodStart);

    if (usageError) throw usageError;

    const typedPlans = (plans ?? []) as PlanRow[];
    const typedUsageRows = (usageRows ?? []) as UsageRow[];

    const userIds = typedPlans.map((row) => row.user_id);
    let profilesMap = new Map<string, ProfileRow>();

    if (userIds.length > 0) {
      const { data: profiles } = await admin
        .from("profiles")
        .select("id, name, email")
        .in("id", userIds);

      profilesMap = new Map((profiles ?? []).map((p) => [p.id, p as ProfileRow]));
    }

    const featureTotals = new Map<string, number>();
    for (const row of typedUsageRows) {
      const total = Number(row.prompt_tokens ?? 0) + Number(row.completion_tokens ?? 0);
      featureTotals.set(row.feature, (featureTotals.get(row.feature) ?? 0) + total);
    }

    const planBreakdown = {
      free: 0,
      pro: 0,
    };

    const perUser = typedPlans
      .map((row) => {
        const planType = row.plan_type === "pro" || row.plan === "pro" ? "pro" : "free";
        const limit = Number(row.monthly_token_limit ?? (planType === "pro" ? 5_000_000 : 500_000));
        const used = Number(row.tokens_used_this_month ?? 0);
        const available = Math.max(limit - used, 0);
        planBreakdown[planType] += used;

        const profile = profilesMap.get(row.user_id);
        return {
          user_id: row.user_id,
          name: profile?.name ?? null,
          email: profile?.email ?? null,
          plan_type: planType,
          monthly_token_limit: limit,
          tokens_used_this_month: used,
          credits_available: available,
        };
      })
      .sort((a, b) => b.tokens_used_this_month - a.tokens_used_this_month);

    const totalCreditsConsumed = perUser.reduce((sum, row) => sum + row.tokens_used_this_month, 0);

    return new Response(
      JSON.stringify({
        period_start: periodStart,
        totals: {
          credits_consumed_this_month: totalCreditsConsumed,
        },
        breakdown: {
          by_plan: planBreakdown,
          by_feature: Array.from(featureTotals.entries())
            .map(([feature, tokens]) => ({ feature, tokens }))
            .sort((a, b) => b.tokens - a.tokens),
        },
        users: perUser,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("ai-usage-admin error", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
