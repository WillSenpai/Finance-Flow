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
  model_used?: string | null;
  prompt_tokens: number;
  completion_tokens: number;
  created_at?: string;
};

type LegacyPlanRow = {
  user_id: string;
  plan: "free" | "pro" | null;
  monthly_token_limit: number | null;
};

type LegacyUsageRow = {
  user_id: string;
  endpoint: string;
  tokens: number;
  period_start: string;
};

type ProfileRow = {
  id: string;
  name: string | null;
  email: string | null;
};

type RequestPayload = {
  date_from?: string;
  date_to?: string;
  timezone?: string;
};

const DEFAULT_TIMEZONE = "Europe/Rome";
const DEFAULT_RANGE_DAYS = 30;
const MAX_RANGE_DAYS = 365;

function isISODate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function parseISODate(value: string): Date | null {
  if (!isISODate(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function toISODateKey(date: Date, timezone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function normalizeTimezone(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) return DEFAULT_TIMEZONE;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value });
    return value;
  } catch {
    return DEFAULT_TIMEZONE;
  }
}

function buildDateRange(payload: RequestPayload) {
  const timezone = normalizeTimezone(payload.timezone);
  const todayKey = toISODateKey(new Date(), timezone);

  const parsedTo = typeof payload.date_to === "string" ? parseISODate(payload.date_to) : null;
  const dateTo = parsedTo ?? parseISODate(todayKey) ?? new Date();

  const parsedFrom = typeof payload.date_from === "string" ? parseISODate(payload.date_from) : null;
  const fallbackFrom = addDays(dateTo, -(DEFAULT_RANGE_DAYS - 1));
  let dateFrom = parsedFrom ?? fallbackFrom;

  if (dateFrom > dateTo) {
    dateFrom = fallbackFrom;
  }

  const diffMs = dateTo.getTime() - dateFrom.getTime();
  const diffDays = Math.floor(diffMs / 86_400_000) + 1;

  if (diffDays > MAX_RANGE_DAYS) {
    dateFrom = addDays(dateTo, -(MAX_RANGE_DAYS - 1));
  }

  const dateFromKey = toISODateKey(dateFrom, "UTC");
  const dateToKey = toISODateKey(dateTo, "UTC");

  return {
    timezone,
    dateFromKey,
    dateToKey,
    rangeStartQuery: addDays(dateFrom, -1).toISOString(),
    rangeEndQueryExclusive: addDays(dateTo, 2).toISOString(),
  };
}

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
    const body = await req.json().catch(() => ({}));
    const range = buildDateRange((body ?? {}) as RequestPayload);

    const admin = createClient(supabaseUrl, serviceRoleKey);

    let typedPlans: PlanRow[] = [];
    let typedUsageRows: UsageRow[] = [];

    const { data: plansV2, error: plansV2Error } = await admin
      .from("user_ai_plans")
      .select("user_id, plan_type, plan, monthly_token_limit, tokens_used_this_month");

    if (!plansV2Error) {
      typedPlans = (plansV2 ?? []) as PlanRow[];

      const { data: usageV2, error: usageV2Error } = await admin
        .from("user_ai_usage_logs")
        .select("user_id, feature, model_used, prompt_tokens, completion_tokens, created_at")
        .gte("created_at", range.rangeStartQuery)
        .lt("created_at", range.rangeEndQueryExclusive);

      if (usageV2Error) throw usageV2Error;
      typedUsageRows = (usageV2 ?? []) as UsageRow[];
    } else {
      const { data: plansLegacy, error: plansLegacyError } = await admin
        .from("user_ai_plans")
        .select("user_id, plan, monthly_token_limit");

      if (plansLegacyError) throw plansLegacyError;

      typedPlans = ((plansLegacy ?? []) as LegacyPlanRow[]).map((row) => ({
        user_id: row.user_id,
        plan_type: row.plan === "pro" ? "pro" : "free",
        plan: row.plan === "pro" ? "pro" : "free",
        monthly_token_limit: row.monthly_token_limit,
        tokens_used_this_month: 0,
      }));

      const { data: usageLegacy, error: usageLegacyError } = await admin
        .from("ai_usage_events")
        .select("user_id, endpoint, tokens, period_start")
        .gte("period_start", range.dateFromKey)
        .lte("period_start", range.dateToKey);

      if (usageLegacyError) throw usageLegacyError;

      typedUsageRows = ((usageLegacy ?? []) as LegacyUsageRow[]).map((row) => ({
        user_id: row.user_id,
        feature: row.endpoint || "unknown",
        model_used: "unknown",
        prompt_tokens: Number(row.tokens ?? 0),
        completion_tokens: 0,
        created_at: `${row.period_start}T00:00:00.000Z`,
      }));
    }

    const usageInRange = typedUsageRows.filter((row) => {
      if (!row.created_at) return false;
      const date = new Date(row.created_at);
      if (Number.isNaN(date.getTime())) return false;
      const key = toISODateKey(date, range.timezone);
      return key >= range.dateFromKey && key <= range.dateToKey;
    });

    const userIds = new Set<string>();
    for (const row of typedPlans) userIds.add(row.user_id);
    for (const row of usageInRange) userIds.add(row.user_id);

    let profilesMap = new Map<string, ProfileRow>();
    const ids = Array.from(userIds);
    if (ids.length > 0) {
      const { data: profiles } = await admin
        .from("profiles")
        .select("id, name, email")
        .in("id", ids);

      profilesMap = new Map((profiles ?? []).map((p) => [p.id, p as ProfileRow]));
    }

    const planByUser = new Map<string, "free" | "pro">();
    const limitByUser = new Map<string, number>();
    const monthUsedByUser = new Map<string, number>();

    for (const row of typedPlans) {
      const planType = row.plan_type === "pro" || row.plan === "pro" ? "pro" : "free";
      planByUser.set(row.user_id, planType);
      limitByUser.set(row.user_id, Number(row.monthly_token_limit ?? (planType === "pro" ? 5_000_000 : 500_000)));
      monthUsedByUser.set(row.user_id, Number(row.tokens_used_this_month ?? 0));
    }

    const featureAgg = new Map<string, { tokens: number; requests: number }>();
    const modelAgg = new Map<string, { tokens: number; requests: number }>();
    const dayAgg = new Map<string, { tokens: number; requests: number; activeUsers: Set<string> }>();
    const userAgg = new Map<string, { tokens: number; requests: number }>();
    const planAgg = {
      free: { tokens: 0, requests: 0 },
      pro: { tokens: 0, requests: 0 },
    };

    for (const row of usageInRange) {
      const tokens = Number(row.prompt_tokens ?? 0) + Number(row.completion_tokens ?? 0);
      const feature = row.feature || "unknown";
      const model = row.model_used || "unknown";
      const planType = planByUser.get(row.user_id) ?? "free";
      const createdAt = row.created_at ? new Date(row.created_at) : null;
      const dayKey = createdAt ? toISODateKey(createdAt, range.timezone) : range.dateToKey;

      const prevFeature = featureAgg.get(feature) ?? { tokens: 0, requests: 0 };
      prevFeature.tokens += tokens;
      prevFeature.requests += 1;
      featureAgg.set(feature, prevFeature);

      const prevModel = modelAgg.get(model) ?? { tokens: 0, requests: 0 };
      prevModel.tokens += tokens;
      prevModel.requests += 1;
      modelAgg.set(model, prevModel);

      const prevDay = dayAgg.get(dayKey) ?? { tokens: 0, requests: 0, activeUsers: new Set<string>() };
      prevDay.tokens += tokens;
      prevDay.requests += 1;
      prevDay.activeUsers.add(row.user_id);
      dayAgg.set(dayKey, prevDay);

      const prevUser = userAgg.get(row.user_id) ?? { tokens: 0, requests: 0 };
      prevUser.tokens += tokens;
      prevUser.requests += 1;
      userAgg.set(row.user_id, prevUser);

      planAgg[planType].tokens += tokens;
      planAgg[planType].requests += 1;
    }

    const allDays: string[] = [];
    for (
      let cursor = parseISODate(range.dateFromKey) ?? new Date(`${range.dateFromKey}T00:00:00.000Z`);
      toISODateKey(cursor, "UTC") <= range.dateToKey;
      cursor = addDays(cursor, 1)
    ) {
      allDays.push(toISODateKey(cursor, "UTC"));
    }

    const timeseriesDaily = allDays.map((day) => {
      const bucket = dayAgg.get(day);
      return {
        date: day,
        tokens: bucket?.tokens ?? 0,
        requests: bucket?.requests ?? 0,
        active_users: bucket?.activeUsers.size ?? 0,
      };
    });

    const users = Array.from(userIds).map((userId) => {
      const planType = planByUser.get(userId) ?? "free";
      const monthlyLimit = limitByUser.get(userId) ?? (planType === "pro" ? 5_000_000 : 500_000);
      const tokensUsedThisMonth = monthUsedByUser.get(userId) ?? 0;
      const usage = userAgg.get(userId) ?? { tokens: 0, requests: 0 };
      const profile = profilesMap.get(userId);

      return {
        user_id: userId,
        name: profile?.name ?? null,
        email: profile?.email ?? null,
        plan_type: planType,
        monthly_token_limit: monthlyLimit,
        tokens_used_this_month: tokensUsedThisMonth,
        credits_available: Math.max(monthlyLimit - tokensUsedThisMonth, 0),
        tokens_in_range: usage.tokens,
        requests_in_range: usage.requests,
      };
    });

    users.sort((a, b) => b.tokens_in_range - a.tokens_in_range);

    const byFeatureDetailed = Array.from(featureAgg.entries())
      .map(([feature, data]) => ({ feature, tokens: data.tokens, requests: data.requests }))
      .sort((a, b) => b.tokens - a.tokens);

    const byModel = Array.from(modelAgg.entries())
      .map(([model, data]) => ({ model, tokens: data.tokens, requests: data.requests }))
      .sort((a, b) => b.tokens - a.tokens);

    const tokensTotal = usageInRange.reduce(
      (sum, row) => sum + Number(row.prompt_tokens ?? 0) + Number(row.completion_tokens ?? 0),
      0,
    );
    const requestsTotal = usageInRange.length;
    const activeUsers = new Set(usageInRange.map((row) => row.user_id)).size;

    return new Response(
      JSON.stringify({
        period_start: range.dateFromKey,
        period: {
          date_from: range.dateFromKey,
          date_to: range.dateToKey,
          timezone: range.timezone,
        },
        totals: {
          credits_consumed_this_month: tokensTotal,
        },
        summary: {
          tokens_total: tokensTotal,
          requests_total: requestsTotal,
          active_users: activeUsers,
          avg_tokens_per_request: requestsTotal > 0 ? Math.round(tokensTotal / requestsTotal) : 0,
        },
        breakdown: {
          by_plan: {
            free: planAgg.free.tokens,
            pro: planAgg.pro.tokens,
          },
          by_feature: byFeatureDetailed.map((row) => ({ feature: row.feature, tokens: row.tokens })),
        },
        breakdown_detailed: {
          by_plan: [
            { plan_type: "free", tokens: planAgg.free.tokens, requests: planAgg.free.requests },
            { plan_type: "pro", tokens: planAgg.pro.tokens, requests: planAgg.pro.requests },
          ],
          by_feature: byFeatureDetailed,
          by_model: byModel,
        },
        timeseries_daily: timeseriesDaily,
        users,
        top_users: users.slice(0, 30),
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
