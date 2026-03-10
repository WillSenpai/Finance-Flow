# Product Requirements Document (PRD) - My Money Compass

## 1. Executive Summary

- **Problem Statement**: Le persone trovano la finanza personale difficile, tecnica e distante dalla vita quotidiana, e quindi non sviluppano abitudini economiche sane e sostenibili. L'app deve rendere apprendimento finanziario e azione pratica semplici, guidati e motivanti.
- **Proposed Solution**: My Money Compass integra educazione finanziaria step-by-step, tracciamento patrimonio/spese, coaching AI contestuale e gamification in un'unica esperienza mobile-first. L'obiettivo e trasformare concetti complessi in micro-azioni quotidiane misurabili.
- **Success Criteria**:
  - `D30 retention` utenti registrati >= 30% entro 6 mesi dal lancio GA.
  - `D7 retention` >= 45% entro 3 mesi dal lancio GA.
  - Conversione a piano premium (quando attivo) >= 4% dei MAU entro 90 giorni dal lancio premium.
  - Completamento onboarding >= 80% degli utenti che iniziano la registrazione.
  - >= 60% degli utenti attivi completa almeno 1 skill Accademia nei primi 14 giorni.
  - >= 70% utenti nuovi completa assessment iniziale (12 domande) al primo accesso Accademia.
  - >= 50% skill completate entra almeno una volta nel ciclo review `1-3-7-14`.
  - `Layout UX`: 0 segnalazioni QA di "spazio vuoto scrollabile" nelle pagine core per 2 cicli consecutivi di test interni.
  - `Scroll Integrity`: 100% pagine core (`Dashboard`, `Patrimonio`, `Accademia`, `Coach`, `Profilo`, `Lezione`) senza doppio scroll verticale involontario.
  - `Viewport Compatibility`: pass 100% test manuali su iPhone e Android (portrait/landscape) per safe-area, tab bar e altezza contenuto.

## 2. User Experience & Functionality

- **User Personas**:
  - Principiante finanziario: vuole capire termini base (budget, inflazione, ETF) senza linguaggio tecnico.
  - Utente in crescita: ha gia iniziato a risparmiare e vuole pianificare obiettivi, spese e primi investimenti.
  - Utente avanzato/curioso: vuole strumenti rapidi (simulatore, analisi categorie, coaching) per ottimizzare decisioni.
  - Nota strategica: il target comunicato e "chiunque"; operativamente il prodotto deve personalizzare per livello (`beginner`, `intermediate`, `pro`) per mantenere rilevanza.

- **User Stories**:
  - `US-01` As a new user, I want a guided onboarding so that I can receive a personalized financial path.
  - `US-02` As a learner, I want short and practical lessons so that I can understand finance concepts quickly.
  - `US-03` As a budget-conscious user, I want to track expenses manually or in natural language so that I can monitor where my money goes.
  - `US-04` As a goal-oriented user, I want savings goals and "what-if" projections so that I can estimate when I will reach objectives.
  - `US-05` As an engaged user, I want an AI coach with my context so that I can get actionable answers and learning support.
  - `US-06` As a returning user, I want points, streaks, badges and challenges so that I stay motivated over time.
  - `US-07` As a content seeker, I want curated news and exploration content so that I connect theory with real-world finance.
  - `US-08` As an admin, I want to publish posts and exploration articles so that I can manage editorial quality and engagement.
  - `US-09` As a mobile user, I want each page to adapt to my device viewport so that I never see artificial empty scroll areas or clipped content.

