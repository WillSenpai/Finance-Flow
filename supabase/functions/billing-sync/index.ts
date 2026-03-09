import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { buildCorsHeaders, rejectDisallowedOrigin } from "../_shared/cors.ts";
import { requireAuthenticatedUser } from "../_shared/auth.ts";
import { createAdminClient, projectEntitlementToDatabase, type EntitlementDecision } from "../_shared/billing.ts";

function jsonResponse(body: unknown, status: number, corsHeaders: HeadersInit) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

type CustomerInfoLike = {
  entitlements?: {
    active?: Record<string, { expiresDate?: string | null }>;
  };
};

function decisionFromCustomerInfo(userId: string, customerInfo: CustomerInfoLike | null): EntitlementDecision {
  const activeEntitlements = customerInfo?.entitlements?.active ?? {};
  const activeKeys = Object.keys(activeEntitlements);

  if (activeKeys.length > 0) {
    const entitlementId = activeKeys[0];
    const expiresDate = activeEntitlements[entitlementId]?.expiresDate ?? null;

    return {
      status: "active",
      plan: "pro",
      graceUntil: null,
      autoRenews: true,
      currentPeriodEndsAt: expiresDate,
      eventType: "MANUAL_SYNC",
      providerEventId: `sync-${userId}-${Date.now()}`,
      productId: null,
      entitlementId,
      store: null,
    };
  }

  return {
    status: "free",
    plan: "free",
    graceUntil: null,
    autoRenews: null,
    currentPeriodEndsAt: null,
    eventType: "MANUAL_SYNC",
    providerEventId: `sync-${userId}-${Date.now()}`,
    productId: null,
    entitlementId: null,
    store: null,
  };
}

serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const blocked = rejectDisallowedOrigin(req, corsHeaders);
  if (blocked) return blocked;

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405, corsHeaders);
  }

  const auth = await requireAuthenticatedUser(req, corsHeaders);
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json().catch(() => ({}));
    const customerInfo = (body as { customerInfo?: CustomerInfoLike }).customerInfo ?? null;

    const decision = decisionFromCustomerInfo(auth.user.id, customerInfo);

    const admin = createAdminClient();
    await projectEntitlementToDatabase({
      admin,
      userId: auth.user.id,
      environment: null,
      payload: body as Record<string, unknown>,
      decision,
    });

    return jsonResponse(
      {
        ok: true,
        plan: decision.plan,
        status: decision.status,
        graceUntil: decision.graceUntil,
      },
      200,
      corsHeaders,
    );
  } catch (error) {
    console.error("billing-sync error", error);
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Internal server error" },
      500,
      corsHeaders,
    );
  }
});
