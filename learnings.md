# Learnings

---

## 1. Tool Reliability Index

| Tool | Status | Failure Mode | Workaround |
|------|--------|--------------|------------|
| `generate_image` | 🔴 Deprecato (per bulk) | `MODEL_CAPACITY_EXHAUSTED` (503) | Non usare per bulk. Generare solo 1 immagine e aspettare ore, oppure fornire i text prompt all'utente |

---

## 2. Errori Noti per Direttiva

### UI Consistency

- **Desktop vs Mobile Grid**: Su `AdminAccademia.tsx` l'utilizzo di griglie rigide su root container senza breakpoint responsivi porta ad accordion e form estesi non compatti. Soluzione: Usare `lg:grid-cols-[1fr,260px]` e agrupare macro sezioni.

---

## 3. Log Cronologico

### [2026-03-05] Gestione Accademia Layout / UI Consistency

**Problema:** L'interfaccia dell'editor lezioni (Gestione Accademia) era eccessivamente allungata verticalmente su mobile, con spazi non ottimizzati e form dispersi.
**Causa:** Container singoli impilati verticalmente, pulsanti d'azione editor ingombranti e "Checklist struttura" spinta in fondo alla pagina o in logiche `md:`. (categoria: UI/UX Layout)
**Fix:** Compatto della sezione raggruppando `Titolo lezione` e `Macrosezione` in riga (`sm:grid-cols-2`). Spostato "Immagine card" assieme alla "Checklist struttura" su colonna dedicata `lg:grid-cols-[1fr,260px]` visibile su desktop/tablet riducendo vertical space su mobile. Pulsanti editor aggregati con stili nativi (`bg-muted/50`).
**Stato:** ✅ Completato
**Confidence:** Alta

---

### [2026-03-16] PostHog Analytics Integration

**Context:** Integrazione PostHog SDK per tracciare metriche utente complete (azioni, crediti, click, utenti attivi, install).
**Modifiche:**
1.  **SDK Setup**: Installato `posthog-js`, creato `src/lib/posthog.ts` con init, identify, tracking tipizzati.
2.  **User Identification**: Hook `usePostHogIdentify` sincronizza identità utente PostHog con AuthContext.
3.  **Page Views**: Hook `usePostHogPageView` traccia ogni navigazione react-router.
4.  **13 eventi custom**: points_earned, badge_unlocked, challenge_completed, patrimonio/salvadanai/investimenti/spese updated, onboarding_completed, pro_paywall_shown, edge_function_called/error, app_installed.
5.  **Env**: API key in `.env` con host EU per GDPR.
**Stato:** ✅ Completato
**Confidence:** Alta

