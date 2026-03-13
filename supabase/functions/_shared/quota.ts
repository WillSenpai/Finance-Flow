import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export type QuotaCheckResult = {
  remaining: number;
  used: number;
  limit: number;
  plan: "free" | "pro";
  resetDate: string | null;
};

export function estimateTokensFromText(text: string): number {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

export function estimateTokensFromMessages(messages: Array<{ content?: string }>): number {
  const totalChars = messages.reduce((sum, message) => sum + (message.content?.length ?? 0), 0);
  return Math.ceil(totalChars / 4);
}

function getAdminClient() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase environment is not configured");
  }
  return createClient(supabaseUrl, serviceRoleKey);
}

export async function getUserQuota(userId: string): Promise<QuotaCheckResult> {
  const admin = getAdminClient();
  const { data, error } = await admin
    .from("user_ai_plans")
    .select("plan_type, plan, monthly_token_limit, tokens_used_this_month, reset_date")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw new Error(error.message);

  const plan = data?.plan_type === "pro" || data?.plan === "pro" ? "pro" : "free";
  const limit = Number(data?.monthly_token_limit ?? (plan === "pro" ? 5_000_000 : 500_000));
  const used = Number(data?.tokens_used_this_month ?? 0);

  return {
    remaining: Math.max(limit - used, 0),
    used,
    limit,
    plan,
    resetDate: typeof data?.reset_date === "string" ? data.reset_date : null,
  };
}

export function isQuotaExceededError(message: string): boolean {
  return /QUOTA_EXCEEDED/i.test(message);
}

export async function checkAndUpdateAiQuota(userId: string, estimatedTokens: number): Promise<void> {
  const admin = getAdminClient();
  const { error } = await admin.rpc("check_and_update_ai_quota", {
    p_user_id: userId,
    p_estimated_tokens: Math.max(0, Math.round(estimatedTokens)),
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function applyAiUsage(
  userId: string,
  feature: string,
  modelUsed: string,
  promptTokens: number,
  completionTokens: number,
): Promise<void> {
  const admin = getAdminClient();
  const { error } = await admin.rpc("apply_ai_usage", {
    p_user_id: userId,
    p_feature: feature,
    p_model_used: modelUsed,
    p_prompt_tokens: Math.max(0, Math.round(promptTokens)),
    p_completion_tokens: Math.max(0, Math.round(completionTokens)),
  });

  if (error) {
    throw new Error(error.message);
  }
}

// Backward-compatible helper used by legacy endpoints that still account estimated tokens upfront.
export async function consumeAiTokens(
  userId: string,
  tokens: number,
  endpoint: string,
): Promise<QuotaCheckResult & { allowed: boolean }> {
  try {
    await checkAndUpdateAiQuota(userId, tokens);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown quota error";
    if (isQuotaExceededError(message)) {
      return {
        allowed: false,
        ...(await getUserQuota(userId)),
      };
    }
    throw error;
  }

  // Estimated accounting for legacy callsites.
  await applyAiUsage(userId, endpoint, "legacy-estimate", tokens, 0);
  const quota = await getUserQuota(userId);
  return {
    allowed: true,
    ...quota,
  };
}

export function quotaExceededResponse(
  quota: QuotaCheckResult & { allowed?: boolean },
  corsHeaders: HeadersInit,
): Response {
  return new Response(
    JSON.stringify({
      error: "Limite mensile AI raggiunto. Passa al piano Pro per continuare.",
      quota,
    }),
    {
      status: 429,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
}
