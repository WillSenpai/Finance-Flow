# RevenueCat JSON Metadata Workflow

Questo progetto usa il JSON metadata dell'Offering RevenueCat per controllare parte della UX paywall senza modifiche codice.

## Dove inserirlo in RevenueCat

1. Apri RevenueCat dashboard.
2. Vai su `Monetization -> Offerings`.
3. Seleziona l'offering corrente (quella usata in app).
4. Nella sezione metadata, incolla un JSON come `offering-metadata.example.json`.

## Chiavi supportate in app

- `paywall_title`: titolo opzionale nella sezione Profilo > Abbonamento Pro.
- `paywall_subtitle`: sottotitolo opzionale.
- `paywall_cta`: testo bottone principale paywall.
- `highlight_package_identifier`: package da ordinare in alto nella lista offerte.

Schema di riferimento: `docs/revenuecat/offering-metadata.schema.json`.

## Note operative

- Le chiavi non presenti vengono ignorate.
- `VITE_REVENUECAT_ENTITLEMENT_ID` continua a controllare l'entitlement richiesto da `presentPaywallIfNeeded`.
- Dopo modifica metadata in dashboard, riapri la schermata profilo o fornisci un refresh per rileggere le offerte.
