import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "caring"],
    blocks: [
      {
        kind: "focus",
        title: "💡 ETF: il miglior amico dell'investitore",
        content: "Un **ETF** (Exchange Traded Fund) è un fondo che si compra e vende in borsa come un'azione, ma al suo interno contiene un portafoglio diversificato di titoli.\n\n**Caratteristiche chiave:**\n- Si compra/vende in tempo reale durante gli orari di mercato\n- Replica un indice (passivo) o una strategia\n- Costi molto bassi (tipicamente 0.05%-0.50%)\n- Diversificazione automatica\n- Trasparenza: sai esattamente cosa contiene\n\n**Esempio:**\nUn ETF S&P 500 contiene tutte le 500 aziende dell'indice. Con un solo acquisto possiedi una fetta di Apple, Microsoft, Amazon, e altre 497 aziende.",
      },
      {
        kind: "explain",
        title: "📌 Perché gli ETF hanno rivoluzionato gli investimenti",
        content: "Gli ETF hanno democratizzato gli investimenti per tre motivi:\n\n**1. Costi bassissimi**\n- ETF: 0.05%-0.30% annuo\n- Fondi attivi: 1.5%-2.5% annuo\n- Risparmio su 30 anni: centinaia di migliaia di euro\n\n**2. Accessibilità**\n- Puoi comprare da qualsiasi broker\n- Importi minimi bassi (il prezzo di 1 quota)\n- Liquidità immediata\n\n**3. Diversificazione istantanea**\n- Un solo ETF può contenere migliaia di titoli\n- Diversificazione globale con un click\n- Impossibile da replicare comprando singole azioni\n\n**Il risultato:** quello che prima era riservato a investitori istituzionali ora è accessibile a tutti, a costi minimi.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Qual è il vantaggio principale degli ETF rispetto ai fondi attivi?",
        pollAreas: [
          {
            id: "concept-verify-18",
            prompt: "Seleziona il vantaggio principale",
            options: [
              "Costi molto più bassi con performance simili o superiori",
              "Rendimenti garantiti",
              "Nessun rischio di perdita",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Gli ETF costano una frazione dei fondi attivi. Poiché il 90% dei fondi attivi non batte il mercato, l'ETF che replica il mercato a basso costo è spesso la scelta migliore.",
            wrongExplanation: "Gli ETF non garantiscono rendimenti e possono perdere valore.\n\n**Il vantaggio reale:** costi bassi + diversificazione. Paghi lo 0.1% invece del 2%, e nel lungo termine questo fa un'enorme differenza.",
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🎯 Come funziona la replica di un indice",
        content: "Gli ETF replicano un indice in due modi:\n\n**Replica fisica:**\n- L'ETF compra effettivamente tutti i titoli dell'indice\n- Es: ETF S&P 500 possiede le 500 azioni\n- Vantaggi: trasparenza, semplicità\n- Tipo più comune e consigliato\n\n**Replica sintetica:**\n- L'ETF usa derivati (swap) per replicare la performance\n- Non possiede fisicamente i titoli\n- Vantaggi: più efficiente per alcuni indici difficili\n- Svantaggi: rischio controparte\n\n**Per l'investitore medio:** la replica fisica è preferibile per semplicità e trasparenza. La sintetica va bene per indici specifici dove la fisica sarebbe troppo costosa.",
      },
      {
        kind: "question",
        title: "🧠 Verifica: tipi di replica",
        content: "Quale tipo di replica è generalmente consigliata per l'investitore retail?",
        pollAreas: [
          {
            id: "concept-solve-18",
            prompt: "Seleziona la risposta",
            options: [
              "Fisica - più trasparente e semplice",
              "Sintetica - più economica",
              "Non fa differenza",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! La replica **fisica** è più trasparente: l'ETF possiede realmente i titoli. È la scelta preferita per la maggior parte degli investitori.",
            wrongExplanation: "La differenza di costo tra fisica e sintetica è minima.\n\n**Perché preferire la fisica:**\n- Trasparenza: sai cosa possiedi\n- Semplicità: niente derivati complessi\n- Nessun rischio controparte",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco gli ETF", "Preferisco replica fisica", "Apprezzo i costi bassi"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "integration"],
    blocks: [
      {
        kind: "focus",
        title: "🛠️ Accumulazione vs Distribuzione",
        content: "Gli ETF gestiscono i dividendi in due modi:\n\n**ETF ad Accumulazione (Acc):**\n- I dividendi vengono reinvestiti automaticamente\n- Il valore della quota cresce\n- Nessuna cedola da gestire\n- Più efficiente fiscalmente in Italia\n- Ideale per chi investe a lungo termine\n\n**ETF a Distribuzione (Dist):**\n- I dividendi vengono pagati periodicamente (trimestre/semestre)\n- Ricevi liquidità sul conto\n- Devi pagare le tasse sui dividendi subito\n- Ideale per chi cerca reddito periodico\n\n**Per la maggior parte delle persone:** l'accumulazione è preferibile. Massimizza l'interesse composto e semplifica la gestione fiscale.",
      },
      {
        kind: "explain",
        title: "📌 TER e costi nascosti",
        content: "Il **TER** (Total Expense Ratio) è il costo annuo dell'ETF, ma non è l'unico costo.\n\n**TER:**\n- Commissione di gestione annua\n- Va dallo 0.03% (ETF S&P 500 Vanguard) allo 0.80%+ (ETF tematici)\n- Viene scalato automaticamente dal valore\n\n**Altri costi da considerare:**\n\n1. **Spread bid-ask:** differenza tra prezzo di acquisto e vendita\n2. **Commissioni broker:** il costo di ogni operazione\n3. **Tracking difference:** quanto l'ETF devia dall'indice\n\n**Regola pratica:**\n- Per ETF su indici principali: TER < 0.30%\n- Per ETF su mercati emergenti/specifici: TER < 0.50%\n- Evita ETF con TER > 0.70% se esistono alternative",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Per un investitore che risparmia per la pensione tra 30 anni, quale ETF è preferibile?",
        pollAreas: [
          {
            id: "widget-verify-18",
            prompt: "Seleziona l'opzione migliore",
            options: [
              "Accumulazione - massimizza l'interesse composto",
              "Distribuzione - per avere rendite periodiche",
              "Non fa differenza",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Con 30 anni davanti, l'**accumulazione** è ideale: i dividendi vengono reinvestiti automaticamente, massimizzando l'interesse composto.",
            wrongExplanation: "Con un orizzonte lungo, non hai bisogno di reddito periodico.\n\n**Accumulazione per lungo termine:**\n- Dividendi reinvestiti automaticamente\n- Interesse composto massimizzato\n- Meno operazioni fiscali da gestire",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario pratico",
        content: "Due ETF replicano lo stesso indice:\n- ETF A: TER 0.07%, molto scambiato\n- ETF B: TER 0.05%, poco scambiato\n\nQuale scegli?",
        pollAreas: [
          {
            id: "widget-scenario-18",
            prompt: "Quale ETF è preferibile?",
            options: [
              "ETF A - la liquidità riduce i costi di spread e rende più facile comprare/vendere",
              "ETF B - il TER più basso batte tutto",
              "Sono equivalenti",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! La differenza di TER (0.02%) è minima. Ma l'ETF poco scambiato potrebbe avere uno **spread bid-ask alto** che costa molto di più. La liquidità conta.",
            wrongExplanation: "Il TER non è l'unico costo.\n\n**Lo spread bid-ask:**\nSe ETF B è poco scambiato, potresti pagare il 0.3-0.5% di spread ogni volta che compri o vendi. Questo supera di gran lunga il risparmio dello 0.02% sul TER.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Scelgo accumulazione", "Verifico TER e liquidità", "Confronto i costi totali"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      {
        kind: "focus",
        title: "⚡ Gli errori comuni con gli ETF",
        content: "Gli ETF sono semplici ma ci sono errori da evitare:\n\n**Errore #1: Scegliere solo per il TER**\nIl TER più basso non è sempre la scelta migliore. Liquidità, tracking difference, e dimensione del fondo contano.\n\n**Errore #2: Troppi ETF**\n3-5 ETF sono sufficienti per un portafoglio completo. Averne 15 complica la gestione senza vantaggi reali.\n\n**Errore #3: ETF tematici speculativi**\nETF su 'robotica', 'cannabis', 'metaverso' sono spesso mode passeggere. Costano di più e spesso sottoperformano.\n\n**Errore #4: Ignorare la valuta**\nUn ETF quotato in USD espone al rischio cambio EUR/USD. Per ridurlo, considera ETF con hedging o domiciliati in Europa.",
      },
      {
        kind: "explain",
        title: "📌 Come scegliere il giusto numero di ETF",
        content: "Quanti ETF servono per un portafoglio completo?\n\n**Portafoglio minimalista (1-2 ETF):**\n- 1 ETF globale (MSCI World o FTSE All-World)\n- + eventualmente 1 ETF obbligazionario\n- Perfetto per chi vuole semplicità assoluta\n\n**Portafoglio standard (3-4 ETF):**\n- 1 ETF mercati sviluppati\n- 1 ETF mercati emergenti\n- 1 ETF obbligazionario\n- + eventualmente oro o altro\n\n**Portafoglio più articolato (5-7 ETF):**\n- Diversi ETF geografici o settoriali\n- Mix obbligazionario più complesso\n- Per chi vuole controllo granulare\n\n**Oltre 10 ETF:** quasi certamente stai complicando troppo. L'overlap tra ETF riduce l'efficacia della diversificazione.",
      },
      {
        kind: "question",
        title: "🧠 Verifica comprensione",
        content: "Un amico ti dice: 'Ho 25 ETF per essere ben diversificato.' Cosa ne pensi?",
        pollAreas: [
          {
            id: "challenge-verify-18",
            prompt: "Valuta l'affermazione",
            options: [
              "Troppi - probabilmente c'è overlap e la gestione è complicata",
              "Giusto - più ETF = più diversificazione",
              "Dipende da quali sono",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **25 ETF sono troppi.** Probabilmente molti si sovrappongono (es. S&P 500 + MSCI World contengono le stesse azioni). 3-7 ETF sono sufficienti per una diversificazione ottimale.",
            wrongExplanation: "Più ETF non significa più diversificazione.\n\n**Il problema dell'overlap:**\nSe hai sia S&P 500 che MSCI World, le stesse 500 aziende USA sono in entrambi. Non stai diversificando, stai duplicando.\n\n3-7 ETF ben scelti coprono tutto il mondo.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario critico",
        content: "Vedi un ETF 'AI & Robotics' con performance +80% nell'ultimo anno. Cosa fai?",
        pollAreas: [
          {
            id: "challenge-scenario-18",
            prompt: "Qual è l'approccio corretto?",
            options: [
              "Cautela - i tematici sono spesso mode e i rendimenti passati non si ripetono",
              "Compro subito - l'AI è il futuro",
              "Metto il 50% del portafoglio",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! Gli **ETF tematici** spesso arrivano dopo che un trend è già iniziato. L'+80% potrebbe essere già scontato nel prezzo. Inoltre, costano di più (TER alto) e molti sottoperformano dopo il boom iniziale.",
            wrongExplanation: "Gli ETF tematici sono pericolosi:\n\n**I problemi:**\n- Arrivano spesso dopo il trend\n- Costi più alti (TER 0.5-0.75%)\n- Concentrazione su pochi titoli\n- Molti sottoperformano nel lungo termine\n\nPer esposizione tech, meglio un ETF globale che include già le migliori aziende tech.",
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
        title: "🧠 Quiz finale: ETF cosa sono",
        content: "Hai imparato cosa sono gli ETF, come funzionano, e come sceglierli.\n\n**Concetti chiave:**\n- ETF = fondo quotato che replica un indice\n- Costi bassi + diversificazione = vantaggi principali\n- Accumulazione preferibile per lungo termine\n- 3-7 ETF sono sufficienti\n- Evita tematici speculativi\n\nVerifichiamo la comprensione.",
      },
      {
        kind: "question",
        title: "❓ Domanda 1",
        content: "Cosa distingue un ETF da un fondo comune tradizionale?",
        pollAreas: [
          {
            id: "quiz-q1-18",
            prompt: "Seleziona la risposta corretta",
            options: [
              "Si compra/vende in borsa, ha costi più bassi, è più trasparente",
              "Ha rendimenti garantiti",
              "È più rischioso",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! L'ETF si **scambia in borsa** come un'azione, ha costi molto più bassi, e pubblica giornalmente i suoi contenuti. Queste sono le differenze principali.",
            wrongExplanation: "Gli ETF non hanno rendimenti garantiti e non sono necessariamente più rischiosi.\n\n**Le differenze vere:**\n- Quotato in borsa (liquidità in tempo reale)\n- Costi molto più bassi\n- Trasparenza sui titoli posseduti",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 2",
        content: "Per un investitore con orizzonte 20+ anni, quale tipo di ETF è preferibile?",
        pollAreas: [
          {
            id: "quiz-q2-18",
            prompt: "Seleziona il tipo migliore",
            options: [
              "Accumulazione - dividendi reinvestiti automaticamente",
              "Distribuzione - per ricevere cedole",
              "Sintetico - più economico",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Con 20 anni davanti, l'**accumulazione** è ideale. I dividendi vengono reinvestiti, l'interesse composto lavora al massimo, e la gestione fiscale è più semplice.",
            wrongExplanation: "La distribuzione ha senso per chi cerca reddito periodico. La sintetica non è necessariamente più economica.\n\n**Per il lungo termine:** accumulazione, sempre.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 3",
        content: "Quanti ETF sono necessari per un portafoglio ben diversificato?",
        pollAreas: [
          {
            id: "quiz-q3-18",
            prompt: "Seleziona il numero ideale",
            options: [
              "3-7 ETF sono sufficienti per copertura globale",
              "Almeno 15-20 per vera diversificazione",
              "Solo 1 ETF per semplicità assoluta",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! **3-7 ETF** coprono tutto: azioni globali, obbligazioni, e eventualmente altri asset. Di più crea complessità senza benefici, di meno può funzionare (1-2 ETF) per chi vuole semplicità estrema.",
            wrongExplanation: "Un solo ETF può funzionare (es. MSCI ACWI), ma spesso 3-5 permettono un controllo migliore.\n\n15-20 sono troppi: crei overlap e complicazioni inutili.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco gli ETF", "So scegliere accumulazione/distribuzione", "Costruisco portafoglio semplice"],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "✅ Cosa hai imparato: ETF cosa sono",
        content: "Complimenti! Hai completato la lezione sugli ETF.\n\n**Principi chiave:**\n\n1. **ETF = fondo quotato** che replica un indice\n2. **Vantaggi:** costi bassi, diversificazione, trasparenza\n3. **Accumulazione vs distribuzione:** per lungo termine, accumulazione\n4. **Numero ideale:** 3-7 ETF per portafoglio completo\n5. **Attenzione:** evita ETF tematici speculativi\n\nNella prossima lezione imparerai come scegliere gli ETF specifici per il tuo portafoglio.",
      },
      {
        kind: "explain",
        title: "📌 Perché gli ETF sono lo strumento ideale",
        content: "Ricapitoliamo perché gli ETF sono la scelta preferita:\n\n**Per l'investitore difensivo:**\n- Diversificazione istantanea\n- Nessuna analisi richiesta\n- Costi minimi\n- Versamenti automatici semplici\n\n**Per l'investitore intraprendente:**\n- ETF come 'core' del portafoglio\n- Singole azioni come 'satellite'\n- Flessibilità nelle allocazioni\n\n**I numeri parlano chiaro:**\n- ETF S&P 500 batte il 90% dei fondi attivi su 15 anni\n- Costi dello 0.07% vs 2% dei fondi attivi\n- Differenza su 30 anni: centinaia di migliaia di euro\n\nGli ETF hanno democratizzato gli investimenti. Approfitta.",
      },
      {
        kind: "question",
        title: "🎯 Il tuo prossimo passo",
        content: "Cosa farai dopo questa lezione?",
        pollAreas: [
          {
            id: "feedback-action-18",
            prompt: "Indica il tuo prossimo passo",
            options: [
              "Cerco ETF globali a basso costo per iniziare",
              "Verifico i costi degli strumenti che ho già",
              "Continuo con la prossima lezione su come scegliere ETF",
            ],
            correctIndex: 2,
            correctExplanation: "Ottima scelta! La prossima lezione ti darà criteri pratici per **scegliere gli ETF giusti** per il tuo portafoglio.",
            wrongExplanation: "Tutte le azioni sono valide! L'importante è procedere.\n\nLa prossima lezione ti guiderà nella scelta degli ETF specifici, quindi ha senso continuare il percorso.",
            allowText: false,
          },
        ],
      },
    ],
    suggestedPrompts: [
      "Quali sono gli ETF globali più popolari e affidabili?",
      "Come imposto un PAC su ETF?",
      "Quanti ETF dovrei avere nel mio portafoglio?",
    ],
  },
};

const lesson18Definition = createStaticLessonDefinition("18", content);

export default lesson18Definition;
