# Plan: App Store Security Hardening

**Generated**: 2026-03-06
**Estimated Complexity**: High

## Overview
Incrementally harden Finance Flow for App Store release without breaking current user flows. The strategy is progressive: classify endpoints by required trust level, enforce JWT where appropriate, add explicit authorization checks, tighten CORS/origin handling, remove secret leakage risk, and add release verification gates.

## Prerequisites
- Access to Supabase project settings and secrets
- Ability to deploy Edge Functions and run local app build
- Test account (user) and admin test account
- Current secrets available in Supabase: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`, `AI_*`

## Sprint 1: Security Baseline & Scope Lock
**Goal**: Define exact security policy per function before code changes.
**Demo/Validation**:
- Security matrix document reviewed and approved
- No runtime behavior changes yet

### Task 1.1: Build Function Access Matrix
- **Location**: `supabase/functions/*/index.ts`, `supabase/config.toml`, `docs/`
- **Description**: For each function, classify as `public`, `authenticated-user`, or `admin-only`; include allowed caller (web app, background job, manual admin trigger).
- **Dependencies**: None
- **Acceptance Criteria**:
  - Every function has one explicit access class
  - Every function has declared auth mechanism (`verify_jwt`, in-function claims check)
- **Validation**:
  - Produce `docs/security/function-access-matrix.md`

### Task 1.2: Define CORS Policy by Environment
- **Location**: `supabase/functions/*/index.ts`, `docs/`
- **Description**: List allowed origins for prod/staging/dev and decide which functions can keep wildcard CORS (if any).
- **Dependencies**: Task 1.1
- **Acceptance Criteria**:
  - Allowed origin list approved
  - Policy states behavior for missing/invalid Origin
- **Validation**:
  - Add `docs/security/cors-policy.md`

### Task 1.3: Define Non-Breaking Rollout Order
- **Location**: `docs/security/`
- **Description**: Sequence function migrations by risk and usage volume (low-risk first), with rollback command snippets.
- **Dependencies**: Task 1.1, Task 1.2
- **Acceptance Criteria**:
  - Ordered migration list with canary checks per step
- **Validation**:
  - Add `docs/security/jwt-rollout-order.md`

## Sprint 2: JWT + Authorization Hardening (No Public Breakage)
**Goal**: Enforce identity on user/private functions while preserving intentionally public endpoints.
**Demo/Validation**:
- Authenticated flows still work end-to-end
- Unauthorized calls fail with `401/403`

### Task 2.1: Enable `verify_jwt=true` for User-Bound Functions
- **Location**: `supabase/config.toml`
- **Description**: Turn on JWT verification for functions that should only run for signed-in users (e.g. `chat`, `parse-spesa`, `report`, `academy-lesson`, `post-generate`, `news-summary`, `generate-lesson-illustrations` if user/admin initiated).
- **Dependencies**: Sprint 1 complete
- **Acceptance Criteria**:
  - Only explicitly public functions keep `verify_jwt=false`
- **Validation**:
  - Invoke each function with/without JWT and record status codes

### Task 2.2: Add Explicit Auth Checks in Function Code
- **Location**: `supabase/functions/*/index.ts`
- **Description**: For each protected function, extract bearer token and validate user with Supabase Auth (`getUser`/claims). For admin routes, enforce role checks via `user_roles`.
- **Dependencies**: Task 2.1
- **Acceptance Criteria**:
  - Protected functions reject missing/invalid token
  - Admin routes reject non-admin users with `403`
- **Validation**:
  - Manual integration tests with normal user + admin user

### Task 2.3: Client Invocation Audit
- **Location**: `src/` function invocation points
- **Description**: Verify all client calls to protected functions use authenticated Supabase client context so `Authorization` is sent automatically.
- **Dependencies**: Task 2.2
- **Acceptance Criteria**:
  - No protected function is called anonymously by mistake
- **Validation**:
  - Login-required flows tested on web + iOS build

## Sprint 3: CORS and Abuse Resistance
**Goal**: Reduce abuse surface and uncontrolled cross-origin access.
**Demo/Validation**:
- Browser calls from approved origins succeed
- Calls from unapproved origins are blocked

### Task 3.1: Replace Wildcard CORS with Policy-Based Headers
- **Location**: `supabase/functions/*/index.ts` (shared helper recommended)
- **Description**: Implement centralized CORS helper using allowlist from env/config; handle `OPTIONS` consistently.
- **Dependencies**: Sprint 2 complete
- **Acceptance Criteria**:
  - `Access-Control-Allow-Origin` is dynamic/allowlisted for protected endpoints
  - Public endpoints documented if wildcard is intentionally kept
- **Validation**:
  - Preflight tests for prod/staging/dev origins

### Task 3.2: Basic Rate-Limit Guards on Costly AI Routes
- **Location**: `supabase/functions/chat/index.ts`, `parse-spesa`, `post-generate`, `report`, `academy-lesson`, `news-summary`
- **Description**: Add lightweight per-user throttling (DB-backed or in-function gate) to reduce abuse and billing spikes.
- **Dependencies**: Task 3.1
- **Acceptance Criteria**:
  - Excessive request bursts return `429`
- **Validation**:
  - Scripted burst test confirms throttling

### Task 3.3: Public Endpoint Justification + Containment
- **Location**: `supabase/functions/news-rss/index.ts`, other public endpoints
- **Description**: Keep only strictly necessary public endpoints; remove payload expansion and set strict timeout and response-size controls.
- **Dependencies**: Task 3.1
- **Acceptance Criteria**:
  - Public endpoints enumerated and justified in docs
- **Validation**:
  - Public endpoint smoke test under load

## Sprint 4: Secret Hygiene & App Release Hardening
**Goal**: Eliminate leaked credentials risk and finalize release safeguards.
**Demo/Validation**:
- No real secrets in repository files
- Mobile release checklist passes

### Task 4.1: Rotate Potentially Exposed AI Credentials
- **Location**: AI provider dashboard, Supabase secrets
- **Description**: Revoke/rotate any key ever committed (including sample files), update Supabase secrets, verify function calls.
- **Dependencies**: None
- **Acceptance Criteria**:
  - Old key invalidated
  - New key active and tested
- **Validation**:
  - One successful call per AI-dependent function

### Task 4.2: Sanitize Example Env Files
- **Location**: `.env.example`, docs
- **Description**: Replace real-looking values with placeholders and add warning banner about never committing real keys.
- **Dependencies**: Task 4.1
- **Acceptance Criteria**:
  - No secret-like token patterns in tracked files
- **Validation**:
  - `rg` scan for known key patterns returns clean results

### Task 4.3: Mobile Security Flags Review
- **Location**: `android/app/src/main/AndroidManifest.xml`, `ios/App/App/Info.plist`, `capacitor.config.ts`
- **Description**: Apply release-safe defaults (e.g. Android `allowBackup=false` if appropriate for your data model), verify no dev server config in release.
- **Dependencies**: Sprint 2 complete
- **Acceptance Criteria**:
  - Release manifest/plist settings approved
- **Validation**:
  - Build + install test on physical devices

## Sprint 5: Release Verification Gate
**Goal**: Block release unless security baseline is objectively met.
**Demo/Validation**:
- One command/runbook proves readiness

### Task 5.1: Add Security Verification Checklist
- **Location**: `docs/security/release-security-checklist.md`
- **Description**: Add mandatory checks: JWT enforcement table, CORS checks, secret scan, role checks, rate-limit checks, critical function smoke tests.
- **Dependencies**: Sprints 1-4
- **Acceptance Criteria**:
  - Checklist complete and executable by another developer
- **Validation**:
  - Dry-run by second pass reviewer

### Task 5.2: Add Pre-Release Scripted Checks
- **Location**: `scripts/security/` (new)
- **Description**: Create scripts to validate endpoint auth behavior and grep for secret patterns before tagging release.
- **Dependencies**: Task 5.1
- **Acceptance Criteria**:
  - Script exits non-zero on security regressions
- **Validation**:
  - Intentional failure test confirms gate works

## Testing Strategy
- Function-level tests: JWT required/missing/invalid/valid/admin role cases
- CORS tests: allowed origin, blocked origin, preflight behavior
- Abuse tests: burst calls to AI routes and verify `429`
- Regression tests: key user flows in app (chat, spese parse, report, academy)
- Release tests: iOS TestFlight build + Android release build smoke test

## Potential Risks & Gotchas
- Enabling `verify_jwt` too early will break current client calls (401).
- Admin-only checks can fail silently if role data is inconsistent.
- CORS tightening may block app webview/browser traffic if origin matrix is incomplete.
- Rate limiting can degrade UX if thresholds are too low.
- Key rotation without staged rollout can cause temporary AI outages.

## Rollback Plan
- Revert only affected function entries in `supabase/config.toml` to previous `verify_jwt` state.
- Redeploy last known-good Edge Function version.
- Temporarily relax CORS allowlist to previously working origins while incident is triaged.
- Re-enable old secret only as last-resort short window, then rotate again.
