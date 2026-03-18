# Contributing Guide

## Source Structure Rules

- `src/pages`: solo componenti route-level (una pagina per file).
- `src/components/ui`: componenti UI riusabili e generici (senza logica di dominio).
- `src/components/<domain>`: componenti specifici di dominio/prodotto.
- `src/hooks`: hook riusabili tra più pagine/componenti.
- `src/lib`: utility, adapter, logica cross-cutting; evitare logica UI.
- `src/contexts`: provider di stato globale/app-level.
- `src/integrations/<provider>`: client e tipi per servizi esterni.

## Placement Quick Decisions

- Nuova pagina raggiungibile da URL: `src/pages`.
- Nuovo widget riusabile in più domini: `src/components/ui`.
- Nuovo widget legato a un dominio: `src/components/<domain>`.
- Nuova funzione helper pura: `src/lib`.
- Nuovo hook React: `src/hooks`.
- Nuovo contratto API esterno: `src/integrations`.

## Repository Hygiene

- Package manager ufficiale: `npm`.
- Non aggiungere lockfile alternativi.
- Non committare artefatti generati (`dist`, `node_modules`, derived/build outputs).
- Spostare report o dump tecnici in `docs/archive/` quando utili.
