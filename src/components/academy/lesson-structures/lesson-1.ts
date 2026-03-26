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
<<<<<<< HEAD
          "Il budget non è una prigione per i tuoi soldi, ma uno strumento di illuminazione finanziaria. Come insegna l'approccio difensivo di Benjamin Graham, investire o gestire il capitale senza un piano strutturato equivale a speculare alla cieca, esponendosi inevitabilmente a un rischio di rovina permanente. Un budget personale è essenzialmente una decisione anticipata: definisci dove devono andare i tuoi soldi prima che ti sfuggano tra le mani. Questo metodo riduce alla radice gli errori impulsivi dettati dalle emozioni momentanee o dalle fluttuazioni di mercato, offrendoti il controllo totale. Avere un piano chiaro ti permette non solo di evitare l'indebitamento per spese non essenziali, ma anche di costruire con rigore quel 'Margine di Sicurezza' vitale per sopportare gli imprevisti. Insomma, governare le uscite con consapevolezza è il primo, insostituibile passo per ogni investitore intelligente.",
=======
          "Un **budget** è semplicemente un piano per i tuoi soldi.\n\nImmagina di avere una torta (il tuo stipendio) e di doverla dividere in fette:\n\n• Una fetta per l'affitto\n• Una fetta per il cibo\n• Una fetta per il risparmio\n• Una fetta per lo svago\n\nIl budget ti dice quanto deve essere grande ogni fetta **prima** di spendere, non dopo.",
