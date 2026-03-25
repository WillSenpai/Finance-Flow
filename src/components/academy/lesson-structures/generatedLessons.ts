import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { LessonDefinition, StructuredLessonContent, StructuredNodeContent } from "./types";

<<<<<<< HEAD
type LessonSeed = {
  id: string;
  title: string;
  section: "basics" | "investing" | "protection" | "intelligent-investor";
=======
type SectionSlug = "fondamenta" | "investire" | "strumenti" | "alternativi" | "macro" | "strategie";

type LessonSeed = {
  id: string;
  title: string;
  section: SectionSlug;
>>>>>>> 6c8f038a135601d721670ce50a860c69236251e8
  focus: string;
};

const LESSONS: LessonSeed[] = [
<<<<<<< HEAD
  { id: "1", title: "Cos'è la Finanza?", section: "basics", focus: "La base di tutto" },
  { id: "2", title: "Cos'è un budget?", section: "basics", focus: "controllo del flusso di cassa e decisioni anticipate" },
  { id: "3", title: "Risparmiare senza fatica", section: "basics", focus: "automazione del risparmio e abitudini sostenibili" },
  { id: "4", title: "Debiti buoni e cattivi", section: "basics", focus: "costo del debito, leva e priorita di rimborso" },
  { id: "5", title: "Che cos'e un investimento?", section: "investing", focus: "differenza tra investimento, consumo e speculazione" },
  { id: "6", title: "I fondi spiegati semplice", section: "investing", focus: "diversificazione, costi e criteri di scelta" },
  { id: "7", title: "Rischio: non e una parolaccia", section: "investing", focus: "rischio sostenibile, volatilita e disciplina" },
  { id: "8", title: "Fondo emergenza: perche serve", section: "protection", focus: "margine di sicurezza personale e liquidita" },
  { id: "9", title: "Assicurazioni in parole povere", section: "protection", focus: "trasferimento del rischio e coperture essenziali" },
  { id: "10", title: "Investimento vs Speculazione", section: "intelligent-investor", focus: "tesi verificabile contro scommessa di prezzo" },
  { id: "11", title: "Risultati attesi e obiettivi realistici", section: "intelligent-investor", focus: "aspettative prudenziali e coerenza obiettivo-rischio" },
  { id: "12", title: "Inflazione e potere d'acquisto", section: "intelligent-investor", focus: "rendimento reale netto e protezione nel lungo periodo" },
  { id: "13", title: "Asset allocation e ribilanciamento", section: "intelligent-investor", focus: "pesi target, soglie e mantenimento del profilo rischio" },
  { id: "14", title: "Profilo Defensive Investor", section: "intelligent-investor", focus: "semplicita, costi bassi e continuita operativa" },
  { id: "15", title: "Profilo Enterprising Investor", section: "intelligent-investor", focus: "processo attivo con regole verificabili" },
  { id: "16", title: "Mr. Market e volatilita", section: "intelligent-investor", focus: "prezzo come offerta, non come ordine di azione" },
  { id: "17", title: "Fondi e index investing", section: "intelligent-investor", focus: "efficienza dei costi e diversificazione ampia" },
  { id: "18", title: "Analisi di bilancio per investitori", section: "intelligent-investor", focus: "lettura utili, cassa e solidita aziendale" },
  { id: "19", title: "Selezione titoli: difensivo vs intraprendente", section: "intelligent-investor", focus: "criteri quantitativi e margine di sicurezza" },
  { id: "20", title: "Errori tipici dell'investitore", section: "intelligent-investor", focus: "bias comportamentali e prevenzione" },
  { id: "21", title: "Margin of safety", section: "intelligent-investor", focus: "protezione dal downside come principio centrale" },
];

function conceptText(seed: LessonSeed): string {
  return `In questa lezione su "${seed.title}", il punto centrale e ${seed.focus}. Seguendo la logica di The Intelligent Investor, non partiamo dalla ricerca del guadagno veloce, ma dalla riduzione degli errori irreversibili. Un investitore disciplinato prende decisioni prima che le emozioni del momento entrino in campo, definendo criteri chiari e verificabili. Anche l'approccio divulgativo di Starting Finance conferma lo stesso principio: le buone scelte economiche nascono da processi semplici, ripetibili e comprensibili, non da intuizioni casuali. Per questo il nodo Concept ti chiede di fissare una regola pratica che puoi applicare subito nel tuo contesto, collegando teoria e realta personale. Se il principio non e trasformabile in un comportamento concreto, allora non e ancora un apprendimento utile.`;
}

function widgetText(seed: LessonSeed): string {
  return `Il nodo Widget traduce il tema "${seed.title}" in una procedura operativa. L'obiettivo non e accumulare nozioni, ma creare un meccanismo decisionale che regga anche nei periodi complessi. Applichiamo tre passaggi: definire una metrica osservabile, impostare una soglia di allerta, scegliere un'azione correttiva standard. Questo schema evita sia il blocco da analisi sia le reazioni impulsive. Nella pratica, puoi usare una revisione settimanale o mensile per confrontare stato reale e obiettivo, poi correggere con piccoli aggiustamenti progressivi. Il vantaggio e cumulativo: quando il processo e stabile, diminuiscono gli errori costosi e aumenta la coerenza tra obiettivi finanziari, rischio sostenibile e tempo disponibile. La disciplina del metodo conta piu del risultato del singolo giorno.`;
}

function challengeText(seed: LessonSeed): string {
  return `Nel nodo Challenge mettiamo sotto stress il metodo della lezione "${seed.title}" con uno scenario realistico, simile alle oscillazioni che Graham descrive quando parla di mercato e comportamento. Qui non vince chi indovina, ma chi resta coerente con regole definite in anticipo. Il compito e riconoscere la differenza tra un problema temporaneo e un errore strutturale: nel primo caso correggi l'esecuzione, nel secondo aggiorni il piano. L'esercizio ti porta a quantificare impatto, priorita e trade-off, cosi da evitare scelte vaghe. Questa abilita e fondamentale: gli investitori perdono valore soprattutto quando cambiano strategia nel momento sbagliato, non quando seguono un processo robusto con pazienza. Il tuo obiettivo e uscire dal nodo con una regola anti-panico chiara.`;
}

function quizText(seed: LessonSeed): string {
  return `Il nodo Quiz verifica se hai interiorizzato il principio "${seed.title}" in modo applicabile. Le domande sono progettate per misurare la qualita del ragionamento, non la memoria di definizioni isolate. La sequenza corretta resta sempre la stessa: chiarisci l'obiettivo, valuta i vincoli, confronta alternative, seleziona l'azione con miglior equilibrio rischio-rendimento nel tuo orizzonte temporale. Se una risposta sembra attraente ma richiede assunzioni non verificate, va scartata. Questo approccio riflette la filosofia del margine di sicurezza: preferire decisioni robuste anche quando promettono meno entusiasmo nel breve termine. Alla fine del quiz devi poter spiegare il perche della scelta in linguaggio semplice, con numeri essenziali e conseguenze pratiche comprensibili.`;
}

function feedbackText(seed: LessonSeed): string {
  return `Il nodo Feedback chiude il ciclo della lezione "${seed.title}" e trasforma il contenuto in abitudine. Il risultato atteso non e una risposta perfetta oggi, ma una routine affidabile che migliori nel tempo. Per questo sintetizziamo tre elementi: cosa mantenere, cosa correggere, quando ricontrollare. Se non pianifichi il prossimo controllo, l'apprendimento resta teorico e tende a svanire. Invece, una piccola revisione programmata riduce la frizione e consolida il comportamento, proprio come un ribilanciamento periodico mantiene il portafoglio allineato alla strategia. Usa il tutor per chiarire i dubbi residui e rendere il piano personale, misurabile e sostenibile. La coerenza ripetuta vale piu di qualsiasi sprint motivazionale occasionale.`;
}

function buildNode(seed: LessonSeed, nodeKey: string, title: string, body: string): StructuredNodeContent {
=======
  // LIVELLO 1: FONDAMENTA (7 lezioni)
  { id: "1", title: "Cos'è la finanza personale", section: "fondamenta", focus: "comprendere **cos'è la Finanza** e comprendere il sistema di **gestione delle finanze personali**" },
  { id: "2", title: "Budget e controllo del cash flow", section: "fondamenta", focus: "controllo del flusso di cassa e decisioni anticipate" },
  { id: "3", title: "Risparmio e abitudini", section: "fondamenta", focus: "capire il risparmio e abitudini sostenibili" },
  { id: "4", title: "Debiti buoni vs cattivi", section: "fondamenta", focus: "costo del debito, leva e priorità di rimborso" },
  { id: "5", title: "Obiettivi finanziari SMART", section: "fondamenta", focus: "definire obiettivi Specifici, Misurabili, Achievable, Rilevanti e Temporizzati" },
  { id: "6", title: "Fondo emergenza", section: "fondamenta", focus: "margine di sicurezza personale e liquidità per imprevisti" },
  { id: "7", title: "Assicurazioni", section: "fondamenta", focus: "trasferimento del rischio e coperture essenziali" },

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
  return `In questa lezione su "${seed.title}", i punti centrali sono ${seed.focus}.💡\n\n Non partiremo dalla ricerca del guadagno veloce, ma piuttosto dal capire come ridurre la % di errori commessi da noi stessi😁.`;
}

function conceptText2(seed: LessonSeed): string {
  return `La finanza personale è semplicemente il modo in cui gestisci i tuoi soldi ogni giorno per vivere meglio e raggiungere i tuoi sogni (come ad esempio comprare una casa o viaggiare senza preoccupazioni).
  
\nImmagina i tuoi soldi come un **budget familiare**: la finanza personale ti aiuta a controllare entrate (lo stipendio o altri guadagni) e uscite (bollette, cibo, svaghi), per evitare di spenderne più di quanto entri.
\nL'obiettivo è creare un piano chiaro, come una mappa o delle semplici regole, che ti permettano di risparmiare e far crescere i tuoi risparmi nel tempo. `;
}

function conceptText3(seed: LessonSeed): string {
  return `Un investitore disciplinato prende decisioni prima che le emozioni entrino in gioco, definendo criteri chiari e verificabili📌.

Questo succede perché le sue scelte economiche e finanziarie nascono da processi semplici, comprensibili e soprattutto **ripetibili**.

Il discorso, quindi, ci porta a capire che la finanza personale non è altro che una questione di metodo e disciplina, come dicevamo prima, dove tu sei artefice e padrone delle scelte sulla gestione dei TUOI soldi🎯.`;
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

  // Blocco extra solo per il nodo "concept"
  const extraBlock = nodeKey === "concept"
    ? [{ kind: "explain" as const, title: "Definizione", content: conceptText2(seed) }]
    : [];
  const extraBlock2 = nodeKey === "concept"
    ? [{ kind: "explain" as const, title: "Disciplina e metodo", content: conceptText3(seed) }]
    : [];

>>>>>>> 6c8f038a135601d721670ce50a860c69236251e8
  return {
    nodeKey,
    criteria: ["foundational", "application", "learning"],
    blocks: [
<<<<<<< HEAD
      { kind: "focus", title: "Focus", content: body },
      {
        kind: "explain",
        title: "Spiegazione rapida",
        content: `${body} Applica questa logica con un controllo periodico e una soglia numerica, cosi ogni decisione resta coerente con il tuo piano.`,
      },
      {
        kind: "question",
        title: "Approfondimento",
        content: `Domanda guida: quale regola concreta adotti da oggi per rendere operativa la lezione "${seed.title}" senza dipendere dall'umore del momento?`,
      },
      {
        kind: "exercise",
        title: "Esempio guidato",
        content: `Caso pratico: definisci un obiettivo, una metrica e un limite massimo di deviazione. Poi scegli un'azione di correzione automatica se superi la soglia. Chiudi con data del prossimo check.`,
=======
      { kind: "focus", title: `${emoji} Focus`, content: body },
      ...extraBlock,
      ...extraBlock2,
      {
        kind: "question",
        title: "Verifichiamo il concetto",
        content: `Bene, vediamo se hai capito il concetto principale.`,
        pollAreas: [
          {
            id: `${nodeKey}-verify-${seed.id}`,
            prompt: "Cos'è la finanza personale?",
            options: [
              "Definire criteri chiari prima di agire",
              "Gestione delle proprie finanze per farle rendere nel tempo",
              "Lasciare i propri risparmi fermi sul conto corrente",
            ],
            correctIndex: 1,
            correctExplanation: "Esatto! La finanza personale è la gestione delle proprie finanze per farle rendere nel tempo.\n\nCome gli investitori, quando crei un piano e definisci i criteri in anticipo, le emozioni non possono sabotarti dal raggiungere i tuoi obiettivi perché le decisioni diventano meccaniche e ripetibili.",
            wrongExplanation: "Le decisioni prese 'sul momento' nella finanza sono quasi sempre influenzate dalle emozioni. L'istinto umano da solo porta a commettere errori sistematici.\nPer evitare ciò, segui il **metodo corretto**:\n1. Definisci i criteri in anticipo\n2. Quando arriva il momento di decidere, applica i criteri\n3. Le emozioni non possono sabotarti\n\nQuesto vale per budget, risparmio, investimenti e qualsiasi decisione finanziaria.",
            allowText: false,
          },
        ],
      },
      {
        kind: "explain",
        title: "Come applicare questo concetto nella pratica",
        content: `Il primo metodo per gestire le proprie finanze è il seguente:\n\n**1. Definisci un controllo periodico**: stabilisci una data fissa (settimanale, mensile o trimestrale) per verificare le tue finanze e capire come strutturarle.\n\n**2. Imposta una soglia numerica**: ogni obiettivo deve avere un numero misurabile, un parametro oggettivo e una revisione periodica (ricorda, i soldi non lavorano completamente da soli🤎). Le intenzioni vaghe non funzionano, i numeri concreti sì.\n\n**3. Mantieni la coerenza col piano**: ogni decisione deve passare il filtro 'questo mi avvicina o mi allontana dal mio obiettivo?'.\n\n**4. Collega alle lezioni precedenti**: ricorda i principi del budget (pianificare prima), del risparmio (automatizzare), della gestione rischio (regole definite in anticipo).\n\nQuesto approccio sistematico è lo stesso che abbiamo accennato prima: criteri definiti in anticipo battono sempre le decisioni improvvisate.`,
      },
      {
        kind: "question",
        title: "Verifichiamo: l'elemento chiave",
        content: `Per applicare il concetto nella vita reale:`,
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
            correctExplanation: "Perfetto! Un **obiettivo numerico con scadenza** trasforma le intenzioni in azione.\n\n'Voglio risparmiare' → vago, non funziona\n\n'Voglio risparmiare 3.000€ entro dicembre' → concreto, misurabile, funziona",
            wrongExplanation: "La motivazione da sola non basta. E il 'momento giusto' non arriva mai.\n\n**Serve un obiettivo concreto:**\n\n• Numerico: quanto?\n\n• Temporizzato: entro quando?\n\n• Misurabile: come verifico?\n\nEsempio: 'Risparmiare 200€/mese per 12 mesi' è un obiettivo che funziona.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "Verifichiamo: il sistema completo",
        content: `Per avere un sistema che funziona:`,
        pollAreas: [
          {
            id: `${nodeKey}-apply-${seed.id}`,
            prompt: "Quali sono i tre elementi essenziali?",
            options: [
              "Obiettivo numerico + controllo periodico + regole chiare",
              "Solo buone intenzioni e motivazione",
              "Nessun elemento specifico, si improvvisa",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! I tre pilastri di un sistema efficace:\n\n1. **Obiettivo numerico**: sai dove vuoi arrivare\n\n2. **Controllo periodico**: verifichi se sei in linea\n\n3. **Regole chiare**: sai cosa fare se sfori\n\nCon questi tre elementi, qualsiasi piano finanziario diventa gestibile.",
            wrongExplanation: "Le buone intenzioni senza struttura portano al fallimento. Improvvisare significa reagire alle emozioni.\n\n**I tre elementi essenziali:**\n1. Obiettivo numerico (quanto, entro quando)\n2. Controllo periodico (settimanale o mensile)\n3. Regole chiare (cosa fai se sfori)\n\nQuesto vale per budget, risparmio, investimenti e qualsiasi obiettivo finanziario.",
            allowText: false,
          },
        ],
>>>>>>> 6c8f038a135601d721670ce50a860c69236251e8
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
<<<<<<< HEAD
    quiz: buildNode(seed, "quiz", "Quiz finale", quizText(seed)),
    feedback: {
      ...buildNode(seed, "feedback", "Feedback", feedbackText(seed)),
      criteria: ["human", "caring", "learning"],
      suggestedPrompts: [
        `Aiutami a trasformare "${seed.title}" in un piano settimanale`,
        "Qual e l'errore principale da evitare nel mio caso?",
=======
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
          title: "📅 I tuoi prossimi passi concreti",
          content: "Hai completato questa lezione. Ora trasforma la teoria in pratica con questi passi:\n\n**1. Scrivi l'obiettivo specifico**: non lasciarlo vago. Definisci cosa, quanto, entro quando.\n\n**2. Pianifica il prossimo controllo**: metti in calendario una data per verificare i progressi. Senza data fissa, il controllo non avviene mai.\n\n**3. Definisci la regola di correzione**: cosa farai se non sei in linea? Avere un piano B evita decisioni emotive.\n\n**Ricorda**: la coerenza ripetuta nel tempo vale molto più degli sprint motivazionali. Un piccolo passo ogni settimana batte un grande sforzo una volta al mese.\n\nCollega questa lezione alle precedenti: usa lo stesso approccio sistematico che hai visto per budget, risparmio e gestione del rischio.",
        },
      ],
      suggestedPrompts: [
        `Aiutami a trasformare "${seed.title}" in un piano settimanale`,
        "Qual è l'errore principale da evitare nel mio caso?",
>>>>>>> 6c8f038a135601d721670ce50a860c69236251e8
        "Dammi un esempio numerico semplice da seguire",
      ],
    },
  };
}

export const generatedLessonDefinitions: Record<string, LessonDefinition> = Object.fromEntries(
  LESSONS.map((seed) => [seed.id, createStaticLessonDefinition(seed.id, buildLessonContent(seed))]),
);

export const generatedLessonSeeds = LESSONS;