- **Acceptance Criteria**:
  - Per `US-01`:
    - Account creation con email/password, raccolta profilo base (nome, telefono, data nascita).
    - Selezione obiettivi e livello esperienza obbligatoria prima dell'accesso completo.
    - Salvataggio profilo in `profiles` con flag `has_completed_onboarding=true`.
  - Per `US-02`:
    - Accesso Accademia gated da assessment iniziale obbligatorio (12 domande adattive).
    - Navigazione `graph-first` con stati skill `locked | available | mastered | fading`.
    - Lezione skill con runtime obbligatorio `Concept -> Widget -> Challenge -> Feedback`.
    - Specifica runtime "spiegazione per nodo":
      - Ogni lezione e composta da nodi ordinati con `node_key` e `sort_order` deterministico.
      - Stato nodo utente richiesto: `locked | available | completed | skipped`.
      - Regola di sblocco: il primo nodo e `available`; i successivi diventano `available` solo dopo `completed` o `skipped` del nodo precedente.
      - Regola di skip: permesso solo al piano `pro`; piano `free` bloccato con errore funzionale dedicato.
      - Regola di completamento lezione: `lesson_completed=true` quando tutti i nodi sono `completed` o `skipped`.
      - Ogni nodo contiene 4 blocchi didattici obbligatori in ordine fisso:
        - `focus`: principio centrale e contesto decisionale del nodo.
        - `explain`: spiegazione operativa breve con esempi pratici.
        - `question`: domanda guida di comprensione.
        - `exercise`: micro-azione immediata da applicare.
      - Il blocco `explain` include un micro-flusso interattivo multi-step (domanda -> opzioni -> follow-up) per guidare la comprensione attiva.
      - Ogni azione utente su nodo deve produrre evento idempotente tracciato (`advance`, `skip`, `optional_quiz`) con `event_id` univoco per utente.
      - La UI deve usare il runtime nodi come fonte di verita per ordine/stato e il contenuto lezione come fonte testuale; se contenuto mancante, usare fallback sicuro.
      - Il dominio deve supportare `node_key` dinamici oltre ai 4 nodi standard, mantenendo compatibilita backward con il flow base.
    - Progressione mastery per skill (`0-100`) e review queue con step `1-3-7-14`.
    - Chat tutor in-lesson disponibile con risposta in streaming.
  - Per `US-03`:
    - Inserimento spesa da form tradizionale (importo, categoria, ricorrenza, data, nota, tag).
    - Parsing linguaggio naturale disponibile e compilazione automatica campi.
    - Visualizzazione per mese e per categoria con totale mensile.
  - Per `US-04`:
    - Gestione categorie patrimonio, investimenti e salvadanai.
    - Simulatore con confronto scenario base vs extra risparmio mensile.
    - Output con stima mesi al target e data prevista raggiungimento.
  - Per `US-05`:
    - Coach AI riceve contesto utente (obiettivi, patrimonio, spese, badge, sfide).
    - Risposte con markdown, tabelle per analisi e link di navigazione interna.
    - Gestione errori 402/429 e fallback UX leggibile lato app.
  - Per `US-06`:
    - Sistema punti con attivita giornaliere (`daily_login`, `review_patrimonio`, `view_lesson`, `complete_lesson`).
    - Streak giornaliero e badge con avanzamento numerico.
    - Sfide settimanali generate deterministicamente e progress tracking.
  - Per `US-07`:
    - Feed notizie da sorgenti economiche italiane con cache server-side.
    - Summary AI on-demand per articolo e supporto immagine correlata.
    - Enciclopedia "Esplora" con ricerca e filtro per categoria.
  - Per `US-08`:
    - Area admin protetta via ruoli (`user_roles`).
    - CRUD post/comunicazioni con visibilita, pubblicazione e scheduling.
    - CRUD articoli Esplora con categoria, ordine, stato pubblicato.
  - Per `US-09`:
    - Il layout deve usare un solo asse di scroll verticale per schermata standard (modello `outer-scroll`) senza nested scroll involontari.
    - Le pagine con contenuto corto non devono mostrare area bianca extra scrollabile sotto il contenuto reale.
    - Le pagine con contenuto lungo devono rimanere scrollabili fino al fondo senza overlay della tab bar sul contenuto.
    - Le route core non devono usare vincoli `h-screen/min-h-screen/100vh` non contestualizzati.
    - In app nativa il contenuto deve occupare tutta la larghezza del device; su web desktop resta ammesso un frame centrato `max-width`.

- **Non-Goals**:
  - Trading execution, consulenza finanziaria personalizzata regolamentata o gestione ordini broker.
  - Raccomandazioni di investimento automatizzate vincolanti.
  - Copertura multi-lingua nel perimetro MVP (focus italiano).
  - Web desktop-first avanzato: priorita UX mobile.
  - Integrazione bancaria PSD2/Open Banking in MVP.

## 3. AI System Requirements (If Applicable)

