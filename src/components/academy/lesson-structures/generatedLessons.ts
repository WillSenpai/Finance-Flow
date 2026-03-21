import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { LessonDefinition, StructuredLessonContent, StructuredNodeContent } from "./types";

type SectionSlug = "fondamenta" | "investire" | "strumenti" | "alternativi" | "macro" | "strategie";

type LessonSeed = {
  id: string;
  title: string;
  section: SectionSlug;
  focus: string;
};

const LESSONS: LessonSeed[] = [
  // LIVELLO 1: FONDAMENTA (7 lezioni)
  { id: "1", title: "Cos'è la finanza personale", section: "fondamenta", focus: "comprendere il sistema di gestione delle risorse economiche personali" },
  { id: "2", title: "Budget e controllo del cash flow", section: "fondamenta", focus: "controllo del flusso di cassa e decisioni anticipate" },
  { id: "3", title: "Risparmio automatico e abitudini", section: "fondamenta", focus: "automazione del risparmio e abitudini sostenibili" },
  { id: "4", title: "Debiti buoni vs cattivi", section: "fondamenta", focus: "costo del debito, leva e priorità di rimborso" },
  { id: "5", title: "Obiettivi finanziari SMART", section: "fondamenta", focus: "definire obiettivi Specifici, Misurabili, Achievable, Rilevanti e Temporizzati" },
  { id: "6", title: "Fondo emergenza", section: "fondamenta", focus: "margine di sicurezza personale e liquidità per imprevisti" },
  { id: "7", title: "Assicurazioni essenziali", section: "fondamenta", focus: "trasferimento del rischio e coperture essenziali" },

  // LIVELLO 2: CONCETTI D'INVESTIMENTO (6 lezioni)
  { id: "8", title: "Cos'è un investimento (vs speculazione)", section: "investire", focus: "differenza tra investimento con tesi verificabile e speculazione sul prezzo" },
  { id: "9", title: "Rischio e rendimento", section: "investire", focus: "relazione tra rischio sostenibile, volatilità e disciplina" },
  { id: "10", title: "L'interesse composto", section: "investire", focus: "la forza esponenziale del tempo e dei rendimenti reinvestiti" },
  { id: "11", title: "La diversificazione", section: "investire", focus: "ridurre il rischio specifico distribuendo su asset non correlati" },
  { id: "12", title: "Orizzonte temporale e obiettivi", section: "investire", focus: "aspettative prudenziali e coerenza obiettivo-rischio" },
  { id: "13", title: "Profilo investitore: difensivo vs intraprendente", section: "investire", focus: "identificare il proprio approccio tra semplicità difensiva e gestione attiva" },

  // LIVELLO 3: STRUMENTI TRADIZIONALI (9 lezioni)
  { id: "14", title: "Azioni: cosa sono e come funzionano", section: "strumenti", focus: "quote di proprietà aziendale, dividendi e capital gain" },
  { id: "15", title: "Analisi fondamentale base", section: "strumenti", focus: "lettura utili, cassa e solidità aziendale" },
  { id: "16", title: "Obbligazioni e reddito fisso", section: "strumenti", focus: "prestiti agli emittenti, cedole e rischio credito" },
  { id: "17", title: "Fondi comuni d'investimento", section: "strumenti", focus: "diversificazione, costi e criteri di scelta" },
  { id: "18", title: "ETF: cosa sono", section: "strumenti", focus: "fondi quotati in borsa, replica passiva e vantaggi strutturali" },
  { id: "19", title: "ETF: come sceglierli", section: "strumenti", focus: "efficienza dei costi e diversificazione ampia tramite indici" },
  { id: "20", title: "Indici di mercato (S&P 500, MSCI, etc)", section: "strumenti", focus: "benchmark, composizione e utilizzo pratico degli indici" },
  { id: "21", title: "Broker, costi e commissioni", section: "strumenti", focus: "scegliere la piattaforma giusta e minimizzare i costi" },
  { id: "22", title: "Fiscalità degli investimenti (Italia)", section: "strumenti", focus: "capital gain, dividendi, regime amministrato vs dichiarativo" },

  // LIVELLO 4: ASSET ALTERNATIVI (6 lezioni)
  { id: "23", title: "Crypto: blockchain e Bitcoin", section: "alternativi", focus: "tecnologia blockchain, decentralizzazione e Bitcoin come asset" },
  { id: "24", title: "Altcoin, token e smart contract", section: "alternativi", focus: "ecosistema crypto oltre Bitcoin, utilità e rischi" },
  { id: "25", title: "DeFi e staking (basics)", section: "alternativi", focus: "finanza decentralizzata, rendimenti e rischi smart contract" },
  { id: "26", title: "Commodities (oro, petrolio, etc)", section: "alternativi", focus: "materie prime come protezione e diversificazione" },
  { id: "27", title: "Real Estate e REIT", section: "alternativi", focus: "investimento immobiliare diretto e tramite fondi quotati" },
  { id: "28", title: "Rischi degli asset alternativi", section: "alternativi", focus: "volatilità, liquidità, regolamentazione e sizing prudente" },

  // LIVELLO 5: MACROECONOMIA (6 lezioni)
  { id: "29", title: "Inflazione e potere d'acquisto", section: "macro", focus: "rendimento reale netto e protezione nel lungo periodo" },
  { id: "30", title: "Tassi d'interesse e loro impatto", section: "macro", focus: "costo del denaro, obbligazioni e valutazioni azionarie" },
  { id: "31", title: "Banche centrali e politica monetaria", section: "macro", focus: "Fed, BCE e strumenti di controllo dell'economia" },
  { id: "32", title: "Cicli economici", section: "macro", focus: "espansione, picco, recessione e ripresa" },
  { id: "33", title: "Indicatori economici chiave", section: "macro", focus: "PIL, disoccupazione, PMI e loro interpretazione" },
  { id: "34", title: "Geopolitica e mercati", section: "macro", focus: "eventi globali, sanzioni e impatto sui portafogli" },

  // LIVELLO 6: STRATEGIE (6 lezioni)
  { id: "35", title: "Asset allocation e ribilanciamento", section: "strategie", focus: "pesi target, soglie e mantenimento del profilo rischio" },
  { id: "36", title: "Dollar Cost Averaging (PAC)", section: "strategie", focus: "investimento periodico per ridurre il rischio timing" },
  { id: "37", title: "Value investing", section: "strategie", focus: "acquistare valore intrinseco con sconto sul prezzo" },
  { id: "38", title: "Margin of safety", section: "strategie", focus: "protezione dal downside come principio centrale" },
  { id: "39", title: "Mr. Market e psicologia", section: "strategie", focus: "prezzo come offerta, non come ordine di azione" },
  { id: "40", title: "Errori comuni dell'investitore", section: "strategie", focus: "bias comportamentali e prevenzione" },
];

