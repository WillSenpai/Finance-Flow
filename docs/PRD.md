# Product Requirements Document (PRD) - My Money Compass

Aggiornato al 18 marzo 2026.
Versione documento: 2.0.

## 1. Executive Summary

- **Problem Statement**: La finanza personale resta frammentata tra apprendimento, monitoraggio e azione operativa; questa separazione riduce continuita d'uso e risultati concreti nel tempo. Gli utenti hanno bisogno di un prodotto unico che trasformi contenuti e analisi in decisioni quotidiane ripetibili.
- **Proposed Solution**: My Money Compass e una piattaforma mobile-first che unisce onboarding guidato, Accademia finanziaria, gestione di patrimonio/spese/investimenti/salvadanai, AI coach contestuale, workspace condivisi e piano Pro nativo (iOS/Android) con entitlement sincronizzato lato backend.
- **Success Criteria**:
  - `D7 retention` utenti registrati >= 45%.
  - `D30 retention` utenti registrati >= 30%.
  - Completamento onboarding >= 80% degli utenti che iniziano la registrazione.
  - >= 60% degli utenti attivi completa almeno una skill Accademia entro 14 giorni dal primo accesso.
  - >= 50% delle skill completate rientra almeno una volta nel ciclo review `1-3-7-14`.
  - Conversione a piano `Pro` >= 4% dei `MAU` su piattaforme native.
  - `Scroll Integrity` 100% sulle route core senza doppio scroll verticale involontario.
  - `Viewport Compatibility` pass 100% dei test manuali su iPhone e Android per safe-area, keyboard e tab bar.

- **Definizione operativa KPI (strumentazione)**:
  - `D7 retention`:
    - Numeratore: utenti registrati con almeno 1 sessione nel giorno `T+7` (finestra 7d +/- 12h).
    - Denominatore: utenti registrati nel giorno `T`.
    - Sorgente eventi: tracciamento page/app open con identificazione utente autenticato.
  - `D30 retention`:
    - Numeratore: utenti registrati con almeno 1 sessione nel giorno `T+30` (finestra 30d +/- 24h).
    - Denominatore: utenti registrati nel giorno `T`.
    - Sorgente eventi: analytics prodotto + identificativo auth stabile.
  - Completamento onboarding:
    - Numeratore: utenti con `profiles.has_completed_onboarding=true` entro 24h dalla registrazione.
    - Denominatore: utenti che hanno creato account nel periodo.
  - Skill completion 14 giorni:
    - Numeratore: utenti attivi con almeno 1 skill portata a `mastered` entro 14 giorni dal primo accesso.
    - Denominatore: utenti attivi nello stesso periodo.
  - Review re-entry `1-3-7-14`:
    - Numeratore: skill completate con almeno 1 review successiva in coda review.
    - Denominatore: skill completate nel periodo.
  - Conversione Pro nativa:
    - Numeratore: utenti MAU con passaggio da free a pro confermato da entitlement backend.
    - Denominatore: MAU mobile iOS/Android.
  - Scroll Integrity:
    - Pass/fail per route core su checklist QA (nessuna area bianca extra, nessun doppio asse di scroll).
  - Viewport Compatibility:
    - Pass/fail su matrice device minima (iPhone moderno + Android moderno) con test su tastiera, safe-area e tab bar.

## 2. User Experience & Functionality

- **User Personas**:
  - Principiante finanziario: vuole spiegazioni semplici, percorsi guidati e azioni pratiche immediate.
  - Utente in crescita: vuole controllo operativo di spese, patrimonio e obiettivi con supporto decisionale.
  - Utente evoluto: vuole velocita, granularita e confronto tra scenari in pochi passaggi.
  - Nucleo condiviso (coppia/famiglia): vuole workspace comune con ruoli, inviti e separazione tra dati personali e condivisi.
  - Admin/editor: vuole creare e aggiornare contenuti Accademia/Esplora/Post senza dipendenze tecniche.

- **User Stories**:
  - `US-01` Come nuovo utente, voglio un onboarding guidato cosi da ottenere un percorso finanziario personalizzato.
  - `US-02` Come learner, voglio lezioni brevi e pratiche cosi da migliorare la mia alfabetizzazione finanziaria senza attrito.
  - `US-03` Come utente che traccia il denaro, voglio gestire patrimonio, spese, salvadanai e investimenti cosi da capire la mia situazione reale.
  - `US-04` Come utente collaborativo, voglio uno spazio condiviso cosi da gestire denaro condiviso con altre persone.
  - `US-05` Come utente che cerca guida, voglio un AI coach contestuale cosi da ricevere risposte azionabili.
  - `US-06` Come utente da ingaggiare nel tempo, voglio punti, badge, streak e report cosi da mantenere costanza.
  - `US-07` Come utente interessato ai mercati, voglio news e spiegazioni curate cosi da collegare teoria e attualita.
  - `US-08` Come admin, voglio gestire contenuti editoriali e didattici cosi da mantenere qualita e aggiornamento continui.
  - `US-09` Come utente pagante, voglio una esperienza Pro chiara cosi da capire cosa sblocco e ripristinare acquisti in modo affidabile.
  - `US-10` Come utente mobile, voglio schermate adattate al mio device cosi da non avere clipping o scroll artefatti.