- **Tool Requirements**:
  - Supabase Edge Functions:
    - `chat`: coach finanziario contestuale con output streaming.
    - `parse-spesa`: estrazione strutturata spese da testo naturale via tool-calling.
    - `academy-lesson`: tutor lezione + generazione spiegazioni lunghe.
    - `academy-assessment`: start/answer/complete assessment adattivo.
    - `academy-graph`: stato grafo skill utente + unlock deterministico.
    - `academy-skill-event`: scoring deterministico eventi runtime (concept/widget/challenge/review/feedback).
    - `academy-review-due`: inbox ripassi in scadenza.
    - `academy-generate-cache`: pre-generazione contenuti lezioni.
    - `news-generate-cache` e `news-summary`: pipeline notizie + riassunti.
    - `generate-lesson-illustrations`: immagini didattiche per lezioni.
  - Gateway AI configurabile tramite env (`AI_PROVIDER`, `AI_BASE_MODEL`, `AI_COMPLEX_MODEL`, `AI_IMAGE_MODEL`).
  - Storage Supabase per asset immagini admin e illustrazioni.

- **Evaluation Strategy**:
  - Accuratezza parser spese:
    - Metrica: % parse corretto su dataset di 300 frasi italiane reali.
    - Soglia: `importo` corretto >= 95%, `categoriaId` corretto >= 90%.
  - Qualita didattica lezioni AI:
    - Checklist automatica su lunghezza minima e sezioni obbligatorie.
    - Review umana mensile su campione 10% con score chiarezza >= 4/5.
  - Qualita coach AI:
    - Tasso risposte utili (thumb-up o equivalente) >= 80%.
    - Hallucination critical rate < 2% su audit manuale settimanale.
  - Qualita news summary:
    - Coerenza con contenuto sorgente su campione casuale 50 articoli/settimana >= 90%.
    - Tempo risposta summary on-demand P95 < 4.0s.

## 4. Technical Specifications

- **Architecture Overview**:
  - Frontend:
    - SPA React + TypeScript + Vite.
    - Routing con `react-router-dom`; stato server con `@tanstack/react-query`.
    - UI mobile-first con Tailwind + shadcn/ui + framer-motion.
    - Packaging mobile tramite Capacitor (iOS/Android).
    - Contratto layout responsive:
      - viewport dinamico (`--app-height` con supporto `dvh`) e variabili safe-area CSS (`--safe-top/right/bottom/left`);
      - contenitore root app con scroll verticale unico;
      - tab bar nel flow del layout (no spazio riservato artificiale quando non necessario);
      - standardizzazione `h-full/min-h-full` per le route core, evitando hardcode `vh`.
  - Backend/Data:
    - Supabase Postgres come datastore primario.
    - Auth email/password Supabase.
    - Edge Functions Deno per logica AI e automazioni contenuto.
  - Data flow principale:
    - Utente autenticato -> fetch profilo e dataset personali (`profiles`, `patrimonio`, `spese`, ecc.) -> rendering dashboard.
    - Eventi utente (aggiunta spesa, update investimenti, progress skill) -> persistenza su Supabase.
    - Richieste AI (coach/parsing/news/lesson) -> Edge Function -> AI Gateway -> risposta streaming/non-streaming -> aggiornamento UI.
    - Runtime lezione per nodo:
      - `LezioneDetail` richiede snapshot nodi utente (`action=get`) alla Edge Function di runtime.
      - Il backend legge i nodi attivi della lezione, crea eventuali righe progresso mancanti e ricalcola disponibilita nodo per nodo.
      - La UI abilita azioni solo su stati validi (`advance` su `available`; `skip` su nodi non `locked` e solo piano `pro`).
      - Su `advance|skip|submit_optional_quiz`, il backend aggiorna stato, registra evento e restituisce snapshot coerente aggiornato.
      - A lezione completata, il client sincronizza completion legacy per retrocompatibilita con punti/storico esistente.

