import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "caring"],
    blocks: [
      {
        kind: "focus",
        title: "💡 Broker: la porta d'accesso ai mercati",
        content: "Per investire ti serve un **broker**: un intermediario che ti permette di comprare e vendere titoli in borsa.\n\n**Tipi di broker:**\n\n**Broker bancari (es. Fineco, Intesa):**\n- Integrati col conto corrente\n- Spesso commissioni più alte\n- Supporto in filiale\n\n**Broker online (es. Directa, Degiro, Interactive Brokers):**\n- Solo online\n- Commissioni generalmente più basse\n- Piattaforme più avanzate\n\n**Broker mobile (es. Trade Republic, Scalable):**\n- App-first\n- Commissioni molto basse o zero\n- Funzionalità semplificate\n\nLa scelta dipende dalle tue esigenze: costi, servizi, facilità d'uso.",
      },
      {
        kind: "explain",
        title: "📌 I costi da considerare",
        content: "I broker guadagnano in diversi modi. Ecco cosa guardare:\n\n**Commissioni di negoziazione:**\n- Fisse (es. 5€ per operazione) o percentuali (es. 0.19%)\n- Alcuni broker offrono operazioni gratuite su certi ETF\n- Importante se fai molte operazioni\n\n**Costi di custodia:**\n- Fee annua per 'tenere' i titoli\n- Molti broker online non la applicano\n- Le banche tradizionali spesso sì (0.1-0.2% annuo)\n\n**Costi di cambio valuta:**\n- Se compri titoli in USD e hai conto in EUR\n- Può essere 0.25-1% per operazione\n- Alcuni broker offrono conti multivaluta\n\n**Costi di inattività:**\n- Fee se non fai operazioni per X mesi\n- Sempre meno comuni\n\n**Regola:** calcola il costo totale annuo, non solo le commissioni.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Quale costo è spesso sottovalutato nella scelta del broker?",
        pollAreas: [
          {
            id: "concept-verify-21",
            prompt: "Seleziona il costo nascosto",
            options: [
              "Costi di cambio valuta (spread EUR/USD)",
              "Le commissioni di acquisto",
              "Il costo dell'app",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Il **cambio valuta** può costare 0.5-1% ogni volta che compri/vendi titoli in USD. Su un portafoglio significativo, pesa più delle commissioni.",
            wrongExplanation: "Le commissioni sono il costo più visibile. Il cambio valuta è spesso nascosto nello spread.\n\n**Attenzione:** se compri S&P 500 in USD, paghi la conversione EUR→USD. Alcuni broker applicano spread molto alti.",
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🎯 Regime fiscale: amministrato vs dichiarativo",
        content: "In Italia puoi scegliere tra due regimi fiscali:\n\n**Regime amministrato:**\n- Il broker calcola e versa le tasse per te\n- Zero adempimenti da parte tua\n- Disponibile solo con broker italiani\n- Ideale per chi vuole semplicità\n\n**Regime dichiarativo:**\n- Devi dichiarare tutto nella dichiarazione dei redditi\n- Richiede commercialista o competenze fiscali\n- Obbligatorio con broker esteri (Degiro, IBKR, Trade Republic)\n- Possibile ottimizzazione fiscale\n\n**Consiglio per principianti:** inizia con un broker italiano in regime amministrato. La semplicità fiscale vale qualche euro in più di commissioni.",
      },
      {
        kind: "question",
        title: "🧠 Verifica: regime fiscale",
        content: "Quale regime fiscale è più semplice per un principiante?",
        pollAreas: [
          {
            id: "concept-solve-21",
            prompt: "Seleziona il regime più adatto",
            options: [
              "Amministrato - il broker gestisce tutto",
              "Dichiarativo - più controllo",
              "Non c'è differenza",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Il **regime amministrato** è ideale per iniziare. Non devi preoccuparti di nulla: il broker calcola, trattiene e versa le tasse automaticamente.",
            wrongExplanation: "La differenza è significativa.\n\n**Amministrato:** zero pensieri, il broker fa tutto\n**Dichiarativo:** devi compilare quadri RW, RT, RM nella dichiarazione dei redditi - serve un commercialista",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco i tipi di broker", "Valuto tutti i costi", "Scelgo il regime fiscale"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "integration"],
    blocks: [
      {
        kind: "focus",
        title: "🛠️ Confronto broker italiani",
        content: "Ecco i principali broker disponibili in Italia:\n\n**Fineco:**\n- Regime amministrato\n- Commissioni: da 2.95€ (under 30) a 19€\n- Ottima piattaforma, molti strumenti\n- Canone conto azzerabile\n\n**Directa:**\n- Regime amministrato\n- Commissioni: ~5€ per ETF europei\n- Specializzato trading, interfaccia datata\n- No canone\n\n**Banca Sella:**\n- Regime amministrato\n- Commissioni: da 3€\n- Buona piattaforma\n- Canone conto\n\n**Degiro:**\n- Regime DICHIARATIVO\n- Commissioni: 0-3€\n- Molti ETF gratuiti\n- Report per dichiarazione",
      },
      {
        kind: "explain",
        title: "📌 Broker esteri: pro e contro",
        content: "I broker esteri offrono costi bassi ma richiedono regime dichiarativo:\n\n**Interactive Brokers:**\n- Pro: commissioni bassissime, piattaforma professionale\n- Pro: accesso a tutti i mercati mondiali\n- Contro: regime dichiarativo, interfaccia complessa\n- Per: investitori esperti\n\n**Trade Republic:**\n- Pro: app semplice, PAC gratuiti\n- Pro: commissioni 1€ per operazione\n- Contro: regime dichiarativo\n- Per: giovani, PAC piccoli\n\n**Scalable Capital:**\n- Pro: PAC gratuiti su molti ETF\n- Pro: interfaccia moderna\n- Contro: regime dichiarativo\n- Per: PAC regolari\n\n**Il trade-off:** risparmi sulle commissioni ma spendi dal commercialista (200-400€/anno). Conviene solo con patrimoni significativi.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Quando conviene passare a un broker estero?",
        pollAreas: [
          {
            id: "widget-verify-21",
            prompt: "Seleziona il criterio corretto",
            options: [
              "Quando il risparmio sulle commissioni supera il costo del commercialista",
              "Sempre - i broker esteri sono migliori",
              "Mai - troppo complicato",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Devi fare il **calcolo complessivo**. Se risparmi 100€ di commissioni ma spendi 300€ di commercialista, non conviene. Con patrimoni alti, può convenire.",
            wrongExplanation: "Non è 'sempre' o 'mai' - è un calcolo.\n\n**Esempio:**\n- Broker italiano: 200€/anno di commissioni\n- Broker estero: 50€/anno + 300€ commercialista = 350€\n\nIn questo caso, il broker italiano conviene.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario pratico",
        content: "Hai 25 anni, investi 200€/mese in ETF, patrimonio attuale 5.000€. Quale broker scegli?",
        pollAreas: [
          {
            id: "widget-scenario-21",
            prompt: "Quale broker è più adatto?",
            options: [
              "Broker italiano (Fineco/Directa) - semplicità fiscale vale più del risparmio",
              "Broker estero - risparmi subito",
              "Nessun broker - meglio il conto deposito",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! Con importi piccoli, il **risparmio sui costi di un broker estero non compensa la complessità fiscale**. Inizia semplice con un broker italiano.",
            wrongExplanation: "Con 200€/mese e 5.000€ di patrimonio, il risparmio di un broker estero è minimo, ma il costo del commercialista (300€/anno) pesa molto.\n\n**La regola:** inizia semplice. Quando il patrimonio cresce, rivaluta.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Confronto i broker", "Calcolo i costi totali", "Scelgo la semplicità"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      {
        kind: "focus",
        title: "⚡ Errori comuni nella scelta del broker",
        content: "Evita questi errori frequenti:\n\n**Errore #1: Guardare solo le commissioni**\n- Ignori costi di custodia, cambio valuta, inattività\n- Il costo totale annuo è ciò che conta\n\n**Errore #2: Sottovalutare la fiscalità**\n- Scegli broker estero per risparmiare 50€\n- Poi spendi 300€ di commercialista\n\n**Errore #3: Broker troppo complesso**\n- Piattaforme pro con 100 funzioni\n- Ne usi 3 e ti confondi\n\n**Errore #4: Broker non regolamentato**\n- Attratto da commissioni zero\n- Rischio truffa o insolvenza\n\n**Errore #5: Cambiare broker spesso**\n- Trasferimenti costano e richiedono tempo\n- Scegli bene la prima volta",
      },
      {
        kind: "explain",
        title: "📌 Come verificare l'affidabilità di un broker",
        content: "Prima di aprire un conto, verifica:\n\n**1. Autorizzazione CONSOB/Banca d'Italia:**\n- Il broker deve essere autorizzato\n- Controlla sul sito CONSOB\n- Se è estero, deve avere licenza UE (passaporto)\n\n**2. Protezione dei depositi:**\n- In UE: protezione fino a 100.000€ per il cash\n- I titoli sono separati dal patrimonio del broker\n- Se il broker fallisce, i tuoi titoli restano tuoi\n\n**3. Recensioni e storia:**\n- Da quanto opera?\n- Recensioni online (Trustpilot, forum)\n- Problemi noti?\n\n**4. Trasparenza costi:**\n- I costi sono chiari e facili da trovare?\n- Se nascondono i costi, cattivo segno\n\n**Regola:** meglio pagare qualcosa in più per un broker affidabile che rischiare con uno sconosciuto.",
      },
      {
        kind: "question",
        title: "🧠 Verifica comprensione",
        content: "Un broker offre commissioni zero ma non trovi informazioni sulla sua regolamentazione. Cosa fai?",
        pollAreas: [
          {
            id: "challenge-verify-21",
            prompt: "Qual è l'azione corretta?",
            options: [
              "Evito - l'affidabilità viene prima del risparmio",
              "Provo con poco - male che vada perdo poco",
              "Commissioni zero sono sempre un buon affare",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **Mai fidarsi di broker non regolamentati**. Le commissioni zero su un broker truffa significano perdere tutto. L'affidabilità è non negoziabile.",
            wrongExplanation: "Anche 'poco' sono i tuoi soldi.\n\n**Red flag:**\n- Nessuna regolamentazione chiara\n- Commissioni 'troppo belle'\n- Difficile contattarli\n- Recensioni sospette\n\nMeglio pagare 5€ di commissione su un broker sicuro.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario critico",
        content: "Il tuo broker fallisce. Cosa succede ai tuoi ETF?",
        pollAreas: [
          {
            id: "challenge-scenario-21",
            prompt: "Cosa succede?",
            options: [
              "I titoli sono tuoi e separati dal patrimonio del broker - vengono trasferiti",
              "Perdi tutto",
              "Recuperi solo fino a 100.000€",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! I **titoli sono segregati**: non fanno parte del patrimonio del broker. Se fallisce, i tuoi ETF vengono trasferiti a un altro broker. La protezione 100.000€ riguarda solo il cash.",
            wrongExplanation: "Non perdi i titoli!\n\n**Come funziona:**\n- I titoli sono depositati presso una banca depositaria\n- Sono separati dal patrimonio del broker\n- In caso di fallimento, vengono trasferiti\n- La protezione 100.000€ è per il cash non investito",
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
        title: "🧠 Quiz finale: broker e commissioni",
        content: "Hai imparato i tipi di broker, i costi da considerare, la differenza tra regime amministrato e dichiarativo, e come verificare l'affidabilità.\n\n**Concetti chiave:**\n- Broker bancari vs online vs mobile\n- Costo totale = commissioni + custodia + cambio + fiscalità\n- Amministrato = semplice; Dichiarativo = fai da te\n- Regolamentazione prima di tutto\n\nVerifichiamo la comprensione.",
      },
      {
        kind: "question",
        title: "❓ Domanda 1",
        content: "Per un principiante italiano, quale broker è più adatto?",
        pollAreas: [
          {
            id: "quiz-q1-21",
            prompt: "Seleziona la scelta migliore",
            options: [
              "Broker italiano con regime amministrato (es. Fineco, Directa)",
              "Broker estero con commissioni più basse",
              "Il broker con l'app più bella",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! Per iniziare, la **semplicità fiscale** del regime amministrato vale più del risparmio sulle commissioni. Inizia semplice, ottimizza dopo.",
            wrongExplanation: "L'app bella non è un criterio. Il broker estero richiede commercialista.\n\n**Per principianti:** broker italiano + regime amministrato = zero pensieri fiscali.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 2",
        content: "Cosa include il 'costo totale' di un broker?",
        pollAreas: [
          {
            id: "quiz-q2-21",
            prompt: "Seleziona i componenti corretti",
            options: [
              "Commissioni + custodia + cambio valuta + eventuale commercialista",
              "Solo le commissioni per operazione",
              "Solo il canone mensile",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Il **costo totale** include tutto: commissioni, custodia, spread cambio, e se in regime dichiarativo anche il commercialista. Calcola tutto.",
            wrongExplanation: "Le commissioni sono solo una parte.\n\n**Costo totale:**\n- Commissioni per operazione\n- Costi di custodia annui\n- Spread sul cambio valuta\n- Costo commercialista (se dichiarativo)\n- Eventuali costi di inattività",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 3",
        content: "Cosa verifica l'affidabilità di un broker?",
        pollAreas: [
          {
            id: "quiz-q3-21",
            prompt: "Seleziona il criterio principale",
            options: [
              "Autorizzazione CONSOB o equivalente UE",
              "Le commissioni più basse del mercato",
              "Il numero di download dell'app",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! L'**autorizzazione regolamentare** è il criterio fondamentale. Senza quella, tutto il resto non conta. Commissioni basse di un broker truffa = perdita totale.",
            wrongExplanation: "Commissioni basse e popolarità non garantiscono affidabilità.\n\n**Il criterio fondamentale:** autorizzazione CONSOB (Italia) o licenza UE con passaporto. Verifica sempre prima di depositare.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["So scegliere il broker", "Calcolo i costi totali", "Verifico la regolamentazione"],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "✅ Cosa hai imparato: broker e commissioni",
        content: "Complimenti! Hai completato la lezione su broker e commissioni.\n\n**Principi chiave:**\n\n1. **Tipi di broker:** bancari, online, mobile\n2. **Costi totali:** commissioni + custodia + cambio + fiscalità\n3. **Regime fiscale:** amministrato (semplice) vs dichiarativo\n4. **Affidabilità:** regolamentazione prima di tutto\n5. **Per principianti:** broker italiano + amministrato\n\nLa prossima lezione sulla fiscalità completerà il quadro.",
      },
      {
        kind: "explain",
        title: "📌 Come procedere",
        content: "Ecco i passi per scegliere il broker:\n\n**Passo 1: Definisci le tue esigenze**\n- Quanto investi? (PAC piccolo vs lump sum grande)\n- Quanto sei esperto? (semplice vs avanzato)\n- Vuoi gestire la fiscalità? (no = amministrato)\n\n**Passo 2: Confronta 2-3 broker**\n- Calcola il costo totale annuo stimato\n- Verifica che siano regolamentati\n- Leggi recensioni recenti\n\n**Passo 3: Apri il conto**\n- Processo online (identità, IBAN, firma)\n- Tempi: 1-5 giorni\n- Primo deposito\n\n**Passo 4: Inizia semplice**\n- Non usare subito tutte le funzioni\n- Compra il primo ETF\n- Impara la piattaforma gradualmente",
      },
      {
        kind: "question",
        title: "🎯 Il tuo prossimo passo",
        content: "Cosa farai dopo questa lezione?",
        pollAreas: [
          {
            id: "feedback-action-21",
            prompt: "Indica il tuo prossimo passo",
            options: [
              "Confronto 2-3 broker per la mia situazione",
              "Apro un conto con un broker italiano",
              "Prima studio la fiscalità nella prossima lezione",
            ],
            correctIndex: 2,
            correctExplanation: "Ottima scelta! La **lezione sulla fiscalità** completerà il quadro. Sapere come funzionano le tasse ti aiuterà a scegliere tra amministrato e dichiarativo.",
            wrongExplanation: "Tutti i passi sono validi!\n\n- Confrontare broker: buon inizio pratico\n- Aprire conto: se hai già deciso\n- Studiare fiscalità: per decidere con tutte le info\n\nL'importante è procedere.",
            allowText: false,
          },
        ],
      },
    ],
    suggestedPrompts: [
      "Qual è il broker migliore per la mia situazione?",
      "Come funziona il regime amministrato?",
      "Quanto costa realmente investire con diversi broker?",
    ],
  },
};

const lesson21Definition = createStaticLessonDefinition("21", content);

export default lesson21Definition;