function conceptText(seed: LessonSeed): string {
  return `💡 In questa lezione su "${seed.title}", il punto centrale è ${seed.focus}. Non partiamo dalla ricerca del guadagno veloce, ma dalla riduzione degli errori irreversibili. 📌 Un investitore disciplinato prende decisioni prima che le emozioni entrino in campo, definendo criteri chiari e verificabili. Le buone scelte economiche nascono da processi semplici, ripetibili e comprensibili. 🎯 Per questo ti chiediamo di fissare una regola pratica che puoi applicare subito, collegando teoria e realtà personale.`;
}

function widgetText(seed: LessonSeed): string {
  return `🛠️ Il Widget traduce "${seed.title}" in procedura operativa. L'obiettivo non è accumulare nozioni, ma creare un meccanismo decisionale robusto. 📋 Tre passaggi: 1) definire una metrica osservabile, 2) impostare una soglia di allerta, 3) scegliere un'azione correttiva. ✅ Usa revisioni settimanali per confrontare stato reale e obiettivo, poi correggi con piccoli aggiustamenti. La disciplina del metodo conta più del risultato del singolo giorno.`;
}

function challengeText(seed: LessonSeed): string {
  return `⚡ Il Challenge mette sotto stress il metodo di "${seed.title}" con uno scenario realistico. 🎯 Non vince chi indovina, ma chi resta coerente con regole definite in anticipo. 🔍 Il compito è riconoscere la differenza tra problema temporaneo ed errore strutturale. Nel primo caso correggi l'esecuzione, nel secondo aggiorni il piano. ⚠️ Gli investitori perdono valore quando cambiano strategia nel momento sbagliato. Il tuo obiettivo: una regola anti-panico chiara.`;
}

