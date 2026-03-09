import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { buildCorsHeaders, rejectDisallowedOrigin } from "../_shared/cors.ts";
import {
  createAdminClient,
  decideEntitlementFromRevenueCatEvent,
  normalizeRevenueCatEvent,
  projectEntitlementToDatabase,
} from "../_shared/billing.ts";

function jsonResponse(body: unknown, status: number, corsHeaders: HeadersInit) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
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

  try {
    const expectedAuthHeader = Deno.env.get("REVENUECAT_WEBHOOK_AUTH_HEADER");
    if (!expectedAuthHeader) {
      return jsonResponse({ error: "Missing webhook secret config" }, 500, corsHeaders);
    }

    const authorization = req.headers.get("Authorization") ?? "";
    if (authorization !== expectedAuthHeader) {
      return jsonResponse({ error: "Unauthorized" }, 401, corsHeaders);
    }

    const rawBody = await req.text();
    const payload = rawBody ? (JSON.parse(rawBody) as Record<string, unknown>) : {};
    const normalized = normalizeRevenueCatEvent(payload);

    if (!normalized.appUserId) {
      return jsonResponse({ ok: true, ignored: "Missing app_user_id" }, 200, corsHeaders);
    }

    const admin = createAdminClient();

    const decision = decideEntitlementFromRevenueCatEvent({
      eventType: normalized.eventType,
      providerEventId: normalized.providerEventId,
      expirationAtIso: normalized.expirationAtIso,
      productId: normalized.productId,
      entitlementId: normalized.entitlementId,
      store: normalized.store,
    });

    await projectEntitlementToDatabase({
      admin,
      userId: normalized.appUserId,
      environment: normalized.environment,
      payload,
      decision,
    });

    return jsonResponse(
      {
        ok: true,
        eventType: normalized.eventType,
        plan: decision.plan,
        status: decision.status,
      },
      200,
      corsHeaders,
    );
  } catch (error) {
    console.error("billing-webhook-revenuecat error", error);
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Internal server error" },
      500,
      corsHeaders,
    );
  }
});