- **Integration Points**:
  - Database tabelle core: `profiles`, `patrimonio`, `salvadanai`, `investimenti`, `categorie_spese`, `spese`, `academy_lessons_cache`, `lesson_illustrations`, `news_cache`, `admin_posts`, `explore_articles`, `post_likes`, `post_views`, `user_roles`.
  - Nuovo dominio Accademia skill-graph: `academy_skills`, `academy_skill_edges`, `academy_assessment_questions`, `user_assessment_runs`, `user_assessment_answers`, `user_skill_mastery`, `user_skill_events`, `user_review_queue`.
  - Dominio runtime lezione per nodo:
    - `academy_lesson_nodes`: configurazione nodi per lezione (`node_key`, titolo, descrizione, `sort_order`, `is_active`).
    - `user_lesson_node_progress`: stato nodo per utente (`locked|available|completed|skipped`) con timestamp di `completed_at` e `skipped_at`.
    - `user_lesson_node_events`: log eventi idempotenti (`advance`, `skip`, `optional_quiz`) con `event_id` univoco e payload.
    - `user_lesson_optional_quiz_runs`: storico quiz opzionale associato a lezione utente.
    - Edge Function `academy-lesson-nodes`: endpoint runtime per azioni `get`, `advance`, `skip`, `submit_optional_quiz`.
  - Auth: Supabase Auth + trigger `handle_new_user()` per bootstrap profilo.
  - Storage: bucket `admin-posts-images`, `lesson-illustrations`.
  - External data: feed RSS economici italiani (ANSA, Il Sole 24 Ore, Milano Finanza, ecc.).
  - UI Layout System:
    - `src/index.css`: variabili viewport/safe-area e baseline di rendering root.
    - `src/components/layout/MobileLayout.tsx`: shell principale per scroll model, tab bar e comportamento responsive nativo/web.
    - Pagine core (`Dashboard`, `Coach`, `LezioneDetail`, `ProfiloPro`) allineate al contratto layout senza dipendenze `100vh` statiche.

- **Security & Privacy**:
  - RLS attiva sulle tabelle principali; accesso utente limitato a record propri (`user_id = auth.uid()`) dove applicabile.
  - Ruoli admin tramite `user_roles` e funzione `has_role` per policy privileged.
  - Secret AI e service role gestiti server-side via Supabase secrets.
  - PII trattata: nome, email, telefono, data nascita; requisito GDPR: informativa privacy esplicita e policy retention dati.
  - Requirement tecnico: eliminare wildcard CORS in produzione e restringere origin consentiti.

## 5. Stato Implementazione (Aggiornato al 10 marzo 2026)

- **Implementato**
  - Autenticazione e onboarding:
    - Login/signup email-password, reset password e callback auth.
    - Blocco routing fino a completamento onboarding (`has_completed_onboarding`).
    - Profilo utente bootstrap automatico via trigger `handle_new_user()`.
  - Gestione finanza personale core:
    - Pagine e flussi per patrimonio, salvadanai, investimenti e spese.
    - CRUD spese con campi estesi (ricorrenza, note, tag/badge).
    - Parsing spese in linguaggio naturale (`parse-spesa`) integrato in UI.
    - Simulatore what-if disponibile nel flusso patrimonio.
  - Accademia:
    - Catalogo lezioni da cache (`academy_lessons_cache`) e pagina dettaglio.
    - Tutor in-lesson via Edge Function `academy-lesson` (anche streaming).
    - Pipeline immagini lezioni (`lesson_illustrations`, `generate-lesson-illustrations`).
    - Area admin Accademia con policy write dedicate.
    - Skill Graph V1 implementato lato codice:
      - assessment obbligatorio (`academy-assessment`),
      - endpoint stato grafo (`academy-graph`),
      - scoring eventi deterministico (`academy-skill-event`),
      - queue review (`academy-review-due`),
      - nuove migration tabelle/RLS per mastery e unlock.
  - Coach AI:
    - Chat contestuale con storico persistente (`coach_conversations`, `coach_messages`).
    - Suggerimenti automatici follow-up.
    - Retention dati conversazioni con cleanup schedulato a 30 giorni (`pg_cron`).
  - Contenuti e discovery:
    - News cache (`news-generate-cache`, `news-rss`) e summary on-demand (`news-summary`).
    - Sezione Esplora con dettaglio articolo.
    - Admin Esplora con CRUD e storage immagini (`explore-articles-images` bucket).
    - Comunicazioni/post admin con likes e unique views (`admin_posts`, `post_likes`, `post_views`).
    - Funzione AI `post-generate` per supportare generazione contenuti admin.
  - Engagement:
    - Sistema punti/streak/badge/challenge in app (`PointsContext`).
    - Pagina Giochi con quiz finanziario e sfide settimanali.
    - Notifiche in-app contestuali.
  - Account & feedback:
    - Cancellazione account (`delete-account` function).
    - Raccolta suggerimenti utenti (`user_suggestions`) da pagina profilo dedicata.
  - Mobile:
    - Integrazione Capacitor iOS presente e funzionante nel progetto (`ios/`).
    - Hardening responsive/layout completato sulle schermate core:
      - introdotto contratto viewport dinamico + safe-area (`--app-height`, `--safe-*`);
      - standardizzato modello `outer-scroll` nel layout mobile;
      - eliminati principali vincoli statici `vh/screen` nelle route core;
      - ridotto il rischio di spazio vuoto scrollabile e conflitti tab bar/contenuto.

