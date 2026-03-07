# FinanceFlow Style Guide

## 1) Obiettivo
Questo documento definisce lo stile **normativo** dell'app FinanceFlow.  
Si applica a UI, copy, interazioni e metodo di implementazione.

Obiettivi:
- mantenere coerenza visiva e comportamentale;
- ridurre regressioni UX tra pagine;
- dare un riferimento unico per sviluppo e review.

---

## 2) Fondamenti di Design

Direzione generale:
- Mobile-first, leggibilità alta, densità media.
- Look warm-neutral (finanza accessibile, non “fredda”).
- Componenti a card, bordi morbidi, contrasto moderato.
- Feedback immediato su azioni utente (tap, progressi, stati).

Principi:
- `Clarity first`: gerarchie semplici, CTA riconoscibili.
- `Consistency`: stessi pattern in tutte le sezioni.
- `Semantic colors`: usare token semantici, non colori hardcoded.
- `Progressive disclosure`: dettaglio dove serve, non ovunque.

---

## 3) Design Tokens (Obbligatori)

Fonte: `src/index.css` + mapping in `tailwind.config.ts`.

### 3.1 Light Theme (`:root`)
- `--background: 45 42% 94%`
- `--foreground: 36 30% 18%`
- `--card: 45 40% 97%`
- `--card-foreground: 36 30% 18%`
- `--popover: 45 40% 97%`
- `--popover-foreground: 36 30% 18%`
- `--primary: 36 27% 43%`
- `--primary-foreground: 45 40% 97%`
- `--secondary: 101 10% 54%`
- `--secondary-foreground: 45 40% 97%`
- `--muted: 39 39% 88%`
- `--muted-foreground: 36 18% 45%`
- `--accent: 101 10% 88%`
- `--accent-foreground: 101 10% 34%`
- `--destructive: 0 84% 60%`
- `--destructive-foreground: 0 0% 100%`
- `--border: 39 30% 78%`
- `--input: 39 30% 78%`
- `--ring: 36 27% 43%`
- `--radius: 1rem`

### 3.2 Dark Theme (`.dark`)
- `--background: 36 20% 8%`
- `--foreground: 39 30% 88%`
- `--card: 36 20% 12%`
- `--card-foreground: 39 30% 88%`
- `--popover: 36 20% 12%`
- `--popover-foreground: 39 30% 88%`
- `--primary: 36 27% 50%`
- `--primary-foreground: 36 20% 8%`
- `--secondary: 101 10% 30%`
- `--secondary-foreground: 39 30% 88%`
- `--muted: 36 15% 18%`
- `--muted-foreground: 39 20% 55%`
- `--accent: 101 10% 18%`
- `--accent-foreground: 101 10% 65%`
- `--destructive: 0 62% 30%`
- `--destructive-foreground: 39 30% 88%`
- `--border: 36 15% 22%`
- `--input: 36 15% 22%`
- `--ring: 36 27% 50%`

### 3.3 Regole d'Uso Colori
- Usare `bg-background` per sfondo pagina.
- Usare `bg-card border border-border/50` per contenitori standard.
- Usare `text-muted-foreground` per testo secondario.
- Usare `text-primary` e `bg-primary/10` per enfasi positiva.
- Usare `destructive` solo per errore/rischio/alert.
- Vietato introdurre nuove palette senza aggiornare i token.

---

## 4) Tipografia

Font stack globale:
- `-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', system-ui, sans-serif`

Regole:
- Titolo pagina: `text-lg` o `text-2xl`, `font-semibold`.
- Titolo sezione: `text-base` o `text-sm`, `font-semibold`.
- Corpo principale: `text-sm`.
- Metadati/caption: `text-xs` o `text-[11px]`.
- Tag/label secondarie: `text-[10px]` uppercase con tracking leggero.

---

## 5) Struttura App e Layout

Shell mobile (`src/components/layout/MobileLayout.tsx`):
- canvas centrato con `max-w-[430px]`;
- `min-h-screen` e overflow interno controllato;
- tab bar fissa in basso su pagine abilitate;
- rispetto safe areas con `env(safe-area-inset-*)`.

Pattern spacing ricorrenti:
- wrapper pagina: `px-5 pt-14 pb-4`;
- sezione: `mb-6`;
- lista card: `space-y-2.5` / `space-y-3`;
- card principale: `rounded-2xl p-4` o `p-5`.

Navigazione:
- 5 tab principali: Home, Patrimonio, Accademia, AI Coach, Profilo.
- Le pagine “detail/settings” usano back button `Indietro`.

---

## 6) Component Language

