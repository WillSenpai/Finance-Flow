# Prompt Master — Ricerca Internet/AI per Lezioni Accademia

Usa questo prompt su ChatGPT/Claude/Gemini quando devi fare ricerca per creare o aggiornare lezioni dell'Accademia FinanceFlow.

## 1) Prompt Master (copia/incolla)

```text
Agisci come Research Lead + Instructional Designer per un'app mobile di educazione finanziaria chiamata "Finance Flow".

OBIETTIVO
Devi fare ricerca su internet e proporre contenuti didattici affidabili, pratici e adatti all'Accademia in-app.
La lezione deve essere allineata ai requisiti PRD:
- target livelli: beginner, intermediate, pro
- formato nodo didattico obbligatorio: Focus -> Explain -> Question -> Exercise
- stile: italiano semplice, pratico, non giudicante, orientato all'azione
- output utile per runtime lezione e UX mobile-first

CONTESTO PRODOTTO (vincolante)
- App: finanza personale accessibile, non consulenza finanziaria personalizzata.
- Utente finale: persone comuni che vogliono capire e applicare subito.
- Non-goals: trading execution, promesse di rendimento, consigli vincolanti su strumenti specifici.
- Lezione efficace = concetto chiaro + micro-azione immediata + domanda guida.

ARGOMENTO LEZIONE
[INSERISCI QUI TEMA PRINCIPALE]

LIVELLO TARGET
[beginner | intermediate | pro]

VINCOLI DIDATTICI
1. Linguaggio in italiano B1/B2 (niente gergo non spiegato).
2. Ogni affermazione chiave deve avere almeno 1 fonte affidabile.
3. Privilegia fonti istituzionali o primarie (es. Banca d'Italia, CONSOB, IVASS, MEF, BCE, ISTAT, OECD, ESMA, Commissione Europea) e solo in seconda battuta fonti editoriali autorevoli.
4. Indica data di aggiornamento della fonte e segnala eventuale rischio obsolescenza.
5. Evidenzia ciò che è “dato/fatto” vs “interpretazione pratica”.

TASK DI RICERCA
A) Ricerca web strutturata
- Trova 8-12 fonti rilevanti e recenti.
- Raggruppa le fonti per: definizioni base, rischi/errori comuni, best practice operative, casi reali.
- Scarta fonti promozionali o con conflitti di interesse non dichiarati.

B) Sintesi didattica
- Estrai i 5-7 insight più utili per utenti reali.
- Per ogni insight: "Cosa significa", "Perché conta", "Come applicarlo in pratica".
- Includi errori frequenti e anti-pattern da evitare.

C) Proposta contenuto lezione (formato Accademia)
- Genera 4 nodi in ordine logico progressivo.
- Per ogni nodo crea i blocchi:
  - focus (1-2 frasi)
  - explain (3-6 frasi, con esempio semplice)
  - question (1 domanda guida)
  - exercise (1 micro-azione concreta in <=15 minuti)
- Dove utile, aggiungi 2-3 opzioni di explainFlow (domanda + opzioni + follow-up) per interazione.

D) QA didattico
- Verifica finale con checklist:
  - chiarezza (si/no + nota)
  - accuratezza (si/no + fonte)
  - applicabilità pratica (si/no + motivo)
  - neutralità/compliance (si/no + motivo)
- Se un punto non passa, riscrivi il blocco interessato.

FORMATO OUTPUT (OBBLIGATORIO)
Restituisci in questa struttura:

1) Executive Brief (max 12 righe)
2) Mappa fonti (tabella: Fonte | Tipo | Data | Affidabilità 1-5 | Note)
3) Insight operativi (5-7)
4) Struttura lezione proposta
   - Nodo 1 ... Nodo 4
   - per ciascuno: focus/explain/question/exercise (+ eventuale explainFlow)
5) Rischi di fraintendimento e mitigazioni
6) Gap di ricerca residui (cosa manca ancora)
7) Citazioni finali complete con URL

REGOLE STILE OUTPUT
- Scrivi in italiano chiaro.
- Evita wall of text: paragrafi brevi e punti elenco.
- Non inventare dati o normative.
- Se una fonte non è verificabile, dichiaralo esplicitamente.
```

## 2) Variante Rapida — Nuovo Argomento

```text
Usa il Prompt Master sopra.
Tema: [INSERISCI TEMA]
Livello: [beginner/intermediate/pro]
Obiettivo pratico utente: [INSERISCI OBIETTIVO]
Vincolo: proponi una lezione con 4 nodi e 1 micro-azione per nodo.
```

## 3) Variante Rapida — Aggiornamento Lezione Esistente

```text
Usa il Prompt Master sopra.
Tema: [TEMA LEZIONE]
Livello: [beginner/intermediate/pro]
Contenuto attuale da revisionare:
[INCOLLA QUI LEZIONE ATTUALE]
Task: mantieni struttura, correggi solo accuratezza, esempi obsoleti e chiarezza.
Output: diff concettuale (prima/dopo) + versione finale aggiornata.
```

## 4) Variante Rapida — Audit Qualità Pre-Pubblicazione

```text
Agisci come reviewer didattico.
Valuta questa lezione rispetto al Prompt Master e al PRD:
[INCOLLA LEZIONE]

Restituisci:
1) Score 0-100 per: accuratezza, chiarezza, utilità pratica, compliance
2) 5 criticità ordinate per severità
3) correzione proposta pronta da incollare (solo blocchi da cambiare)
4) checklist pass/fail finale
```

## 5) Criteri Interni di Accettazione (FinanceFlow)

Una proposta è pronta per entrare in implementazione solo se:
- almeno 8 fonti affidabili con URL e data;
- nessuna affermazione critica senza fonte;
- 4 nodi completi (focus/explain/question/exercise);
- almeno 1 micro-azione concreta per nodo;
- tono coerente FinanceFlow (semplice, pratico, non giudicante);
- nessun suggerimento che sembri consulenza personalizzata vincolante.