- **Parzialmente implementato / da completare**
  - Android: dipendenze Capacitor Android presenti e progetto `android/` nel repository; rimangono da validare test real-device completi.
  - Premium: supporto editoriale a visibilita premium nei contenuti, ma non esiste ancora pipeline completa entitlement/billing lato utente.
  - Notifiche: presenti notifiche in-app, non risulta ancora un sistema push end-to-end.
  - Telemetria prodotto: non e ancora formalizzato un layer analytics completo per monitorare KPI PRD (D7/D30, funnel onboarding, conversion premium, unlock velocity review).
  - QA automatizzata viewport/scroll: non ancora presente una suite E2E cross-device dedicata a regressioni layout (safe-area, keyboard, nested scroll).
  - Distribuzione beta: processo documentato (TestFlight + Play Closed Testing), ma non ancora automatizzato in CI/CD.

- **Non implementato (in perimetro roadmap)**
  - Monetizzazione premium end-to-end (paywall + gestione abbonamenti).
  - Assistente proattivo predittivo su obiettivi/spese.
  - Integrazioni esterne (import CSV avanzato / open banking).
  - Regression suite visuale automatizzata per validare viewport/safe-area su device matrix.

- **Readiness operativa (dev & release)**
  - Requisito runtime aggiornato:
    - Node.js `>= 22.0.0` (raccomandato `22.22.0`) per compatibilita con Capacitor 8.
    - npm `>= 10`.
  - File di allineamento ambiente presenti:
    - `.nvmrc`
    - `.node-version`
    - `package.json` con `engines`.
  - Distribuzione beta documentata per il team:
    - iOS: workflow Xcode Archive -> App Store Connect -> TestFlight (internal/external testers).
    - Android: workflow Android Studio signed `.aab` -> Play Console Closed Testing.

## 6. Risks & Roadmap

- **Phased Rollout**:
  - `MVP (0-3 mesi)`:
    - Onboarding personalizzato, patrimonio/spese/salvadanai, Accademia skill-graph V1, coach AI, gamification base.
    - Dashboard con news cache e comunicazioni admin.
    - Event instrumentation per funnel onboarding-retention.
    - Responsive hardening (scroll model + safe-area + viewport dinamico) completato sulle pagine core.
  - `v1.1 (3-6 mesi)`:
    - Premium monetization end-to-end (paywall, entitlement, gating contenuti).
    - Notifiche intelligenti piu granulari e challenge dinamiche basate comportamento.
    - Miglioramento explainability AI (citazioni sintetiche, confidenza output).
    - Introduzione test E2E automatizzati per regressioni viewport/scroll su iOS e Android.
  - `v2.0 (6-12 mesi)`:
    - Personal finance assistant proattivo (obiettivi adattivi, alert predittivi spesa).
    - Segmentazione avanzata utenti e learning path dinamico.
    - Integrazioni esterne opzionali (es. import CSV conto, successivamente open banking).
    - Quality gate pre-release su UI responsiveness (blocco release in caso di regressioni scroll core).

- **Technical Risks**:
  - Rischio costi AI variabili con crescita usage chat/news/lesson generation.
  - Rischio quality drift dei modelli su parser e consigli finanziari.
  - Rischio dipendenza feed RSS (downstream outage, cambi formato XML).
  - Rischio performance su approccio "delete + reinsert" per update massivi dataset utente (scalabilita).
  - Rischio conversion premium: nel codice attuale esiste campo `visibility=premium`, ma manca pipeline completa di entitlement/billing lato utente.
  - Rischio regressioni UI: nuovi componenti potrebbero reintrodurre nested scroll o vincoli `vh` statici fuori standard.
  - Rischio incoerenza iOS/Android su combinazione tab bar + keyboard + safe-area senza copertura test automatizzata.

- **Punti Forti da valorizzare (USP)**:
  - Esperienza "learn + do" nativa: formazione e azione finanziaria convivono nello stesso flusso.
  - AI contestuale realmente personalizzata su dati utente, non chatbot generico.
  - Forte meccanica di engagement (streak, badge, sfide, quiz) orientata a retention.
  - Ecosistema contenuti ibrido: didattica strutturata + notizie + enciclopedia + comunicazioni editoriali.
  - Architettura moderna e veloce da iterare (React + Supabase + Edge Functions), gia pronta per roadmap premium.
