# PRD: Native Pro Subscription (StoreKit + Google Play Billing + Apple Submission Gate)

**Document Version**: 1.1  
**Last Updated**: 2026-03-08  
**Status**: Ready for Implementation

## 1. Executive Summary

- **Problem Statement**: The previous Stripe-oriented approach is not appropriate for native mobile digital subscriptions and creates App Review risk on iOS.
- **Proposed Solution**: Implement native subscriptions with StoreKit (iOS) and Google Play Billing (Android) through RevenueCat as billing abstraction, with Supabase as entitlement source of truth (`public.user_ai_plans`).
- **Success Criteria**:
  - Upgrade conversion (free -> pro) reaches **>= 8%** within 30 days.
  - 30-day paid churn remains **<= 6%**.
  - Purchase technical failure rate is **<= 1.0%**.
  - Entitlement mismatch rate is **<= 0.3%** daily.
  - Event-to-entitlement latency p95 is **<= 60s**.
  - Apple Submission Gate checklist is **100% PASS** before iOS submission.

## 2. User Experience & Functionality

- **User Personas**:
  - Free mobile user reaching AI quota and needing upgrade.
  - Pro subscriber needing clear billing/renewal state.
  - Support operator needing deterministic billing diagnostics.

- **User Stories**:
  - As a free user, I want in-app native purchase so I can unlock Pro immediately.
  - As a Pro user, I want clear renewal and subscription status visibility.
  - As a user with renewal failure, I want grace-period messaging and recovery actions.
  - As a returning user, I want restore purchases to recover entitlement.
  - As support staff, I want billing event history and entitlement snapshot.

- **Acceptance Criteria**:
  - iOS and Android upgrade flows are native; no Stripe checkout in native app.
  - Purchase/renewal sets `plan=pro` within p95 <= 60s.
  - Renewal failure sets 3-day grace period with visible UX status.
  - Grace expiration downgrades to `free` automatically if unresolved.
  - Restore purchases updates entitlement correctly.
  - Duplicate/out-of-order events never produce wrong final entitlement.
  - Profile screen shows plan status, renewal state, and manage/restore actions.

- **Non-Goals**:
  - No Stripe flow inside native app.
  - No web/desktop monetization implementation in this PRD.
  - No redesign of unrelated profile/settings areas.

## 3. AI System Requirements (If Applicable)

- **Tool Requirements**: Not applicable for billing core.
- **Evaluation Strategy**: Not applicable. Validation is operational and product KPI-based.

## 4. Technical Specifications

- **Architecture Overview**:
  - Client uses RevenueCat Capacitor SDK to load offerings, purchase, restore.
  - Store lifecycle events are delivered to RevenueCat and forwarded to backend webhook.
  - Supabase webhook handler maps events to internal subscription state and projects entitlements into `public.user_ai_plans`.
  - Reconciliation job checks drift and auto-heals safe mismatches.

- **Integration Points**:
  - **iOS**: StoreKit 2 via RevenueCat.
  - **Android**: Google Play Billing via RevenueCat.
  - **Backend**: Supabase Edge Functions for webhook ingestion, sync, reconciliation.
  - **Database**: `public.user_ai_plans` + billing event log + subscription snapshot tables.
  - **Auth**: Supabase JWT and deterministic mapping `appUserID == auth.user.id`.

- **Security & Privacy**:
  - Verify webhook signature for every provider event.
  - Enforce idempotency/event deduplication with unique constraints.
  - Keep secrets server-side only.
  - Log minimal PII required for support and reconciliation.
  - Maintain auditable event trail.

## 5. Apple Submission Gate (Blocking)

Every iOS billing release is blocked unless all controls are PASS.

| ID | Control | Pass Criteria | Owner |
|---|---|---|---|
| ASG-01 | IAP-only digital purchase | All iOS upgrade paths open native StoreKit flow only | Engineering |
| ASG-02 | No external payment CTA | No in-app link/button/text directing to external purchase | QA |
| ASG-03 | Restore Purchases | Visible entrypoint + successful restore in TestFlight sandbox | QA |
| ASG-04 | Subscription disclosure | Price, period, auto-renew, cancellation/manage info shown before purchase | Product |
| ASG-05 | Metadata parity | App Store Connect text/screenshots match real app behavior | Product |
| ASG-06 | Submission evidence pack | Video/screenshot evidence attached for iOS review readiness | Engineering |

Release rule: if one control is FAIL, iOS submission is not allowed.

## 6. Testing Strategy (Including Pre-Submit Matrix)

- **Unit Tests**:
  - Event mapping to internal subscription states.
  - Grace-period timers and downgrade logic.
  - Idempotency and out-of-order event handling.
- **Integration Tests**:
  - Valid webhook events: purchase, renewal, cancellation, billing issue, expiration.
  - Invalid signature is rejected.
  - Reconciliation fixes safe entitlement drift.
- **E2E Sandbox (iOS/Android)**:
  - Monthly/annual purchase success.
  - Restore purchase after reinstall.
  - Renewal failure -> grace -> downgrade.
  - User cancellation and expiry behavior.
- **Compliance Pre-Submit Tests (iOS)**:
  - External payment CTA scan: zero findings.
  - Restore flow end-to-end evidence.
  - Subscription disclosure screenshot verification.
  - App Store metadata consistency check.

## 7. Risks & Roadmap

- **Phased Rollout**:
  - **MVP**: Purchase, renewal, cancellation, restore, entitlement projection, profile billing UI.
  - **v1.1**: Grace UX refinements and ops drift dashboard.
  - **v2.0**: Advanced reconciliation automation and anomaly alerting.
- **Technical Risks**:
  - Event ordering/retry differences across stores.
  - Identity mapping mistakes between billing and auth.
  - Drift between provider truth and local entitlement.
  - UX confusion around grace timing.
- **Mitigation**:
  - Deterministic identity mapping, idempotent ingestion, daily reconciliation, blocking Apple gate.

## 8. Implementation Notes

- This document replaces the previous Stripe-oriented plan.
- Canonical path: `docs/plans/native-subscriptions-prd.md`.
- Any future web/desktop monetization must be planned in a separate document.