### 6.1 Card
Pattern default:
- `bg-card border border-border/50 rounded-2xl`
- Stato active/tap: `whileTap` con lieve scale down.

### 6.2 Bottoni
- CTA primaria: sfondo `primary`, testo `primary-foreground`.
- Azioni secondarie: `ghost` o `bg-muted`.
- Azioni distruttive: `destructive` + copy esplicita.

### 6.3 Badge/Indicatori
- Badge stato admin/success/warning con colore semantico.
- Badge notifiche numeriche in posizione `absolute`, piccolo e leggibile.

### 6.4 Progress
- Valore sempre in range `0..100`.
- Valori non validi (`NaN`, `Infinity`) da normalizzare a `0`.
- Per casi edge (`target <= 0`) definire fallback esplicito nel dominio.

### 6.5 Empty/Loading/Error
- Empty state con icona + messaggio breve.
- Loading con spinner o skeleton.
- Error state con tono chiaro e azione successiva.

---

## 7) Motion & Interaction

Libreria: `framer-motion`.

Regole:
- Page enter: fade/scale leggera (es. `opacity + scale`).
- Liste: usare `staggerChildren` su container.
- Tap feedback: `whileTap` (`scale` ~ 0.85-0.98 in base al componente).
- Evitare animazioni lunghe o decorative non funzionali.
- Le animazioni devono aiutare gerarchia, non distrarre.

---

## 8) Tone of Voice (Italiano App)

Tono richiesto:
- educativo, pratico, rassicurante;
- mai aggressivo o giudicante;
- orientato ad azione chiara.

Linee guida copy:
- Frasi brevi, lessico semplice.
- Usare termini familiari all’utente (es. “stelline”, “sfide”, “patrimonio”).
- CTA dirette: “Segna come letto”, “Indietro”, “Gioca ancora”.
- Nei messaggi di warning: indicare problema + passo successivo.

Do:
- “Ogni settimana nuove sfide per migliorare le tue abitudini finanziarie.”

Don't:
- linguaggio tecnico non spiegato;
- messaggi ambigui senza call-to-action.

---

## 9) Metodologia di Implementazione

Quando aggiungi una nuova schermata:
1. Definisci semantica UI (primary/secondary/muted/destructive).
2. Usa primitive `src/components/ui/*` prima di creare varianti custom.
3. Applica layout standard (`px-5 pt-14 pb-4`, card rounded-2xl).
4. Aggiungi stati completi: loading, empty, error, success.
5. Verifica dark mode e safe area.
6. Controlla coerenza tone of voice.

Regole tecniche:
- Evitare hardcode di colori/spacing già coperti da token.
- Preferire composizione di classi utility già in uso.
- Gestire edge case numerici (progressi, percentuali, contatori).

---

## 10) Checklist PR/Review (Obbligatoria)

### Visual
- [ ] Usa token semantici (`primary`, `muted`, `destructive`, ecc.).
- [ ] Nessun colore fuori palette senza motivo documentato.
- [ ] Border radius coerente (`rounded-2xl` o token derivati).

### Layout
- [ ] Griglia/spacing allineati ai pattern app.
- [ ] Safe area rispettata su mobile.
- [ ] Tab bar/back navigation coerenti con il contesto.

### Componenti e stati
- [ ] Stati `loading/empty/error/success` presenti.
- [ ] Progress e percentuali robusti (no `NaN`/`Infinity`).
- [ ] Focus/tap feedback presente sulle azioni principali.

### Copy
- [ ] Italiano coerente con tono FinanceFlow.
- [ ] Microcopy breve e orientata all’azione.
- [ ] Messaggi di errore comprensibili e utili.

### Accessibilità minima
- [ ] Contrasto testo/sfondo adeguato.
- [ ] Dimensioni tap target adeguate su mobile.
- [ ] Indicazione visibile di stato attivo/selezionato.

---

## 11) Mapping Rapido Token -> Utility
- `--background` -> `bg-background`
- `--foreground` -> `text-foreground`
- `--card` -> `bg-card`
- `--border` -> `border-border`
- `--primary` -> `bg-primary`, `text-primary`
- `--muted` -> `bg-muted`, `text-muted-foreground`
- `--accent` -> `bg-accent`, `text-accent-foreground`
- `--destructive` -> `bg-destructive`, `text-destructive-foreground`
- `--ring` -> `ring-ring`

---

## 12) Governance del Documento
- Questo file è la fonte normativa primaria dello stile.
- Ogni modifica a token, pattern UI o tono deve aggiornare questo file.
- In caso di conflitto tra nuova UI e guida: aggiornare guida + motivazione in PR.
