# MCP Supabase Token Setup - Stato e prossimi passi

Data: 2026-03-05

## Cosa è stato fatto

1. Rimosso `SUPABASE_ACCESS_TOKEN` in chiaro dai dotfiles utente:
- `~/.zshrc`
- `~/.zshenv`

2. Creati backup dei file modificati:
- `~/.zshrc.bak-<timestamp>`
- `~/.zshenv.bak-<timestamp>`
- `~/.codex/config.toml.bak-<timestamp>`

3. Configurata gestione token persistente e fuori repo:
- creato `~/.codex/secrets/supabase.env`
- permessi impostati a `600`

4. Riconfigurato server MCP `supabase` in `~/.codex/config.toml` per leggere il token da:
- `~/.codex/secrets/supabase.env`

5. Aggiornato il token con il valore nuovo fornito dall'utente.

6. Verifica eseguita con Supabase CLI:
- comando: `supabase projects list`
- risultato: autenticazione OK, progetti visibili (incluso `Finance Flow`, ref `ilmodaqjpjuldwtkbeyd`).

## Problema risolto

- Setup token definitivo lato macchina locale (persistente, non in chiaro nel repository, caricamento centralizzato per MCP).

## Cosa manca da fare

1. Riavviare la sessione Codex/MCP.
- Motivo: il tool MCP in questa sessione era stato avviato prima dell'aggiornamento token e mantiene stato `Unauthorized`.

2. Dopo riavvio, rieseguire test MCP interno:
- `mcp__supabase__list_projects`
- atteso: risposta con elenco progetti senza errore `Unauthorized`.

3. Riprendere task applicativo richiesto:
- verificare/modificare il flusso di pubblicazione in modo che i contenuti desiderati finiscano nella sezione `Esplora`.

## Note sicurezza

- Il token non è stato scritto in file del repository.
- Il file segreti è locale (`~/.codex/secrets/supabase.env`) e con permessi restrittivi.
