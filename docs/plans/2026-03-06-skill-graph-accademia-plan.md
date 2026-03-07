# Plan: Skill Graph Accademia (sostituzione completa metodo studio)

**Generated**: 2026-03-06  
**Estimated Complexity**: High

## Overview
Refactor completo dell’Accademia da struttura lineare (`lesson_id` + completamento binario) a `Knowledge Graph` adattivo con:
- test iniziale obbligatorio (12 quiz adattivi),
- padronanza per skill `0-100`,
- sblocco nodi con `prerequisiti + soglia`,
- lezione sempre in ciclo attivo (`Concept <=200 parole -> Widget -> Challenge -> Feedback`),
- spaced repetition fisso `1-3-7-14`,
- migrazione utenti legacy in mastery iniziale (no reset).

Approccio scelto: deterministico e data-driven, con AI solo come supporto contenutistico, non come motore decisionale di sblocco.

## Prerequisites
- Accesso a Supabase migrations/functions/RLS gia in uso nel progetto.
- Allineamento su naming tabelle nuove e strategia di deprecazione `lesson_progress`.
- Aggiornamento tipi Supabase (`src/integrations/supabase/types.ts`) dopo nuove migration.
- Nessuna implementazione `Scenario Builder` in questa fase (target V1.5).

## Execution Order and Parallelization
- Sequenza obbligatoria: Sprint 1 -> Sprint 2 -> Sprint 3 -> Sprint 4.
- Parallelizzabile in Sprint 1: Task 1.3 (RLS) puo partire appena esiste schema base di Task 1.1.
- Parallelizzabile in Sprint 3: Task 3.4 (copy) puo iniziare quando il contratto lesson runtime di Task 3.3 e stabile.
- Non parallelizzare con migrazione utenti: Task 4.2 deve completarsi prima di Task 4.3 (hard cutover).

## Sprint 1: Fondazioni Dati + Contratti API
**Goal**: introdurre il nuovo dominio skill-graph senza rompere l’app attuale.  
**Demo/Validation**:
- DB contiene nuove tabelle e policy attive.
- Endpoint "read-only graph" risponde con nodi, archi, stato utente mock.

### Task 1.1: Definire schema relazionale del grafo
- **Location**: `supabase/migrations/*_academy_skill_graph_core.sql`
- **Description**: creare `academy_skills`, `academy_skill_edges`, `user_skill_mastery`, `user_skill_events`.
- **Dependencies**: nessuna
- **Acceptance Criteria**:
  - chiavi/foreign key coerenti,
  - vincoli anti-loop base sugli archi (no self-edge),
  - indici su `(user_id, skill_id)` e `due_at`.
- **Validation**:
  - query SQL smoke su seed minimo (3 skill + 2 edge).

### Task 1.2: Definire schema assessment e review
- **Location**: `supabase/migrations/*_academy_assessment_review.sql`
- **Description**: creare `academy_assessment_questions`, `user_assessment_runs`, `user_assessment_answers`, `user_review_queue`.
- **Dependencies**: Task 1.1
- **Acceptance Criteria**:
  - supporto difficulty 1..5,
  - queue review con step `1|3|7|14`.
- **Validation**:
  - insert/select end-to-end di un run assessment.

### Task 1.3: RLS policies nuove tabelle
- **Location**: stessa migration o migration dedicata RLS
- **Description**: policy per utente su record personali, read globale su skill graph pubblico, write admin su contenuti.
- **Dependencies**: Task 1.1, 1.2
- **Acceptance Criteria**:
  - utente legge solo il proprio progresso,
  - admin mantiene gestione contenuti.
- **Validation**:
  - test manuale con due utenti distinti.

### Task 1.4: Contratti endpoint V1
- **Location**: `supabase/functions/*` (nuove function)
- **Description**: definire shape I/O per:
  - `academy-assessment/start|answer|complete`
  - `academy-graph`
  - `academy-skill-event`
  - `academy-review-due`
- **Dependencies**: Task 1.1-1.3
- **Acceptance Criteria**:
  - payload versionato e validato,
  - errori HTTP coerenti (400/401/403/409).