- **Acceptance Criteria**:
  - Per `US-01`:
    - Registrazione email/password, callback auth e reset password funzionanti end-to-end.
    - Onboarding obbligatorio prima delle route protette.
    - Persistenza profilo base con `has_completed_onboarding=true` a fine flusso.
  - Per `US-02`:
    - Accesso Accademia con gate assessment iniziale.
    - Skill graph con stati `locked | available | mastered | fading`.
    - Runtime lezioni su nodi ordinati con progress stati utente `locked | available | completed | skipped`.
    - Eventi `advance`, `skip`, `submit_optional_quiz` idempotenti.
    - Tutor in-lesson con risposta streaming e fallback UX in caso errore.
  - Per `US-03`:
    - CRUD per patrimonio, investimenti, salvadanai, spese disponibile da UI.
    - Inserimento spese manuale e parsing linguaggio naturale.
    - Simulatore `what-if` disponibile per scenari obiettivo.
    - Vista categorie/periodo disponibile almeno per mese corrente.
  - Per `US-04`:
    - Creazione shared workspace da owner autenticato.
    - Invito membri via email con stato e scadenza tracciati.
    - Supporto entita condivise (patrimonio, investimenti, salvadanai, categorie, spese).
    - Limiti workspace applicati backend-side in coerenza con piano.
  - Per `US-05`:
    - Coach AI riceve contesto utente strutturato.
    - Risposte con markdown, tabelle, link interni e streaming.
    - Gestione errori `402`, `429`, `5xx` con UX leggibile.
    - Quote AI enforce backend-side in base al piano utente.
  - Per `US-06`:
    - Eventi punti giornalieri persistenti e cumulativi.
    - Badge/streak/challenge visibili in app.
    - Report settimanale generabile da funzione dedicata.
  - Per `US-07`:
    - Feed news con cache server-side da fonti economiche italiane.
    - Summary AI on-demand disponibile da articolo.
    - Sezione Esplora con ricerca, filtro e dettaglio articolo.
  - Per `US-08`:
    - CRUD admin per post, contenuti Esplora e contenuti Accademia.
    - Ruoli admin protetti da RLS/policy dedicate.
    - Storage immagini per post, Esplora e illustrazioni lezioni.
  - Per `US-09`:
    - Pagina `Profilo Pro` accessibile su client mobile.
    - Offerte RevenueCat caricate nativamente su iOS/Android.
    - Acquisto, restore e sync subscription funzionanti.
    - Entitlement sincronizzato con webhook/sync backend in `user_ai_plans`.
  - Per `US-10`:
    - Singolo asse di scroll verticale sulle route core.
    - Uso safe-area CSS e viewport dinamico su mobile.
    - Nessuna dipendenza da `100vh` statico sulle route core.
    - Nessuna area bianca extra scrollabile nelle schermate core.

- **Non-Goals**:
  - Trading execution o invio ordini a broker.
  - Consulenza finanziaria personalizzata regolamentata.
  - Open banking/sync bancaria automatica nel perimetro attuale.
  - Esperienza desktop-first avanzata.
  - Monetizzazione web completa con checkout browser nel perimetro attuale.
  - Supporto multilingua oltre all'italiano nel perimetro attuale.

## 3. AI System Requirements

- **Tool Requirements**:
  - Edge Functions Supabase richieste:
    - `chat`, `report`, `parse-spesa`.
    - `academy-assessment`, `academy-graph`, `academy-review-due`, `academy-skill-event`, `academy-lesson`, `academy-lesson-nodes`, `academy-generate-cache`.
    - `news-rss`, `news-generate-cache`, `news-summary`.
    - `post-generate`.
    - `ai-usage-admin` (supporto monitoraggio admin AI usage).
  - Gateway LLM via secret server-side (`AI_API_KEY` o `OPENAI_API_KEY`).
  - Enforcement quote/backend guardrails per piano utente e consumo AI.
  - Streaming SSE per coach e tutor contestuale.
  - Caching risposte/contenuti AI dove appropriato per controllo costi e latenza.

- **Evaluation Strategy**:
  - Coach AI:
    - P95 time-to-first-token < 4s su rete stabile.
    - 0 errori non gestiti lato UX su `402/429/5xx`.
    - Campione manuale minimo 50 conversazioni/settimana con >= 90% valutate utili e contestuali.
  - Parsing spese:
    - Accuratezza campi `importo`, `categoria`, `data` >= 90% su campione interno minimo 100 input realistici.
  - Runtime Accademia:
    - Allineamento contenuto nodo con stato utente >= 95% su regression suite backend.
    - Duplicazione eventi lesson-node = 0 a parita di `event_id`.
  - News summary:
    - Coerenza semantica con sorgente >= 90% su campione casuale 50 articoli/settimana.
    - P95 generazione summary on-demand < 4s.
  - Costo AI:
    - Budget mensile monitorato con alert superamento soglia (soglia operativa definita dal team in dashboard costi).

## 4. Technical Specifications

