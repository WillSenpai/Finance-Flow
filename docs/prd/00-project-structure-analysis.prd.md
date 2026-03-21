# Analisi Struttura Progetto

Estratto sintetico della struttura utile al contesto PRD:
- App frontend: `src/` (React + TypeScript + Vite).
- Native shell: `ios/`, `android/` (Capacitor).
- Backend e database: `supabase/` + migrazioni/query in `docs/sql/`.
- Documentazione: `docs/` con PRD principale in `docs/PRD.md` e piani specifici in `docs/plans/`.
- Config/build: root (`vite.config.ts`, `tailwind.config.ts`, `package.json`).

Obiettivo di questa modularizzazione: ridurre la frizione di ricerca e consentire deep-link diretti a sezione/elemento del PRD.