- **Validation**:
  - curl smoke per ogni endpoint.

## Sprint 2: Motore Adattivo (Assessment + Mastery + Unlock)
**Goal**: rendere deterministico il calcolo stato utente.  
**Demo/Validation**:
- Utente nuovo completa assessment e riceve nodi iniziali sbloccati automaticamente.

### Task 2.1: Engine test iniziale adattivo (12 domande)
- **Location**: `supabase/functions/academy-assessment/*`
- **Description**: implementare algoritmo difficulty start=2, corretta +1 (max5), errata -1 (min1), 12 step.
- **Dependencies**: Sprint 1
- **Acceptance Criteria**:
  - run conclude sempre a 12 risposte,
  - score per skill normalizzato 0-100.
- **Validation**:
  - suite casi deterministici (all correct, mixed, all wrong).

### Task 2.2: Calcolo mastery iniziale e mapping range
- **Location**: stessa function complete
- **Description**: persistere `user_skill_mastery` con range:
  - 0-29 base,
  - 30-59 foundation,
  - 60-79 intermediate,
  - 80-100 advanced.
- **Dependencies**: Task 2.1
- **Acceptance Criteria**:
  - ogni skill rilevante riceve punteggio iniziale,
  - clamp sempre 0..100.
- **Validation**:
  - snapshot DB post-complete run.

### Task 2.3: Regole di sblocco nodo
- **Location**: `academy-graph` + query SQL helper
- **Description**: nodo `available` solo se:
  - tutti prerequisiti >= `min_mastery_required`,
  - media prerequisiti >= `unlock_mastery_threshold`.
- **Dependencies**: Task 2.2
- **Acceptance Criteria**:
  - locked/available/mastered coerenti per casi limite.
- **Validation**:
  - fixture con grafo piccolo e attese note.

### Task 2.4: Event scoring runtime
- **Location**: `academy-skill-event`
- **Description**: applicare delta deterministici:
  - concept +5, widget +15, challenge +40/+25/+10, review +10/-15.
- **Dependencies**: Task 2.3
- **Acceptance Criteria**:
  - scoring idempotente per event duplicati (event_id),
  - audit trail su `user_skill_events`.
- **Validation**:
  - test replay eventi con stesso input.

## Sprint 3: Frontend Nuova Accademia (Graph-first)
**Goal**: sostituzione completa UX attuale con skill tree + lesson flow obbligatorio.  
**Demo/Validation**:
- `Accademia` mostra grafo, non piu caroselli lineari.
- Accesso bloccato da assessment se non completato.

### Task 3.1: Gate test iniziale
- **Location**: `src/pages/Accademia.tsx` + routing
- **Description**: prima apertura -> assessment flow obbligatorio, no bypass.
- **Dependencies**: Sprint 2
- **Acceptance Criteria**:
  - utente senza run completed non vede grafo.
- **Validation**:
  - test navigazione utente nuovo/esistente.

### Task 3.2: UI Skill Graph + heatmap mastery
- **Location**: `src/pages/Accademia.tsx` + nuovi componenti `src/components/academy/*`
- **Description**: render nodi/archi con stato:
  - locked,
  - available,
  - mastered,
  - fading (review overdue).
- **Dependencies**: Task 3.1
- **Acceptance Criteria**:
  - click solo su nodi available/mastered,
  - legenda chiara stati.
- **Validation**:
  - visual test su mobile/desktop.

### Task 3.3: Lesson runtime obbligatorio ciclo attivo
- **Location**: `src/pages/LezioneDetail.tsx`, `src/components/academy/LessonStepper.tsx`
- **Description**: enforce sequenza `Concept -> Widget -> Challenge -> Feedback`; completamento nodo solo a ciclo chiuso.
- **Dependencies**: Task 3.2
- **Acceptance Criteria**:
  - impossibile "segnare completata" senza challenge.
- **Validation**:
  - test UI e query invalide bloccate.