- **Architecture Overview**:
  - Frontend:
    - SPA React + TypeScript + Vite.
    - Routing con `react-router-dom`.
    - Stato server con `@tanstack/react-query`.
    - UI mobile-first con Tailwind + shadcn/ui.
    - Packaging nativo iOS/Android con Capacitor.
  - Backend:
    - Supabase Postgres come datastore primario.
    - Supabase Auth per identita e sessione.
    - Edge Functions Deno per AI, billing, collaboration, contenuti e automazioni.
  - Billing:
    - RevenueCat lato client nativo (offering, purchase, restore).
    - Webhook e sync backend (`billing-webhook-revenuecat`, `billing-sync`) con projection su `user_ai_plans`.
  - Layout contract mobile:
    - viewport dinamico con `dvh` e variabili `--safe-*`.
    - modello `outer-scroll` sulle route core.
    - tab bar integrata senza spacer artificiale.
    - uso limitato/controllato di `vh/screen`.

- **Integration Points**:
  - Dominio utente/finanza personale:
    - `profiles`, `patrimonio`, `salvadanai`, `investimenti`, `categorie_spese`, `spese`.
  - Dominio Accademia:
    - `academy_skills`, `academy_skill_edges`, `academy_lessons_cache`.
    - `academy_assessment_questions`, `user_assessment_runs`, `user_assessment_answers`.
    - `user_skill_mastery`, `user_skill_events`, `user_review_queue`.
    - `academy_lesson_nodes`, `user_lesson_node_progress`, `user_lesson_node_events`, `user_lesson_optional_quiz_runs`, `user_lesson_intro_views`.
  - Dominio contenuti:
    - `news_cache`, `explore_articles`, `admin_posts`, `post_likes`, `post_views`, `lesson_illustrations`.
  - Dominio billing:
    - `billing_subscriptions`, `billing_events`, `user_ai_plans`.
  - Dominio collaborazione:
    - `shared_workspaces`, `shared_workspace_members`, `shared_workspace_invites`.
    - `shared_patrimonio`, `shared_investimenti`, `shared_salvadanai`, `shared_categorie_spese`, `shared_spese`.
  - Storage:
    - Bucket immagini per `admin-posts`, `explore_articles`, `lesson-illustrations`.

- **Security & Privacy**:
  - RLS obbligatoria sulle tabelle business con policy per owner/member/admin secondo dominio.
  - Separazione privilegi admin tramite `user_roles` + policy dedicate.
  - Secret AI, service role key e webhook secret solo server-side.
  - CORS produzione senza wildcard; allowlist origin esplicita.
  - Billing events idempotenti (dedup provider event id) e gestione out-of-order.
  - GDPR operativo:
    - informativa privacy in app,
    - retention definita per dati sensibili e log,
    - cancellazione account funzionante end-to-end.

## 5. Risks & Roadmap

- **Phased Rollout**:
  - `Stato corrente (18 marzo 2026)`:
    - Auth + onboarding + dashboard core operativi.
    - Gestione patrimonio, investimenti, salvadanai, spese e simulatore operativi.
    - Coach AI, parsing spese, report AI, news cache/summary e sezione Esplora operativi.
    - Accademia con assessment, skill graph, review queue, lesson runtime a nodi e tutor in-lesson operativi.
    - Workspace condivisi con inviti email e membership rules operativi.
    - Pro nativo con RevenueCat + sync backend operativo.
    - Hardening layout mobile route core implementato.
  - `MVP stabilizzato (0-2 mesi)`:
    - Consolidare tracciamento KPI PRD in dashboard unica.
    - Copertura regressioni core con E2E su onboarding, patrimonio, Accademia, billing e workspace.
    - Validazione Android real-device su scenari billing full-cycle.
  - `v1.1 (2-4 mesi)`:
    - Rafforzare gating Pro feature/content oltre al solo stato subscription.
    - Push notifications end-to-end.
    - Migliorare explainability AI e quality monitoring continuo.
    - Reporting funnel premium con breakdown acquisition -> conversion -> retention.
  - `v2.0 (4-8 mesi)`:
    - Assistente proattivo su obiettivi/spese con suggerimenti predittivi.
    - Segmentazione avanzata percorsi educativi e coaching.
    - Import dati esterni opzionale (fase iniziale CSV strutturati).
    - Evoluzione workspace con regole permessi e insight avanzati.

- **Technical Risks**:
  - Variabilita costi AI su chat/tutoring/summary/contenuti.
  - Drift qualita modello su parsing spese e suggerimenti.
  - Fragilita feed RSS esterni e dipendenze da provider terzi.
  - Regressioni UI mobile (safe-area, keyboard, nested scroll) con nuove schermate.
  - Gap osservabilita su retention/funnel premium/completion Accademia se analytics non consolidato.
  - Crescita complessita dominio condiviso con rischio incoerenza tra dati personali e workspace.

- **Mitigazioni prioritarie**:
  - Budget guardrails AI + caching + fallback deterministici.
  - Test idempotenza eventi e regression suite su edge functions critiche.
  - Canary QA mobile su route core prima di release.
  - Alerting su mismatch entitlement billing e job di riconciliazione periodica.
