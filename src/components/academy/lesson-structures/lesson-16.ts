import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "caring"],
    blocks: [
      {
        kind: "focus",
        title: "💡 Obbligazioni: prestare soldi in cambio di interessi",
        content: "Un'**obbligazione** (bond) è un prestito che fai a un'azienda o a uno Stato. In cambio, ricevi interessi regolari e alla scadenza ti restituiscono il capitale.\n\n**Differenza con le azioni:**\n- Azione: sei proprietario, partecipi a profitti e perdite\n- Obbligazione: sei creditore, ricevi interessi fissi\n\n**Esempio:**\nCompri un'obbligazione da 1.000€ con cedola 3% annua, scadenza 10 anni.\n- Ogni anno ricevi 30€ di interessi (cedola)\n- Dopo 10 anni ricevi indietro i 1.000€\n- Totale incassato: 1.300€\n\nLe obbligazioni sono generalmente meno rischiose delle azioni ma rendono di meno.",
      },
      {
        kind: "explain",
        title: "📌 I componenti di un'obbligazione",
        content: "Ogni obbligazione ha queste caratteristiche:\n\n**1. Valore nominale (face value)**\nIl capitale che ti viene restituito a scadenza. Tipicamente 1.000€ o 100€.\n\n**2. Cedola (coupon)**\nL'interesse che ricevi periodicamente (annuale o semestrale).\nEsempio: cedola 3% su 1.000€ = 30€/anno\n\n**3. Scadenza (maturity)**\nQuando ti restituiscono il capitale.\n- Breve termine: 1-3 anni\n- Medio termine: 3-10 anni\n- Lungo termine: 10-30 anni\n\n**4. Prezzo di mercato**\nLe obbligazioni si comprano/vendono sul mercato. Il prezzo può essere sopra o sotto il valore nominale.\n\n**5. Emittente**\nChi ti deve i soldi (Stato, azienda, banca).",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Qual è la differenza principale tra azioni e obbligazioni?",
        pollAreas: [
          {
            id: "concept-verify-16",
            prompt: "Seleziona la risposta corretta",
            options: [
              "Azioni = proprietà; Obbligazioni = prestito",
              "Le obbligazioni rendono sempre di più",
              "Le azioni sono più sicure",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Con le azioni sei **proprietario** e partecipi ai profitti/perdite. Con le obbligazioni sei **creditore**: presti soldi e ricevi interessi.",
            wrongExplanation: "Le azioni rendono storicamente di più (ma con più rischio). E le azioni non sono più sicure.\n\n**La differenza fondamentale:**\n- Azioni: proprietà, partecipazione a profitti e perdite\n- Obbligazioni: prestito, interessi fissi, rimborso del capitale",
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🎯 Tipi di obbligazioni",
        content: "Le obbligazioni si classificano per emittente e caratteristiche:\n\n**Per emittente:**\n- **Titoli di Stato**: emessi dai governi (BTP, Bund, Treasury)\n- **Corporate bond**: emessi da aziende\n- **Obbligazioni bancarie**: emesse da banche\n\n**Per rischio (rating):**\n- **Investment grade**: AAA, AA, A, BBB - rischio basso/medio\n- **High yield (junk bond)**: BB e inferiori - rischio alto, rendimenti alti\n\n**Per cedola:**\n- **Tasso fisso**: cedola costante (es. 3% per sempre)\n- **Tasso variabile**: cedola legata a un indice (es. Euribor + 1%)\n- **Zero coupon**: nessuna cedola, guadagni dalla differenza prezzo acquisto/rimborso",
      },
      {
        kind: "question",
        title: "🧠 Verifica: tipi di obbligazioni",
        content: "Quale tipo di obbligazione è generalmente considerato il più sicuro?",
        pollAreas: [
          {
            id: "concept-solve-16",
            prompt: "Seleziona la risposta",
            options: [
              "Titoli di Stato di paesi solidi (es. Germania, USA)",
              "Corporate bond di aziende in crescita",
              "High yield bond con rendimenti alti",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! I **titoli di Stato** di paesi con rating AAA (Germania, USA) sono considerati i più sicuri perché il rischio di default è quasi zero.",
            wrongExplanation: "I corporate bond dipendono dalla solidità dell'azienda. Gli high yield sono rischiosi per definizione.\n\n**I più sicuri:** titoli di Stato di paesi con economia solida e rating alto (AAA/AA). Germania, USA, Svizzera sono esempi.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco le obbligazioni", "Conosco i tipi", "Valuto il rischio emittente"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "integration"],
    blocks: [
      {
        kind: "focus",
        title: "🛠️ Come funziona il prezzo delle obbligazioni",
        content: "Il prezzo delle obbligazioni si muove in direzione **opposta** ai tassi di interesse. Questo è fondamentale da capire.\n\n**La regola:**\n- Tassi salgono → prezzo obbligazioni scende\n- Tassi scendono → prezzo obbligazioni sale\n\n**Perché succede:**\nImmagina di avere un'obbligazione al 3%. Se i tassi salgono al 5%, la tua obbligazione diventa meno attraente (rende di meno). Chi la compra vorrà uno sconto.\n\n**Esempio numerico:**\n- Hai un BTP al 3%, valore nominale 100€\n- I tassi salgono al 5%\n- Il prezzo di mercato scende a ~90€ (per compensare il rendimento inferiore)\n\nSe tieni fino a scadenza, ricevi comunque 100€. Il prezzo conta solo se vendi prima.",
      },
      {
        kind: "explain",
        title: "📌 Rendimento a scadenza (YTM)",
        content: "Il **rendimento a scadenza** (Yield to Maturity) è il rendimento totale che otterrai se tieni l'obbligazione fino alla fine.\n\n**Include:**\n- Le cedole che riceverai\n- Il guadagno/perdita tra prezzo di acquisto e valore nominale\n\n**Esempio:**\n- Compri un'obbligazione a 95€ (sotto la pari)\n- Valore nominale: 100€\n- Cedola: 3% annuo (3€)\n- Scadenza: 5 anni\n\n**YTM ≈ 4.2%** (cedola 3% + guadagno capitale di 5€ distribuito su 5 anni)\n\n**La regola:** se compri sotto la pari, il YTM è maggiore della cedola. Se compri sopra la pari, il YTM è minore della cedola.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "I tassi di interesse salgono dal 2% al 4%. Cosa succede al prezzo delle obbligazioni esistenti?",
        pollAreas: [
          {
            id: "widget-verify-16",
            prompt: "Seleziona la risposta corretta",
            options: [
              "Il prezzo scende (le vecchie obbligazioni sono meno attraenti)",
              "Il prezzo sale (rendono di più)",
              "Il prezzo resta uguale (la cedola è fissa)",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Quando i tassi salgono, le obbligazioni esistenti (con cedole più basse) diventano **meno attraenti**. Il prezzo scende per compensare.",
            wrongExplanation: "La cedola è fissa, ma il prezzo di mercato cambia.\n\n**La relazione inversa:**\n- Tassi su → prezzi obbligazioni giù\n- Tassi giù → prezzi obbligazioni su\n\nQuesto è uno dei principi fondamentali del mercato obbligazionario.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario pratico",
        content: "Hai comprato un BTP a 100€ con cedola 3%. Ora vale 92€. Cosa fai?",
        pollAreas: [
          {
            id: "widget-scenario-16",
            prompt: "Qual è l'azione corretta?",
            options: [
              "Se non mi servono i soldi, tengo - a scadenza ricevo 100€",
              "Vendo subito per limitare le perdite",
              "Compro altre obbligazioni per mediare il prezzo",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! A scadenza ricevi comunque **100€ + tutte le cedole**. Il prezzo di mercato conta solo se vendi prima. Se puoi aspettare, non hai perso nulla.",
            wrongExplanation: "Vendere a 92€ cristallizza la perdita. A scadenza riceveresti 100€.\n\n**Il punto chiave:** le oscillazioni di prezzo delle obbligazioni contano solo se vendi prima della scadenza. Se tieni fino alla fine, ricevi il valore nominale.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco tassi vs prezzi", "Calcolo il YTM", "Valuto se tenere a scadenza"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      {
        kind: "focus",
        title: "⚡ I rischi delle obbligazioni",
        content: "Le obbligazioni sono più sicure delle azioni, ma non sono prive di rischi.\n\n**Rischio di credito (default)**\nL'emittente non riesce a pagare gli interessi o restituire il capitale. Raro per gli Stati solidi, più comune per aziende.\n\n**Rischio di tasso**\nSe i tassi salgono, il valore delle tue obbligazioni scende. Più lunga la scadenza, maggiore l'effetto.\n\n**Rischio inflazione**\nSe l'inflazione supera la cedola, il rendimento reale è negativo. Stai perdendo potere d'acquisto.\n\n**Rischio di liquidità**\nAlcune obbligazioni sono difficili da vendere rapidamente senza perdere valore.\n\n**Rischio di reinvestimento**\nQuando l'obbligazione scade, potresti dover reinvestire a tassi più bassi.",
      },
      {
        kind: "explain",
        title: "📌 Duration: misurare la sensibilità ai tassi",
        content: "La **duration** misura quanto il prezzo di un'obbligazione è sensibile ai tassi di interesse.\n\n**Regola pratica:**\nSe la duration è 5 e i tassi salgono dell'1%, il prezzo scende di circa il 5%.\n\n**Duration alta = più sensibilità:**\n- Obbligazioni a lunga scadenza\n- Cedole basse\n\n**Duration bassa = meno sensibilità:**\n- Obbligazioni a breve scadenza\n- Cedole alte\n\n**Applicazione pratica:**\n- Se pensi che i tassi saliranno → preferisci duration bassa\n- Se pensi che i tassi scenderanno → duration alta può amplificare i guadagni\n\nPer la maggior parte degli investitori: duration media (3-7 anni) è un buon compromesso.",
      },
      {
        kind: "question",
        title: "🧠 Verifica comprensione",
        content: "Quale obbligazione è più sensibile alle variazioni dei tassi?",
        pollAreas: [
          {
            id: "challenge-verify-16",
            prompt: "Seleziona l'obbligazione più sensibile",
            options: [
              "BTP a 30 anni con cedola 2%",
              "BOT a 6 mesi",
              "BTP a 5 anni con cedola 4%",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **30 anni + cedola bassa** = duration molto alta. Questa obbligazione oscillerà molto al variare dei tassi.",
            wrongExplanation: "La sensibilità dipende da scadenza e cedola.\n\n**Più sensibile:** lunga scadenza + cedola bassa\n**Meno sensibile:** breve scadenza + cedola alta\n\nIl BTP 30 anni al 2% ha la duration più alta tra le opzioni.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario critico",
        content: "L'inflazione è al 5%, il tuo BTP rende il 3%. Cosa sta succedendo?",
        pollAreas: [
          {
            id: "challenge-scenario-16",
            prompt: "Valuta la situazione",
            options: [
              "Stai perdendo potere d'acquisto - rendimento reale negativo (-2%)",
              "Stai guadagnando il 3% l'anno",
              "L'inflazione non influisce sulle obbligazioni",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **Rendimento reale = rendimento nominale - inflazione** = 3% - 5% = -2%. Stai perdendo potere d'acquisto anche se ricevi la cedola.",
            wrongExplanation: "Il rendimento nominale è 3%, ma l'inflazione al 5% erode il valore reale.\n\n**Calcolo:**\nRendimento reale = 3% - 5% = -2%\n\nI tuoi soldi comprano meno ogni anno, nonostante gli interessi.",
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
        title: "🧠 Quiz finale: obbligazioni",
        content: "Hai imparato cosa sono le obbligazioni, come funzionano cedole e prezzi, e i rischi da considerare.\n\n**Concetti chiave:**\n- Obbligazione = prestito con interessi\n- Tassi e prezzi si muovono in direzione opposta\n- Duration misura la sensibilità ai tassi\n- Rendimento reale = nominale - inflazione\n\nVerifichiamo la comprensione.",
      },
      {
        kind: "question",
        title: "❓ Domanda 1",
        content: "Compri un'obbligazione a 95€, valore nominale 100€, cedola 3%. Il rendimento a scadenza sarà:",
        pollAreas: [
          {
            id: "quiz-q1-16",
            prompt: "Seleziona la risposta corretta",
            options: [
              "Maggiore del 3% (cedola + guadagno capitale)",
              "Esattamente 3% (la cedola)",
              "Minore del 3%",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! Comprando **sotto la pari** (95€ vs 100€), guadagni sia la cedola (3%) che la differenza di prezzo (+5€). Il rendimento totale è superiore al 3%.",
            wrongExplanation: "Quando compri sotto la pari, il rendimento totale include sia la cedola che il guadagno in conto capitale.\n\n**YTM > cedola** quando prezzo < valore nominale\n**YTM < cedola** quando prezzo > valore nominale",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 2",
        content: "La banca centrale alza i tassi di interesse. Le tue obbligazioni esistenti:",
        pollAreas: [
          {
            id: "quiz-q2-16",
            prompt: "Cosa succede?",
            options: [
              "Scendono di prezzo (la relazione è inversa)",
              "Salgono di prezzo",
              "Il prezzo non cambia",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! La relazione è **inversa**. Tassi su → prezzi obbligazioni giù. Le tue obbligazioni esistenti diventano meno attraenti rispetto alle nuove.",
            wrongExplanation: "La relazione tassi-prezzi è inversa ed è fondamentale:\n\n- Tassi su → prezzi giù\n- Tassi giù → prezzi su\n\nQuesto perché le nuove obbligazioni offrono rendimenti più alti, rendendo meno attraenti quelle esistenti.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 3",
        content: "Perché le obbligazioni sono utili in un portafoglio diversificato?",
        pollAreas: [
          {
            id: "quiz-q3-16",
            prompt: "Seleziona il beneficio principale",
            options: [
              "Spesso si muovono in direzione opposta alle azioni, riducendo la volatilità",
              "Rendono sempre di più delle azioni",
              "Non perdono mai valore",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! Le obbligazioni (specialmente governative) hanno spesso **correlazione negativa o bassa** con le azioni. Quando le azioni crollano, le obbligazioni spesso salgono. Questo riduce la volatilità del portafoglio.",
            wrongExplanation: "Le obbligazioni non rendono più delle azioni nel lungo termine, e possono perdere valore.\n\n**Il loro ruolo:** diversificazione. Quando le azioni crollano, le obbligazioni governative spesso salgono (gli investitori cercano sicurezza). Questo stabilizza il portafoglio.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco cedole e prezzi", "Applico la relazione tassi-prezzi", "Uso le obbligazioni per diversificare"],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "✅ Cosa hai imparato: obbligazioni",
        content: "Complimenti! Hai completato la lezione sulle obbligazioni.\n\n**Principi fondamentali:**\n\n1. **Obbligazione = prestito** con cedole e rimborso a scadenza\n2. **Relazione inversa** tassi-prezzi\n3. **Duration** misura la sensibilità ai tassi\n4. **Rischi:** credito, tasso, inflazione, liquidità\n5. **Ruolo nel portafoglio:** diversificazione e stabilità\n\nLe obbligazioni sono la parte 'stabile' del portafoglio, utili per bilanciare la volatilità delle azioni.",
      },
      {
        kind: "explain",
        title: "📌 Come usare le obbligazioni in pratica",
        content: "Per la maggior parte degli investitori, le obbligazioni si usano così:\n\n**Tramite ETF obbligazionari:**\n- Più semplice che comprare singole obbligazioni\n- Diversificazione automatica\n- Liquidità immediata\n\n**Percentuale nel portafoglio:**\n- Formula classica: età = % obbligazioni\n- 30 anni → 30% obbligazioni, 70% azioni\n- 50 anni → 50% obbligazioni, 50% azioni\n\n**Quali scegliere:**\n- Investment grade (AAA-BBB) per sicurezza\n- Duration media (3-7 anni) per equilibrio\n- Area euro per evitare rischio cambio\n\nGli ETF obbligazionari globali o euro aggregate sono una buona scelta standard.",
      },
      {
        kind: "question",
        title: "🎯 Il tuo prossimo passo",
        content: "Come userai le obbligazioni?",
        pollAreas: [
          {
            id: "feedback-action-16",
            prompt: "Indica il tuo approccio",
            options: [
              "Tramite ETF obbligazionari per diversificare",
              "BTP singoli per cedole garantite",
              "Per ora mi concentro sulle azioni",
            ],
            correctIndex: 0,
            correctExplanation: "Ottima scelta! Gli **ETF obbligazionari** sono il modo più efficiente per avere esposizione alle obbligazioni con diversificazione automatica.",
            wrongExplanation: "Tutte le scelte sono valide!\n\n- ETF: più semplice e diversificato\n- BTP singoli: controllo diretto, cedola certa\n- Solo azioni: ok se orizzonte lungo e tolleranza alta\n\nL'importante è che la scelta sia coerente con il tuo profilo.",
            allowText: false,
          },
        ],
      },
    ],
    suggestedPrompts: [
      "Quali ETF obbligazionari sono adatti per iniziare?",
      "Conviene comprare BTP singoli o ETF?",
      "Quante obbligazioni dovrei avere nel mio portafoglio?",
    ],
  },
};

const lesson16Definition = createStaticLessonDefinition("16", content);

export default lesson16Definition;
