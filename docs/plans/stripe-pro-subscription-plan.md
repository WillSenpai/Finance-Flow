# Plan: Pro Subscription (StoreKit/Play + Stripe Web) & AI Plan Assignment

**Generated**: 2026-03-06
**Estimated Complexity**: High

## Overview
Implement paid upgrade from `free` to `pro` with a unified entitlement backend and platform-appropriate billing rails: StoreKit on iOS, Google Play Billing on Android, and Stripe for web/desktop checkout. Keep `public.user_ai_plans` in sync from billing state through idempotent webhooks/events. Include two billing cadences (`monthly`, `annual`) and a 3-day grace period before automatic downgrade to `free`.

## Prerequisites
- Stripe account with test and live modes enabled (web checkout only)
- App Store Connect (StoreKit products) and Google Play Console (subscriptions)
- Access to create webhook endpoints (Stripe + optional store server notifications)
- Supabase Edge Functions deploy access and secrets management
- Existing DB objects from migration: `public.user_ai_plans`, `public.ai_usage_monthly`, `public.consume_ai_tokens`
- Commerce decision locked:
  - iOS: StoreKit
  - Android: Google Play Billing
  - Web/Desktop: Stripe Checkout

## Sprint 1: Billing Domain Model & Compliance Gate
**Goal**: Define source-of-truth and legal-safe billing architecture before coding.
**Demo/Validation**:
- Written decision log with commerce path per platform/region
- Data model approved and mapped to current schema

### Task 1.1: Define Subscription State Machine
- **Location**: `docs/billing/stripe-state-machine.md`
- **Description**: Define transitions for `free -> pro`, cancellation, grace period, payment failure, reactivation. Map Stripe statuses to app entitlements.
- **Dependencies**: None
- **Acceptance Criteria**:
  - Every Stripe subscription status maps to one internal plan status
  - Includes retry/dunning and `past_due` behavior
- **Validation**:
  - Review with test event samples from Stripe docs

### Task 1.2: Finalize Commerce Policy by Platform
- **Location**: `docs/billing/app-store-commerce-policy.md`
- **Description**: Document fixed purchase rails (StoreKit iOS, Play Billing Android, Stripe web) and app navigation rules so users are never sent to non-compliant purchase flow.
- **Dependencies**: None
- **Acceptance Criteria**:
  - No ambiguous purchase path on any platform
  - Policy references Apple 3.1.1 and Google Play billing requirements
- **Validation**:
  - Checklist signed before implementation begins

### Task 1.3: Map Stripe IDs to Internal User IDs
- **Location**: `docs/billing/identity-linking.md`
- **Description**: Define canonical linking strategy using `customer.metadata.user_id` + DB fallback table.
- **Dependencies**: Task 1.1
- **Acceptance Criteria**:
  - Link strategy handles account email changes and duplicate customers
- **Validation**:
  - Simulated scenarios documented

## Sprint 2: Unified Entitlement Backend Foundation
**Goal**: Create a single entitlement backend that ingests events from StoreKit/Play/Stripe.
**Demo/Validation**:
- Can process purchase/renewal/cancelation from each billing source
- Entitlement updates `user_ai_plans` reliably

### Task 2.1: Add Billing Tables
- **Location**: `supabase/migrations/*_stripe_billing_tables.sql`
- **Description**: Create `billing_customers`, `billing_subscriptions`, and `billing_events` (idempotency/event log).
- **Dependencies**: Sprint 1 complete
- **Acceptance Criteria**:
  - Unique constraints on Stripe IDs
  - RLS read-only for own user where relevant
- **Validation**:
  - SQL checks for unique/index/policy correctness

### Task 2.2: Create Edge Function `billing-create-checkout` (Web Stripe)
- **Location**: `supabase/functions/billing-create-checkout/index.ts`
- **Description**: Authenticated endpoint creating Stripe Checkout Session in `mode=subscription` for `pro` price.
- **Dependencies**: Task 2.1
- **Acceptance Criteria**:
  - Requires valid JWT
  - Uses server-side Stripe secret only
  - Supports both Stripe prices (`pro_monthly`, `pro_annual`)
  - Returns `session.url`
- **Validation**:
  - Test call returns valid Checkout URL in Stripe test mode

### Task 2.3: Create Event Ingestion Endpoints
- **Location**: `supabase/functions/billing-webhook/index.ts`
- **Description**: Verify provider signatures and process lifecycle events idempotently:
  - Stripe webhook (web)
  - App Store server notifications (iOS)
  - Google Play RTDN flow (Android) or scheduled verification job
- **Dependencies**: Task 2.1
- **Acceptance Criteria**:
  - Handles monthly/annual activation, renewal, cancelation
  - Implements 3-day grace period on failed renewal
  - Auto-downgrades to `free` after grace expiry
  - Ignores duplicate/out-of-order events safely
- **Validation**:
  - Stripe CLI replay tests produce deterministic DB state

