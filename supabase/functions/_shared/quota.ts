import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export type QuotaCheckResult = {
  allowed: boolean;
  remaining: number;
  used: number;
  limit: number;
  plan: "free" | "pro";
};

export function estimateTokensFromText(text: string): number {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

export function estimateTokensFromMessages(messages: Array<{ content?: string }>): number {
  const totalChars = messages.reduce((sum, message) => sum + (message.content?.length ?? 0), 0);
  return Math.ceil(totalChars / 4);
}

export async function consumeAiTokens(
  userId: string,
  tokens: number,
  endpoint: string,
): Promise<QuotaCheckResult> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase environment is not configured");
  }

  const admin = createClient(supabaseUrl, serviceRoleKey);
  const { data, error } = await admin.rpc("consume_ai_tokens", {
    p_user_id: userId,
    p_tokens: Math.max(0, Math.round(tokens)),
    p_endpoint: endpoint,
  });

  if (error) {
    throw new Error(error.message);
  }

  const payload = (data ?? {}) as Partial<QuotaCheckResult>;
  return {
    allowed: Boolean(payload.allowed),
    remaining: Number(payload.remaining ?? 0),
    used: Number(payload.used ?? 0),
    limit: Number(payload.limit ?? 0),
    plan: payload.plan === "pro" ? "pro" : "free",
  };
}

export function quotaExceededResponse(
  quota: QuotaCheckResult,
  corsHeaders: HeadersInit,
): Response {
  return new Response(
    JSON.stringify({
      error: "Limite mensile AI raggiunto. Passa al piano Pro per continuare.",
      quota,
    }),
    {
      status: 402,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
}