>>>>>>> 6c8f038a135601d721670ce50a860c69236251e8
      },
      {
        kind: "explain",
        title: "📌 Perché serve un budget?",
        content:
<<<<<<< HEAD
          "Un budget efficace si basa su pilastri solidi e inequivocabili, senza bisogno di formule matematiche incomprensibili. In sostanza, un budget personale minimo prevede tre macro-aree fondamentali: entrate nette (il vero carburante del tuo sistema), spese essenziali (le fondamenta della tua vita, come affitto, bollette, alimentari di base) e spese variabili (tutto ciò che riguarda lo stile di vita, lo svago e le scelte discrezionali). Conoscere questi tre numeri con estrema precisione ti garantisce un vantaggio competitivo enorme: sai già, giorno per giorno, come amministrare il mese. Inoltre, è cruciale prevedere sempre una quota inamovibile destinata al risparmio o all'investimento (spesso definita come 'paga prima te stesso'). Questo sistema non richiede un tracciamento ossessivo del singolo centesimo, ma piuttosto un controllo delle proporzioni: se le categorie essenziali divorano l'80% delle tue entrate nette, il tuo budget è in una condizione di fragilità e necessita di un intervento immediato e ragionato.",
      },
      {
        kind: "question",
        title: "Approfondimento",
        content:
          "Domanda didattica per testare la solidità del tuo metodo decisionale: perché fissare un tetto prima di spendere è infinitamente più efficace nel ridurre gli sforamenti rispetto al semplice controllo a consuntivo fatto a fine mese? Immagina l'approccio di un investitore razionale che stabilisce le sue regole prima che i mercati aprano, rispetto a chi si limita a contare i danni dopo il crollo. Decidere in anticipo sottrae potere alle emozioni, alle pubblicità e all'urgenza del momento, ancorandoti a un principio logico predeterminato quando la mente è ancora lucida e focalizzata sull'obiettivo di lungo periodo. D'altronde, il tracciamento a posteriori registra la storia, mentre la pianificazione a priori costruisce concretamente il futuro.",
        pollAreas: [
          {
            id: "concept-cause",
            prompt: "Qual è la causa principale degli sforamenti senza un budget strutturato?",
            options: [
              "Decisioni prese sotto pressione emotiva nel momento dell'acquisto",
              "Mancanza di entrate sufficienti in senso assoluto o strutturale",
              "Uso di troppe micro-categorie di spesa che confondono l'esito finale",
=======
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
>>>>>>> 6c8f038a135601d721670ce50a860c69236251e8
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
<<<<<<< HEAD
          "Scenario pratico: immagina di disporre di entrate nette pari a 1.850 euro mensili. Come traduci questo numero in un piano d'azione razionale e metodologico? \nPassi chiari e inequivocabili:\n1) Assegna innanzitutto 1.100 euro alle spese essenziali (affitto, bollette, assicurazioni, cibo base).\n2) Destina direttamente, prima di qualsiasi tentazione, 300 euro al risparmio o agli investimenti di lungo corso, creando il tuo Margine di Sicurezza in anticipo.\n3) Il residuo (450 euro) costituisce il tuo reale limite invalicabile per le spese variabili e discrezionali.\nSoluzione attesa: il piano risulta matematicamente e logicamente sostenibile perché la somma totale (1.100 + 450 + 300) equivale esattamente a 1.850 euro. Soprattutto, il risparmio non è lasciato al caso (cioè 'quello che avanza a fine mese'), ma è rigorosamente pre-allocato, seguendo il principio chiave per non erodere stupidamente il patrimonio.",
        pollAreas: [
          {
            id: "concept-solve",
            prompt: "Qual è la prima verifica numerica e logica da effettuare in questo esercizio?",
            options: [
              "Controllare rigorosamente che la somma algebrica delle categorie sia uguale alle entrate",
              "Aumentare subito la quota di spesa variabile riducendo le aspettative",
              "Eliminare del tutto la voce 'risparmio' per garantirsi più liquidità nel breve termine",
=======
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
>>>>>>> 6c8f038a135601d721670ce50a860c69236251e8
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
<<<<<<< HEAD
        title: "Focus",
        content: "L'efficacia reale di un budget non risiede nella perfezione estetica del foglio Excel o nella miriade di categorie create, ma nella sua visibilità e sistematicità operativa. Proprio come l'analisi periodica che Graham suggeriva per le azioni, un budget invisibile o ignorato diventa rapidamente carta straccia. Il funzionamento del sistema richiede che tu stabilisca un limite categorico chiaro e lo abbini a un check-up ricorrente e implacabilmente breve. Senza una frizione cognitiva utile e senza una misurazione costante dei progressi, la derivazione comportamentale prende il sopravvento. Rendi i tuoi obiettivi finanziari trasparenti a te stesso, aggiornando le informazioni in modo sufficientemente frequente per correggere la rotta prima che un piccolo sbandamento si trasformi in una vera e propria rottura strutturale.",
=======
        title: "🛠️ Come monitorare il budget",
        content:
          "Avere un budget scritto non basta. Devi **controllarlo regolarmente**.\n\nMa attenzione: non serve ossessionarsi!\n\nBastano **5 minuti a settimana** per:\n• Vedere quanto hai speso\n• Confrontare con il piano\n• Correggere se stai sforando",
>>>>>>> 6c8f038a135601d721670ce50a860c69236251e8
      },
      {
        kind: "explain",
        title: "📌 Il check settimanale",
        content:
<<<<<<< HEAD
          "La complessità estrema è spesso nemica giurata dell'investitore privato e del risparmiatore cittadino moderno. Non serve, e anzi spesso risulta essere controproducente, un foglio elettronico sterminato che richiede ore per la quadratura del singolo spicciolo speso al distributore automatico. Quello di cui hai realmente bisogno è un tracciamento agile e settimanale: una tabella minimalista in cui confronti rapidamente ciò che hai speso con il residuo allocato per quel periodo, identificando subito la correzione da apportare. Il fine ultimo non è mai la precisione millimetrica della rendicontazione contabile, bensì la tempestività della correzione. Se scopri di aver superato un budget a metà settimana, l'azione correttiva è limitata al weekend; se lo scopri alla fine del mese, il danno è ormai un fatto storico irreparabile. Adotta l'abitudine difensiva di revisionare la rotta di frequente, ma per pochi minuti alla volta.",
      },
      {
        kind: "question",
        title: "Approfondimento",
        content: "Domanda didattica centrale per rafforzare l'abitudine analitica: quale è l'indicatore guida (leading indicator) che ti permette di accorgerti prima del tempo che il tuo budget sta pericolosamente deragliando dai suoi binari originari? Pensa alla differenza radicale tra osservare lo specchietto retrovisore a fine mese e guardare lo scostamento giornaliero del budget discrezionale. Un buon investitore guarda i segnali anticipatori: il tasso di esaurimento del budget ('burn rate') nei primi dieci giorni del mese è spesso un indicatore ben più predittivo del saldo residuo riportato al ventottesimo giorno. Monitorare con rigore il consumo precoce della quota discrezionale protegge inevitabilmente e direttamente il capitale destinato all'investimento a lungo termine.",
=======
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
>>>>>>> 6c8f038a135601d721670ce50a860c69236251e8
      },
      {
        kind: "focus",
        title: "⚡ Cosa fare se stai sforando",
        content:
<<<<<<< HEAD
          "Scenario pratico e frequente: hai fissato un tetto settimanale rigido di 95 euro per coprire le spese non essenziali (uscite, sfizi, caffè). Tuttavia, arrivi al venerdì pomeriggio e ti accorgi di aver già speso 82 euro, in anticipo sulla tabella di marcia. Come correggere efficacemente il tiro? \nI passi metodologici da seguire:\n1) Calcola immediatamente il residuo oggettivo senza mentire a te stesso: rimangono esattamente 13 euro a disposizione.\n2) Identifica tra le spese in programma per il fine settimana almeno un'uscita totalmente rinviabile, superflua o cancellabile.\n3) Imposta un limite categorico per il weekend, imponendoti di non superare per alcun motivo la soglia residua, pena l'erosione ingiustificata dei risparmi accumulati altrove.\nSoluzione logica: il limite per il weekend è blindato a 13 euro, abbinato al rinvio cosciente e proattivo di almeno una spesa discrezionale, riportando così in equilibrio il sistema.",
=======
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
>>>>>>> 6c8f038a135601d721670ce50a860c69236251e8
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
<<<<<<< HEAD
        title: "Focus",
        content: "Il vero banco di prova per l'efficacia del tuo budget non è la gestione di settimane noiose o di mesi finanziariamente perfetti, in cui ogni flusso ricalca le aspettative matematiche. Il vero test si manifesta in modo prepotente quando una settimana si dimostra clamorosamente irregolare, portando imprevisti, inviti inaspettati o micro-spese urgenti. È in tali frangenti, che simulano la natura caotica dei mercati finanziari o le recessioni cicliche descritte nei tomi di economia, che la solidità della tua pianificazione subisce lo stress test decisivo. Riuscire a mantenere il sangue freddo, inquadrare l'anomalia e assorbirla senza gettare alle fiamme l'intero piano finanziario mensile costituisce il passaggio evolutivo fondamentale tra un apprendista e un manager oculato delle proprie risorse economiche.",
=======
        title: "⚡ Quando il budget viene messo alla prova",
        content:
          "Il vero test non sono le settimane normali.\n\nÈ quando arriva:\n• Una bolletta più alta del solito\n• Un invito a cena inaspettato\n• Una riparazione urgente\n• Un'offerta 'imperdibile'\n\nIn questi momenti il budget viene **testato**. E tu devi avere un piano.",
>>>>>>> 6c8f038a135601d721670ce50a860c69236251e8
      },
      {
        kind: "explain",
        title: "📌 La differenza tra errore e problema strutturale",
        content:
<<<<<<< HEAD
          "Nell'inevitabile eventualità di un superamento del tetto prefissato, la reazione istintiva – e più deleteria possibile – è quella di scartare con frustrazione l'intera pianificazione, convincendosi segretamente che 'il budget non fa per me'. Al contrario, l'approccio intellettualmente onesto e risolutivo prevede l'applicazione di una semplice, rigorosa regola di recupero matematico. Invece di cedere al panico o annullare la quota sacrosanta destinata al risparmio o agli investimenti di lungo corso, si attua una decurtazione progressiva e compensativa direttamente sulle categorie opzionali relative alla settimana o quindicina successiva. Come avviene nei fondi comuni o nei portafogli modello a seguito di forti fluttuazioni di mercato (drawdown), il ribilanciamento tempestivo ristabilisce l'equilibrio strutturale del sistema originario eliminando le risposte cariche di emotività regressiva.",
      },
      {
        kind: "question",
        title: "Approfondimento",
        content: "Domanda didattica per esercitare l'intelligenza critica rispetto al proprio comportamento economico: quale divergenza fondamentale sussiste tra un errore occasionale di calcolo (come dimenticarsi l'assicurazione auto annuale o cedere a una singola cena costosa) rispetto a un budget che può esser definito strutturalmente irrealistico fin dalle sue prime fondamenta? Nel primo caso palese, l'intervento chirurgico da applicare è semplicemente una dilazione metodica dei consumi discrezionali nel successivo arco temporale. Nel secondo, invece, si richiede ben più che una toppa: occorre una revisione radicale delle macro-assegnazioni percentuali, in quanto l'intero tenore di vita atteso risulta palesemente al di sopra delle reali possibilità oggettive imposte dalle entrate.",
=======
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
>>>>>>> 6c8f038a135601d721670ce50a860c69236251e8
      },
      {
        kind: "focus",
        title: "🛡️ Come recuperare uno sforamento",
        content:
<<<<<<< HEAD
          "Scenario d'esame tipico ma insidioso: hai sforato inequivocabilmente il tuo budget settimanale di 28 euro, accumulando quello che in gergo tecnico possiamo definire un 'deficit provvisorio'. Come affronti l'ammanco senza destrutturare l'equilibrio di lungo periodo?\nI passi tattici da applicare con assoluta imparzialità:\n1) Intervieni attivamente sulla settimana entrante recuperando 18 euro falcidiandoli dal budget 'svago e divertimento'.\n2) Compensa i restanti 10 euro sforzandoti di escludere dalla tua routine settimanale alcune micro-spese superflue (ad esempio un paio di pause caffè, snaks e via dicendo).\n3) Soprattutto, mantieni sacra e intoccabile la tua quota prestabilita del risparmio mensile.\nSoluzione vincente: in questo scenario virtuoso un recupero quantitativamente completo si conclude nel breve periodo – nell'arco ridotto di 7 giorni precisi – senza che il veicolo principale della crescita del tuo patrimonio (il risparmio) venga mai interrotto o intaccato per colpa dell'emergenza.",
=======
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
>>>>>>> 6c8f038a135601d721670ce50a860c69236251e8
      },
    ],
  },
  quiz: {
    nodeKey: "quiz",
    criteria: ["integration", "application"],
    blocks: [
      {
        kind: "focus",
<<<<<<< HEAD
        title: "Focus",
        content: "Siamo arrivati al quiz valutativo finale, momento nevralgico progettato per accertare analiticamente la tua effettiva capacità di tradurre le direttive del budget in decisioni veloci, fredde, spietate e maledettamente pratiche nella tua vita reale. L'intelligenza finanziaria – come ci insegnano storicamente i testi di analisi dei bilanci e di gestione strategica dei portafogli patrimoniali – non può che confermarsi attraverso la ferrea trasposizione delle astrazioni matematiche in comportamenti abituali prevedibili ed economicamente coerenti. Considera questo quiz come una simulazione in totale sicurezza, un laboratorio controllato in cui ogni tua risposta riflette meticolosamente il tuo approccio intellettuale nei confronti delle turbolenze quotidiane.",
      },
      {
        kind: "explain",
        title: "Spiegazione rapida",
        content:
          "Oltre a fidarti della primissima reazione istintuale, prova a rispondere argomentando criticamente sui freddi dati numerici a tua disposizione. Segui questo ordine logico d'attacco: in primo luogo verifica sempre l'equilibro macroeconomico fondamentale, ovverosia che non ci sia alcuna defezione algebrica tra le entrate certe e le stime in uscita. Solo poi dedica l'attenzione analitica alle asimmetrie all'interno delle specifiche sotto-priorità di spesa e, come ultimo livello d'azione, progetta lucidamente il piano di correzione da impostare settimanalmente per limitare ogni deviazione di bilancio. Chi riesce sistematicamente a pensare per compartimenti stagni in situazioni inattese preserva il nucleo del proprio patrimonio nel tempo.",
      },
      {
        kind: "question",
        title: "Domanda 1",
        content: "A fronte di un totale di entrate nette garantite di 2.100 euro per l'intero arco mensile, quale struttura e proporzione di spesa risulta indiscutibilmente la più resiliente e metodologicamente robusta contro potenziali shock o cicli economici avversi?",
        pollAreas: [
          {
            id: "quiz-q1",
            prompt: "Esamina e seleziona la risposta strategicamente migliore e fondata sul concetto di risparmio protettivo.",
            options: [
              "Fondo spese essenziali 1.250 euro, variabili/svago a 500 euro, accumulo risparmio garantito a 350 euro (Modello strutturalmente resiliente)",
              "Fondo spese essenziali 1.500 euro, variabili/svago a 600 euro, accumulo marginale a 50 euro (Modello sbilanciato sul consumo base)",
              "Fondo spese essenziali 1.000 euro, variabili/svago a 1.000 euro, accumulo marginale a 100 euro (Modello ad alta volatilità comportamentale)",
            ],
            allowText: true,
          },
          {
            id: "quiz-q1-why",
            prompt: "Palesa le motivazioni della tua opzione. Qual è il principio in base al quale la struttura garantisce maggiore protezione per i capitali di lungo corso?",
            allowText: true,
=======
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
>>>>>>> 6c8f038a135601d721670ce50a860c69236251e8
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 2: Il check del budget",
        content:
<<<<<<< HEAD
          "Prendiamo le redini del comando del tuo budget in uno scenario ad alta criticità: in sole due settimane sei tragicamente riuscito a consumare ben il 70% dell'intero ammontare mensile dedicato alle spese di tipo variabile/svago. Come argini l'emorragia finanziaria?\nIl protocollo suggerito si divide in tre azioni:\n1) Estrapola, basandoti sul trend odierno, una stima oggettiva dello sforamento netto finale previsto arrivando all'ultimo del mese con questo pericolosissimo ritmo di spesa.\n2) Calcola il valore puntuale dell'ammanco potenziale confrontandolo con la tua liquidità.\n3) Proponi due interventi correttivi fulminei senza dover far debito.\nLa soluzione intellettualmente più robusta ed ineccepibile esigerà a denti stretti: l'abbassamento a zero di gran parte delle categorie ultra-discrezionali affiancato alla fissazione di un minuscolo e rigidissimo tetto giornaliero ammissibile calcolato sui giorni restanti.",
        pollAreas: [
          {
            id: "quiz-case",
            prompt: "Esaminata l'urgenza, qual è da considerarsi in principio la primissima mossa correttiva in assoluto più efficace e di facile implementazione?",
            options: [
              "Falciare drasticamente e istantaneamente la singola voce più alta appartenente alle categorie puramente discrezionali (come l'entertainment o l'abbigliamento impulsivo)",
              "Concedersi indulgenza e innalzare in modo postumo il budget variabile, corrodendo direttamente la quota risparmio",
              "Ignorare momentaneamente la problematica e far la resa dei conti definitiva sul cruscotto a fine trentina del mese",
=======
          "È il 15 del mese. Marco controlla il budget e scopre di aver già speso il 70% del budget variabile mensile.\n\n**Cosa dovrebbe fare Marco?**",
        pollAreas: [
          {
            id: "quiz-q2",
            prompt: "Qual è la mossa corretta?",
            options: [
              "Tagliare subito le spese non essenziali per le prossime 2 settimane",
              "Aspettare fine mese e vedere se riesce a rientrare",
              "Prendere dal risparmio per avere più margine",
>>>>>>> 6c8f038a135601d721670ce50a860c69236251e8
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
<<<<<<< HEAD
        title: "Focus",
        content: "Eccoci alla conclusione fondamentale: un budget davvero ben architettato e collaudato diventa un indispensabile motore algebrico in grado di garantirti calma e raziocinio perfino quando i mesi sembrano accanirsi in un disordine sistemico imprevisto. Come la disciplina impone di non lasciarsi prendere dal panico a fronte del primo ribasso borsistico inaspettato (i famosi crolli di liquidabilità illustrati copiosamente in letteratura finanziaria), parimenti una pianificazione delle proprie finanze personali permette di incollare le tessere del puzzle e rispondere ad ogni turbolenza con assoluta impassibilità, salvaguardando il futuro dei propri progetti economici più determinanti.",
      },
      {
        kind: "explain",
        title: "Spiegazione rapida",
        content: "Nella creazione della ricchezza personale trionfa quasi esclusivamente un singolo fattore imperativo e rarissimo da ravvisare tra i risparmiatori indisciplinati: una banale, formidabile costanza d'intenti. Ritagliarsi anche un infinitesimo angolo ritmato – soli benedetti dieci minuti da dedicare sistematicamente la domenica o il lunedì d'ogni singola settimana per monitorare entrate, uscite e scostamenti vari – sconfigge sonoramente, sempre e ad ogni giro contabile della spesa, l'approccio emotivo di chi ignora sistematicamente lo stato del bilancio nel mese, demandando interamente ogni speranza unicamente per riscontrarne unicamente i danni catastrofici del residuo sul tabulato bancario mensile dell'estratto conto finale.",
      },
      {
        kind: "question",
        title: "Approfondimento",
        content: "Tra le molteplici opzioni tattiche discusse e valutate assieme durante tutto il decorso del corso base sul bilanciamento e sui flussi della spesa razionale: esattamente quale ferrea e irrinunciabile direttiva regolatrice hai solidamente optato d'estrapolare, e successivamente mantenere saldamente applicata d'ufficio per guidare al buio le decisioni pratiche senza cedere allo stress incombente delle giornate durante le incombenti successive 4 lunghissime settimane e trenta faticosi giorni calendari?",
      },
      {
        kind: "exercise",
        title: "Esempio guidato",
        content: "Sigla, e codifica ufficialmente senza incertezza, nero puro primario su sfondo bianco acceso, una promessa formale un autenticamente invalicabile patto d'opera comportamentale vincolante rivolto esclusivamente rivolto a sorvegliare minuziosamente al tuo preziosissimo futuro io interiore: impalcatura del limite massimo imposto in budget della liquidità in uscita da scoccare per le variabili settimanali, allocazione prefissata del giorno inconfondibilmente intoccabile programmato con avviso su agenda per dedicarsi all'auditing e check di allineamento e infine progetta lucidamente che drastica tipologia ed entità della correzione, quale tassonomica contromisura compensativa applicherai come punizione auto-diregoltiva ri-equilibrativa quando si rileverà ed accerterà oggettivamente un'infrazione allo schema originario del budget limitato che hai progettato.",
      },
    ],
    suggestedPrompts: [
      "Aiutami a costruire il mio budget mensile completo bilanciando la quota di accantonamento",
      "Specificatamente, a livello settimanale che macro e micro categorie devo far monitorare con regolarità per scongiurare derive e default?",
      "Cortesemente, formula rapidamente per mia utilità immediata una singola direttiva stringente, un argine metodologico inoppugnabile contro gli sforamenti improvvisi, limitata concisamente ed essenziale, orientata alla drastica riduzione delle uscite in caso d'emergenza, facile da assimilare per salvaguardare capitali preziosissimi",
=======
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
>>>>>>> 6c8f038a135601d721670ce50a860c69236251e8
    ],
  },
};

const lesson1Definition = createStaticLessonDefinition("1", content);

export default lesson1Definition;
