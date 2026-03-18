# Project Folders Structure Blueprint

Last updated: 2026-03-18

## 1. Auto-Detection Summary
- Primary project type: React + TypeScript (Vite).
- Backend/data integration: Supabase (client + edge/functions folder).
- Mobile wrapper: Capacitor (`android/`, `ios/`).
- Repository type: single repo (not a monorepo workspace).
- Microservices: not a classic microservices architecture; includes serverless functions in `supabase/functions`.

## 2. Structural Overview
- Main app code is in `src/` and follows a mostly feature-by-domain organization:
  - `pages/` for route-level screens.
  - `components/` split by domain (`academy`, `billing`, `chat`, `patrimonio`, `profile`) plus shared `ui/`.
  - `contexts/`, `hooks/`, `lib/` for cross-cutting logic.
- Mobile native projects are clearly separated in `android/` and `ios/`.
- Supabase artifacts are isolated in `supabase/` (migrations/functions/templates).

Current organization principle: hybrid by route + domain + shared technical layers.

## 3. Directory Visualization (Depth 3)
- `/`
  - `src/`
    - `pages/`
    - `components/`
      - `academy/`
      - `billing/`
      - `chat/`
      - `layout/`
      - `patrimonio/`
      - `profile/`
      - `startup/`
      - `ui/`
    - `contexts/`
    - `hooks/`
    - `lib/`
      - `billing/`
    - `integrations/`
      - `supabase/`
    - `assets/`
      - `startup/`
    - `config/`
    - `test/`
  - `public/`
    - `libri/`
  - `docs/`
    - `plans/`
    - `prompts/`
    - `revenuecat/`
  - `supabase/`
    - `functions/`
    - `migrations/`
    - `templates/`
  - `android/`
    - `app/`
    - `gradle/`
  - `ios/`
    - `App/`
    - `capacitor-cordova-ios-plugins/`
  - `scripts/`

## 4. Key Directory Analysis
- `src/pages` (37 files): clear route mapping, easy navigation for app flows.
- `src/components` (90 files): good domain split, but shared UI + domain components are mixed in one top-level area; still readable.
- `src/lib` (14 files): utility/business logic bucket is useful but risks becoming a catch-all over time.
- `src/contexts` and `src/hooks`: coherent and predictable placement.
- `src/integrations/supabase`: good boundary for external platform client/types.
- `supabase/`: good separation of infra/backend concerns from frontend app.
- `android/` and `ios/`: correctly isolated native concerns.

## 5. File Placement Patterns
- Route screens: `src/pages/*.tsx`.
- Reusable UI primitives: `src/components/ui/*.tsx`.
- Domain components: `src/components/<domain>/*.tsx`.
- App-level providers/state: `src/contexts/*`.
- Cross-page hooks: `src/hooks/*`.
- Utilities/services/platform bridge: `src/lib/*`.
- Platform integration contract: `src/integrations/supabase/*`.

Pattern quality: generally consistent.

## 6. Naming and Organization Conventions
- Mostly PascalCase for React components and pages.
- Mixed naming styles in some utility files (`kebab-case` and `camelCase` coexist), but acceptable.
- Route/page naming is descriptive and mirrors product language (Italian domain terms).

## 7. Navigation and Workflow
- Entrypoints are clear:
  - App bootstrap: `src/main.tsx`
  - Router/providers composition: `src/App.tsx`
  - Build/runtime config: `vite.config.ts`, `capacitor.config.ts`
- Adding a new feature is straightforward:
  - New route in `src/pages`
  - Domain components in `src/components/<domain>`
  - Shared logic in `hooks`/`lib`
  - Supabase contract updates in `integrations/supabase` or `supabase/*`

## 8. Build and Output Organization
- Toolchain config is standard and easy to locate (`package.json`, `vite`, `tailwind`, `tsconfig`).
- Output directories:
  - Web build: `dist/`
  - Native wrappers consume `dist` via Capacitor `webDir`.
- Generated folders should remain excluded from structural judgments (`dist/`, `node_modules/`, native derived/build folders).

## 9. Assessment: Is It Well Organized and Clear?
Short answer: **yes, mostly**.

### Strengths
- Clear separation between web app (`src`), backend infra (`supabase`), and native wrappers (`android`/`ios`).
- Routing and screen structure is explicit and easy to follow.
- Domain-oriented component folders improve discoverability.
- Conventional modern stack layout (Vite + React + TS + Capacitor).

### Clarity Risks
- `src/lib` can become a generic dumping area if not governed.
- Root contains operational artifacts (`Build App_*.txt`, temporary timestamp config file) that add noise.
- Lockfile strategy is mixed (`package-lock.json` + `bun.lockb`), which can confuse contributors.
- Hidden repo metadata anomalies (`.git/index N`) indicate local tooling noise.

## 10. Recommended Improvements (Low Risk, High Clarity)
1. Keep one package manager as canonical (npm or bun) and document it in `README.md`.
2. Add a small `CONTRIBUTING.md` with folder placement rules:
   - when to use `components/<domain>` vs `components/ui`
   - when code belongs in `hooks` vs `lib`.
3. Move or archive operational artifacts from root into `docs/` or `.tmp/`.
4. Add lightweight lint rules for import boundaries (e.g. prevent `pages` importing deep internals unnecessarily).
5. Periodically clean local repo artifacts that are not source of truth.

## 11. Optional Templates
### New Feature Template
- `src/pages/<Feature>.tsx`
- `src/components/<feature>/...`
- `src/hooks/use<Feature>.ts`
- `src/lib/<feature>.ts`
- `src/test/<feature>.test.ts` (or colocated tests)

### New Service/Integration Template
- `src/integrations/<provider>/client.ts`
- `src/integrations/<provider>/types.ts`
- `src/lib/<provider>.ts` (thin app-facing adapter)

## 12. Maintenance Notes
- Update this blueprint when one of these changes:
  - major folder move/renaming
  - new top-level domain/module
  - new platform boundary (new app package, backend runtime, or workspace split)
