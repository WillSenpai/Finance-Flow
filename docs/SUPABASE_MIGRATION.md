# Migrazione a un Nuovo Progetto Supabase

## 1) Prerequisiti

Installa la CLI Supabase (una volta sola):

```bash
brew install supabase/tap/supabase
```

Login CLI:

```bash
supabase login
```

## 2) Crea e collega il nuovo progetto

1. Crea il progetto da dashboard Supabase.
2. Recupera il `project-ref` (es. `abcd1234wxyz`).
3. Dal root del repo:

```bash
supabase link --project-ref <NUOVO_PROJECT_REF>
```

Questo aggiorna `supabase/config.toml` con il nuovo `project_id`.

## 3) Migra schema database

```bash
supabase db push
```

## 4) Deploy Edge Functions

```bash
supabase functions deploy chat
supabase functions deploy parse-spesa
supabase functions deploy report
supabase functions deploy news-summary
supabase functions deploy academy-lesson
supabase functions deploy news-rss
supabase functions deploy news-generate-cache
supabase functions deploy academy-generate-cache
supabase functions deploy generate-lesson-illustrations
```

## 5) Imposta i secrets server-side

```bash
supabase secrets set \
  AI_API_KEY=... \
  AI_PROVIDER=gemini \
  AI_BASE_MODEL=gemini-2.5-flash-lite \
  AI_COMPLEX_MODEL=gemini-2.5-pro \
  AI_IMAGE_MODEL=gemini-2.5-flash-image \
  AI_ILLUSTRATION_MODEL=gemini-2.5-flash-image \
  AI_TIMEOUT_MS=45000
```

Se richiesto da alcune function nel tuo deploy:

```bash
supabase secrets set SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=...
```

## 6) Aggiorna frontend `.env` locale

```bash
VITE_SUPABASE_URL=https://<NUOVO_PROJECT_REF>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<NUOVA_ANON_KEY>
```

## 7) Verifica rapida

1. Login utente.
2. Chat coach (`/coach`).
3. News summary in dashboard.
4. Lezione accademia + chat lezione.
5. Inserimento spesa in linguaggio naturale.
