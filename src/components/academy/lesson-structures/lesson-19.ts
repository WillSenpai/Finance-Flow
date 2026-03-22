import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "caring"],
    blocks: [
      {
        kind: "focus",
        title: "💡 ETF: come sceglierli",
        content: "Hai capito cosa sono gli ETF. Ora impari a scegliere quelli giusti per te.\n\n**I criteri di selezione:**\n1. **Indice replicato** - cosa vuoi comprare?\n2. **Costo (TER)** - quanto paghi?\n3. **Dimensione** - quanto è grande il fondo?\n4. **Liquidità** - quanto è facile comprare/vendere?\n5. **Tipo** - accumulazione o distribuzione?\n6. **Replica** - fisica o sintetica?\n7. **Domicilio** - dove è registrato?\n\nNon tutti i criteri hanno la stessa importanza. Vediamoli in ordine di priorità.",
      },
      {
        kind: "explain",
        title: "📌 Criterio #1: L'indice giusto",
        content: "La scelta dell'indice è la decisione più importante.\n\n**Per azioni globali:**\n- **MSCI World**: 1.500+ aziende, 23 paesi sviluppati\n- **FTSE All-World**: 4.000+ aziende, include emergenti\n- **MSCI ACWI**: simile a FTSE All-World\n\n**Per azioni USA:**\n- **S&P 500**: 500 grandi aziende USA\n- **NASDAQ 100**: 100 tech USA\n\n**Per azioni Europa:**\n- **STOXX Europe 600**: 600 aziende europee\n- **MSCI EMU**: area euro\n\n**Per obbligazioni:**\n- **Euro Aggregate**: obbligazioni area euro\n- **Global Aggregate**: obbligazioni globali\n\n**Consiglio:** per la maggior parte, un ETF MSCI World o FTSE All-World copre il grosso del portafoglio azionario.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Se vuoi diversificare su tutto il mondo sviluppato con un solo ETF, quale indice scegli?",
        pollAreas: [
          {
            id: "concept-verify-19",
            prompt: "Seleziona l'indice corretto",
            options: [
              "MSCI World o FTSE Developed World",
              "S&P 500",
              "FTSE MIB",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **MSCI World** copre 1.500+ aziende in 23 paesi sviluppati. Con un solo ETF hai diversificazione globale. L'S&P 500 copre solo gli USA, il FTSE MIB solo l'Italia.",
            wrongExplanation: "L'S&P 500 copre solo gli USA (importante ma non globale). Il FTSE MIB copre solo l'Italia (troppo concentrato).\n\n**Per diversificazione globale:** MSCI World o FTSE All-World (che include anche emergenti).",
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🎯 Criterio #2-4: Costo, dimensione, liquidità",
        content: "Dopo aver scelto l'indice, valuta questi criteri:\n\n**TER (costo):**\n- Per indici principali: < 0.25% è eccellente\n- Per emergenti/specifici: < 0.50% è ok\n- A parità di tutto, scegli il TER più basso\n\n**Dimensione del fondo (AUM):**\n- Minimo consigliato: 100 milioni €\n- Ideale: > 500 milioni €\n- Fondi piccoli rischiano chiusura o inefficienze\n\n**Liquidità (volume scambi):**\n- Guarda i volumi giornalieri\n- ETF molto scambiati hanno spread più bassi\n- Per indici principali, la liquidità è raramente un problema",
      },
      {
        kind: "question",
        title: "🧠 Verifica: criteri di selezione",
        content: "Due ETF replicano lo stesso indice:\n- ETF A: TER 0.20%, AUM 3 miliardi €\n- ETF B: TER 0.12%, AUM 50 milioni €\n\nQuale scegli?",
        pollAreas: [
          {
            id: "concept-solve-19",
            prompt: "Quale ETF è preferibile?",
            options: [
              "ETF A - la dimensione garantisce liquidità e stabilità",
              "ETF B - il costo più basso batte tutto",
              "Sono equivalenti",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **ETF A** è preferibile. La differenza di costo (0.08%) è minima, ma ETF B è troppo piccolo: rischio chiusura, spread alti, possibili inefficienze.",
            wrongExplanation: "Il costo non è l'unico fattore.\n\n**Perché ETF A è migliore:**\n- Dimensione 3 miliardi = stabile, liquido\n- Differenza costo: solo 0.08% annuo\n- ETF B (50M) potrebbe chiudere o avere problemi di liquidità",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Scelgo l'indice giusto", "Valuto TER e dimensione", "Verifico la liquidità"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "integration"],
    blocks: [
      {
        kind: "focus",
        title: "🛠️ Dove trovare e confrontare ETF",
        content: "Per scegliere gli ETF usa questi strumenti:\n\n**JustETF (gratuito):**\n- Il più completo per ETF europei\n- Filtri per indice, costo, dimensione\n- Confronto dettagliato tra ETF simili\n- www.justetf.com\n\n**Morningstar (gratuito base):**\n- Rating e analisi\n- Performance storica\n- Confronto con benchmark\n\n**ETF specifici da broker:**\n- Fineco, Directa, Degiro hanno liste\n- Verifica costi di negoziazione\n\n**Consiglio pratico:** usa JustETF per la ricerca, poi compra dal tuo broker. JustETF permette di filtrare per indice, TER, dimensione, tipo, e mostra tutti i dati necessari.",
      },
      {
        kind: "explain",
        title: "📌 I principali emittenti di ETF",
        content: "Non tutti gli ETF sono uguali. Ecco gli emittenti più affidabili:\n\n**iShares (BlackRock):**\n- Il più grande al mondo\n- Ampia gamma di prodotti\n- Costi competitivi\n- Liquidità eccellente\n\n**Vanguard:**\n- Pioniere degli index fund\n- Costi tra i più bassi\n- Filosofia orientata all'investitore\n\n**Xtrackers (DWS/Deutsche Bank):**\n- Forte in Europa\n- Buoni ETF obbligazionari\n\n**Amundi/Lyxor:**\n- Più grandi in Europa\n- Buona gamma, costi competitivi\n\n**SPDR (State Street):**\n- SPY è l'ETF più scambiato al mondo\n- Forte su USA\n\n**Consiglio:** per lo stesso indice, confronta ETF di 2-3 emittenti diversi e scegli in base a costo, dimensione, e disponibilità sul tuo broker.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Quale strumento è più utile per confrontare ETF europei?",
        pollAreas: [
          {
            id: "widget-verify-19",
            prompt: "Seleziona lo strumento migliore",
            options: [
              "JustETF - specializzato su ETF europei con filtri dettagliati",
              "Google Finance - per le quotazioni",
              "Il sito della banca - hanno le migliori info",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **JustETF** è lo strumento migliore per confrontare ETF europei. Permette di filtrare per ogni criterio e confrontare ETF simili fianco a fianco.",
            wrongExplanation: "Google Finance mostra solo quotazioni base. I siti delle banche spesso mostrano solo i prodotti che vendono.\n\n**JustETF** è indipendente, completo, e gratuito. È lo standard per la ricerca ETF in Europa.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario pratico",
        content: "Cerchi un ETF su MSCI World. JustETF ne mostra 15. Come filtri?",
        pollAreas: [
          {
            id: "widget-scenario-19",
            prompt: "Quali filtri applichi?",
            options: [
              "TER < 0.25%, AUM > 500M, accumulazione, replica fisica",
              "Solo TER più basso possibile",
              "Quello con performance migliore ultimo anno",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! Filtri per **costo ragionevole + dimensione adeguata + tipo preferito + replica fisica**. Questo ti lascia 2-3 opzioni ottime tra cui scegliere.",
            wrongExplanation: "Il TER più basso non è l'unico criterio. La performance passata non predice quella futura.\n\n**Filtri intelligenti:**\n- TER: competitivo (< 0.25%)\n- Dimensione: > 500M (stabilità)\n- Tipo: accumulazione (se lungo termine)\n- Replica: fisica (trasparenza)",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Uso JustETF", "Confronto emittenti", "Applico i filtri"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      {
        kind: "focus",
        title: "⚡ Il portafoglio ETF ideale",
        content: "Ecco alcuni portafogli tipo costruiti con ETF:\n\n**Portafoglio 1 ETF (semplicissimo):**\n- 100% FTSE All-World o MSCI ACWI\n- Diversificazione globale totale\n- Per chi vuole zero complicazioni\n\n**Portafoglio 2 ETF (classico):**\n- 80% MSCI World\n- 20% ETF obbligazionario Euro\n- Bilancia crescita e stabilità\n\n**Portafoglio 3 ETF (più articolato):**\n- 60% MSCI World\n- 15% MSCI Emerging Markets\n- 25% Obbligazioni Euro Aggregate\n\n**Portafoglio 4 ETF (completo):**\n- 50% MSCI World\n- 15% Emergenti\n- 25% Obbligazioni\n- 10% Oro\n\nScegli in base alla tua tolleranza al rischio e preferenza di complessità.",
      },
      {
        kind: "explain",
        title: "📌 Esempi concreti di ETF popolari",
        content: "Ecco ETF specifici usati da molti investitori:\n\n**Azioni globali:**\n- iShares Core MSCI World (SWDA) - TER 0.20%\n- Vanguard FTSE All-World (VWCE) - TER 0.22%\n\n**Azioni USA:**\n- iShares Core S&P 500 (CSPX) - TER 0.07%\n- Vanguard S&P 500 (VUAA) - TER 0.07%\n\n**Mercati emergenti:**\n- iShares Core MSCI EM (EIMI) - TER 0.18%\n\n**Obbligazioni:**\n- iShares Euro Aggregate Bond (IEAG) - TER 0.25%\n- Vanguard Global Aggregate (VAGF) - TER 0.10%\n\n**Oro:**\n- Invesco Physical Gold (SGLD) - TER 0.12%\n\nQuesti sono tra i più liquidi e usati. Verifica sempre disponibilità sul tuo broker.",
      },
      {
        kind: "question",
        title: "🧠 Verifica comprensione",
        content: "Per un investitore difensivo che vuole semplicità, quale portafoglio è ideale?",
        pollAreas: [
          {
            id: "challenge-verify-19",
            prompt: "Seleziona il portafoglio più adatto",
            options: [
              "1-2 ETF: un globale + eventualmente obbligazionario",
              "10+ ETF per massima diversificazione",
              "Solo singole azioni scelte con cura",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **1-2 ETF** sono perfetti per l'investitore difensivo: un ETF globale (es. VWCE) copre tutto, un obbligazionario aggiunge stabilità. Semplice, efficace, economico.",
            wrongExplanation: "10+ ETF sono troppi per chi cerca semplicità. Le singole azioni richiedono analisi.\n\n**Per il difensivo:** 1-2 ETF. Un FTSE All-World contiene già 4.000+ titoli. Aggiungere altri ETF complica senza vantaggi reali.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario: costruisci il tuo portafoglio",
        content: "Hai 30 anni, orizzonte pensione (35 anni), tolleranza al rischio alta. Quale portafoglio scegli?",
        pollAreas: [
          {
            id: "challenge-scenario-19",
            prompt: "Quale allocazione è appropriata?",
            options: [
              "90% azioni globali, 10% obbligazioni (o 100% azioni)",
              "50% azioni, 50% obbligazioni",
              "20% azioni, 80% obbligazioni",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! Con 35 anni davanti e tolleranza alta, **90-100% azioni** è appropriato. Hai tempo per recuperare i crolli e massimizzare la crescita.",
            wrongExplanation: "Con 35 anni di orizzonte e alta tolleranza, essere troppo conservativi spreca potenziale di crescita.\n\n**La logica:**\n- 35 anni = tantissimo tempo per recuperare crolli\n- Alta tolleranza = reggi la volatilità\n- 90-100% azioni massimizza il rendimento atteso",
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
        title: "🧠 Quiz finale: come scegliere ETF",
        content: "Hai imparato i criteri per scegliere ETF: indice, costo, dimensione, liquidità, tipo.\n\n**Concetti chiave:**\n- L'indice è la scelta più importante\n- TER basso ma non l'unico criterio\n- Dimensione > 100M, idealmente > 500M\n- Accumulazione per lungo termine\n- JustETF per confrontare\n\nVerifichiamo la comprensione.",
      },
      {
        kind: "question",
        title: "❓ Domanda 1",
        content: "Qual è il criterio PIÙ importante nella scelta di un ETF?",
        pollAreas: [
          {
            id: "quiz-q1-19",
            prompt: "Seleziona il criterio principale",
            options: [
              "L'indice che replica (cosa vuoi comprare)",
              "Il TER (costo)",
              "La performance passata",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! Prima devi decidere **COSA comprare** (l'indice). Solo dopo confronti costo, dimensione ecc. tra ETF che replicano lo stesso indice.",
            wrongExplanation: "Il TER conta, ma viene dopo. La performance passata non predice quella futura.\n\n**L'ordine logico:**\n1. Scegli l'indice (cosa vuoi)\n2. Confronta gli ETF su quell'indice\n3. Valuta costo, dimensione, tipo",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 2",
        content: "Un ETF con TER 0.05% ma dimensione 30 milioni € è una buona scelta?",
        pollAreas: [
          {
            id: "quiz-q2-19",
            prompt: "Valuta l'ETF",
            options: [
              "No - troppo piccolo, rischio chiusura e spread alti",
              "Sì - il costo bassissimo compensa tutto",
              "Dipende solo dalla performance",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **30 milioni è troppo piccolo.** L'ETF potrebbe chiudere, avere spread alti, o problemi di liquidità. Meglio pagare 0.10-0.20% per un ETF solido.",
            wrongExplanation: "Il costo basso non compensa i rischi di un fondo piccolo.\n\n**I problemi dei fondi piccoli:**\n- Rischio chiusura\n- Spread bid-ask alti\n- Minore efficienza\n\nMeglio pagare un po' di più per stabilità.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 3",
        content: "Per un portafoglio semplice ed efficace, quanti ETF servono?",
        pollAreas: [
          {
            id: "quiz-q3-19",
            prompt: "Seleziona il numero ideale",
            options: [
              "1-3 ETF sono sufficienti per copertura completa",
              "Almeno 10 per diversificare bene",
              "Più sono meglio è",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! **1-3 ETF** coprono tutto. Un ETF globale da solo contiene già migliaia di titoli. Aggiungere ETF obbligazionari o emergenti è opzionale.",
            wrongExplanation: "Più ETF non significa più diversificazione. Un ETF MSCI World contiene 1.500+ aziende.\n\n**La semplicità vince:** 1-3 ETF ben scelti battono 15 ETF che si sovrappongono.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["So scegliere ETF", "Uso i criteri corretti", "Costruisco portafoglio semplice"],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "✅ Cosa hai imparato: come scegliere ETF",
        content: "Complimenti! Hai completato la lezione sulla scelta degli ETF.\n\n**Principi chiave:**\n\n1. **Prima l'indice** - cosa vuoi comprare?\n2. **Poi i criteri** - TER, dimensione, liquidità, tipo\n3. **Strumenti** - JustETF per confrontare\n4. **Semplicità** - 1-3 ETF bastano\n5. **Emittenti affidabili** - iShares, Vanguard, Amundi\n\nOra hai tutti gli strumenti per costruire il tuo portafoglio ETF.",
      },
      {
        kind: "explain",
        title: "📌 Il tuo piano d'azione",
        content: "Ecco come procedere:\n\n**Passo 1: Definisci l'allocazione**\n- Quante azioni vs obbligazioni?\n- Usa la formula 100 - età per iniziare\n\n**Passo 2: Scegli gli indici**\n- Azioni globali: MSCI World o FTSE All-World\n- Obbligazioni: Euro Aggregate o Global\n- Eventuale emergenti, oro\n\n**Passo 3: Seleziona gli ETF specifici**\n- Vai su JustETF\n- Filtra per i criteri visti\n- Scegli 1-3 ETF\n\n**Passo 4: Verifica sul broker**\n- Gli ETF scelti sono disponibili?\n- Quali sono le commissioni?\n\n**Passo 5: Inizia**\n- Imposta versamento automatico\n- Non guardare troppo spesso",
      },
      {
        kind: "question",
        title: "🎯 Il tuo prossimo passo",
        content: "Cosa farai dopo questa lezione?",
        pollAreas: [
          {
            id: "feedback-action-19",
            prompt: "Indica il tuo prossimo passo",
            options: [
              "Vado su JustETF a cercare ETF concreti",
              "Definisco prima la mia allocazione azioni/obbligazioni",
              "Apro un conto broker se non ce l'ho",
            ],
            correctIndex: 1,
            correctExplanation: "Ottimo approccio! Prima **definisci l'allocazione** (quanto rischio, quanto in azioni), poi cerca gli ETF specifici. L'ordine è importante.",
            wrongExplanation: "Tutti i passi sono validi! Ma l'ordine logico è:\n\n1. Definisci allocazione\n2. Scegli gli ETF\n3. Apri broker (se serve)\n4. Inizia ad investire",
            allowText: false,
          },
        ],
      },
    ],
    suggestedPrompts: [
      "Aiutami a scegliere gli ETF per il mio profilo",
      "Qual è la differenza tra MSCI World e FTSE All-World?",
      "Come imposto un PAC mensile sugli ETF?",
    ],
  },
};

const lesson19Definition = createStaticLessonDefinition("19", content);

export default lesson19Definition;
