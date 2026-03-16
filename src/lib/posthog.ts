/**
 * PostHog Analytics — initialisation & typed helpers.
 *
 * Call `initPostHog()` once at app startup (before any tracking).
 * Use `identifyUser` / `resetUser` on auth changes.
 * Use `trackEvent` for custom events throughout the app.
 */
import posthog from "posthog-js";

/* ------------------------------------------------------------------ */
/*  Initialisation                                                     */
/* ------------------------------------------------------------------ */

let _initialised = false;

export function initPostHog(): void {
  const key = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
  const host = import.meta.env.VITE_POSTHOG_HOST as string | undefined;

  if (!key) {
    if (import.meta.env.DEV) console.warn("[PostHog] VITE_POSTHOG_KEY missing — analytics disabled.");
    return;
  }

  posthog.init(key, {
    api_host: host || "https://eu.i.posthog.com",
    autocapture: true,          // auto-track clicks, inputs, form submissions
    capture_pageview: false,    // we handle pageviews manually via react-router
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

/** All custom event names used in the app. */
export const AnalyticsEvents = {
  // Auth & Onboarding
  ONBOARDING_COMPLETED: "onboarding_completed",
  APP_INSTALLED: "app_installed",

  // Gamification
  POINTS_EARNED: "points_earned",
  BADGE_UNLOCKED: "badge_unlocked",
  CHALLENGE_COMPLETED: "challenge_completed",

  // Patrimonio
  PATRIMONIO_UPDATED: "patrimonio_updated",
  SALVADANAIO_UPDATED: "salvadanaio_updated",
  INVESTIMENTO_UPDATED: "investimento_updated",

  // Spese
  SPESA_UPDATED: "spesa_updated",

  // Content
  LESSON_VIEWED: "lesson_viewed",
  ARTICLE_VIEWED: "article_viewed",
  COACH_SESSION_STARTED: "coach_session_started",

  // Billing
  PRO_PAYWALL_SHOWN: "pro_paywall_shown",

  // Edge Functions
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

/** Manual pageview (used by the react-router hook). */
export function trackPageView(path: string): void {
  if (!_initialised) return;
  posthog.capture("$pageview", { $current_url: path });
}
