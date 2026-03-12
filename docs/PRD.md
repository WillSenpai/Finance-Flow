# Product Requirements Document (PRD) - My Money Compass

Aggiornato al 12 marzo 2026.

## 1. Executive Summary

- **Problem Statement**: Le persone percepiscono la finanza personale come complessa, dispersiva e scollegata dalle decisioni quotidiane. I prodotti esistenti separano spesso apprendimento, monitoraggio e azione, riducendo continuita d'uso e impatto comportamentale.
- **Proposed Solution**: My Money Compass e un'app mobile-first che unisce educazione finanziaria guidata, gestione di patrimonio e spese, AI coach contestuale, contenuti editoriali, patrimonio condiviso e monetizzazione Pro in un unico flusso prodotto. L'obiettivo e trasformare concetti astratti in micro-azioni ripetibili e misurabili.
- **Success Criteria**:
  - `D7 retention` utenti registrati >= 45%.
  - `D30 retention` utenti registrati >= 30%.
  - Completamento onboarding >= 80% degli utenti che iniziano la registrazione.
  - >= 60% degli utenti attivi completa almeno una skill Accademia entro 14 giorni dal primo accesso.
  - >= 50% delle skill completate rientra almeno una volta nel ciclo review `1-3-7-14`.
  - Conversione a piano `Pro` >= 4% dei `MAU` su piattaforme native dopo attivazione paywall stabile.
  - `Scroll Integrity` 100% sulle route core senza doppio scroll verticale involontario.
  - `Viewport Compatibility` pass 100% dei test manuali su iPhone e Android per safe-area, keyboard e tab bar.

## 2. User Experience & Functionality

- **User Personas**:
  - Principiante finanziario: vuole capire concetti base e ricevere indicazioni semplici, non gergo tecnico.
  - Utente in crescita: vuole organizzare spese, obiettivi e primi investimenti in modo concreto.
  - Utente evoluto: vuole strumenti rapidi, comparazioni e supporto decisionale contestuale.
  - Coppia o piccolo nucleo: vuole gestire patrimonio e spese condivise in uno spazio collaborativo.
  - Admin/editor: vuole pubblicare contenuti, lezioni e articoli senza dipendere dal team tecnico.

- **User Stories**:
  - `US-01` As a new user, I want a guided onboarding so that I can receive a personalized financial path.
  - `US-02` As a learner, I want short and practical lessons so that I can improve my financial literacy without friction.
  - `US-03` As a user tracking money, I want to manage patrimonio, spese, salvadanai and investimenti so that I can understand my current financial position.
  - `US-04` As a collaborative user, I want a shared workspace so that I can manage shared money with another person or a small group.
  - `US-05` As a user seeking guidance, I want an AI coach with my context so that I can receive actionable answers and summaries.
  - `US-06` As an engaged user, I want points, streaks, badges, challenges and weekly reports so that I stay consistent over time.
  - `US-07` As a content seeker, I want curated news, explainers and exploration content so that I connect theory with current events.
  - `US-08` As an admin, I want to manage editorial and academy content so that content quality remains high and current.
  - `US-09` As a paying user, I want a clear Pro experience so that I understand what is unlocked and can restore my purchases reliably.
  - `US-10` As a mobile user, I want screens that fit my device correctly so that content is never clipped or artificially scrollable.

