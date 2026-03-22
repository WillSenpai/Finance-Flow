import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "caring"],
    blocks: [
      {
        kind: "focus",
        title: "💡 Cos'è il risparmio automatico?",
        content: "Nella lezione precedente sul budget hai imparato a pianificare dove vanno i tuoi soldi. Ora facciamo un passo avanti: **automatizzare** quel piano.\n\nRisparmiare senza fatica significa ridurre l'attrito tra te e i tuoi obiettivi. Ogni volta che devi decidere manualmente 'risparmio questo mese?', c'è il rischio di rimandare, ridurre o saltare del tutto.\n\nL'automatismo elimina questa decisione. Imposti una volta, e il sistema lavora per te ogni mese, senza che tu debba pensarci.\n\n**Il principio chiave:** meno decisioni manuali = più costanza nel tempo.",
      },
      {
        kind: "explain",
        title: "📌 La regola d'oro: prima risparmio, poi spendo",
        content: "Ricordi la lezione sul budget? Abbiamo visto che l'ordine giusto è: prima risparmiare, poi pagare le spese essenziali, infine usare il resto per lo svago.\n\nOra trasformiamo questa regola in un sistema automatico. Appena lo stipendio arriva sul conto, un bonifico automatico trasferisce la quota risparmio su un conto separato.\n\nAnche una quota piccola ma fissa (es. 50€ o 100€ al mese) crea due effetti potenti:\n\n• **Continuità**: non salti mai, perché non devi decidere\n• **Fiducia**: vedi il saldo crescere mese dopo mese\n\nQuesto approccio batte qualsiasi importo alto deciso 'quando ricordo', perché elimina il fattore umano.",
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
        content: "Uno degli errori più comuni è pensare: 'Quando guadagnerò di più, risparmierò di più'. In realtà, funziona al contrario.\n\nLa **continuità** conta più del volume. Risparmiare 100€ ogni mese per 12 mesi (1.200€) batte risparmiare 500€ tre volte l'anno quando 'te lo ricordi' (1.500€ in teoria, ma spesso meno in pratica).\n\nPerché? Per tre motivi:\n\n• L'abitudine si consolida con la ripetizione\n• Non devi mai 'trovare' i soldi da mettere da parte\n• Il sistema funziona anche quando sei stanco, stressato o demotivato\n\nPensa al risparmio come all'allenamento: meglio 20 minuti ogni giorno che 3 ore una volta al mese.",
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
        title: "🛠️ Come costruire il tuo sistema di risparmio",
        content: "Dopo aver capito il 'perché' del risparmio automatico, passiamo al 'come'. Il sistema perfetto ha tre elementi:\n\n**1. Nome chiaro**: non 'conto risparmio generico', ma 'Fondo vacanza 2025' o 'Anticipo casa'. Un nome specifico ti ricorda perché stai risparmiando.\n\n**2. Data fissa**: il bonifico automatico parte sempre lo stesso giorno, idealmente il giorno dello stipendio o il giorno dopo. Così i soldi 'spariscono' prima che tu possa spenderli.\n\n**3. Importo realistico**: meglio iniziare con 50€ che puoi mantenere sempre, che 200€ che ti costringono a saltare mesi. Come hai visto nella lezione sul budget, la sostenibilità viene prima dell'ambizione.",
      },
      {
        kind: "explain",
        title: "📌 Perché servono obiettivi numerici",
        content: "Un obiettivo vago come 'voglio risparmiare di più' non funziona. Il cervello non sa cosa fare con questa informazione, quindi la ignora.\n\nUn obiettivo numerico con scadenza cambia tutto. Confronta:\n\n• ❌ 'Voglio mettere da parte qualcosa per le vacanze'\n• ✅ 'Voglio risparmiare 1.200€ entro giugno per le vacanze = 200€/mese per 6 mesi'\n\nIl secondo obiettivo ti dice esattamente **quanto** e **quando**. Puoi verificare ogni mese se sei in linea, e correggere se necessario.\n\nQuesto collegamento tra obiettivo e azione è lo stesso principio del budget: sapere i numeri ti dà controllo.",
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
        title: "⚡ Il momento critico: quando arriva l'imprevisto",
        content: "Hai impostato il tuo sistema automatico, tutto funziona... e poi arriva una bolletta più alta del previsto, una riparazione urgente, o un mese con spese extra.\n\nQuesto è il momento critico. Il rischio non è l'imprevisto in sé, ma la tua reazione.\n\n**L'errore comune**: 'Questo mese sospendo il risparmio, tanto ricomincio il prossimo mese.' Ma il prossimo mese avrà le sue spese, e l'abitudine si spezza.\n\n**L'approccio corretto**: non sospendere, ma **adattare**. Riduci temporaneamente la quota invece di fermarti del tutto. Come hai visto nel budget, la flessibilità intelligente batte la rigidità.",
      },
      {
        kind: "explain",
        title: "📌 La regola di continuità: ridurre, mai fermarsi",
        content: "Ecco perché la continuità conta più del volume. Considera questo esempio:\n\n• **Persona A**: risparmia 100€ per 8 mesi, poi salta 4 mesi = 800€\n• **Persona B**: risparmia 100€ per 8 mesi, poi 60€ per 4 mesi = 1.040€\n\nLa persona B ha risparmiato di più, ma soprattutto ha mantenuto l'abitudine attiva. Quando tornerà alla quota piena, non dovrà 'ricominciare da zero'.\n\nQuesto principio lo ritroverai anche nelle prossime lezioni sul fondo emergenza e sugli investimenti: la costanza nel tempo batte sempre i grandi gesti sporadici.\n\n**La regola**: definisci in anticipo una 'versione B' della tua quota per i mesi difficili.",
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
        title: "🛡️ Piano di recupero: come tornare in carreggiata",
        content: "Hai dovuto ridurre la quota per un mese difficile. Bene, hai fatto la cosa giusta mantenendo l'abitudine. Ma ora serve un piano per recuperare il gap.\n\n**Il metodo è semplice:**\n\n1. Calcola quanto hai mancato (es. 100€ normali - 60€ versati = 40€ di gap)\n2. Distribuisci il recupero sui mesi successivi (es. +20€ per 2 mesi)\n3. Torna alla quota normale quando hai coperto il gap\n\nQuesto approccio è lo stesso che hai visto nel budget per recuperare gli sforamenti. La differenza è che qui parliamo di risparmio, non di spese.\n\n**Importante**: pianifica il recupero SUBITO, non 'quando ci pensi'. Altrimenti il gap si accumula e diventa psicologicamente impossibile da colmare.",
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
        title: "🧠 Quiz finale: il tuo sistema sotto stress",
        content: "Hai imparato i principi del risparmio automatico: automatizzare, definire obiettivi numerici, mantenere la continuità anche nei mesi difficili.\n\nOra mettiamo tutto insieme con un quiz pratico. Le domande simulano situazioni reali che potresti incontrare.\n\nRicorda i principi chiave:\n• L'automatismo elimina la fatica decisionale\n• La continuità batte il volume\n• Ridurre è meglio che fermarsi\n• Il recupero va pianificato subito\n\nNon preoccuparti se sbagli: ogni errore è un'opportunità per consolidare il concetto.",
      },
      {
        kind: "explain",
        title: "📌 Come rispondere: il criterio guida",
        content: "Quando rispondi, applica sempre questo criterio: **massimizza continuità e sostenibilità, non aggressività**.\n\nUna risposta 'aggressiva' (es. 'risparmio il massimo possibile') sembra vincente sulla carta, ma nella realtà porta a fallimenti quando arrivano gli imprevisti.\n\nUna risposta 'sostenibile' (es. 'risparmio una quota che posso mantenere sempre') sembra meno ambiziosa, ma nel lungo termine vince sempre.\n\nQuesto principio è lo stesso del budget: un piano realistico che rispetti batte un piano 'perfetto' che abbandoni dopo due mesi.",
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
        title: "✅ Cosa hai imparato: dal budget al risparmio automatico",
        content: "Complimenti! Hai completato la lezione sul risparmio automatico e abitudini. Vediamo cosa hai costruito:\n\n**Nella lezione precedente (Budget)** hai imparato a pianificare dove vanno i tuoi soldi.\n\n**In questa lezione** hai trasformato quel piano in un sistema automatico che funziona senza sforzo mentale.\n\n**Il principio chiave**: risparmiare bene non è una sfida di motivazione o forza di volontà. È un sistema replicabile che funziona anche quando sei stanco, stressato o demotivato.\n\nQuesto approccio 'sistema > motivazione' lo ritroverai in tutte le prossime lezioni: fondo emergenza, gestione debiti, investimenti.",
      },
      {
        kind: "explain",
        title: "📌 Le poche regole da ricordare",
        content: "Il risparmio automatico funziona con poche regole stabili. Non servono fogli Excel complicati o app costose.\n\n**Le tre regole essenziali:**\n\n1. **Quota base**: l'importo che trasferisci automaticamente ogni mese (es. 100€)\n\n2. **Quota minima**: l'importo ridotto per i mesi difficili (es. 60€), definito IN ANTICIPO\n\n3. **Check mensile**: un controllo veloce per vedere se sei in linea col piano, e attivare il recupero se necessario\n\nCon queste tre regole, il sistema si gestisce quasi da solo. Nella prossima lezione sul fondo emergenza vedrai come applicare lo stesso approccio per costruire il tuo cuscinetto di sicurezza.",
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
