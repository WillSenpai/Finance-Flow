# Plan: Accademia Lesson Nodes (sostituzione skill graph)

**Generated**: 2026-03-07
**Estimated Complexity**: High

## Overview
Refactor completo Accademia da skill graph globale a percorso `lesson-first` con nodi sequenziali obbligatori per ogni lezione.

Regole di prodotto bloccate:
- ogni lezione ha nodi fissi `Concept -> Widget -> Challenge -> Feedback`;
- un nodo si sblocca solo quando il precedente e `completed` o `skipped`;
- utenti `free` non possono skippare (mostrare popup upgrade Pro);
- utenti `pro` possono skippare senza limiti ma `skipped != completed`;
- la lezione e completata solo con tutti i nodi `completed`;
- assessment iniziale rimosso;
- test finale facoltativo in fondo alla lezione;
- utenti legacy con `lesson_progress` completato ricevono backfill su nodi `completed`.

## Prerequisites
- Accesso a Supabase migrations/functions/RLS.
- Presenza tabella `public.user_ai_plans` con `plan in ('free','pro')`.
- Deploy edge functions con `academy-lesson-nodes` abilitata.

## Sprint 1: Data Model + Policies
**Goal**: introdurre il dominio nodi lezione senza rompere UX corrente.
**Demo/Validation**:
- nuove tabelle create e policy RLS attive;
- seed nodi presente per tutte le lezioni disponibili.

### Task 1.1: Schema lesson nodes
- **Location**: `supabase/migrations/*_academy_lesson_nodes_v1.sql`
- **Description**: creare `academy_lesson_nodes`, `user_lesson_node_progress`, `user_lesson_node_events`, `user_lesson_optional_quiz_runs`.
- **Dependencies**: nessuna
- **Acceptance Criteria**:
  - status supportati: `locked|available|completed|skipped`;
  - indici per query user/lesson;
  - vincoli univoci su nodi per lezione.
- **Validation**:
  - smoke SQL su insert/select utente.

### Task 1.2: Seed template fisso nodi
- **Location**: stessa migration
- **Description**: seed 4 nodi fissi per ogni `lesson_id` (`concept/widget/challenge/feedback`).
- **Dependencies**: Task 1.1
- **Acceptance Criteria**:
  - ogni lezione ha 4 nodi attivi e ordinati.
- **Validation**:
  - query count per lesson.

### Task 1.3: Backfill legacy
- **Location**: stessa migration
- **Description**: mappare `lesson_progress` completato a tutti nodi `completed`.
- **Dependencies**: Task 1.1-1.2
- **Acceptance Criteria**:
  - utenti legacy non perdono completamenti.
- **Validation**:
  - report pre/post migrazione.

### Task 1.4: Code Review Gate
- **Location**: workflow sviluppo
- **Description**: review obbligatoria dopo ogni task con confronto SHA base/head.
- **Dependencies**: Task 1.1-1.3
- **Acceptance Criteria**:
  - nessun task chiuso senza review.
- **Validation**:
  - checklist review allegata al PR.

## Sprint 2: Backend Runtime Sequenziale
**Goal**: consolidare logica deterministica di sblocco/skip/completion.
**Demo/Validation**:
- endpoint unico restituisce stato nodi e applica regole skip Pro.

### Task 2.1: Nuova edge function `academy-lesson-nodes`
- **Location**: `supabase/functions/academy-lesson-nodes/index.ts`
- **Description**: implementare azioni `get|advance|skip|submit_optional_quiz`.
- **Dependencies**: Sprint 1
- **Acceptance Criteria**:
  - payload deterministico con nodi ordinati e stati;
  - idempotenza eventi base.
- **Validation**:
  - curl smoke per ogni action.

### Task 2.2: Regole unlock e completion
- **Location**: stessa function
- **Description**: enforce sequenza stretta, no bypass.
- **Dependencies**: Task 2.1
- **Acceptance Criteria**:
  - nodo locked non avanzabile/skippabile;
  - `lesson_completed=true` solo quando tutti `completed`.
- **Validation**:
  - fixture con casi `completed/skipped/mixed`.

### Task 2.3: Entitlement skip Pro
- **Location**: stessa function
- **Description**: leggere `user_ai_plans.plan` e bloccare skip free con errore dominio.
- **Dependencies**: Task 2.1
- **Acceptance Criteria**:
  - free skip => `403 PRO_REQUIRED_FOR_SKIP`;
  - pro skip => stato `skipped`.
- **Validation**:
  - test con due utenti (free/pro).

