# PRD: Native Pro Subscription (StoreKit + Google Play Billing + Apple Submission Gate)

**Document Version**: 1.2  
**Last Updated**: 2026-03-08  
**Status**: Ready for Implementation

## 1. Executive Summary

- **Problem Statement**: The previous Stripe-oriented setup is not suitable for native mobile digital subscriptions and increases App Review risk on iOS. The product also needs stronger entitlement reliability across purchase lifecycle events.
- **Proposed Solution**: Implement native subscriptions with StoreKit (iOS) and Google Play Billing (Android) using RevenueCat as billing abstraction, while keeping Supabase (`public.user_ai_plans`) as entitlement source of truth.
- **Success Criteria**:
  - Upgrade conversion (free -> pro) >= 8% within 30 days from rollout.
  - 30-day paid churn <= 6%.
  - Purchase technical failure rate <= 1.0% across iOS/Android.
  - Entitlement synchronization mismatch rate <= 0.3% daily.
  - Event-to-entitlement update latency p95 <= 60 seconds.

## 2. User Experience & Functionality

- **User Personas**:
  - Free mobile user reaching quota and evaluating upgrade.
  - Active Pro subscriber needing clear billing and renewal visibility.
  - Support/operator needing deterministic billing diagnostics.

- **User Stories**:
  - As a free user, I want a native in-app purchase flow so that I can unlock Pro immediately.
  - As a Pro user, I want clear renewal/cancellation state so that I can trust my subscription status.
  - As a user with billing issues, I want explicit grace-period messaging so that I can recover without abrupt access loss.
  - As a returning user, I want Restore Purchases so that my entitlement is recovered after reinstall/device change.
  - As support staff, I want event history and entitlement snapshot so that billing tickets are resolved quickly.

- **Acceptance Criteria**:
  - iOS and Android upgrade paths are native only; no Stripe checkout in native app.
  - Successful purchase/renewal sets `plan=pro` in `user_ai_plans` within p95 <= 60s.
  - Failed renewal triggers 3-day grace period and visible in-app status.
  - Grace expiration downgrades entitlement to `free` automatically when unresolved.
  - Restore Purchases works on supported platforms and updates entitlement correctly.
  - Duplicate/out-of-order billing events do not produce incorrect final entitlement.
  - Profile screen exposes plan status, renewal state, and restore/manage actions.

- **Non-Goals**:
  - No Stripe payment flow inside native apps.
  - No web/desktop monetization implementation in this PRD.
  - No redesign of unrelated profile/settings features.

## 3. AI System Requirements (If Applicable)

- **Tool Requirements**: Not applicable for billing core; no model decisioning required.
- **Evaluation Strategy**: Not applicable; quality is measured by billing reliability and entitlement KPIs.

## 4. Technical Specifications

- **Architecture Overview**:
  - Mobile app uses RevenueCat Capacitor SDK for offerings, purchase, restore, and customer info sync.
  - Store lifecycle events are received by RevenueCat and sent to Supabase webhook ingestion.
  - Supabase projects normalized billing state to `public.user_ai_plans` (`free`, `pro`, grace metadata).
  - Scheduled reconciliation compares provider state to DB state and fixes safe drift.

- **Integration Points**:
  - **iOS**: StoreKit 2 via RevenueCat.
  - **Android**: Google Play Billing via RevenueCat.
  - **Backend**: Supabase Edge Functions for webhook ingestion, entitlement sync, reconciliation.
  - **Database**: `public.user_ai_plans` + billing events table + subscription snapshot table.
  - **Auth**: deterministic identity mapping `appUserID == auth.user.id` via Supabase JWT context.

- **Security & Privacy**:
  - Verify webhook signatures for all billing events.
  - Enforce idempotency and deduplication with unique constraints on provider event IDs.
  - Keep billing credentials/secrets server-side only.
  - Store minimum required PII for support and reconciliation workflows.
  - Maintain auditable billing event history for incident handling.

## 5. Risks & Roadmap

- **Phased Rollout**:
  - **MVP**: Native purchase/renewal/cancellation, restore purchases, entitlement projection, profile billing UI.
  - **v1.1**: Grace-period UX hardening, support tooling, drift dashboard.
  - **v2.0**: Advanced reconciliation automation and proactive anomaly alerts.

- **Technical Risks**:
  - Event ordering/retry differences between Apple and Google.
  - Identity-linking errors between billing provider and app user.
  - Entitlement drift between provider truth and local DB projection.
  - UX confusion if grace timers are inconsistent client vs backend.

- **Delivery Constraints**:
  - Priority is jointly balanced across: time-to-market, Apple compliance, and billing operational stability.
  - iOS submission date is currently **TBD** (no fixed deadline).

- **Apple Submission Gate (Blocking)**:
  - ASG-01: IAP-only digital purchase on iOS (PASS required).
  - ASG-02: No external payment CTA/link in native app (PASS required).
  - ASG-03: Restore Purchases visible and validated in TestFlight sandbox (PASS required).
  - ASG-04: Subscription disclosure present before purchase (price, period, auto-renew, manage/cancel) (PASS required).
  - ASG-05: App Store Connect metadata/screenshots aligned with real in-app behavior (PASS required).
  - ASG-06: Submission evidence pack ready (video/screenshots/test log) (PASS required).
  - Release rule: any FAIL blocks iOS submission.
