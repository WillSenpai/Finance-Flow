import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export type BillingStatus = "free" | "active" | "grace" | "canceled" | "expired";

export type EntitlementDecision = {
  status: BillingStatus;
  plan: "free" | "pro";
  graceUntil: string | null;
  autoRenews: boolean | null;
  currentPeriodEndsAt: string | null;
  eventType: string;
  providerEventId: string;
  productId: string | null;
  entitlementId: string | null;
  store: string | null;
};

export function createAdminClient() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase service environment missing");
  }
  return createClient(supabaseUrl, serviceRoleKey);
}

export function normalizeRevenueCatEvent(payload: Record<string, unknown>): {
  providerEventId: string;
  eventType: string;
  appUserId: string | null;
  productId: string | null;
  entitlementId: string | null;
  store: string | null;
  environment: string | null;
  expirationAtIso: string | null;
  rawEvent: Record<string, unknown>;
} {
  const rawEvent = (payload.event as Record<string, unknown> | undefined) ?? payload;
  const eventType = String(rawEvent.type ?? "UNKNOWN").toUpperCase();

  const providerEventId =
    (typeof rawEvent.id === "string" && rawEvent.id) ||
    (typeof rawEvent.event_id === "string" && rawEvent.event_id) ||
    `${eventType}-${String(rawEvent.app_user_id ?? "unknown")}-${String(rawEvent.transaction_id ?? rawEvent.original_transaction_id ?? Date.now())}`;

  const expirationMs =
    typeof rawEvent.expiration_at_ms === "number"
      ? rawEvent.expiration_at_ms
      : typeof rawEvent.expires_date_ms === "number"
        ? rawEvent.expires_date_ms
        : null;

  return {
    providerEventId,
    eventType,
    appUserId: typeof rawEvent.app_user_id === "string" ? rawEvent.app_user_id : null,
    productId: typeof rawEvent.product_id === "string" ? rawEvent.product_id : null,
    entitlementId:
      Array.isArray(rawEvent.entitlement_ids) && typeof rawEvent.entitlement_ids[0] === "string"
        ? String(rawEvent.entitlement_ids[0])
        : null,
    store: typeof rawEvent.store === "string" ? rawEvent.store : null,
    environment: typeof rawEvent.environment === "string" ? rawEvent.environment : null,
    expirationAtIso: expirationMs ? new Date(expirationMs).toISOString() : null,
    rawEvent,
  };
}

export function decideEntitlementFromRevenueCatEvent(input: {
  eventType: string;
  providerEventId: string;
  expirationAtIso: string | null;
  now?: Date;
  productId: string | null;
  entitlementId: string | null;
  store: string | null;
}): EntitlementDecision {
  const now = input.now ?? new Date();
  const nowIso = now.toISOString();
  const eventType = input.eventType.toUpperCase();
  const expiration = input.expirationAtIso ? new Date(input.expirationAtIso) : null;
  const expirationFuture = expiration ? expiration.getTime() > now.getTime() : false;

  if (["INITIAL_PURCHASE", "RENEWAL", "UNCANCELLATION", "PRODUCT_CHANGE", "SUBSCRIPTION_EXTENDED"].includes(eventType)) {
    return {
      status: "active",
      plan: "pro",
      graceUntil: null,
      autoRenews: true,
      currentPeriodEndsAt: expirationFuture ? expiration!.toISOString() : input.expirationAtIso,
      eventType,
      providerEventId: input.providerEventId,
      productId: input.productId,
      entitlementId: input.entitlementId,
      store: input.store,
    };
  }

  if (eventType === "BILLING_ISSUE") {
    const grace = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();
    return {
      status: "grace",
      plan: "pro",
      graceUntil: grace,
      autoRenews: true,
      currentPeriodEndsAt: input.expirationAtIso,
      eventType,
      providerEventId: input.providerEventId,
      productId: input.productId,
      entitlementId: input.entitlementId,
      store: input.store,
    };
  }

  if (eventType === "CANCELLATION") {
    if (expirationFuture) {
      return {
        status: "canceled",
        plan: "pro",
        graceUntil: null,
        autoRenews: false,
        currentPeriodEndsAt: expiration!.toISOString(),
        eventType,
        providerEventId: input.providerEventId,
        productId: input.productId,
        entitlementId: input.entitlementId,
        store: input.store,
      };
    }

    return {
      status: "expired",
      plan: "free",
      graceUntil: null,
      autoRenews: false,
      currentPeriodEndsAt: input.expirationAtIso,
      eventType,
      providerEventId: input.providerEventId,
      productId: input.productId,
      entitlementId: input.entitlementId,
      store: input.store,
    };
  }

  if (["EXPIRATION", "SUBSCRIPTION_PAUSED", "TRANSFER"].includes(eventType)) {
    return {
      status: "expired",
      plan: "free",
      graceUntil: null,
      autoRenews: false,
      currentPeriodEndsAt: input.expirationAtIso,
      eventType,
      providerEventId: input.providerEventId,
      productId: input.productId,
      entitlementId: input.entitlementId,
      store: input.store,
    };
  }

  return {
    status: expirationFuture ? "active" : "free",
    plan: expirationFuture ? "pro" : "free",
    graceUntil: null,
    autoRenews: null,
    currentPeriodEndsAt: input.expirationAtIso ?? nowIso,
    eventType,
    providerEventId: input.providerEventId,
    productId: input.productId,
    entitlementId: input.entitlementId,
    store: input.store,
  };
}

export async function projectEntitlementToDatabase(params: {
  admin: ReturnType<typeof createAdminClient>;
  userId: string;
  environment: string | null;
  payload: Record<string, unknown>;
  decision: EntitlementDecision;
}) {
  const { admin, userId, environment, payload, decision } = params;

  await admin
    .from("billing_subscriptions")
    .upsert(
      {
        user_id: userId,
        provider: "revenuecat",
        store: decision.store,
        status: decision.status,
        entitlement_id: decision.entitlementId,
        product_id: decision.productId,
        current_period_ends_at: decision.currentPeriodEndsAt,
        grace_until: decision.graceUntil,
        auto_renews: decision.autoRenews,
        last_event_type: decision.eventType,
        last_provider_event_id: decision.providerEventId,
      },
      { onConflict: "user_id" },
    );

  await admin
    .from("billing_events")
    .upsert(
      {
        provider: "revenuecat",
        provider_event_id: decision.providerEventId,
        event_type: decision.eventType,
        app_user_id: userId,
        environment,
        payload,
      },
      { onConflict: "provider,provider_event_id" },
    );

  const monthlyTokenLimit = decision.plan === "pro" ? 5_000_000 : 500_000;

  await admin
    .from("user_ai_plans")
    .upsert(
      {
        user_id: userId,
        plan: decision.plan,
        monthly_token_limit: monthlyTokenLimit,
        grace_until: decision.graceUntil,
        billing_provider: "revenuecat",
        last_billing_event_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );
}