function quizText(seed: LessonSeed): string {
  return `🧠 Il Quiz verifica se hai interiorizzato "${seed.title}" in modo applicabile. Le domande misurano la qualità del ragionamento, non la memoria. 📋 Sequenza corretta: 1) chiarisci obiettivo, 2) valuta vincoli, 3) confronta alternative, 4) seleziona l'azione con miglior equilibrio rischio-rendimento. ⚠️ Se una risposta richiede assunzioni non verificate, va scartata. 🎯 Alla fine devi poter spiegare il perché della scelta in linguaggio semplice.`;
}

function feedbackText(seed: LessonSeed): string {
  return `✅ Il Feedback chiude il ciclo di "${seed.title}" e trasforma il contenuto in abitudine. 📋 Sintetizziamo tre elementi: cosa mantenere, cosa correggere, quando ricontrollare. 📅 Se non pianifichi il prossimo controllo, l'apprendimento resta teorico. Una piccola revisione programmata consolida il comportamento. 💡 Usa il tutor per chiarire i dubbi e rendere il piano personale, misurabile e sostenibile. La coerenza ripetuta vale più di sprint motivazionali.`;
}

function buildNode(seed: LessonSeed, nodeKey: string, title: string, body: string): StructuredNodeContent {
  const titleEmojis: Record<string, string> = {
    "Concept": "💡",
    "Widget": "🛠️",
    "Challenge": "⚡",
    "Quiz finale": "🧠",
    "Feedback": "✅",
  };
  const emoji = titleEmojis[title] || "📌";

  return {
    nodeKey,
    criteria: ["foundational", "application", "learning"],
    blocks: [
      { kind: "focus", title: `${emoji} Focus`, content: body },
      {
        kind: "question",
        title: "🧠 Verifichiamo il concetto",
        content: `Bene, vediamo se hai colto il principio chiave di "${seed.title}".`,
        pollAreas: [
          {
            id: `${nodeKey}-verify-${seed.id}`,
            prompt: "Qual è l'approccio corretto?",
            options: [
              "Definire criteri chiari PRIMA di agire, non dopo",
              "Decidere sul momento in base alle emozioni",
              "Non serve un metodo, basta l'istinto",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Il principio fondamentale è **decidere prima, non dopo**.\n\nQuando definisci i criteri in anticipo, le emozioni non possono sabotarti. Le decisioni diventano meccaniche e ripetibili.",
            wrongExplanation: "Le decisioni prese 'sul momento' sono quasi sempre influenzate dalle emozioni. L'istinto da solo porta a errori sistematici.\n\n**Il metodo corretto:**\n1. Definisci i criteri in anticipo\n2. Quando arriva il momento di decidere, applica i criteri\n3. Le emozioni non possono sabotarti\n\nQuesto vale per budget, risparmio, investimenti e qualsiasi decisione finanziaria.",
            allowText: false,
          },
        ],
      },
      {
        kind: "explain",
        title: "📌 Applicazione pratica",
        content: `🎯 Applica questa logica con un controllo periodico e una soglia numerica. Ogni decisione deve restare coerente con il tuo piano.`,
      },
      {
        kind: "question",
        title: "🧠 Verifichiamo: l'elemento chiave",
        content: `Per applicare "${seed.title}" nella vita reale, qual è l'elemento più importante?`,
        pollAreas: [
          {
            id: `${nodeKey}-rule-${seed.id}`,
            prompt: "Qual è l'elemento fondamentale?",
            options: [
              "Un obiettivo numerico con scadenza definita",
              "Buone intenzioni e motivazione",
              "Aspettare il momento giusto per iniziare",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! Un **obiettivo numerico con scadenza** trasforma le intenzioni in azione.\n\n'Voglio risparmiare' → vago, non funziona\n'Voglio risparmiare 3.000€ entro dicembre' → concreto, misurabile, funziona",
            wrongExplanation: "La motivazione da sola non basta. E il 'momento giusto' non arriva mai.\n\n**Serve un obiettivo concreto:**\n• Numerico: quanto?\n• Temporizzato: entro quando?\n• Misurabile: come verifico?\n\nEsempio: 'Risparmiare 200€/mese per 12 mesi' è un obiettivo che funziona.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Verifichiamo: il sistema completo",
        content: `Per avere un sistema che funziona, di quali elementi hai bisogno?`,
        pollAreas: [
          {
            id: `${nodeKey}-apply-${seed.id}`,
            prompt: "Quali sono i tre elementi essenziali?",
            options: [
              "Obiettivo numerico + controllo periodico + regola di correzione",
              "Solo buone intenzioni e motivazione",
              "Nessun elemento specifico, si improvvisa",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! I tre pilastri di un sistema efficace:\n\n1. **Obiettivo numerico**: sai dove vuoi arrivare\n2. **Controllo periodico**: verifichi se sei in linea\n3. **Regola di correzione**: sai cosa fare se sfori\n\nCon questi tre elementi, qualsiasi piano finanziario diventa gestibile.",
            wrongExplanation: "Le buone intenzioni senza struttura portano al fallimento. Improvvisare significa reagire alle emozioni.\n\n**I tre elementi essenziali:**\n1. Obiettivo numerico (quanto, entro quando)\n2. Controllo periodico (settimanale o mensile)\n3. Regola di correzione (cosa fai se sfori)\n\nQuesto vale per budget, risparmio, investimenti e qualsiasi obiettivo finanziario.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Scelgo una regola", "Imposto una soglia", "Programmo il check"],
  };
}

function buildLessonContent(seed: LessonSeed): StructuredLessonContent {
  return {
    concept: buildNode(seed, "concept", "Concept", conceptText(seed)),
    widget: buildNode(seed, "widget", "Widget", widgetText(seed)),
    challenge: buildNode(seed, "challenge", "Challenge", challengeText(seed)),
    quiz: {
      ...buildNode(seed, "quiz", "Quiz finale", quizText(seed)),
      blocks: [
        { kind: "focus", title: "🧠 Quiz finale", content: quizText(seed) },
        {
          kind: "question",
          title: "❓ Domanda 1: Il principio fondamentale",
          content: `In "${seed.title}", qual è il principio che fa la differenza?`,
          pollAreas: [
            {
              id: `quiz-main-${seed.id}`,
              prompt: "Qual è il principio più importante?",
              options: [
                "Decidere con regole definite PRIMA che servano",
                "Reagire velocemente quando succede qualcosa",
                "Affidarsi all'istinto e all'esperienza",
              ],
              correctIndex: 0,
              correctExplanation: "Esatto! Le **regole definite in anticipo** eliminano l'emotività.\n\nQuando la situazione si presenta, non devi decidere: applichi la regola. Questo ti protegge da errori impulsivi.",
              wrongExplanation: "Reagire 'velocemente' significa reagire emotivamente. L'istinto da solo porta a errori sistematici.\n\n**Il principio corretto:**\nDefinisci le regole PRIMA che servano.\n\nQuando arriva il momento critico, non decidi: applichi. Zero emotività, zero errori impulsivi.",
              allowText: false,
            },
          ],
        },
        {
          kind: "question",
          title: "❓ Domanda 2: L'errore da evitare",
          content: "Quale di questi è l'errore più dannoso per le tue finanze?",
          pollAreas: [
            {
              id: `quiz-bonus-${seed.id}`,
              prompt: "Qual è l'errore più grave?",
              options: [
                "Prendere decisioni finanziarie sotto l'effetto delle emozioni",
                "Controllare il budget una volta a settimana",
                "Avere un piano scritto con obiettivi numerici",
              ],
              correctIndex: 0,
              correctExplanation: "Esatto! Le **decisioni emotive** sono il nemico numero uno.\n\nPaura, euforia, frustrazione: tutte portano a scelte sbagliate. Per questo servono regole definite in anticipo.",
              wrongExplanation: "Controllare il budget settimanalmente è positivo. Avere un piano scritto è essenziale.\n\n**L'errore più grave è decidere sotto emozione:**\n• Paura → vendi nel momento peggiore\n• Euforia → compri nel momento peggiore\n• Frustrazione → abbandoni il piano\n\nLe regole predefinite ti proteggono da te stesso.",
              allowText: false,
            },
          ],
        },
        {
          kind: "question",
          title: "❓ Domanda 3: La regola efficace",
          content: "Come deve essere una regola finanziaria per funzionare davvero?",
          pollAreas: [
            {
              id: `quiz-rule-${seed.id}`,
              prompt: "Quali elementi deve avere una regola efficace?",
              options: [
                "Azione specifica + frequenza definita + criterio di verifica",
                "Buone intenzioni e impegno generico",
                "Flessibilità totale per adattarsi al momento",
              ],
              correctIndex: 0,
              correctExplanation: "Perfetto! Una regola efficace ha tre elementi:\n\n1. **Azione specifica**: cosa fai esattamente\n2. **Frequenza**: quando lo fai\n3. **Criterio di verifica**: come sai se funziona\n\nEsempio: 'Trasferisco 150€ il 1° del mese sul conto risparmio e verifico il saldo ogni domenica'.",
              wrongExplanation: "Le buone intenzioni non bastano. La flessibilità totale significa nessuna regola.\n\n**Una regola efficace deve essere:**\n• Specifica: cosa fai esattamente?\n• Temporizzata: quando lo fai?\n• Verificabile: come controlli?\n\nEsempio concreto: 'Trasferisco 150€ il 1° del mese e verifico ogni domenica'.",
              allowText: false,
            },
          ],
        },
      ],
    },
    feedback: {
      ...buildNode(seed, "feedback", "Feedback", feedbackText(seed)),
      criteria: ["human", "caring", "learning"],
      blocks: [
        { kind: "focus", title: "✅ Feedback", content: feedbackText(seed) },
        {
          kind: "question",
          title: "🎯 Il tuo primo passo",
          content: "Quale azione concreta farai questa settimana per applicare quello che hai imparato?",
          pollAreas: [
            {
              id: `feedback-action-${seed.id}`,
              prompt: "Qual è il tuo primo passo?",
              options: [
                "Scrivo un obiettivo numerico con scadenza",
                "Imposto un promemoria per il check settimanale",
                "Definisco una regola specifica da seguire",
              ],
              correctIndex: 0,
              correctExplanation: "Ottima scelta! Iniziare con un **obiettivo numerico** è la base di tutto.\n\nSenza sapere dove vuoi arrivare, non puoi misurare i progressi. Scrivi il tuo obiettivo in modo specifico: quanto, entro quando.",
              wrongExplanation: "Tutte le opzioni sono valide! L'importante è **fare il primo passo** questa settimana.\n\nSe hai scelto il check settimanale o la regola specifica, perfetto. Ma ricorda: tutto parte da un obiettivo chiaro.\n\nSenza obiettivo numerico, non sai se stai andando nella direzione giusta.",
              allowText: false,
            },
          ],
        },
        {
          kind: "explain",
          title: "📅 Prossimi passi",
          content: "🎯 La coerenza ripetuta vale più di sprint motivazionali. Pianifica il prossimo controllo.",
        },
      ],
      suggestedPrompts: [
        `Aiutami a trasformare "${seed.title}" in un piano settimanale`,
        "Qual è l'errore principale da evitare nel mio caso?",
        "Dammi un esempio numerico semplice da seguire",
      ],
    },
  };
}

export const generatedLessonDefinitions: Record<string, LessonDefinition> = Object.fromEntries(
  LESSONS.map((seed) => [seed.id, createStaticLessonDefinition(seed.id, buildLessonContent(seed))]),
);

export const generatedLessonSeeds = LESSONS;
