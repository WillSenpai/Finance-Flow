# Guida: Come aggiungere blocchi alle lezioni

## Struttura di una lezione

Ogni lezione ha **5 nodi** (sezioni):

| Nodo | Scopo |
|------|-------|
| `concept` | Teoria e concetti base |
| `widget` | Applicazione pratica |
| `challenge` | Scenario difficile/stress test |
| `quiz` | Domande di verifica finale |
| `feedback` | Chiusura e prossimi passi |

Ogni nodo contiene un array `blocks` con i contenuti da mostrare.

---

## Tipi di blocco disponibili

| `kind` | Quando usarlo | Richiede `pollAreas`? |
|--------|---------------|----------------------|
| `"focus"` | Introduzione, concetto principale | No |
| `"explain"` | Spiegazione, approfondimento | No |
| `"question"` | Domanda con opzioni multiple | **Sì** |

---

## Passo 1: Crea la funzione con il testo

Ogni blocco di testo è generato da una funzione che riceve `seed` (i dati della lezione).

```typescript
function nomeFunzione(seed: LessonSeed): string {
  return `Il tuo testo qui.

Puoi usare:
- ${seed.id} → ID della lezione (es. "1", "2", "3")
- ${seed.title} → Titolo (es. "Cos'è la finanza personale")
- ${seed.section} → Sezione (es. "fondamenta", "investire")
- ${seed.focus} → Focus della lezione

Supporta **markdown** per grassetto, *corsivo*, ecc.`;
}
```

### Esempio reale dal codice:

```typescript
function conceptText(seed: LessonSeed): string {
  return `In questa lezione su "${seed.title}", i punti centrali sono ${seed.focus}.💡

Non partiremo dalla ricerca del guadagno veloce, ma piuttosto dal capire come ridurre la % di errori commessi da noi stessi😁.`;
}

function conceptText2(seed: LessonSeed): string {
  return `Un investitore disciplinato prende decisioni prima che le emozioni entrino in gioco, definendo criteri chiari e verificabili📌.

Questo succede perché le sue scelte economiche e finanziarie nascono da processi semplici, comprensibili e soprattutto **ripetibili**.

Il discorso, quindi, ci porta a capire che la finanza personale non è altro che una questione di metodo e disciplina, dove tu sei artefice e padrone delle tue scelte sulla gestione dei TUOI soldi🎯.`;
}
```

---

## Passo 2: Decidi in quale nodo inserirlo

Usa una condizione basata su `nodeKey`:

```typescript
// Solo nel nodo concept
if (nodeKey === "concept") { ... }

// Solo nel nodo widget
if (nodeKey === "widget") { ... }

// Solo nel nodo challenge
if (nodeKey === "challenge") { ... }

// In più nodi (concept E widget)
if (nodeKey === "concept" || nodeKey === "widget") { ... }

// In tutti i nodi tranne quiz
if (nodeKey !== "quiz") { ... }
```

---

## Passo 3: Aggiungi il blocco nell'array

Nella funzione `buildNode`, crea un array condizionale e usa lo spread operator `...` per inserirlo.

### Sintassi:

```typescript
const nomeDelBlocco = nodeKey === "concept"
  ? [{ kind: "explain" as const, title: "📌 Titolo", content: nomeFunzione(seed) }]
  : [];
```

### Dove inserirlo nell'array `blocks`:

```typescript
blocks: [
  { kind: "focus", title: `${emoji} Focus`, content: body },
  ...nomeDelBlocco,  // ← Il blocco si inserisce qui (solo se la condizione è vera)
  { kind: "question", ... },
  // altri blocchi...
]
```

---

## Esempio reale completo

Questo è il codice attuale in `generatedLessons.ts`:

```typescript
function buildNode(seed: LessonSeed, nodeKey: string, title: string, body: string): StructuredNodeContent {
  const titleEmojis: Record<string, string> = {
    "Concept": "💡",
    "Widget": "🛠️",
    "Challenge": "⚡",
    "Quiz finale": "🧠",
    "Feedback": "✅",
  };
  const emoji = titleEmojis[title] || "📌";

  // Blocco extra solo per il nodo "concept"
  const extraBlock = nodeKey === "concept"
    ? [{ kind: "explain" as const, title: "📌 Disciplina e metodo", content: conceptText2(seed) }]
    : [];

  return {
    nodeKey,
    criteria: ["foundational", "application", "learning"],
    blocks: [
      { kind: "focus", title: `${emoji} Focus`, content: body },
      ...extraBlock,  // ← Appare solo in "concept"
      {
        kind: "question",
        title: "🧠 Verifichiamo il concetto",
        // ... resto del blocco
      },
      // ... altri blocchi
    ],
    options: ["Scelgo una regola", "Imposto una soglia", "Programmo il check"],
  };
}
```

---

## Aggiungere un blocco "question" (con opzioni)

I blocchi `question` richiedono la proprietà `pollAreas`:

```typescript
{
  kind: "question",
  title: "🧠 Titolo della domanda",
  content: "Testo introduttivo della domanda",
  pollAreas: [
    {
      id: `${nodeKey}-nome-${seed.id}`,  // ID univoco
      prompt: "Qual è la risposta corretta?",
      options: [
        "Opzione 1 (corretta)",
        "Opzione 2",
        "Opzione 3",
      ],
      correctIndex: 0,  // Indice della risposta corretta (0 = prima opzione)
      correctExplanation: "Spiegazione se l'utente risponde correttamente.",
      wrongExplanation: "Spiegazione se l'utente sbaglia.",
      allowText: false,
    },
  ],
}
```

---

## Riepilogo veloce

| Cosa vuoi fare | Come farlo |
|----------------|------------|
| Creare il testo | `function mioTesto(seed) { return "..."; }` |
| Mostrare solo in `concept` | `nodeKey === "concept"` |
| Mostrare solo in `widget` | `nodeKey === "widget"` |
| Mostrare in più nodi | `nodeKey === "concept" \|\| nodeKey === "widget"` |
| Inserire nell'array | `...nomeBlocco` dentro `blocks: [...]` |

---

## File di riferimento

- **Lezioni generate**: `generatedLessons.ts`
- **Lezioni statiche (1-8)**: `lesson-1.ts`, `lesson-2.ts`, ecc.
- **Tipi**: `types.ts`
- **Definizione base**: `defaultLessonDefinition.ts`
