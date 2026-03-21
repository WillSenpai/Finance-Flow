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
            correctIndex: 0,
            correctExplanation: "Esatto! L'automatismo elimina la **fatica decisionale**. Ogni volta che devi decidere 'quanto risparmio questo mese?', c'è il rischio di rimandare o ridurre. Con l'automatismo, il risparmio avviene senza che tu debba pensarci.",
            wrongExplanation: "Il vero vantaggio dell'automatismo non è la semplicità di calcolo.\n\n**Il punto chiave è eliminare la decisione mensile.**\n\nOgni volta che devi decidere 'risparmio o no?', il cervello trova scuse. Con un bonifico automatico, i soldi vengono messi da parte prima che tu possa spenderli.\n\nQuesto crea un'**abitudine** che funziona anche quando non hai voglia.",
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
        kind: "question",
        title: "🧠 Verifica: piano di risparmio",
        content:
          "Stipendio: 1.700€\nObiettivo: 1.200€ in 12 mesi\n\nPiano proposto:\n1) Quota media 100€/mese\n2) Data automatica il giorno dello stipendio\n3) Versione B da 60€ nei mesi stretti",
        pollAreas: [
          {
            id: "concept-solve-2",
            prompt: "Qual è l'elemento chiave che rende questo piano sostenibile?",
            options: [
              "Avere una versione B per i mesi difficili",
              "Risparmiare sempre la stessa cifra esatta",
              "Non pianificare e vedere come va",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! La **versione B** è il segreto della sostenibilità.\n\nNei mesi difficili (bollette alte, spese impreviste), invece di fermarti del tutto, riduci a 60€. Così mantieni l'abitudine attiva e non perdi la continuità.",
            wrongExplanation: "La rigidità è nemica del risparmio.\n\n**La versione B è fondamentale:**\nNei mesi difficili, invece di fermarti completamente (che spezza l'abitudine), riduci temporaneamente.\n\n• Mese normale: 100€\n• Mese stretto: 60€ (versione B)\n\nMeglio 60€ che 0€. La continuità protegge l'abitudine.",
            allowText: false,
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
            correctIndex: 0,
            correctExplanation: "Esatto! Il confronto **saldo attuale vs saldo atteso** ti dice se sei in linea con il piano.\n\nSe dopo 6 mesi dovresti avere 600€ e ne hai 520€, sai che hai un gap di 80€ da recuperare.",
            wrongExplanation: "Il numero di transazioni non ti dice nulla sulla sostanza. E il saldo finale da solo non ti dice se sei in linea col piano.\n\n**La metrica giusta è: saldo attuale vs saldo atteso.**\n\nDopo 6 mesi con obiettivo 100€/mese, dovresti avere 600€. Se ne hai 520€, hai un gap di 80€ da gestire.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Verifica: calcolo obiettivo",
        content:
          "Obiettivo: 600€ per fondo emergenze in 8 mesi\n\nQuota target: 75€/mese\nSoglia minima nei mesi difficili: 50€",
        pollAreas: [
          {
            id: "widget-scenario-2",
            prompt: "Perché è importante definire una soglia minima?",
            options: [
              "Permette di continuare anche nei mesi difficili senza interrompere",
              "Non serve, basta risparmiare quando si può",
              "La soglia minima rallenta il raggiungimento dell'obiettivo",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! La soglia minima (50€) garantisce che **l'abitudine non si interrompa** mai.\n\nAnche nei mesi peggiori, quei 50€ mantengono attivo il sistema. Fermarsi del tutto è molto più dannoso che ridurre temporaneamente.",
            wrongExplanation: "Risparmiare 'quando si può' significa non risparmiare mai. La vita trova sempre spese.\n\n**La soglia minima protegge l'abitudine:**\n• Nei mesi normali: 75€\n• Nei mesi difficili: almeno 50€\n\nQuei 50€ sono il minimo per mantenere il sistema attivo. Meglio 50€ che 0€.",
            allowText: false,
          },
        ],
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
            correctIndex: 0,
            correctExplanation: "Perfetto! Una quota minima (es. 50% della base) protegge l'abitudine.\n\nSe normalmente risparmi 100€, nei mesi difficili scendi a 50€ ma **non ti fermi mai**. La continuità vale più del volume.",
            wrongExplanation: "Sospendere completamente è il peggior errore possibile.\n\n**Quando ti fermi:**\n• L'abitudine si spezza\n• Ricominciare diventa difficile\n• La scusa 'questo mese no' si ripete\n\n**La soglia minima** (es. 50% della quota base) ti permette di continuare anche nei momenti difficili. È il tuo paracadute.",
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
        kind: "question",
        title: "🧠 Verifica: gestione imprevisto",
        content:
          "Arriva una bolletta extra di 180€.\n\nIl tuo risparmio mensile è di 100€.\n\nDevi decidere come gestire la situazione.",
        pollAreas: [
          {
            id: "challenge-scenario-2",
            prompt: "Qual è la strategia corretta?",
            options: [
              "Ridurre a 60€ questo mese e recuperare 40€ nei due mesi successivi",
              "Sospendere completamente il risparmio questo mese",
              "Prelevare dal fondo emergenze per la bolletta",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! Riduci ma **non ti fermi**.\n\nQuesto mese: 60€ invece di 100€ (mancano 40€)\nProssimi 2 mesi: 120€ ciascuno (+20€)\n\nCosì mantieni l'abitudine attiva e recuperi il gap gradualmente.",
            wrongExplanation: "Sospendere completamente spezza l'abitudine. Usare il fondo emergenze per una bolletta ordinaria lo svuota.\n\n**La strategia corretta:**\n• Questo mese: riduci a 60€ (non zero!)\n• Prossimi 2 mesi: aumenta a 120€ per recuperare\n• Gap coperto, abitudine salva\n\nAdattarsi > fermarsi.",
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
            correctIndex: 0,
            correctExplanation: "Esatto! 100€/mese × 15 mesi = 1.500€.\n\nL'automatismo garantisce costanza, e la cifra lascia margine nel budget (1.900€ - 100€ = 1.800€ per il resto).",
            wrongExplanation: "Analizziamo:\n\n• **30€/mese**: troppo lento, ci vorrebbero 50 mesi\n• **200€/mese**: non sostenibile, lascia poco margine\n• **100€/mese con automatismo**: perfetto! 15 mesi × 100€ = 1.500€\n\nL'automatismo garantisce che i soldi vengano messi da parte prima che tu possa spenderli.",
            allowText: false,
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
            correctIndex: 0,
            correctExplanation: "Esatto! Gap totale = 60€ (40€ + 20€ mancanti).\n\nDistribuito su 3 mesi: +20€ al mese.\n\nCosì non stressi il budget e recuperi gradualmente.",
            wrongExplanation: "Hai mancato 40€ + 20€ = 60€ totali.\n\nRecuperare tutto in un mese (+60€) è stressante. Ignorare non risolve.\n\n**La soluzione corretta:** distribuire su 3 mesi (+20€/mese).\n\nRecupero graduale = sostenibile.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Verifica: piano di recupero",
        content:
          "Nei primi 2 mesi hai versato 80€ e 60€ invece di 100€.\n\nHai un deficit totale di 60€ da recuperare.",
        pollAreas: [
          {
            id: "quiz-scenario-2",
            prompt: "Come distribuisci il recupero?",
            options: [
              "Aggiungi 20€ per 3 mesi (120€/mese), poi torni a 100€",
              "Versa 160€ il prossimo mese per recuperare tutto subito",
              "Ignora il deficit e continua con 100€",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! Il recupero graduale è sostenibile:\n\n• 3 mesi × 120€ = 360€\n• Poi torni a 100€\n• Deficit coperto senza stress",
            wrongExplanation: "160€ in un mese è troppo aggressivo e probabilmente sforerai altrove. Ignorare accumula il gap.\n\n**La distribuzione graduale funziona:**\n• +20€/mese per 3 mesi\n• Poi torni alla quota normale\n• Gap coperto senza creare nuovi problemi",
            allowText: false,
          },
        ],
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
            correctIndex: 0,
            correctExplanation: "Ottima scelta! Il confronto saldo atteso vs reale è **oggettivo e misurabile**.\n\nTi dice subito se sei in linea o se devi recuperare.",
            wrongExplanation: "Tutte le opzioni hanno un valore, ma la più efficace è **saldo atteso vs saldo reale**.\n\nÈ oggettivo, misurabile, e ti dice subito se devi agire.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Verifica finale: il tuo cruscotto",
        content:
          "Per monitorare il tuo risparmio hai bisogno di un cruscotto con metriche chiare.",
        pollAreas: [
          {
            id: "feedback-cruscotto-2",
            prompt: "Quali sono le tre metriche essenziali del cruscotto?",
            options: [
              "Quota attesa + quota versata + gap da recuperare",
              "Solo il saldo totale del conto",
              "Numero di mesi consecutivi di risparmio",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! Le tre metriche essenziali:\n\n• **Quota attesa**: quanto dovresti aver risparmiato\n• **Quota versata**: quanto hai effettivamente versato\n• **Gap**: la differenza da recuperare\n\nCon questi tre numeri sai sempre dove sei.",
            wrongExplanation: "Il saldo totale da solo non ti dice se sei in linea. I mesi consecutivi sono utili ma non misurano il gap.\n\n**Le tre metriche essenziali sono:**\n1. Quota attesa (obiettivo)\n2. Quota versata (realtà)\n3. Gap (differenza)\n\nCosì sai sempre se devi agire.",
            allowText: false,
          },
        ],
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
