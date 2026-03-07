# Setup Email Auth - Finance Flow

Questo documento copre la parte email auth (conferma account, reset password, magic link, inviti, cambio email) per Finance Flow.

## 1) File template nel repo

Template HTML pronti:

- `supabase/templates/auth/confirmation.html`
- `supabase/templates/auth/recovery.html`
- `supabase/templates/auth/magic_link.html`
- `supabase/templates/auth/invite.html`
- `supabase/templates/auth/email_change.html`

Configurazione locale/CLI:

- `supabase/config.toml` con sezioni `auth.email.template.*`

## 2) Redirect sicuri nel frontend

Aggiornato il flusso auth:

- reset password ora punta a `.../auth/callback?next=/reset-password`
- nuova pagina callback: `src/pages/AuthCallback.tsx`
- onboarding signup email redirect: `.../auth/callback`

Questo evita problemi comuni su token/code e riduce errori di redirect.

## 3) Applicazione su Supabase hosted

### URL Configuration

In Supabase Dashboard:

1. `Authentication` -> `URL Configuration`
2. Imposta `Site URL` (produzione)
3. Inserisci tutte le `Redirect URLs` necessarie, inclusi:
   - `https://<tuo-dominio>/auth/callback`
   - `https://<tuo-dominio>/reset-password`
   - eventuali deep-link mobile (es. `my-money-compass://auth/callback`)

### Email Templates

In Supabase Dashboard:

1. `Authentication` -> `Email Templates`
2. Per ogni template (`Confirm signup`, `Reset password`, `Magic Link`, `Invite user`, `Change email`) copia il rispettivo HTML dal repo
3. Imposta il subject coerente con quelli in `supabase/config.toml`
4. Salva e invia una email di test

## 4) Note operative

- I template usano variabili Go template supportate da Supabase (es. `{{ .ConfirmationURL }}`, `{{ .NewEmail }}`).
- Evitare JS/CSS esterni nelle email: mantenere stili inline per compatibilita client.
- Per sicurezza, mantenere redirect solo verso origini controllate (allowlist).