- **Acceptance Criteria**:
  - Per `US-01`:
    - Registrazione con email/password, callback auth e reset password funzionanti.
    - Onboarding obbligatorio prima dell'accesso alle route protette.
    - Salvataggio profilo base in `profiles` con `has_completed_onboarding=true`.
  - Per `US-02`:
    - Accesso Accademia gated da assessment iniziale.
    - Grafo skill con stati `locked | available | mastered | fading`.
    - Runtime lezione basato su nodi ordinati con stati utente `locked | available | completed | skipped`.
    - Azioni `advance`, `skip`, `submit_optional_quiz` tracciate in modo idempotente.
    - Chat tutor in-lesson disponibile con risposta streaming.
  - Per `US-03`:
    - CRUD patrimonio, investimenti, salvadanai e spese disponibile da UI.
    - Inserimento spese sia manuale sia tramite parsing in linguaggio naturale.
    - Simulatore `what-if` disponibile per stimare il raggiungimento obiettivi.
    - Vista per categorie e periodo disponibile almeno per il mese corrente.
  - Per `US-04`:
    - Creazione di uno `shared workspace` da parte del proprietario.
    - Invito membri via email con scadenza e accettazione tracciata.
    - Supporto a patrimonio, investimenti, salvadanai e spese condivisi.
    - Limite workspace applicato lato backend e coerente con il piano di prodotto.
  - Per `US-05`:
    - Coach AI riceve contesto utente strutturato.
    - Risposte supportano markdown, tabelle, link interni e streaming.
    - Gestione errori `402`, `429` e fallback UX leggibile lato app.
    - Quote AI applicate lato backend in base al piano utente.
  - Per `US-06`:
    - Sistema punti con eventi giornalieri e progressione persistente.
    - Badge, streak e sfide settimanali visibili in app.
    - Report finanziario settimanale generabile via funzione dedicata.
  - Per `US-07`:
    - Feed news con cache server-side da sorgenti economiche italiane.
    - Summary AI on-demand disponibile per articolo.
    - Sezione Esplora con ricerca, filtro e dettaglio articolo.
  - Per `US-08`:
    - CRUD admin per post, contenuti Esplora e contenuti Accademia.
    - Ruoli admin protetti da RLS/policy dedicate.
    - Supporto storage immagini per post, Esplora e illustrazioni lezioni.
  - Per `US-09`:
    - Pagina `Profilo Pro` accessibile in app.
    - Offerte RevenueCat caricate nativamente su iOS/Android.
    - Acquisto, restore e sync stato abbonamento funzionanti.
    - Entitlement e piano AI allineati via webhook/sync backend.
  - Per `US-10`:
    - Shell layout con singolo asse di scroll verticale sulle route core.
    - Uso di safe-area CSS e viewport dinamico su mobile.
    - Nessuna route core dipende da `100vh` statico senza contesto.
    - Nessuna area bianca extra scrollabile nelle schermate core.

- **Non-Goals**:
  - Trading execution o invio ordini a broker.
  - Consulenza finanziaria personalizzata regolamentata.
  - Open banking o sincronizzazione bancaria automatica nel perimetro attuale.
  - Esperienza desktop-first avanzata: il prodotto resta mobile-first.
  - Monetizzazione web completa con checkout browser nel perimetro attuale.
  - Supporto multilingua oltre all'italiano nel perimetro attuale.

## 3. AI System Requirements

- **Tool Requirements**:
  - Edge Functions Supabase per `chat`, `academy-lesson`, `academy-lesson-nodes`, `academy-assessment`, `academy-graph`, `academy-review-due`, `academy-skill-event`, `parse-spesa`, `news-summary`, `news-generate-cache`, `post-generate`, `report`.
  - Gateway LLM configurato tramite `AI_API_KEY` o `OPENAI_API_KEY`.
  - Sistema quote/token per piano utente con enforcement lato backend.
  - Streaming SSE per i flussi di coaching e tutor contestuale.
  - Caching contenuti AI dove opportuno per contenere costi e latenza.

- **Evaluation Strategy**:
  - Coach AI:
    - P95 prima risposta streaming < 4s su rete stabile.
    - 0 risposte non gestite lato UX per errori `402/429/500`.
    - Qualita campionata manualmente su 50 conversazioni/settimana con >= 90% di risposte giudicate utili e contestuali.
  - Parsing spese:
    - Accuratezza di compilazione campi core (`importo`, `categoria`, `data`) >= 90% su campione interno di 100 input realistici.
  - Accademia AI:
    - Allineamento del contenuto lesson-node con lo stato utente >= 95% su test di regressione backend.
    - Nessun evento duplicato su `advance/skip/optional_quiz` a parita di `event_id`.
  - News summary:
    - Coerenza con sorgente >= 90% su campione casuale di 50 articoli/settimana.
    - P95 summary on-demand < 4s.

## 4. Technical Specifications

- **Architecture Overview**:
  - Frontend:
    - SPA React + TypeScript + Vite.
    - Routing con `react-router-dom`.
    - Stato server con `@tanstack/react-query`.
    - UI mobile-first con Tailwind, shadcn/ui e framer-motion.
    - Packaging nativo tramite Capacitor per iOS e Android.
  - Backend:
    - Supabase Postgres come datastore primario.
    - Supabase Auth per email/password e callback auth.
    - Edge Functions Deno per AI, billing sync, contenuti e workspace operations.
  - Layout contract:
    - viewport dinamico con `dvh` e variabili `--safe-*`;
    - `outer-scroll` come modello standard sulle schermate core;
    - tab bar integrata nel layout senza riserva artificiale di spazio;
    - evitato l'uso indiscriminato di `vh/screen`.
  - Vincoli di progetto:
    - Stack obbligatorio: React, TypeScript, Vite, Supabase, Capacitor, RevenueCat per billing nativo.
    - Runtime locale: Node.js `>= 22.0.0`, npm `>= 10`.
    - Audience primaria: utenti italiani mobile-first, dal livello beginner al pro, con estensione collaborativa per nuclei condivisi.
    - Monetizzazione: piano `Pro` attivo su canali nativi; il web non e canale principale di conversione nel perimetro attuale.
    - Deadline: allineamento funzionale continuo al codice esistente; nessuna data di GA globale formalizzata nel repository, quindi resta `TBD`.

