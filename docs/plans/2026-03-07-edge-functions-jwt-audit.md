# Edge Functions JWT Audit

**Date**: 2026-03-07  
**Project**: `ilmodaqjpjuldwtkbeyd`  
**Goal**: resolve `academy-graph` `401 Invalid JWT` while preserving authorization security.

## Executive summary

- Confirmed symptom: `POST /functions/v1/academy-graph` returns `401 {"message":"Invalid JWT"}` at gateway level.
- Verified user token is valid against Auth API (`/auth/v1/user` returns `200` with same bearer and apikey).
- Safe fix applied: set `functions.academy-graph.verify_jwt = false` and keep strict app-level auth with `requireAuthenticatedUser`.
- Security verdict for current fix: **SAFE WITH CONDITIONS**.

## Function audit

| Function | verify_jwt before | App-level auth check | Risk if verify_jwt=false | Recommendation |
|---|---:|---|---|---|
| `academy-graph` | true | `requireAuthenticatedUser` on all POST paths | Low | Set `verify_jwt=false` (done) |
| `academy-lesson` | true | `requireAuthenticatedUser` | Low | Candidate for migration if gateway issue extends |
| `academy-assessment` | true | `requireAuthenticatedUser` | Low | Candidate for migration |
| `academy-skill-event` | true | `requireAuthenticatedUser` | Low | Candidate for migration |
| `academy-review-due` | true | `requireAuthenticatedUser` | Low | Candidate for migration |
| `chat` | true | `requireAuthenticatedUser` | Low | Candidate for migration |
| `parse-spesa` | true | `requireAuthenticatedUser` | Low | Candidate for migration |
| `report` | true | `requireAuthenticatedUser` | Low | Candidate for migration |
| `news-summary` | true | `requireAuthenticatedUser` | Low | Candidate for migration |
| `news-rss` | true | `requireAuthenticatedUser` | Low | Candidate for migration |
| `post-generate` | true | `requireAuthenticatedUser` + `requireAdminUser` | Low | Candidate for migration |
| `delete-account` | true | Manual bearer + `auth.getUser()` | Low-Medium | Keep as-is now; can refactor to shared auth helper |
| `academy-generate-cache` | true | Manual bearer + admin check | Low-Medium | Keep as-is now; can refactor to shared auth helper |
| `generate-lesson-illustrations` | true | Auth check only in `mode=card` branch | **High** | Do not disable gateway JWT until non-card branches are gated |
| `news-generate-cache` | false | `requireAuthenticatedUser` + `requireAdminUser` (except cron-secret path) | Controlled | Keep `verify_jwt=false` |

## Security conditions for the applied fix

1. `academy-graph` must always call `requireAuthenticatedUser` before accessing user data.
2. No token values should be logged in function logs.
3. Client must send both:
   - `Authorization: Bearer <access_token>`
   - `apikey: <publishable_key>`
4. Keep retry behavior bounded client-side (already implemented in `invokeWithAuth`).

## Validation checklist (branch/test environment)

- [ ] `academy-graph` with valid bearer + apikey returns `200`.
- [ ] `academy-graph` without bearer returns `401`.
- [ ] `academy-graph` with malformed bearer returns `401`.
- [ ] `academy-graph` with expired bearer returns `401`.
- [ ] App flow: Accademia loads after login with no repeating `401` loop.

## Next hardening steps

1. Refactor `delete-account` and `academy-generate-cache` to use shared auth helper for consistency.
2. Gate all `generate-lesson-illustrations` modes with authenticated + authorized checks before considering `verify_jwt=false`.
3. If gateway `Invalid JWT` affects other endpoints, migrate only endpoints with full app-level auth coverage.
