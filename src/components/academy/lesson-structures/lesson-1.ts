import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "integration"],
    blocks: [
      {
        kind: "focus",
        title: "💡 Cos'è un budget?",
        content:
          "Un **budget** è semplicemente un piano per i tuoi soldi.\n\nImmagina di avere una torta (il tuo stipendio) e di doverla dividere in fette:\n\n• Una fetta per l'affitto\n• Una fetta per il cibo\n• Una fetta per il risparmio\n• Una fetta per lo svago\n\nIl budget ti dice quanto deve essere grande ogni fetta **prima** di spendere, non dopo.",
      },
      {
        kind: "explain",
        title: "📌 Perché serve un budget?",
        content:
          "Senza budget, i soldi 'spariscono' senza che tu sappia dove.\n\nCon un budget:\n\n• Sai esattamente dove vanno i tuoi soldi\n• Eviti di arrivare a fine mese senza niente\n• Puoi mettere da parte soldi per il futuro\n• Riduci lo stress quando arrivano spese impreviste",
      },
      {
        kind: "question",
        title: "🧠 Verifichiamo: cos'è un budget?",
        content: "Bene, vediamo se hai colto il concetto principale.\n\n**Cos'è un budget personale?**",
        pollAreas: [
          {
            id: "concept-q1",
            prompt: "Seleziona la definizione corretta di budget",
            options: [
              "Un piano che decide dove vanno i soldi PRIMA di spenderli",
              "Un controllo che fai a fine mese per vedere dove sono andati i soldi",
              "Un foglio Excel complicato che solo gli esperti sanno usare",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Il budget è un **piano anticipato**. Decidi prima dove devono andare i tuoi soldi, così quando li ricevi sai già cosa fare. Questo ti dà il controllo invece di rincorrere le spese.",
            wrongExplanation: "Non proprio. Il budget non è un controllo a posteriori né qualcosa di complicato.\n\n**Il budget è un piano anticipato**: decidi PRIMA dove devono andare i tuoi soldi.\n\nPensa così: è come fare la lista della spesa prima di andare al supermercato, invece di comprare a caso e poi chiederti 'ma quanto ho speso?'.\n\nQuesto semplice cambio di prospettiva fa tutta la differenza.",
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🛡️ I tre pilastri del budget",
        content:
          "Un budget semplice ha solo tre categorie:\n\n**1. Spese essenziali** (affitto, bollette, cibo, trasporti)\nSono le spese che DEVI fare per vivere.\n\n**2. Risparmio** (metti da parte PRIMA di spendere)\nNon è 'quello che avanza'. È una fetta che tagli subito.\n\n**3. Spese variabili** (svago, shopping, uscite)\nQuello che rimane dopo essenziali e risparmio.",
      },
      {
        kind: "explain",
        title: "📊 La regola d'oro: paga prima te stesso",
        content:
          "Il segreto è semplice: appena ricevi lo stipendio, **metti subito da parte il risparmio**.\n\nNon aspettare di vedere 'cosa avanza' a fine mese, perché non avanzerà mai niente.\n\n**Esempio pratico:**\n• Stipendio: 1.500€\n• Risparmio immediato: 150€ (il 10%)\n• Ora hai 1.350€ per tutto il resto\n\nQuei 150€ sono 'spariti' dal tuo conto corrente, ma in realtà sono al sicuro per te.",
      },
      {
        kind: "question",
        title: "🧠 Verifichiamo: l'ordine giusto",
        content: "Hai ricevuto lo stipendio. In che ordine dovresti gestire i soldi?",
        pollAreas: [
          {
            id: "concept-q2",
            prompt: "Qual è l'ordine corretto?",
            options: [
              "Spendi per essenziali → Spendi per svago → Risparmia quello che avanza",
              "Risparmia una quota fissa → Paga essenziali → Svago con il resto",
              "Calcola tutto a fine mese e vedi se puoi risparmiare",
            ],
            correctIndex: 1,
            correctExplanation: "Perfetto! Prima **risparmi** (paga te stesso), poi paghi le **spese essenziali**, infine usi il resto per **svago e variabili**. Questo garantisce che il risparmio non venga 'mangiato' dalle spese.",
            wrongExplanation: "Attenzione, l'ordine è fondamentale!\n\nSe aspetti di vedere cosa avanza, non avanzerà mai niente. È psicologia umana: tendiamo a spendere tutto quello che abbiamo disponibile.\n\n**L'ordine corretto è:**\n1. Risparmia subito una quota fissa (es. 10%)\n2. Paga le spese essenziali\n3. Usa il resto per svago\n\nCosì il risparmio è **garantito**, non è un 'forse'.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Verifichiamo: un budget concreto",
        content:
          "Mario guadagna 1.800€ al mese. Decide di dividere così:\n\n• 1.100€ per spese essenziali\n• 200€ per risparmio\n• 500€ per spese variabili\n\n**Qual è la prima cosa che Mario deve verificare?**",
        pollAreas: [
          {
            id: "concept-q3",
            prompt: "Cosa deve controllare Mario?",
            options: [
              "Che la somma faccia 1.800€ (non di più, non di meno)",
              "Se 500€ di svago sono abbastanza",
              "Se può ridurre il risparmio per avere più svago",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! La prima regola del budget: **le uscite devono essere uguali alle entrate**.\n\n1.100 + 200 + 500 = 1.800€ ✓\n\nIl budget 'quadra'. Se la somma fosse stata 1.900€, Mario avrebbe pianificato di spendere più di quanto guadagna = debito garantito.",
            wrongExplanation: "La prima verifica è sempre **matematica**: le uscite devono essere uguali alle entrate.\n\n1.100 + 200 + 500 = 1.800€ ✓\n\nSe la somma fosse stata maggiore di 1.800€, Mario avrebbe pianificato di spendere più di quanto guadagna. Questo porta inevitabilmente al debito.\n\nSolo dopo aver verificato che il budget 'quadra', puoi ragionare su come distribuire meglio le fette.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Definisco i 3 numeri base", "Imposto un tetto per categoria", "Scrivo la mia regola mensile"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "🛠️ Come monitorare il budget",
        content:
          "Avere un budget scritto non basta. Devi **controllarlo regolarmente**.\n\nMa attenzione: non serve ossessionarsi!\n\nBastano **5 minuti a settimana** per:\n• Vedere quanto hai speso\n• Confrontare con il piano\n• Correggere se stai sforando",
      },
      {
        kind: "explain",
        title: "📌 Il check settimanale",
        content:
          "Scegli un giorno fisso (es. la domenica sera) e fai un check veloce:\n\n**Domande da farti:**\n• Quanto ho speso questa settimana?\n• Sono dentro i limiti?\n• Se sto sforando, dove taglio?\n\nNon serve un'app complicata. Basta guardare il saldo e le ultime transazioni.",
      },
      {
        kind: "question",
        title: "🧠 Verifichiamo: quando controllare?",
        content: "Ogni quanto dovresti controllare il tuo budget?",
        pollAreas: [
          {
            id: "widget-q1",
            prompt: "Qual è la frequenza migliore?",
            options: [
              "Una volta a settimana, sempre lo stesso giorno",
              "Solo a fine mese quando arriva l'estratto conto",
              "Ogni volta che fai un acquisto",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! Il check **settimanale** è l'equilibrio ideale:\n\n• Non è ossessivo come controllare ogni acquisto\n• Non è troppo tardi come aspettare fine mese\n• Ti dà tempo di correggere se stai sforando\n\nScegli un giorno fisso (es. domenica sera) e in 5 minuti sei a posto.",
            wrongExplanation: "Controllare a fine mese è troppo tardi: se hai sforato, ormai è fatta.\n\nControllare ogni acquisto è stressante e insostenibile.\n\n**Il check settimanale è l'equilibrio perfetto:**\n• Ti dà visibilità su come stai andando\n• Hai tempo di correggere se stai sforando\n• Non ti stressa\n\nScegli un giorno fisso (es. domenica sera) e dedicaci 5 minuti. È tutto quello che serve.",
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "⚡ Cosa fare se stai sforando",
        content:
          "È venerdì, controlli il budget e scopri che stai sforando.\n\nNiente panico! Hai ancora tempo per correggere.\n\n**Le mosse possibili:**\n• Rimandare spese non urgenti alla settimana prossima\n• Tagliare qualcosa di opzionale questo weekend\n• Cucinare a casa invece di ordinare\n\nL'importante è **agire subito**, non ignorare il problema.",
      },
      {
        kind: "question",
        title: "🧠 Verifichiamo: scenario pratico",
        content:
          "Hai un budget settimanale di 100€ per spese variabili.\n\nÈ venerdì e hai già speso 85€.\n\nTi rimangono 15€ per il weekend.\n\n**Cosa fai?**",
        pollAreas: [
          {
            id: "widget-q2",
            prompt: "Qual è la mossa corretta?",
            options: [
              "Rispetti il limite di 15€ per il weekend",
              "Prendi 50€ dal fondo risparmio, tanto li rimetti dopo",
              "Ignori il limite, tanto la prossima settimana recuperi",
            ],
            correctIndex: 0,
            correctExplanation: "Bravo! Rispettare il limite insegna **disciplina**.\n\n15€ per un weekend non sono tanti, ma ti costringono a:\n• Fare scelte consapevoli\n• Evitare sprechi\n• Sentirti orgoglioso lunedì\n\nOgni volta che rispetti il budget, rafforzi l'abitudine. E 15€ per un weekend non è impossibile: cucini a casa, fai una passeggiata invece di uscire a pagamento.",
            wrongExplanation: "Attenzione a queste trappole mentali!\n\n**'Prendo dal risparmio, poi rimetto'**: Spoiler, non rimetterai mai. È sempre così.\n\n**'La prossima settimana recupero'**: Anche questo non succede mai. Ogni settimana ha le sue spese.\n\n**La mossa corretta è rispettare i 15€**:\n• Ti insegna disciplina\n• Rafforza l'abitudine al budget\n• 15€ per un weekend sono gestibili (cucini a casa, fai attività gratuite)\n\nLa difficoltà di oggi costruisce la sicurezza di domani.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Faccio check settimanale", "Correggo prima del weekend", "Tengo una categoria cuscinetto"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "caring"],
    blocks: [
      {
        kind: "focus",
        title: "⚡ Quando il budget viene messo alla prova",
        content:
          "Il vero test non sono le settimane normali.\n\nÈ quando arriva:\n• Una bolletta più alta del solito\n• Un invito a cena inaspettato\n• Una riparazione urgente\n• Un'offerta 'imperdibile'\n\nIn questi momenti il budget viene **testato**. E tu devi avere un piano.",
      },
      {
        kind: "explain",
        title: "📌 La differenza tra errore e problema strutturale",
        content:
          "**Errore occasionale**: hai sforato di 30€ questa settimana perché c'era il compleanno di un amico.\n→ Si recupera la settimana prossima tagliando qualcosa.\n\n**Problema strutturale**: sfori OGNI settimana di 50€.\n→ Il budget è sbagliato, va rivisto completamente.\n\nLa differenza è importante: l'errore si compensa, il problema strutturale si risolve cambiando il piano.",
      },
      {
        kind: "question",
        title: "🧠 Verifichiamo: errore o problema?",
        content:
          "Negli ultimi 4 mesi hai sforato il budget variabile:\n\n• Mese 1: sforato di 80€\n• Mese 2: sforato di 65€\n• Mese 3: sforato di 90€\n• Mese 4: sforato di 70€\n\n**Cosa sta succedendo?**",
        pollAreas: [
          {
            id: "challenge-q1",
            prompt: "Di cosa si tratta?",
            options: [
              "Problema strutturale: il budget è irrealistico e va rivisto",
              "Errori occasionali: capita, recupero nei prossimi mesi",
              "Sfiga: sono stati mesi particolarmente sfortunati",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Se sfori **ogni mese** per importi simili, non è sfiga: è un budget irrealistico.\n\nLa soluzione non è 'essere più disciplinati' ma **rivedere i numeri**:\n• Forse le spese essenziali sono più alte di quanto pensavi\n• Forse hai sottostimato le spese variabili\n• Forse devi ridurre temporaneamente il risparmio\n\nUn budget realistico batte un budget perfetto sulla carta ma impossibile da seguire.",
            wrongExplanation: "Sfori **ogni mese** per importi simili. Questo non è sfiga né errori occasionali.\n\n**È un problema strutturale**: il budget che hai scritto non riflette la tua vita reale.\n\nLa soluzione? **Rivedi i numeri**:\n• Forse hai sottostimato le spese essenziali\n• Forse le spese variabili reali sono più alte\n• Meglio un budget realistico che rispetti, che uno 'perfetto' che sfori sempre\n\nNon sentirti in colpa: il budget va adattato alla realtà, non viceversa.",
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🛡️ Come recuperare uno sforamento",
        content:
          "Hai sforato di 30€ questa settimana. Come recuperi?\n\n**La regola: mai toccare il risparmio.**\n\nInvece:\n1. Identifica le spese opzionali della prossima settimana\n2. Taglia 30€ da quelle\n3. Torna in pari\n\n**Esempio:**\n• Sfori di 30€ questa settimana\n• Prossima settimana: niente aperitivo fuori (15€) + cucino invece di ordinare (15€)\n• Recuperato!",
      },
      {
        kind: "question",
        title: "🧠 Verifichiamo: piano di recupero",
        content:
          "Hai sforato il budget di 40€ questo mese.\n\nLa tua quota risparmio è 150€.\n\n**Come recuperi?**",
        pollAreas: [
          {
            id: "challenge-q2",
            prompt: "Qual è il piano corretto?",
            options: [
              "Taglio 40€ dalle spese opzionali del mese prossimo",
              "Questo mese risparmio solo 110€ invece di 150€",
              "Ignoro e riparto da zero il mese prossimo",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! Il risparmio è **sacro**.\n\nRecuperi dai tagli alle spese opzionali:\n• Meno uscite a cena\n• Meno acquisti non necessari\n• Più attenzione per qualche settimana\n\nQuesto ti insegna anche che le azioni hanno conseguenze. Sfori oggi → tagli domani. È una lezione importante.",
            wrongExplanation: "**Mai toccare il risparmio** per coprire sforamenti!\n\nSe prendi l'abitudine di usare il risparmio come 'cuscinetto', non risparmierai mai niente.\n\n**Il recupero corretto è tagliare le spese opzionali:**\n• Meno aperitivi\n• Cucina a casa\n• Rimanda un acquisto non urgente\n\nCosì impari anche che le azioni hanno conseguenze: sfori oggi, tagli domani. È una lezione preziosa.",
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
        title: "🧠 Quiz finale",
        content:
          "Ora mettiamo insieme tutto quello che hai imparato.\n\nRispondi alle domande per verificare di aver capito i concetti chiave del budget personale.\n\nNon preoccuparti se sbagli: ogni errore è un'opportunità per capire meglio.",
      },
      {
        kind: "question",
        title: "❓ Domanda 1: La struttura del budget",
        content:
          "Anna guadagna 2.000€ netti al mese.\n\nQuale di queste strutture di budget è più solida?",
        pollAreas: [
          {
            id: "quiz-q1",
            prompt: "Seleziona la struttura migliore",
            options: [
              "Essenziali 1.200€, Risparmio 300€, Variabili 500€",
              "Essenziali 1.400€, Risparmio 100€, Variabili 500€",
              "Essenziali 1.000€, Risparmio 200€, Variabili 800€",
            ],
            correctIndex: 0,
            correctExplanation: "Ottimo! Questa struttura:\n\n• **Essenziali al 60%** (1.200€): è sotto la soglia di allerta dell'80%\n• **Risparmio al 15%** (300€): è una quota significativa\n• **Variabili al 25%** (500€): c'è margine per vivere\n\nLa seconda opzione ha troppo poco risparmio (100€). La terza ha troppe variabili (800€) che saranno difficili da controllare.",
            wrongExplanation: "Analizziamo le opzioni:\n\n**Opzione A (corretta):**\n• Essenziali 60%, Risparmio 15%, Variabili 25%\n• Equilibrio sano tra tutte le aree\n\n**Opzione B (sbagliata):**\n• Solo 100€ di risparmio (5%) è troppo poco\n• In caso di emergenza non hai margine\n\n**Opzione C (sbagliata):**\n• 800€ di variabili (40%) sono difficili da controllare\n• Troppa 'libertà' porta a sprechi\n\nLa regola: **risparmio significativo + essenziali sotto l'80% + variabili ragionevoli**.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 2: Il check del budget",
        content:
          "È il 15 del mese. Marco controlla il budget e scopre di aver già speso il 70% del budget variabile mensile.\n\n**Cosa dovrebbe fare Marco?**",
        pollAreas: [
          {
            id: "quiz-q2",
            prompt: "Qual è la mossa corretta?",
            options: [
              "Tagliare subito le spese non essenziali per le prossime 2 settimane",
              "Aspettare fine mese e vedere se riesce a rientrare",
              "Prendere dal risparmio per avere più margine",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Marco deve **agire subito**.\n\nHa speso il 70% ma è solo a metà mese. Se continua così, sforerà.\n\n**Piano d'azione:**\n• Identificare le spese opzionali previste per le prossime 2 settimane\n• Tagliarle o rimandarle\n• Tenere traccia giornaliera fino a fine mese\n\nAgire a metà mese dà tempo per correggere. Aspettare è troppo rischioso.",
            wrongExplanation: "A metà mese con il 70% del budget già speso, Marco ha un problema.\n\n**Aspettare fine mese è pericoloso**: sarà troppo tardi per correggere.\n\n**Prendere dal risparmio è sbagliato**: crea un precedente pericoloso.\n\n**La mossa corretta è agire subito:**\n• Identificare spese tagliabili nelle prossime 2 settimane\n• Ridurre al minimo gli acquisti non necessari\n• Monitorare ogni giorno fino a fine mese\n\nIl vantaggio di controllare a metà mese è proprio questo: hai ancora tempo per correggere!",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 3: Il sistema completo",
        content: "Quali sono i tre elementi essenziali di un sistema di budget che funziona?",
        pollAreas: [
          {
            id: "quiz-q3",
            prompt: "Seleziona la risposta corretta",
            options: [
              "Limiti definiti + Check settimanale + Piano di recupero per sforamenti",
              "App costosa + Foglio Excel dettagliato + Consulente finanziario",
              "Buone intenzioni + Controllo a fine anno + Speranza che vada bene",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! Un sistema di budget efficace ha tre pilastri:\n\n**1. Limiti definiti**: sai esattamente quanto puoi spendere per categoria\n\n**2. Check settimanale**: controlli regolarmente se sei in linea\n\n**3. Piano di recupero**: sai cosa fare se sfori\n\nNon servono app costose o consulenti. Serve **metodo e costanza**.",
            wrongExplanation: "Un sistema di budget non richiede strumenti costosi o complicati.\n\n**I tre pilastri veri sono:**\n\n1. **Limiti definiti**: sapere esattamente quanto puoi spendere\n2. **Check settimanale**: controllare regolarmente\n3. **Piano di recupero**: sapere cosa fare quando sfori\n\nPuoi gestire tutto con carta e penna o un foglio Excel gratuito. La differenza la fa il **metodo**, non lo strumento.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Completo il quiz con numeri", "Rivedo il passaggio critico", "Chiudo con una regola personale"],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "caring"],
    blocks: [
      {
        kind: "focus",
        title: "✅ Cosa hai imparato",
        content:
          "Complimenti! Hai completato la lezione sul budget personale.\n\n**Concetti chiave:**\n\n• Il budget è un **piano anticipato** per i tuoi soldi\n• Prima **risparmi**, poi paghi essenziali, poi variabili\n• **Check settimanale** per restare in controllo\n• Se sfori, **recuperi dalle spese opzionali** (mai dal risparmio)\n• Errori occasionali si compensano, problemi strutturali richiedono revisione",
      },
      {
        kind: "explain",
        title: "📌 Il prossimo passo",
        content:
          "La teoria è importante, ma la pratica lo è di più.\n\n**Azione consigliata:**\n\nQuesta settimana, scrivi i tuoi 3 numeri:\n1. Entrate mensili nette\n2. Spese essenziali (affitto, bollette, cibo base, trasporti)\n3. Quanto vuoi risparmiare (inizia con il 10%)\n\nIl resto sarà il tuo budget per spese variabili.",
      },
      {
        kind: "question",
        title: "🎯 Il tuo impegno",
        content: "Quale azione concreta farai questa settimana per iniziare a controllare le tue finanze?",
        pollAreas: [
          {
            id: "feedback-commitment",
            prompt: "Scegli il tuo primo passo",
            options: [
              "Calcolo i miei 3 numeri (entrate, essenziali, risparmio)",
              "Imposto un check settimanale della domenica sera",
              "Creo un conto separato per il risparmio automatico",
            ],
            correctIndex: 0,
            correctExplanation: "Ottima scelta! Calcolare i 3 numeri è il **primo passo fondamentale**.\n\nSenza sapere quanto entra e quanto esce, non puoi pianificare nulla.\n\nPrenditi 15 minuti questa settimana:\n• Guarda gli ultimi 3 estratti conto\n• Calcola la media delle spese essenziali\n• Decidi quanto vuoi risparmiare\n\nDa lì costruirai tutto il resto.",
            wrongExplanation: "Tutte le opzioni sono valide! L'importante è **fare il primo passo**.\n\nSe hai scelto il check settimanale o il conto separato, perfetto. Ma assicurati prima di conoscere i tuoi numeri base.\n\n**Il consiglio:**\n1. Prima calcola entrate, essenziali e risparmio\n2. Poi imposta il check settimanale\n3. Poi automatizza il risparmio\n\nUn passo alla volta, senza fretta.",
            allowText: false,
          },
        ],
      },
    ],
    suggestedPrompts: [
      "Aiutami a costruire il mio budget mensile bilanciato",
      "Quali categorie devo monitorare settimanalmente?",
      "Dammi una regola semplice per ridurre le uscite in emergenza",
    ],
  },
};

const lesson1Definition = createStaticLessonDefinition("1", content);

export default lesson1Definition;
