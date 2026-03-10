import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "integration"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Il budget è un documento previsionale che pianifica entrate, uscite, costi e ricavi per un periodo futuro, che solitamente è di un anno.🗓️ \nServe come strumento di controllo per gestire risorse limitate, fissando obiettivi economici e finanziari per aziende, progetti, gestione familiare o la propria gestione personale delle spese. \nQuindi, in parole povere, **il budget** è uno strumento che ti aiuta a pianificare e controllare le tue finanze, in modo da poter raggiungere i tuoi obiettivi economici e finanziari.😁" },
      { kind: "explain", title: "Spiegazione rapida", content: "Esistono diversi tipi di budget, ma i più comuni sono il budget operativo, il budget finanziario e il budget di cassa. \n\n**Il budget operativo** è un budget che pianifica le entrate e le uscite di un'azienda per un periodo di tempo, solitamente un anno. \n**Il budget finanziario** è un budget che pianifica le entrate e le uscite di un'azienda per un periodo di tempo, solitamente un anno. \n**Il budget di cassa** è un budget che pianifica le entrate e le uscite di un'azienda per un periodo di tempo, solitamente un anno." },
      { kind: "question", title: "Domanda guida", content: "Il budgeting personale è una pratica fondamentale per gestire le proprie finanze in modo efficace. Creare un piano di spesa, monitorare le entrate e le uscite e impostare obiettivi di risparmio possono fare la differenza nella stabilità economica di una persona, esattamente come accade per le aziende con le attività di [budgeting e forecasting](https://easypol.io/blog/pagopa/budgeting-e-forecasting-cosa-sono-differenze-e-come-usarli/)" },
      { kind: "exercise", title: "Micro-azione", content: "Scegli una categoria (spesa casa, trasporti o svago) e definisci un tetto semplice per 7 giorni." },
    ],
    options: [
      "Lo spiego con parole mie in 1 frase",
      "Faccio un esempio reale della mia settimana",
      "Segno il punto che non mi e chiaro",
    ],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "learning"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Il budget funziona se e visibile: una regola piccola e un check regolare." },
      { kind: "explain", title: "Spiegazione rapida", content: "Non serve precisione perfetta. Serve una soglia chiara e una revisione breve ogni domenica." },
      { kind: "question", title: "Domanda guida", content: "Quale numero monitorerai questa settimana per capire se sei in linea?" },
      { kind: "exercise", title: "Micro-azione", content: "Imposta ora un promemoria domenicale di 10 minuti per rivedere le uscite." },
    ],
    options: [
      "Attivo una micro-azione da fare oggi",
      "Imposto un promemoria per domani",
      "Scelgo una versione super semplice",
    ],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "caring"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Scenario: il tetto settimanale e quasi finito al venerdi." },
      { kind: "explain", title: "Spiegazione rapida", content: "Il test non e evitare ogni spesa, ma scegliere cosa posticipare senza sabotare il piano." },
      { kind: "question", title: "Domanda guida", content: "Quale spesa puoi rinviare senza impatto reale sulla tua settimana?" },
      { kind: "exercise", title: "Micro-azione", content: "Definisci una regola di recupero: se superi il tetto, riduci la categoria opzionale successiva." },
    ],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "caring"],
    blocks: [
      { kind: "focus", title: "Focus", content: "Un budget buono ti fa decidere con calma, non con ansia." },
      { kind: "explain", title: "Spiegazione rapida", content: "Conta piu la continuita della precisione perfetta. Se rivedi ogni settimana, migliori ogni settimana." },
      { kind: "question", title: "Domanda guida", content: "Qual e la prima abitudine che manterrai anche il mese prossimo?" },
      { kind: "exercise", title: "Micro-azione", content: "Scrivi il tuo patto personale: limite, giorno di controllo e mossa correttiva." },
    ],
    suggestedPrompts: [
      "Aiutami a impostare il mio primo budget settimanale",
      "Che categorie devo usare se parto da zero?",
      "Fammi un esempio realistico con stipendio variabile",
    ],
  },
};

const lesson1Definition = createStaticLessonDefinition("1", content);

export default lesson1Definition;
