import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "caring"],
    blocks: [
      {
        kind: "focus",
        title: "💡 Focus",
        content: "Risparmiare senza fatica significa ridurre attrito: meno decisioni manuali, più automatismi utili.",
      },
      {
        kind: "explain",
        title: "📌 La regola d'oro",
        content: "La regola efficace è 'prima risparmio, poi spendo': anche una quota piccola ma fissa crea continuità e fiducia.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Perché un importo basso automatico batte un importo alto deciso ogni mese?",
        pollAreas: [
          {
            id: "concept-verify-2",
            prompt: "Seleziona la risposta corretta",
            options: [
              "Elimina la decisione mensile e crea abitudine",
              "È più facile da calcolare",
              "Non richiede nessun controllo",
            ],
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🎯 Continuità > Volume",
        content: "La continuità conta più del volume. Un piccolo risparmio costante batte un grande risparmio sporadico.",
      },
      {
        kind: "exercise",
        title: "🛠️ Esempio guidato",
        content:
          "Stipendio 1.700€, obiettivo 1.200€ in 12 mesi. Piano: 1) quota media 100€/mese, 2) data automatica giorno stipendio, 3) versione B da 60€ nei mesi stretti.",
        pollAreas: [
          {
            id: "concept-solve-2",
            prompt: "Qual è l'elemento chiave del piano?",
            options: [
              "Avere una versione B per i mesi difficili",
              "Risparmiare sempre la stessa cifra",
              "Non avere nessun piano",
            ],
            allowText: true,
          },
        ],
      },
    ],
    options: ["Scelgo quota base", "Attivo automatismo", "Definisco piano A/B"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "integration"],
    blocks: [
      {
        kind: "focus",
        title: "🛠️ Focus",
        content: "Il salvadanaio migliore ha nome chiaro, data fissa e importo realistico.",
      },
      {
        kind: "explain",
        title: "📌 Obiettivi numerici",
        content: "Collega ogni obiettivo a una cifra e a una scadenza: obiettivi vaghi generano rinvii, obiettivi numerici guidano azione.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Quale metrica guardi per capire se il tuo automatismo sta funzionando?",
        pollAreas: [
          {
            id: "widget-verify-2",
            prompt: "Seleziona la metrica chiave",
            options: [
              "Saldo attuale vs saldo atteso",
              "Numero di transazioni",
              "Solo il saldo finale",
            ],
            allowText: false,
          },
        ],
      },
      {
        kind: "exercise",
        title: "🛠️ Scenario pratico",
        content:
          "Obiettivo 600€ per emergenze in 8 mesi. Piano: 1) quota target 75€/mese, 2) verifica sostenibilità, 3) soglia minima 50€ nei mesi di picco.",
      },
    ],
    options: ["Importo realistico", "Data fissa", "Check mensile"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      {
        kind: "focus",
        title: "⚡ Focus",
        content: "Il rischio tipico è sospendere il risparmio al primo imprevisto invece di adattarlo.",
      },
      {
        kind: "explain",
        title: "📌 La regola di continuità",
        content: "La continuità conta più del volume: meglio ridurre temporaneamente che fermare del tutto.",
      },
      {
        kind: "question",
        title: "🧠 Verifica comprensione",
        content: "Quale soglia minima protegge l'abitudine nei mesi difficili?",
        pollAreas: [
          {
            id: "challenge-verify-2",
            prompt: "Seleziona l'approccio migliore",
            options: [
              "Una quota minima predefinita (es. 50% della quota base)",
              "Zero, sospendo completamente",
              "Non ho bisogno di una soglia minima",
            ],
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🛡️ Piano di recupero",
        content: "Quando riduci temporaneamente, pianifica subito il recupero nei mesi successivi.",
      },
      {
        kind: "exercise",
        title: "🛠️ Scenario",
        content:
          "Bolletta extra 180€. Piano: 1) riduci risparmio da 100€ a 60€, 2) recupera 40€ nei due mesi successivi, 3) mantieni data automatica. Abitudine salva, obiettivo recuperabile.",
      },
    ],
  },
  quiz: {
    nodeKey: "quiz",
    criteria: ["integration", "application"],
    blocks: [
      {
        kind: "focus",
        title: "🧠 Focus",
        content: "Quiz finale: verifica se il tuo sistema di risparmio regge anche sotto stress.",
      },
      {
        kind: "explain",
        title: "📌 Criterio di scelta",
        content: "Scegli sempre l'opzione che massimizza continuità e sostenibilità, non quella più aggressiva.",
      },
      {
        kind: "question",
        title: "❓ Domanda 1",
        content: "Hai 1.900€ netti e vuoi risparmiare 1.500€ in 15 mesi. Quale quota è coerente?",
        pollAreas: [
          {
            id: "quiz-q1-2",
            prompt: "Risposta corretta",
            options: [
              "100€/mese con automatismo",
              "30€/mese senza data fissa",
              "200€/mese senza margine sul budget",
            ],
            allowText: true,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 2",
        content: "Nei primi 2 mesi hai versato 80€ e 60€ invece di 100€. Come recuperi?",
        pollAreas: [
          {
            id: "quiz-q2-2",
            prompt: "Qual è il recupero mensile corretto?",
            options: [
              "+20€ per 3 mesi",
              "+60€ in un mese",
              "Nessun recupero necessario",
            ],
            allowText: true,
          },
        ],
      },
      {
        kind: "exercise",
        title: "🛠️ Caso pratico",
        content:
          "Deficit 60€. Piano: 1) calcola deficit, 2) distribuisci su 3 mesi (+20€), 3) conferma quota base. Risultato: 120€ per 3 mesi, poi ritorno a 100€.",
      },
    ],
    options: ["Valido la quota", "Verifico il recupero", "Confermo la regola"],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "✅ Focus",
        content: "Risparmiare bene è un sistema replicabile, non una sfida di motivazione.",
      },
      {
        kind: "explain",
        title: "📌 Le poche regole",
        content: "Mantieni poche regole stabili: quota base, quota minima, check mensile.",
      },
      {
        kind: "question",
        title: "🎯 Il tuo piano",
        content: "Quale segnale userai per misurare che il tuo piano sta funzionando?",
        pollAreas: [
          {
            id: "feedback-rule-2",
            prompt: "Seleziona il tuo indicatore",
            options: [
              "Saldo atteso vs saldo reale",
              "Numero di mesi consecutivi",
              "Sensazione generale",
            ],
            allowText: true,
          },
        ],
      },
      {
        kind: "exercise",
        title: "✍️ Cruscotto personale",
        content: "Definisci il tuo cruscotto: quota attesa, quota versata, gap da recuperare.",
      },
    ],
    suggestedPrompts: [
      "Aiutami a scegliere una quota di risparmio sostenibile",
      "Come gestisco i mesi con spese extra?",
      "Dammi un modello semplice per monitorare i progressi",
    ],
  },
};

const lesson2Definition = createStaticLessonDefinition("2", content);

export default lesson2Definition;
