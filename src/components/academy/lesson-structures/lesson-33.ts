import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "caring"],
    blocks: [
      {
        kind: "focus",
        title: "💡 Indicatori economici: la dashboard dell'economia",
        content: "Gli **indicatori economici** sono i dati che ci dicono come sta andando l'economia.\n\n**Le categorie principali:**\n\n**1. Crescita:**\n- PIL (Prodotto Interno Lordo)\n- Produzione industriale\n- Vendite al dettaglio\n\n**2. Occupazione:**\n- Tasso di disoccupazione\n- Nuovi occupati (payrolls USA)\n- Richieste sussidi\n\n**3. Inflazione:**\n- CPI (Consumer Price Index)\n- PCE (Personal Consumption Expenditure)\n- PPI (Producer Price Index)\n\n**4. Fiducia/Sentiment:**\n- PMI (Purchasing Managers Index)\n- Fiducia consumatori\n- Fiducia imprese\n\n**Perché contano:**\nI mercati si muovono sui dati. Capire gli indicatori ti aiuta a interpretare le reazioni.",
      },
      {
        kind: "explain",
        title: "📌 PIL: la misura della crescita",
        content: "Il **PIL** (Prodotto Interno Lordo) è il valore di tutti i beni e servizi prodotti in un paese.\n\n**Come si legge:**\n- PIL +2% = economia cresce del 2%\n- PIL -0.5% = economia si contrae\n- 2 trimestri negativi = recessione tecnica\n\n**PIL reale vs nominale:**\n- Nominale: include l'inflazione\n- Reale: aggiustato per l'inflazione (quello che conta)\n\n**Tassi di crescita tipici:**\n- USA: 2-3% in espansione\n- Europa: 1-2%\n- Mercati emergenti: 4-6%\n\n**Limiti del PIL:**\n- Dato trimestrale (arriva in ritardo)\n- Viene revisionato più volte\n- Non cattura tutto (economia informale, benessere)\n\n**Per i mercati:**\n- PIL sopra attese = positivo\n- PIL sotto attese = negativo\n- Conta la sorpresa, non il numero assoluto",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Il PIL cresce del 2% ma l'inflazione è al 5%. Cosa sta succedendo?",
        pollAreas: [
          {
            id: "concept-verify-33",
            prompt: "Seleziona l'interpretazione corretta",
            options: [
              "La crescita reale è probabilmente negativa (-3%)",
              "L'economia sta crescendo forte",
              "Il PIL e l'inflazione non sono correlati",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Se il PIL nominale cresce del 2% ma l'inflazione è 5%, il **PIL reale** è circa -3%. Il potere d'acquisto sta calando nonostante la 'crescita' nominale.",
            wrongExplanation: "Il PIL reale è quello che conta.\n\n**Calcolo approssimativo:**\n- PIL nominale: +2%\n- Inflazione: +5%\n- PIL reale: 2% - 5% = -3%\n\nL'economia si sta contraendo in termini reali.",
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🎯 PMI: il termometro in tempo reale",
        content: "Il **PMI** (Purchasing Managers Index) è uno degli indicatori più seguiti.\n\n**Cos'è:**\n- Sondaggio mensile tra i responsabili acquisti\n- Misura ordini, produzione, occupazione, scorte\n- Anticipatore: esce prima del PIL\n\n**Come si legge:**\n- PMI > 50 = espansione\n- PMI < 50 = contrazione\n- PMI = 50 = stabile\n\n**Tipi di PMI:**\n- PMI manifatturiero: industria\n- PMI servizi: settore terziario\n- PMI composito: combinazione\n\n**Perché conta:**\n- Mensile (più frequente del PIL)\n- Anticipatore (prevede il PIL)\n- Comparabile tra paesi\n\n**Per i mercati:**\n- PMI sopra attese e in crescita = positivo\n- PMI in calo verso 50 = allarme\n- PMI sotto 50 = recessione possibile",
      },
      {
        kind: "question",
        title: "🧠 Verifica: PMI",
        content: "Il PMI manifatturiero passa da 52 a 48. Cosa indica?",
        pollAreas: [
          {
            id: "concept-solve-33",
            prompt: "Seleziona l'interpretazione",
            options: [
              "L'industria sta passando da espansione a contrazione",
              "L'industria sta crescendo più velocemente",
              "Nessun cambiamento significativo",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Da **52 (espansione) a 48 (contrazione)** indica che l'industria sta rallentando significativamente. Sotto 50 = l'attività si contrae.",
            wrongExplanation: "Il passaggio sotto 50 è significativo.\n\n**PMI da 52 a 48:**\n- Era in espansione (>50)\n- Ora in contrazione (<50)\n- Segnale di rallentamento industriale",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco gli indicatori", "So leggere il PIL", "Capisco il PMI"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "integration"],
    blocks: [
      {
        kind: "focus",
        title: "🛠️ Indicatori di occupazione",
        content: "Il mercato del lavoro è cruciale per l'economia:\n\n**Tasso di disoccupazione:**\n- % di forza lavoro senza impiego\n- USA 'piena occupazione': ~4%\n- Europa naturalmente più alto\n\n**Non-farm payrolls (USA):**\n- Nuovi posti di lavoro creati nel mese\n- Esclude agricoltura\n- Molto seguito dai mercati\n- Attese: ~150-200k/mese in espansione\n\n**Richieste sussidi (jobless claims):**\n- Settimanale (dato più frequente)\n- Initial claims: nuove richieste\n- Continuing claims: richieste attive\n\n**JOLTS (Job Openings):**\n- Posti vacanti\n- Tante aperture = mercato forte\n- Poche aperture = rallentamento\n\n**Per i mercati:**\nDati occupazione forti → BCE/Fed potrebbero alzare i tassi\nDati occupazione deboli → possibile politica accomodante",
      },
      {
        kind: "explain",
        title: "📌 Indicatori di inflazione: CPI e PCE",
        content: "**CPI (Consumer Price Index):**\n- Misura il costo di un paniere di beni per i consumatori\n- Headline CPI: include tutto\n- Core CPI: esclude cibo e energia (più volatile)\n- Il più seguito dai media\n\n**PCE (Personal Consumption Expenditure):**\n- Preferito dalla Fed\n- Include più categorie\n- Core PCE: l'obiettivo della Fed\n\n**Come si leggono:**\n- Variazione mensile (0.2-0.3% è normale)\n- Variazione annuale (l'obiettivo è 2%)\n- CPI annuale 8% = inflazione alta\n\n**Per i mercati:**\n- Inflazione sopra attese = BCE/Fed hawkish = azioni giù\n- Inflazione sotto attese = possibile pausa = azioni su\n\n**Attenzione:** i dati inflazione sono volatili. Un singolo dato non fa tendenza.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Il Core CPI è al 3.5% annuale. L'obiettivo Fed è 2%. Cosa significa?",
        pollAreas: [
          {
            id: "widget-verify-33",
            prompt: "Seleziona l'interpretazione corretta",
            options: [
              "L'inflazione è sopra target - la Fed potrebbe restare hawkish",
              "L'inflazione è sotto controllo",
              "La Fed taglierà i tassi presto",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **3.5% vs obiettivo 2%** significa inflazione ancora elevata. La Fed probabilmente resterà restrittiva finché non si avvicina al target.",
            wrongExplanation: "3.5% è sopra target, non sotto controllo.\n\n**L'interpretazione:**\n- Obiettivo: 2%\n- Attuale: 3.5%\n- Gap: 1.5 punti percentuali\n- Fed: probabilmente restrittiva",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario pratico",
        content: "Venerdì escono i payrolls USA: +300k posti (attese +180k). Come reagiscono i mercati?",
        pollAreas: [
          {
            id: "widget-scenario-33",
            prompt: "Quale reazione è più probabile?",
            options: [
              "Azioni inizialmente giù - la Fed potrebbe essere più hawkish",
              "Tutto sale - l'economia va forte",
              "Nessuna reazione",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! Un dato **molto sopra attese** suggerisce mercato del lavoro forte → la Fed potrebbe mantenere tassi alti più a lungo → azioni e obbligazioni soffrono nel breve.",
            wrongExplanation: "In questa fase, 'buone notizie' per l'economia sono spesso 'cattive notizie' per i mercati.\n\n**Paradosso:**\n- Economia forte = Fed hawkish\n- Fed hawkish = tassi alti\n- Tassi alti = pressione su azioni",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco l'occupazione", "So leggere l'inflazione", "Interpreto le reazioni"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      {
        kind: "focus",
        title: "⚡ Il calendario economico: quando escono i dati",
        content: "I dati economici escono in momenti precisi:\n\n**Settimanali:**\n- Jobless claims (giovedì USA)\n\n**Mensili:**\n- PMI (primi giorni del mese)\n- Payrolls USA (primo venerdì)\n- CPI (circa metà mese)\n- Vendite al dettaglio\n- Produzione industriale\n\n**Trimestrali:**\n- PIL (fine trimestre successivo, revisionato)\n\n**Dove trovarli:**\n- Calendari economici online (Investing.com, etc.)\n- Bloomberg, Reuters\n- Siti delle banche centrali\n\n**Come leggerli:**\n- Attese vs effettivo vs precedente\n- Conta la sorpresa\n- Un singolo dato non fa tendenza\n\n**Volatilità:** i mercati si muovono nei minuti dopo i dati importanti.",
      },
      {
        kind: "explain",
        title: "📌 Come usare i dati senza ossessionarsi",
        content: "Gli indicatori sono utili ma non devono dominare le tue decisioni:\n\n**Approccio sano:**\n\n**1. Guarda il trend, non il singolo dato**\n- Un PMI negativo non è recessione\n- Una serie di PMI negativi è preoccupante\n\n**2. Considera il contesto**\n- Dove siamo nel ciclo?\n- Cosa stanno facendo le banche centrali?\n- Qual è il sentiment generale?\n\n**3. Non fare trading sui dati**\n- I professionisti hanno vantaggi\n- La volatilità può colpirti\n- Il tuo vantaggio è l'orizzonte lungo\n\n**4. Usa i dati per calibrare, non stravolgere**\n- Se tutto indica late cycle, magari riduci un po' il rischio\n- Non passare da 100% azioni a 0% per un dato\n\n**Il principio:** informati, ma mantieni la prospettiva di lungo termine.",
      },
      {
        kind: "question",
        title: "🧠 Verifica comprensione",
        content: "Come dovresti reagire a un singolo dato negativo?",
        pollAreas: [
          {
            id: "challenge-verify-33",
            prompt: "Seleziona la reazione appropriata",
            options: [
              "Osservare se si forma un trend, non reagire a un singolo dato",
              "Vendere immediatamente tutto",
              "Comprare il dip - è un'opportunità",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **Un singolo dato non fa tendenza**. Osserva se si ripete, considera il contesto, e non prendere decisioni impulsive. I trend si confermano nel tempo.",
            wrongExplanation: "Reagire a ogni dato è trading emotivo.\n\n**Approccio corretto:**\n- Osserva il trend\n- Considera il contesto\n- Mantieni la prospettiva\n- Non fare overtrading",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario critico",
        content: "PMI in calo da 3 mesi, payrolls in rallentamento, curva invertita. Cosa suggeriscono insieme?",
        pollAreas: [
          {
            id: "challenge-scenario-33",
            prompt: "Quale interpretazione è corretta?",
            options: [
              "Segnali multipli di rallentamento - aumentare la prudenza",
              "Tutto normale, niente di cui preoccuparsi",
              "Recessione certa domani",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! **Segnali multipli convergenti** suggeriscono rallentamento. Non recessione certa, ma prudenza sensata: verifica il fondo emergenza, riduci moderatamente il rischio se necessario.",
            wrongExplanation: "Non è 'tutto normale' ma nemmeno recessione certa.\n\n**Segnali convergenti:**\n- PMI in calo: industria rallenta\n- Payrolls in calo: occupazione rallenta\n- Curva invertita: aspettative negative\n\nPrudenza sensata, non panico.",
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
        title: "🧠 Quiz finale: indicatori economici",
        content: "Hai imparato i principali indicatori, come leggerli e come usarli.\n\n**Concetti chiave:**\n- PIL: misura della crescita (reale vs nominale)\n- PMI: anticipatore, >50 espansione, <50 contrazione\n- CPI/PCE: misure di inflazione\n- Payrolls: mercato del lavoro USA\n- Trend > singolo dato\n\nVerifichiamo la comprensione.",
      },
      {
        kind: "question",
        title: "❓ Domanda 1",
        content: "Un PMI di 48 indica:",
        pollAreas: [
          {
            id: "quiz-q1-33",
            prompt: "Seleziona l'interpretazione corretta",
            options: [
              "Contrazione del settore",
              "Espansione del settore",
              "Crescita forte",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! PMI < 50 indica **contrazione**. 48 significa che l'attività si sta riducendo rispetto al mese precedente.",
            wrongExplanation: "PMI sotto 50 = contrazione.\n\n**La scala:**\n- > 50: espansione\n- = 50: stabile\n- < 50: contrazione",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 2",
        content: "Quale indicatore anticipa meglio il ciclo economico?",
        pollAreas: [
          {
            id: "quiz-q2-33",
            prompt: "Seleziona l'indicatore anticipatore",
            options: [
              "PMI e curva dei rendimenti",
              "Tasso di disoccupazione",
              "PIL trimestrale",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! **PMI e curva** sono indicatori anticipatori. Si muovono prima dell'economia. Disoccupazione e PIL sono ritardati o coincidenti.",
            wrongExplanation: "Disoccupazione è ritardata, PIL è coincidente.\n\n**Anticipatori:**\n- PMI\n- Curva dei rendimenti\n- Ordini industriali\n- Fiducia consumatori",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 3",
        content: "Come dovresti usare i dati economici nelle tue decisioni?",
        pollAreas: [
          {
            id: "quiz-q3-33",
            prompt: "Seleziona l'approccio corretto",
            options: [
              "Osservare i trend per calibrare, non stravolgere",
              "Fare trading su ogni dato",
              "Ignorarli completamente",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! I dati servono a **calibrare**, non stravolgere. Osserva i trend, considera il contesto, mantieni la prospettiva di lungo termine.",
            wrongExplanation: "Non ignorarli ma nemmeno ossessionarsi.\n\n**L'approccio giusto:**\n- Informati sui trend\n- Calibra moderatamente\n- Non fare overtrading\n- Mantieni l'orizzonte lungo",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco gli indicatori", "So interpretarli", "Ho un approccio equilibrato"],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "✅ Cosa hai imparato: indicatori economici",
        content: "Complimenti! Hai completato la lezione sugli indicatori.\n\n**Principi chiave:**\n\n1. **PIL**: crescita, conta il reale non nominale\n2. **PMI**: anticipatore, >50 espansione, <50 contrazione\n3. **Occupazione**: payrolls, disoccupazione, sussidi\n4. **Inflazione**: CPI, PCE, target 2%\n5. **Approccio**: trend > singolo dato, calibrare non stravolgere\n\nOra puoi leggere le notizie economiche con più consapevolezza.",
      },
      {
        kind: "explain",
        title: "📌 Collegamento con la sezione",
        content: "Questa lezione fa parte della sezione **Macroeconomia**.\n\n**Percorso:**\n- Inflazione\n- Tassi d'interesse\n- Banche centrali\n- Cicli economici\n- **Indicatori economici** (questa lezione)\n- Geopolitica (prossima)\n\nGli indicatori sono il linguaggio dell'economia. Ora sai interpretarlo.",
      },
      {
        kind: "question",
        title: "🎯 Il tuo prossimo passo",
        content: "Cosa farai con questa conoscenza?",
        pollAreas: [
          {
            id: "feedback-action-33",
            prompt: "Indica il tuo prossimo passo",
            options: [
              "Consulto un calendario economico per capire quando escono i dati",
              "Seguo il PMI del mio paese regolarmente",
              "Continuo con la lezione sulla geopolitica",
            ],
            correctIndex: 0,
            correctExplanation: "Ottima scelta! Un **calendario economico** ti aiuta a sapere quando escono i dati importanti e cosa aspettarsi.",
            wrongExplanation: "Tutte le scelte sono valide!\n\n- Calendario: strumento pratico\n- PMI: indicatore chiave da seguire\n- Continuare: per completare la sezione",
            allowText: false,
          },
        ],
      },
    ],
    suggestedPrompts: [
      "Dove trovo un calendario economico affidabile?",
      "Quali sono i dati più importanti da seguire?",
      "Come interpreto un dato molto diverso dalle attese?",
    ],
  },
};

const lesson33Definition = createStaticLessonDefinition("33", content);

export default lesson33Definition;
