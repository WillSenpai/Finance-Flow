import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "integration"],
    blocks: [
      {
        kind: "focus",
        title: "Focus",
        content:
          "Il budget non è una prigione per i tuoi soldi, ma uno strumento di illuminazione finanziaria. Come insegna l'approccio difensivo di Benjamin Graham, investire o gestire il capitale senza un piano strutturato equivale a speculare alla cieca, esponendosi inevitabilmente a un rischio di rovina permanente. Un budget personale è essenzialmente una decisione anticipata: definisci dove devono andare i tuoi soldi prima che ti sfuggano tra le mani. Questo metodo riduce alla radice gli errori impulsivi dettati dalle emozioni momentanee o dalle fluttuazioni di mercato, offrendoti il controllo totale. Avere un piano chiaro ti permette non solo di evitare l'indebitamento per spese non essenziali, ma anche di costruire con rigore quel 'Margine di Sicurezza' vitale per sopportare gli imprevisti. Insomma, governare le uscite con consapevolezza è il primo, insostituibile passo per ogni investitore intelligente.",
      },
      {
        kind: "explain",
        title: "Spiegazione rapida",
        content:
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
            ],
            allowText: true,
          },
        ],
      },
      {
        kind: "exercise",
        title: "Esempio guidato",
        content:
          "Scenario pratico: immagina di disporre di entrate nette pari a 1.850 euro mensili. Come traduci questo numero in un piano d'azione razionale e metodologico? \nPassi chiari e inequivocabili:\n1) Assegna innanzitutto 1.100 euro alle spese essenziali (affitto, bollette, assicurazioni, cibo base).\n2) Destina direttamente, prima di qualsiasi tentazione, 300 euro al risparmio o agli investimenti di lungo corso, creando il tuo Margine di Sicurezza in anticipo.\n3) Il residuo (450 euro) costituisce il tuo reale limite invalicabile per le spese variabili e discrezionali.\nSoluzione attesa: il piano risulta matematicamente e logicamente sostenibile perché la somma totale (1.100 + 450 + 300) equivale esattamente a 1.850 euro. Soprattutto, il risparmio non è lasciato al caso (cioè 'quello che avanza a fine mese'), ma è rigorosamente pre-allocato, seguendo il principio chiave per non erodere stupidamente il patrimonio.",
        pollAreas: [
          {
            id: "concept-solve",
            prompt: "Qual è la prima verifica numerica e logica da effettuare in questo esercizio?",
            options: [
              "Controllare rigorosamente che la somma algebrica delle categorie sia uguale alle entrate",
              "Aumentare subito la quota di spesa variabile riducendo le aspettative",
              "Eliminare del tutto la voce 'risparmio' per garantirsi più liquidità nel breve termine",
            ],
            allowText: true,
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
        title: "Focus",
        content: "L'efficacia reale di un budget non risiede nella perfezione estetica del foglio Excel o nella miriade di categorie create, ma nella sua visibilità e sistematicità operativa. Proprio come l'analisi periodica che Graham suggeriva per le azioni, un budget invisibile o ignorato diventa rapidamente carta straccia. Il funzionamento del sistema richiede che tu stabilisca un limite categorico chiaro e lo abbini a un check-up ricorrente e implacabilmente breve. Senza una frizione cognitiva utile e senza una misurazione costante dei progressi, la derivazione comportamentale prende il sopravvento. Rendi i tuoi obiettivi finanziari trasparenti a te stesso, aggiornando le informazioni in modo sufficientemente frequente per correggere la rotta prima che un piccolo sbandamento si trasformi in una vera e propria rottura strutturale.",
      },
      {
        kind: "explain",
        title: "Spiegazione rapida",
        content:
          "La complessità estrema è spesso nemica giurata dell'investitore privato e del risparmiatore cittadino moderno. Non serve, e anzi spesso risulta essere controproducente, un foglio elettronico sterminato che richiede ore per la quadratura del singolo spicciolo speso al distributore automatico. Quello di cui hai realmente bisogno è un tracciamento agile e settimanale: una tabella minimalista in cui confronti rapidamente ciò che hai speso con il residuo allocato per quel periodo, identificando subito la correzione da apportare. Il fine ultimo non è mai la precisione millimetrica della rendicontazione contabile, bensì la tempestività della correzione. Se scopri di aver superato un budget a metà settimana, l'azione correttiva è limitata al weekend; se lo scopri alla fine del mese, il danno è ormai un fatto storico irreparabile. Adotta l'abitudine difensiva di revisionare la rotta di frequente, ma per pochi minuti alla volta.",
      },
      {
        kind: "question",
        title: "Approfondimento",
        content: "Domanda didattica centrale per rafforzare l'abitudine analitica: quale è l'indicatore guida (leading indicator) che ti permette di accorgerti prima del tempo che il tuo budget sta pericolosamente deragliando dai suoi binari originari? Pensa alla differenza radicale tra osservare lo specchietto retrovisore a fine mese e guardare lo scostamento giornaliero del budget discrezionale. Un buon investitore guarda i segnali anticipatori: il tasso di esaurimento del budget ('burn rate') nei primi dieci giorni del mese è spesso un indicatore ben più predittivo del saldo residuo riportato al ventottesimo giorno. Monitorare con rigore il consumo precoce della quota discrezionale protegge inevitabilmente e direttamente il capitale destinato all'investimento a lungo termine.",
      },
      {
        kind: "exercise",
        title: "Esempio guidato",
        content:
          "Scenario pratico e frequente: hai fissato un tetto settimanale rigido di 95 euro per coprire le spese non essenziali (uscite, sfizi, caffè). Tuttavia, arrivi al venerdì pomeriggio e ti accorgi di aver già speso 82 euro, in anticipo sulla tabella di marcia. Come correggere efficacemente il tiro? \nI passi metodologici da seguire:\n1) Calcola immediatamente il residuo oggettivo senza mentire a te stesso: rimangono esattamente 13 euro a disposizione.\n2) Identifica tra le spese in programma per il fine settimana almeno un'uscita totalmente rinviabile, superflua o cancellabile.\n3) Imposta un limite categorico per il weekend, imponendoti di non superare per alcun motivo la soglia residua, pena l'erosione ingiustificata dei risparmi accumulati altrove.\nSoluzione logica: il limite per il weekend è blindato a 13 euro, abbinato al rinvio cosciente e proattivo di almeno una spesa discrezionale, riportando così in equilibrio il sistema.",
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
        title: "Focus",
        content: "Il vero banco di prova per l'efficacia del tuo budget non è la gestione di settimane noiose o di mesi finanziariamente perfetti, in cui ogni flusso ricalca le aspettative matematiche. Il vero test si manifesta in modo prepotente quando una settimana si dimostra clamorosamente irregolare, portando imprevisti, inviti inaspettati o micro-spese urgenti. È in tali frangenti, che simulano la natura caotica dei mercati finanziari o le recessioni cicliche descritte nei tomi di economia, che la solidità della tua pianificazione subisce lo stress test decisivo. Riuscire a mantenere il sangue freddo, inquadrare l'anomalia e assorbirla senza gettare alle fiamme l'intero piano finanziario mensile costituisce il passaggio evolutivo fondamentale tra un apprendista e un manager oculato delle proprie risorse economiche.",
      },
      {
        kind: "explain",
        title: "Spiegazione rapida",
        content:
          "Nell'inevitabile eventualità di un superamento del tetto prefissato, la reazione istintiva – e più deleteria possibile – è quella di scartare con frustrazione l'intera pianificazione, convincendosi segretamente che 'il budget non fa per me'. Al contrario, l'approccio intellettualmente onesto e risolutivo prevede l'applicazione di una semplice, rigorosa regola di recupero matematico. Invece di cedere al panico o annullare la quota sacrosanta destinata al risparmio o agli investimenti di lungo corso, si attua una decurtazione progressiva e compensativa direttamente sulle categorie opzionali relative alla settimana o quindicina successiva. Come avviene nei fondi comuni o nei portafogli modello a seguito di forti fluttuazioni di mercato (drawdown), il ribilanciamento tempestivo ristabilisce l'equilibrio strutturale del sistema originario eliminando le risposte cariche di emotività regressiva.",
      },
      {
        kind: "question",
        title: "Approfondimento",
        content: "Domanda didattica per esercitare l'intelligenza critica rispetto al proprio comportamento economico: quale divergenza fondamentale sussiste tra un errore occasionale di calcolo (come dimenticarsi l'assicurazione auto annuale o cedere a una singola cena costosa) rispetto a un budget che può esser definito strutturalmente irrealistico fin dalle sue prime fondamenta? Nel primo caso palese, l'intervento chirurgico da applicare è semplicemente una dilazione metodica dei consumi discrezionali nel successivo arco temporale. Nel secondo, invece, si richiede ben più che una toppa: occorre una revisione radicale delle macro-assegnazioni percentuali, in quanto l'intero tenore di vita atteso risulta palesemente al di sopra delle reali possibilità oggettive imposte dalle entrate.",
      },
      {
        kind: "exercise",
        title: "Esempio guidato",
        content:
          "Scenario d'esame tipico ma insidioso: hai sforato inequivocabilmente il tuo budget settimanale di 28 euro, accumulando quello che in gergo tecnico possiamo definire un 'deficit provvisorio'. Come affronti l'ammanco senza destrutturare l'equilibrio di lungo periodo?\nI passi tattici da applicare con assoluta imparzialità:\n1) Intervieni attivamente sulla settimana entrante recuperando 18 euro falcidiandoli dal budget 'svago e divertimento'.\n2) Compensa i restanti 10 euro sforzandoti di escludere dalla tua routine settimanale alcune micro-spese superflue (ad esempio un paio di pause caffè, snaks e via dicendo).\n3) Soprattutto, mantieni sacra e intoccabile la tua quota prestabilita del risparmio mensile.\nSoluzione vincente: in questo scenario virtuoso un recupero quantitativamente completo si conclude nel breve periodo – nell'arco ridotto di 7 giorni precisi – senza che il veicolo principale della crescita del tuo patrimonio (il risparmio) venga mai interrotto o intaccato per colpa dell'emergenza.",
      },
    ],
  },
  quiz: {
    nodeKey: "quiz",
    criteria: ["integration", "application"],
    blocks: [
      {
        kind: "focus",
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
          },
        ],
      },
      {
        kind: "exercise",
        title: "Caso pratico",
        content:
          "Prendiamo le redini del comando del tuo budget in uno scenario ad alta criticità: in sole due settimane sei tragicamente riuscito a consumare ben il 70% dell'intero ammontare mensile dedicato alle spese di tipo variabile/svago. Come argini l'emorragia finanziaria?\nIl protocollo suggerito si divide in tre azioni:\n1) Estrapola, basandoti sul trend odierno, una stima oggettiva dello sforamento netto finale previsto arrivando all'ultimo del mese con questo pericolosissimo ritmo di spesa.\n2) Calcola il valore puntuale dell'ammanco potenziale confrontandolo con la tua liquidità.\n3) Proponi due interventi correttivi fulminei senza dover far debito.\nLa soluzione intellettualmente più robusta ed ineccepibile esigerà a denti stretti: l'abbassamento a zero di gran parte delle categorie ultra-discrezionali affiancato alla fissazione di un minuscolo e rigidissimo tetto giornaliero ammissibile calcolato sui giorni restanti.",
        pollAreas: [
          {
            id: "quiz-case",
            prompt: "Esaminata l'urgenza, qual è da considerarsi in principio la primissima mossa correttiva in assoluto più efficace e di facile implementazione?",
            options: [
              "Falciare drasticamente e istantaneamente la singola voce più alta appartenente alle categorie puramente discrezionali (come l'entertainment o l'abbigliamento impulsivo)",
              "Concedersi indulgenza e innalzare in modo postumo il budget variabile, corrodendo direttamente la quota risparmio",
              "Ignorare momentaneamente la problematica e far la resa dei conti definitiva sul cruscotto a fine trentina del mese",
            ],
            allowText: true,
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
    ],
  },
};

const lesson1Definition = createStaticLessonDefinition("1", content);

export default lesson1Definition;
