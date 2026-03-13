import {
  applyAiUsage,
  checkAndUpdateAiQuota,
  estimateTokensFromMessages,
  estimateTokensFromText,
  getUserQuota,
  isQuotaExceededError,
  quotaExceededResponse,
  type QuotaCheckResult,
} from "./quota.ts";

export type AiFeature = "parse-spesa" | "news-summary" | "chat" | "chat:suggestions";
export type PlanType = "free" | "pro";

const DEFAULT_CHEAP_MODEL = Deno.env.get("AI_CHEAP_MODEL") ?? Deno.env.get("AI_BASE_MODEL") ?? "gpt-4o-mini";
const DEFAULT_PRO_MODEL = Deno.env.get("AI_PRO_MODEL") ?? Deno.env.get("AI_COMPLEX_MODEL") ?? "gpt-4o";

export function resolveModelForFeature(feature: AiFeature, planType: PlanType): string {
  if (feature === "chat" && planType === "pro") return DEFAULT_PRO_MODEL;
  return DEFAULT_CHEAP_MODEL;
}

export function estimateRequestTokens(params: {
  base: number;
  messages?: Array<{ content?: string }>;
  text?: string;
  context?: unknown;
}) {
  return (
    params.base +
    estimateTokensFromMessages(params.messages ?? []) +
    estimateTokensFromText(params.text ?? "") +
    estimateTokensFromText(JSON.stringify(params.context ?? {}))
  );
}

export type QuotaGuardResult = {
  ok: true;
  quota: QuotaCheckResult;
} | {
  ok: false;
  response: Response;
};

export async function enforceQuota(params: {
  userId: string;
  estimatedTokens: number;
  corsHeaders: HeadersInit;
}): Promise<QuotaGuardResult> {
  try {
    await checkAndUpdateAiQuota(params.userId, params.estimatedTokens);
    const quota = await getUserQuota(params.userId);
    return { ok: true, quota };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown quota error";
    if (isQuotaExceededError(message)) {
      const quota = await getUserQuota(params.userId);
      return {
        ok: false,
        response: quotaExceededResponse({ ...quota, allowed: false }, params.corsHeaders),
      };
    }
    throw error;
  }
}

export async function trackUsageAsync(params: {
  userId: string;
  feature: AiFeature;
  modelUsed: string;
  promptTokens: number;
  completionTokens: number;
}) {
  void applyAiUsage(
    params.userId,
    params.feature,
    params.modelUsed,
    params.promptTokens,
    params.completionTokens,
  ).catch((error) => {
    console.error("Failed to persist AI usage", error);
  });
}

export function inferUsageFromResponse(data: unknown, fallbackText = "", requestText = ""): {
  promptTokens: number;
  completionTokens: number;
} {
  const usage = (data as { usage?: { prompt_tokens?: unknown; completion_tokens?: unknown } })?.usage;
  const promptTokens = Number(usage?.prompt_tokens ?? Math.ceil(requestText.length / 4));
  const completionTokens = Number(usage?.completion_tokens ?? Math.ceil(fallbackText.length / 4));

  return {
    promptTokens: Number.isFinite(promptTokens) ? Math.max(0, Math.round(promptTokens)) : 0,
    completionTokens: Number.isFinite(completionTokens) ? Math.max(0, Math.round(completionTokens)) : 0,
  };
}

export function paymentRequiredResponse(corsHeaders: HeadersInit, message = "Questa funzionalità richiede il piano Pro.") {
  return new Response(
    JSON.stringify({
      error: message,
      code: "UPGRADE_REQUIRED",
      upgradeRequired: true,
    }),
    {
      status: 402,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
}