- **Integration Points**:
  - Tabelle core utente:
    - `profiles`, `patrimonio`, `salvadanai`, `investimenti`, `categorie_spese`, `spese`.
  - Dominio Accademia:
    - `academy_lessons_cache`, `academy_skills`, `academy_skill_edges`, `academy_assessment_questions`, `user_assessment_runs`, `user_assessment_answers`, `user_skill_mastery`, `user_skill_events`, `user_review_queue`.
    - `academy_lesson_nodes`, `user_lesson_node_progress`, `user_lesson_node_events`, `user_lesson_optional_quiz_runs`, `user_lesson_intro_views`.
  - Dominio contenuti:
    - `news_cache`, `explore_articles`, `admin_posts`, `post_likes`, `post_views`, `lesson_illustrations`.
  - Dominio billing:
    - `billing_subscriptions`, `billing_events`, `user_ai_plans`.
    - RevenueCat lato client nativo + webhook `billing-webhook-revenuecat` + sync `billing-sync`.
  - Dominio collaborazione:
    - `shared_workspaces`, `shared_workspace_members`, `shared_workspace_invites`, `shared_patrimonio`, `shared_investimenti`, `shared_salvadanai`, `shared_categorie_spese`, `shared_spese`.
    - Edge Functions `workspace-invite-create`, `workspace-invite-list`, `workspace-invite-accept`, `workspace-member-remove`.
  - Storage:
    - bucket immagini per `admin-posts`, `explore_articles`, `lesson-illustrations`.

- **Security & Privacy**:
  - RLS attiva sulle tabelle principali con vincolo su `auth.uid()` ove applicabile.
  - Ruoli admin separati tramite `user_roles` e policy dedicate.
  - Secret AI, service role e webhook auth gestiti server-side.
  - Dati personali trattati: nome, email, telefono, data di nascita.
  - Requisito GDPR: informativa privacy esplicita, retention definita e cancellazione account funzionante.
  - Requirement operativo: origini CORS ristrette in produzione, niente wildcard.
  - Requirement billing: eventi provider idempotenti e sincronizzazione abbonamento coerente tra client, store e database.

## 5. Risks & Roadmap

- **Phased Rollout**:
  - `Stato attuale (12 marzo 2026)`:
    - Implementati autenticazione, onboarding, dashboard, patrimonio, salvadanai, investimenti, spese e simulatore.
    - Implementati coach AI, parsing spese, report AI, news cache/summary, Esplora e contenuti admin.
    - Implementati Skill Graph Accademia V1, assessment, review queue, tutor lezione e runtime nodi.
    - Implementati workspace condivisi per patrimonio e spese con inviti email e membership rules.
    - Implementato piano `Pro` nativo con RevenueCat, sync backend e stato subscription persistito.
    - Implementato hardening layout mobile su route core con safe-area e controllo scroll.
  - `MVP stabilizzato (0-2 mesi)`:
    - Consolidare analytics di prodotto per KPI PRD.
    - Coprire regressioni core con suite E2E su onboarding, patrimonio, Accademia, billing e workspace.
    - Chiudere i gap Android real-device e validare scenari billing full-cycle.
  - `v1.1 (2-4 mesi)`:
    - Rafforzare gating `Pro` lato feature/content oltre al solo stato subscription.
    - Aggiungere notifiche push end-to-end.
    - Migliorare explainability AI, osservabilita costi e quality monitoring.
    - Formalizzare funnel premium e reporting conversione.
  - `v2.0 (4-8 mesi)`:
    - Assistente proattivo su obiettivi, spese e suggerimenti predittivi.
    - Segmentazione avanzata per percorso educativo e coaching.
    - Import dati esterni opzionali, iniziando da CSV strutturati.
    - Evoluzione dei workspace condivisi con piu regole, insight e permessi.

- **Technical Risks**:
  - Costi AI variabili su chat, tutoring, summary e generazione contenuti.
  - Drift di qualita del modello su parsing spese e suggerimenti finanziari.
  - Fragilita dei feed RSS e dipendenze da sorgenti terze.
  - Regressioni UI su safe-area, keyboard e nested scroll con nuove schermate.
  - Gap di misurazione: KPI di retention, funnel premium e completion Accademia non sono ancora completamente osservati end-to-end.
  - Billing incompleto su canali non nativi: la monetizzazione e reale ma resta centrata su iOS/Android.
  - Complessita crescente del dominio condiviso, con rischio di incoerenze tra dati personali e workspace se non coperti da test.