### Task 2.4: Code Review Gate
- **Location**: workflow sviluppo
- **Description**: review obbligatoria dopo ogni task backend.
- **Dependencies**: Task 2.1-2.3
- **Acceptance Criteria**:
  - feedback critical/important risolti prima merge.
- **Validation**:
  - summary review nel PR.

## Sprint 3: Frontend Accademia + Lezione
**Goal**: UX completa basata su nodi, senza skill graph.
**Demo/Validation**:
- pagina Accademia mostra progresso nodi;
- dettaglio lezione enforce sequenza e popup upgrade su skip free.

### Task 3.1: Accademia progress nodi
- **Location**: `src/pages/Accademia.tsx`
- **Description**: sostituire progresso da `lesson_progress` a `user_lesson_node_progress`.
- **Dependencies**: Sprint 2
- **Acceptance Criteria**:
  - card lezione mostra percentuale nodi completati.
- **Validation**:
  - controllo visuale mobile/desktop.

### Task 3.2: LessonStepper a stato persistito
- **Location**: `src/components/academy/LessonStepper.tsx`
- **Description**: rendere lo stepper dipendente da stato nodi backend.
- **Dependencies**: Task 3.1
- **Acceptance Criteria**:
  - avanzamento solo su nodi disponibili;
  - badge stato nodo coerente.
- **Validation**:
  - test manuale sequenza completa.

### Task 3.3: Skip Pro con popup free
- **Location**: `src/pages/LezioneDetail.tsx`
- **Description**: integrare action skip e popup upgrade per free.
- **Dependencies**: Task 3.2
- **Acceptance Criteria**:
  - free vede popup;
  - pro skippa e avanza.
- **Validation**:
  - e2e user free/pro.

### Task 3.4: Quiz finale facoltativo
- **Location**: `src/components/academy/LessonStepper.tsx`, `src/pages/LezioneDetail.tsx`
- **Description**: invio risultato quiz facoltativo senza bloccare completion.
- **Dependencies**: Task 3.2
- **Acceptance Criteria**:
  - submit quiz persistito;
  - completion lezione invariata.
- **Validation**:
  - submit riuscito e lezione non bloccata.

### Task 3.5: Code Review Gate
- **Location**: workflow sviluppo
- **Description**: review obbligatoria dopo ogni task frontend.
- **Dependencies**: Task 3.1-3.4
- **Acceptance Criteria**:
  - nessun task marcato done senza review.
- **Validation**:
  - note review nel PR.

## Sprint 4: Cutover e Telemetria Minima
**Goal**: completare cutover dal vecchio runtime e monitorare adozione.
**Demo/Validation**:
- nessuna dipendenza runtime da skill-graph assessment/review.

### Task 4.1: Cutover route/data flow
- **Location**: frontend Accademia + Lezione
- **Description**: rimuovere dipendenza runtime da `academy-graph`, `academy-assessment`, `academy-review-due`.
- **Dependencies**: Sprint 3
- **Acceptance Criteria**:
  - percorso utente interamente lesson-nodes.
- **Validation**:
  - regression smoke completa navigazione.

### Task 4.2: Telemetria eventi
- **Location**: client/server events
- **Description**: tracciare `node_completed`, `node_skipped`, `skip_blocked_free`, `lesson_completed`, `optional_quiz_submitted`.
- **Dependencies**: Task 4.1
- **Acceptance Criteria**:
  - dashboard minima KPI nodi.
- **Validation**:
  - verifica eventi in ambiente test.

### Task 4.3: Code Review Gate
- **Location**: workflow sviluppo
- **Description**: review finale pre-merge.
- **Dependencies**: Task 4.1-4.2
- **Acceptance Criteria**:
  - zero issue critical aperte.
- **Validation**:
  - sign-off review finale.

## Testing Strategy
- Unit: regole unlock sequenziale e completion.
- Integration: endpoint `academy-lesson-nodes` con utenti free/pro.
- E2E: journey completo lezione con path `completed` e path `skipped`.
- UX acceptance:
  - skip free sempre bloccato con popup,
  - skip pro consentito ma non chiude lezione,
  - completamento lezione solo con 4 nodi `completed`.

## Potential Risks & Gotchas
- Drift tra `lesson_progress` legacy e nuovo stato nodi.
- Skip abusivo pro con backlog nodi non recuperati.
- Regression UI su stepper se stato nodo non sincronizzato.

## Rollback Plan
- Feature flag runtime lesson-nodes.
- Conservare `lesson_progress` read path in emergenza.
- Possibilita di disabilitare endpoint `academy-lesson-nodes` e tornare al flow precedente.
