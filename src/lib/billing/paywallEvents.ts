import { trackEvent, AnalyticsEvents } from "@/lib/posthog";

export type PaywallReason = {
  status: number;
  message?: string;
  code?: string;
};

const PAYWALL_EVENT = "financeflow:pro-paywall-open";

export function triggerProPaywall(reason: PaywallReason) {
  if (typeof window === "undefined") return;
  trackEvent(AnalyticsEvents.PRO_PAYWALL_SHOWN, {
    status: reason.status,
    code: reason.code,
  });
  window.dispatchEvent(new CustomEvent(PAYWALL_EVENT, { detail: reason }));
}

export function subscribeProPaywall(handler: (reason: PaywallReason) => void): () => void {
  if (typeof window === "undefined") return () => undefined;

  const listener = (event: Event) => {
    const detail = (event as CustomEvent<PaywallReason>).detail;
    if (!detail) return;
    handler(detail);
  };

  window.addEventListener(PAYWALL_EVENT, listener);
  return () => window.removeEventListener(PAYWALL_EVENT, listener);
}