### Task 3.4: Copy colloquiale progressivo
- **Location**: prompt/content pipeline academy lesson
- **Description**: introdurre micro-copy motivazionale legata al livello utente e al "perche" della formazione.
- **Dependencies**: Task 3.3
- **Acceptance Criteria**:
  - copy varia tra livelli (base/intermediate/advanced),
  - tono coerente italiano colloquiale.
- **Validation**:
  - review contenuti su 3 profili utente.

## Sprint 4: Spaced Repetition + Migrazione Legacy + Hard Cutover
**Goal**: retention attiva e cutover definitivo dal vecchio modello.  
**Demo/Validation**:
- Review queue popolata e visibile.
- Utenti storici mantengono vantaggio iniziale.

### Task 4.1: Scheduling review 1-3-7-14
- **Location**: backend review queue + client inbox
- **Description**: creare task review a completamento skill, avanzamento/reset step in base all’esito.
- **Dependencies**: Sprint 2/3
- **Acceptance Criteria**:
  - due date corrette,
  - fail review -> step=1.
- **Validation**:
  - time-travel test su date.

### Task 4.2: Migrazione utenti esistenti
- **Location**: migration script SQL + function one-shot
- **Description**: convertire `lesson_progress` in `user_skill_mastery`:
  - base 60 per skill mappata,
  - cap iniziale 75 su overlap multipli.
- **Dependencies**: Task 4.1
- **Acceptance Criteria**:
  - nessun utente legacy a zero senza motivo,
  - mapping tracciabile/loggato.
- **Validation**:
  - report pre/post migrazione.

### Task 4.3: Deprecazione vecchio flusso
- **Location**: frontend academy pages + query keys legacy
- **Description**: rimuovere dipendenza runtime da `lesson_id` lineare e `lesson_progress` come source of truth.
- **Dependencies**: Task 4.2
- **Acceptance Criteria**:
  - nessuna route utente punta al vecchio percorso.
- **Validation**:
  - regression smoke su navigazione completa.

### Task 4.4: Telemetria prodotto
- **Location**: eventi analytics lato client/server
- **Description**: tracciare assessment completion, unlock velocity, review completion, drop-off per step.
- **Dependencies**: Task 4.3
- **Acceptance Criteria**:
  - dashboard minima con KPI base.
- **Validation**:
  - verifica eventi su ambiente test.

## Testing Strategy
- Unit: algoritmi difficulty, scoring, unlock.
- Integration: endpoints assessment/graph/event/review con RLS attiva.
- E2E: user journey completo (nuovo, legacy, admin).
- UX acceptance:
  - gating obbligatorio,
  - sblocco dinamico evidente,
  - feedback correttivo contestuale al widget,
  - heatmap/fading coerenti.

## Potential Risks & Gotchas
- Mapping legacy troppo aggressivo o troppo conservativo.  
Mitigazione: dry-run con report distribuzione mastery prima del cutover.
- Complessita contenuti "widget-first" su tutti i nodi.  
Mitigazione: template didattici riusabili per tipo skill.
- Regressioni RLS con nuove tabelle utente.  
Mitigazione: checklist policy + test cross-user automatici.
- Drift tra scoring frontend/backend.  
Mitigazione: scoring centralizzato backend, frontend solo rendering.

## Rollback Plan
- Feature flag `academy_skill_graph_enabled` per rollout graduale.
- Conservare lettura legacy per emergenza (read-only) fino a stabilizzazione Sprint 4.
- Snapshot DB pre-migrazione utenti legacy.
- In caso di rollback: ripristino UI legacy + freeze scrittura su nuove tabelle.

## Release Acceptance Criteria
- Utente nuovo non puo accedere all'Accademia senza assessment completato.
- Al termine assessment, almeno un percorso risulta `available` nel grafo.
- Completamento skill possibile solo dopo `Concept + Widget + Challenge + Feedback`.
- Review queue produce scadenze reali `1-3-7-14` e modifica mastery in base all'esito.
- Utente legacy conserva un vantaggio iniziale visibile dopo migrazione.

## Post-V1 Backlog (gia deciso)
- `V1.5`: Scenario Builder deterministico (input economico, composizione strategia, simulazione matematica, suggerimento skill da ripassare).
