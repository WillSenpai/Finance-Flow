/**
 * PostHog Analytics - initialization and typed helpers.
 *
 * Call `initPostHog()` once at app startup (before any tracking).
 * Use `identifyUser` / `resetUser` on auth changes.
 * Use `trackEvent` for custom events throughout the app.
 */
import posthog from "posthog-js";

/* ------------------------------------------------------------------ */
/*  Initialization                                                     */
/* ------------------------------------------------------------------ */

let _initialised = false;

export function initPostHog(): void {
  const key = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
  const host = import.meta.env.VITE_POSTHOG_HOST as string | undefined;
  const explicitlyEnabled = import.meta.env.VITE_POSTHOG_ENABLED as string | undefined;
  const isEnabled = explicitlyEnabled === "true" || (!import.meta.env.DEV && explicitlyEnabled !== "false");

  // In development we keep analytics off by default to reduce noise.
  if (!isEnabled) {
    if (import.meta.env.DEV) {
      console.info("[PostHog] disabled in dev (set VITE_POSTHOG_ENABLED=true to enable).");
    }
    return;
  }

  if (!key) {
    if (import.meta.env.DEV) console.warn("[PostHog] VITE_POSTHOG_KEY missing - analytics disabled.");
    return;
  }

  posthog.init(key, {
    api_host: host || "https://eu.i.posthog.com",
    autocapture: true,
    capture_pageview: false,
    capture_pageleave: true,
    persistence: "localStorage",
    person_profiles: "identified_only",
  });

  _initialised = true;
}

export function isPostHogReady(): boolean {
  return _initialised;
}

/* ------------------------------------------------------------------ */
/*  User identification                                                */
/* ------------------------------------------------------------------ */

export interface UserTraits {
  name?: string;
  email?: string;
  level?: string;
  goals?: string[];
  is_admin?: boolean;
  is_pro?: boolean;
  avatar_id?: string;
}

export function identifyUser(userId: string, traits?: UserTraits): void {
  if (!_initialised) return;
  posthog.identify(userId, traits);
}

export function resetUser(): void {
  if (!_initialised) return;
  posthog.reset();
}

/* ------------------------------------------------------------------ */
/*  Event tracking                                                     */
/* ------------------------------------------------------------------ */

export const AnalyticsEvents = {
  ONBOARDING_COMPLETED: "onboarding_completed",
  APP_INSTALLED: "app_installed",
  POINTS_EARNED: "points_earned",
  BADGE_UNLOCKED: "badge_unlocked",
  CHALLENGE_COMPLETED: "challenge_completed",
  PATRIMONIO_UPDATED: "patrimonio_updated",
  SALVADANAIO_UPDATED: "salvadanaio_updated",
  INVESTIMENTO_UPDATED: "investimento_updated",
  SPESA_UPDATED: "spesa_updated",
  SHARED_CARD_VIEW: "shared_card_view",
  SHARED_CARD_PRIMARY_CTA_CLICK: "shared_card_primary_cta_click",
  SHARED_QUICK_ADD_OPEN: "shared_quick_add_open",
  SHARED_WEEKLY_REMINDER_SHOWN: "shared_weekly_reminder_shown",
  SHARED_WEEKLY_REMINDER_CLICK: "shared_weekly_reminder_click",
  LESSON_VIEWED: "lesson_viewed",
  ARTICLE_VIEWED: "article_viewed",
  COACH_SESSION_STARTED: "coach_session_started",
  PRO_PAYWALL_SHOWN: "pro_paywall_shown",
  EDGE_FUNCTION_CALLED: "edge_function_called",
  EDGE_FUNCTION_ERROR: "edge_function_error",
} as const;

export type AnalyticsEventName = (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];

export function trackEvent(
  eventName: AnalyticsEventName | string,
  properties?: Record<string, unknown>,
): void {
  if (!_initialised) return;
  posthog.capture(eventName, properties);
}

export function trackPageView(path: string): void {
  if (!_initialised) return;
  posthog.capture("$pageview", { $current_url: path });
}