### Task 2.4: Entitlement Projection to `user_ai_plans` + Grace Logic
- **Location**: `supabase/functions/billing-webhook/index.ts`, SQL helpers
- **Description**: On active subscription set plan `pro` (limit default 5M). On renewal failure set `grace_until = now()+3d`; if unresolved after grace, downgrade to `free` (500k).
- **Dependencies**: Task 2.3
- **Acceptance Criteria**:
  - `user_ai_plans` always reflects effective entitlement
  - Grace state is queryable and visible in support tools
  - Manual override path documented for support team
- **Validation**:
  - Unit scenarios for active/canceled/past_due

## Sprint 3: Client Purchase & Plan UX (Monthly + Annual)
**Goal**: Make upgrade flow visible and predictable in app UX.
**Demo/Validation**:
- User can start checkout and return to app with refreshed plan
- Usage meter/limit message is clear

### Task 3.1: Billing UI in Profile
- **Location**: `src/pages/Profilo.tsx`, new billing components
- **Description**: Add section showing current plan (`free/pro`), monthly usage, remaining quota, upgrade CTA.
- **Dependencies**: Sprint 2 complete
- **Acceptance Criteria**:
  - Free users see upgrade action
  - Pro users see renewal/cancel/manage actions
  - Monthly and annual offers both visible with clear savings label
- **Validation**:
  - UI tested on iOS and Android form factors

### Task 3.2: Wire Platform-Specific Purchase Invocation
- **Location**: `src/lib/edge.ts`, billing UI components
- **Description**:
  - iOS: start StoreKit purchase flow
  - Android: start Play Billing flow
  - Web: call `billing-create-checkout` and open Stripe Checkout
  - Handle post-purchase refresh state for all channels
- **Dependencies**: Task 3.1
- **Acceptance Criteria**:
  - Errors surfaced cleanly
  - Prevents double-submit checkout races
- **Validation**:
  - Manual e2e in Stripe test mode

### Task 3.3: Improve Quota Exceeded UX
- **Location**: AI feature entry points and error handlers in `src/pages/*`
- **Description**: Convert raw `402` responses into consistent “upgrade to Pro” UX with deep-link to billing screen.
- **Dependencies**: Task 3.1
- **Acceptance Criteria**:
  - All protected AI actions show coherent upgrade message
- **Validation**:
  - Trigger quota exhaustion in test and verify UX

## Sprint 4: Operations, Security, and Go-Live
**Goal**: Production-safe deployment with monitoring and rollback.
**Demo/Validation**:
- Live-mode dry run checklist passes
- Alerting and reconciliation playbook exists

### Task 4.1: Secrets & Environment Hardening
- **Location**: Supabase secrets, Stripe dashboard
- **Description**: Configure secrets and product IDs for all providers:
  - Stripe: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_PRO_MONTHLY`, `STRIPE_PRICE_PRO_ANNUAL`
  - Apple: app shared secret / App Store Server API credentials
  - Google: Play service credentials / product IDs
  - test/live separation across all providers
- **Dependencies**: Sprint 2
- **Acceptance Criteria**:
  - No Stripe secret in client bundle
  - Separate test and live webhook endpoints
- **Validation**:
  - Secret scan + endpoint smoke tests

### Task 4.2: Reconciliation Job
- **Location**: `supabase/functions/billing-reconcile/index.ts` + scheduler
- **Description**: Daily reconciliation between Stripe subscription status and `user_ai_plans` to auto-heal drift.
- **Dependencies**: Sprint 2
- **Acceptance Criteria**:
  - Drift report generated
  - Auto-fix for safe cases enabled
- **Validation**:
  - Simulate mismatch and verify correction

### Task 4.3: Support/Refund/Dispute Runbook
- **Location**: `docs/billing/ops-runbook.md`
- **Description**: Procedures for refunds, charge disputes, plan restoration, and user communication templates.
- **Dependencies**: Sprint 2
- **Acceptance Criteria**:
  - Team can resolve billing tickets with deterministic steps
- **Validation**:
  - Tabletop exercise with sample incidents

## Testing Strategy
- Stripe webhook contract tests using Stripe CLI fixtures
- DB idempotency tests for duplicate and out-of-order events
- End-to-end purchase test in Stripe test mode (success, failure, cancel)
- Quota gate tests: free limit hit, pro limit hit, downgrade edge cases
- Platform behavior tests: iOS/Android/web checkout launch and return handling

## Potential Risks & Gotchas
- **Cross-store consistency risk**: three billing rails can drift without strict reconciliation.
- Webhook delivery ordering is not guaranteed; handlers must be idempotent and state-based.
- Customer/user linking drift can grant wrong entitlements if metadata strategy is inconsistent.
- Grace-period messaging can confuse users if entitlement and UI timers diverge.
- Tax/VAT handling differs by region and store/payment channel.

## Rollback Plan
- Feature-flag billing UI and checkout entry point.
- Temporarily force all users to `free` by freezing entitlement projection job.
- Disable webhook endpoint processing while preserving event log.
- Re-run reconciliation after rollback to restore consistent state.
