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
        content: "Il fondo emergenza evita che un imprevisto si trasformi in debito.",
      },
      {
        kind: "explain",
        title: "📌 Target pratico",
        content: "Target iniziale: 1 mese di spese essenziali. Poi estensione a 3-6 mesi.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Perché il fondo deve essere liquido e separato dal conto operativo?",
        pollAreas: [
          {
            id: "concept-verify-7",
            prompt: "Seleziona la risposta corretta",
            options: [
              "Per essere accessibile subito e non confondersi con le spese",
              "Non importa dove sia",
              "Deve essere investito in azioni",
            ],
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "📊 Crescita a step",
        content: "Crescita a step: prima il livello minimo, poi ampliamento. Evita frustrazione e mantieni routine.",
      },
      {
        kind: "question",
        title: "🧠 Verifica: calcolo fondo emergenza",
        content:
          "Spese essenziali mensili: 1.250€\n\nTarget livello 1: 1.250€ (1 mese)\nTarget livello 2: 3.750€ (3 mesi)",
        pollAreas: [
          {
            id: "concept-solve-7",
            prompt: "Qual è il vantaggio della crescita a step?",
            options: [
              "Mantiene motivazione e routine costante",
              "Richiede uno sforzo unico enorme all'inizio",
              "Non serve pianificare i tempi",
            ],
            allowText: false,
          },
        ],
      },
    ],
    options: ["Calcolo spese essenziali", "Definisco target a step", "Scelgo conto dedicato"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "🛠️ Focus",
        content: "Automatizzare piccoli importi rende il fondo stabile nel tempo.",
      },
      {
        kind: "explain",
        title: "📌 Tre elementi minimi",
        content: "Importo settimanale o mensile, data fissa, nome del fondo: tre elementi minimi operativi.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Quale frequenza di versamento riduce di più il rischio di saltare?",
        pollAreas: [
          {
            id: "widget-verify-7",
            prompt: "Seleziona la frequenza migliore",
            options: [
              "Versamento automatico il giorno dello stipendio",
              "Quando mi ricordo",
              "Una volta all'anno",
            ],
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Verifica: piano di accumulo",
        content:
          "Obiettivo: 1.250€ in 10 mesi\n\nQuota media: 125€/mese\nQuota minima nei mesi critici: 90€",
        pollAreas: [
          {
            id: "widget-scenario-7",
            prompt: "Perché è importante avere una quota minima?",
            options: [
              "Permette di continuare anche nei mesi difficili senza interrompere",
              "Non serve, basta saltare i mesi difficili",
              "La quota minima rallenta troppo l'obiettivo",
            ],
            allowText: false,
          },
        ],
      },
    ],
    options: ["Imposto quota base", "Definisco quota minima", "Attivo check mensile"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      {
        kind: "focus",
        title: "⚡ Focus",
        content: "Dopo un prelievo, la priorità è ricostruire subito con una regola chiara.",
      },
      {
        kind: "explain",
        title: "📌 Piano di ricostruzione",
        content: "Ogni uso del fondo deve attivare automaticamente un piano di ricostruzione.",
      },
      {
        kind: "question",
        title: "🧠 Verifica comprensione",
        content: "Quale piano riattivi dopo un prelievo di emergenza?",
        pollAreas: [
          {
            id: "challenge-verify-7",
            prompt: "Seleziona l'approccio corretto",
            options: [
              "Quota extra mensile fino a recupero completo",
              "Aspetto tempi migliori",
              "Non ricostruisco mai",
            ],
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🛡️ Quota base + extra",
        content: "Mantieni la quota base e aggiungi una quota extra dedicata alla ricostruzione.",
      },
      {
        kind: "question",
        title: "🧠 Verifica: ricostruzione fondo",
        content:
          "Hai dovuto prelevare 600€ dal fondo emergenza.\n\nDevi pianificare la ricostruzione.",
        pollAreas: [
          {
            id: "challenge-scenario-7",
            prompt: "Qual è il piano corretto di ricostruzione?",
            options: [
              "Obiettivo 6 mesi + quota extra 100€/mese + quota base invariata",
              "Aspettare tempi migliori per ricominciare",
              "Dimezzare la quota base per compensare",
            ],
            allowText: false,
          },
        ],
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
        content: "Quiz finale: verifica se il tuo fondo emergenza è progettato per reggere davvero.",
      },
      {
        kind: "explain",
        title: "📌 Logica del fondo",
        content: "Rispondi con logica: liquidità, separazione, progressione a step, ricostruzione.",
      },
      {
        kind: "question",
        title: "❓ Domanda 1",
        content: "Con spese essenziali 1.400€, qual è un primo target corretto?",
        pollAreas: [
          {
            id: "quiz-q1-7",
            prompt: "Scegli la risposta migliore",
            options: [
              "1.400€ come livello iniziale",
              "50€ simbolici senza piano",
              "10.000€ immediati senza step",
            ],
            allowText: true,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 2",
        content: "Fondo attuale 900€, target 2.800€ in 12 mesi. Qual è il gap?",
        pollAreas: [
          {
            id: "quiz-q2-7",
            prompt: "Qual è il gap corretto da coprire?",
            options: ["1.900€", "2.800€", "900€"],
            allowText: true,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Verifica: calcolo del gap",
        content:
          "Fondo attuale: 900€\nTarget: 2.800€ in 12 mesi\n\nGap da coprire: 1.900€\nQuota mensile necessaria: circa 158€/mese",
        pollAreas: [
          {
            id: "quiz-scenario-7",
            prompt: "Cosa devi definire oltre alla quota mensile?",
            options: [
              "Quota minima per i mesi difficili + regola di recupero",
              "Solo la quota mensile è sufficiente",
              "Nessuna regola, decido mese per mese",
            ],
            allowText: false,
          },
        ],
      },
    ],
    options: ["Verifico target", "Calcolo il gap", "Definisco piano di ricarica"],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "✅ Focus",
        content: "Il fondo emergenza compra lucidità quando il contesto cambia all'improvviso.",
      },
      {
        kind: "explain",
        title: "📌 Affidabilità > Perfezione",
        content: "Non serve perfezione: serve affidabilità del sistema mese dopo mese.",
      },
      {
        kind: "question",
        title: "🎯 Il tuo patto",
        content: "Quale importo minimo vuoi vedere sempre disponibile?",
        pollAreas: [
          {
            id: "feedback-rule-7",
            prompt: "Seleziona il tuo obiettivo",
            options: [
              "1 mese di spese essenziali",
              "3 mesi di spese essenziali",
              "Un importo fisso in euro",
            ],
            allowText: true,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Verifica finale: il tuo patto",
        content:
          "Per mantenere il fondo emergenza hai bisogno di un patto con regole chiare.",
        pollAreas: [
          {
            id: "feedback-patto-7",
            prompt: "Quali elementi deve contenere il tuo patto?",
            options: [
              "Target finale + quota base mensile + regola dopo prelievo",
              "Solo l'importo che vuoi raggiungere",
              "Nessuna regola, vedrò come va",
            ],
            allowText: false,
          },
        ],
      },
    ],
    suggestedPrompts: [
      "Aiutami a calcolare il mio fondo emergenza ideale",
      "Come ricostruisco il fondo dopo un imprevisto?",
      "Qual è una quota mensile realistica per iniziare?",
    ],
  },
};

const lesson7Definition = createStaticLessonDefinition("7", content);

export default lesson7Definition;
