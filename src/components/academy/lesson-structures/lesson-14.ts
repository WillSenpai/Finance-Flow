import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "caring"],
    blocks: [
      {
        kind: "focus",
        title: "💡 Azioni: diventare proprietari di un'azienda",
        content: "Un'**azione** è una quota di proprietà di un'azienda. Quando compri un'azione Apple, diventi proprietario di una piccolissima parte di Apple.\n\nNon stai prestando soldi all'azienda (quello sono le obbligazioni). Stai diventando **socio**: partecipi ai profitti e alle perdite.\n\n**Cosa significa in pratica:**\n- Se l'azienda va bene → il valore delle tue azioni sale\n- Se l'azienda distribuisce utili → ricevi dividendi\n- Se l'azienda fallisce → perdi tutto l'investimento\n\nLe azioni sono lo strumento di investimento più potente nel lungo termine, ma anche il più volatile.",
      },
      {
        kind: "explain",
        title: "📌 Come guadagni con le azioni",
        content: "Ci sono due modi per guadagnare con le azioni:\n\n**1. Capital gain (aumento del valore)**\n- Compri a 100€, vendi a 150€ → guadagni 50€\n- È il modo principale per creare ricchezza\n- Richiede pazienza: nel breve periodo il prezzo oscilla molto\n\n**2. Dividendi (distribuzione degli utili)**\n- L'azienda distribuisce parte dei profitti agli azionisti\n- Es: 4€ per azione all'anno\n- Flusso di cassa regolare, utile per chi cerca reddito\n\n**Esempio concreto:**\nCompri 10 azioni a 100€ l'una = 1.000€ investiti\n- Dopo 5 anni valgono 150€ l'una = 1.500€ (capital gain 500€)\n- In 5 anni ricevi 4€/azione/anno = 200€ di dividendi\n- Totale guadagno: 700€ (70%)",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Cosa rappresenta un'azione?",
        pollAreas: [
          {
            id: "concept-verify-14",
            prompt: "Seleziona la risposta corretta",
            options: [
              "Una quota di proprietà dell'azienda",
              "Un prestito all'azienda",
              "Una garanzia di rendimento",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! L'azione è una **quota di proprietà**. Sei socio dell'azienda, partecipi a profitti e perdite. Non è un prestito (quello sono le obbligazioni) e non c'è alcuna garanzia.",
            wrongExplanation: "Le obbligazioni sono prestiti. Le azioni sono quote di proprietà.\n\n**La differenza fondamentale:**\n- Obbligazione: presti soldi, ricevi interessi, ti restituiscono il capitale\n- Azione: diventi socio, partecipi a profitti e perdite, nessuna garanzia",
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🎯 Perché le azioni sono volatili",
        content: "Il prezzo di un'azione cambia ogni secondo durante le ore di mercato. Perché?\n\n**Il prezzo riflette le aspettative future:**\n- Se gli investitori pensano che l'azienda crescerà → comprano → prezzo sale\n- Se pensano che andrà male → vendono → prezzo scende\n\n**Fattori che influenzano il prezzo:**\n- Risultati trimestrali dell'azienda\n- Notizie sul settore\n- Condizioni economiche generali\n- Psicologia degli investitori (paura/avidità)\n- Tassi di interesse\n\n**La lezione:** il prezzo di breve periodo è 'rumore'. Nel lungo periodo, conta solo se l'azienda crea valore. Ecco perché l'orizzonte temporale è fondamentale.",
      },
      {
        kind: "question",
        title: "🧠 Verifica: volatilità",
        content: "Un'azione che hai comprato a 100€ oggi vale 70€ (-30%). Cosa significa?",
        pollAreas: [
          {
            id: "concept-solve-14",
            prompt: "Qual è l'interpretazione corretta?",
            options: [
              "Hai una perdita su carta - diventa reale solo se vendi",
              "Hai perso definitivamente 30€ per azione",
              "L'azienda sta per fallire",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Finché non vendi, è una **perdita su carta**. Se l'azienda è solida e hai tempo, potrebbe recuperare. Vendere durante un calo cristallizza la perdita.",
            wrongExplanation: "Un calo del 30% non significa fallimento. Le azioni oscillano.\n\n**Perdita su carta vs reale:**\n- Su carta: il prezzo è sceso ma non hai venduto\n- Reale: hai venduto e hai meno soldi di prima\n\nMolte aziende solide hanno avuto cali del 30-50% per poi recuperare e crescere.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco la proprietà", "Distinguo capital gain e dividendi", "Accetto la volatilità"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "integration"],
    blocks: [
      {
        kind: "focus",
        title: "🛠️ Come si comprano le azioni",
        content: "Per comprare azioni ti serve un **conto titoli** presso un broker.\n\n**Passaggi:**\n1. Apri un conto presso un broker (es. Fineco, Directa, Degiro, Interactive Brokers)\n2. Deposita i fondi\n3. Cerca l'azione per nome o codice (ticker)\n4. Inserisci l'ordine di acquisto\n5. Le azioni entrano nel tuo portafoglio\n\n**Costi da considerare:**\n- Commissione di acquisto (fissa o percentuale)\n- Eventuale costo di custodia\n- Commissione di vendita\n- Tasse sui guadagni (26% in Italia)\n\nAttenzione: comprare singole azioni richiede analisi. Per la maggior parte delle persone, gli ETF sono più adatti.",
      },
      {
        kind: "explain",
        title: "📌 Ticker e quotazione",
        content: "Ogni azione ha un **ticker** (codice identificativo) e una **quotazione** (prezzo corrente).\n\n**Esempi di ticker:**\n- Apple: AAPL (USA)\n- Microsoft: MSFT (USA)\n- Ferrari: RACE (Italia/USA)\n- Enel: ENEL (Italia)\n\n**Dove vedere le quotazioni:**\n- Google Finance, Yahoo Finance (gratis)\n- App del tuo broker\n- Trading View\n\n**Informazioni chiave da guardare:**\n- Prezzo corrente\n- Variazione giornaliera (% e valore assoluto)\n- Volume (quante azioni scambiate)\n- Market cap (valore totale dell'azienda)\n- Dividend yield (rendimento dei dividendi)",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Cosa ti serve per comprare azioni?",
        pollAreas: [
          {
            id: "widget-verify-14",
            prompt: "Seleziona lo strumento necessario",
            options: [
              "Un conto titoli presso un broker",
              "Un conto corrente normale",
              "Contattare direttamente l'azienda",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Serve un **conto titoli** (detto anche deposito titoli) presso un broker autorizzato. Non puoi comprare azioni con un normale conto corrente.",
            wrongExplanation: "Il conto corrente non permette di comprare titoli. E non si contatta l'azienda direttamente.\n\n**Serve un conto titoli:** lo apri presso una banca o un broker online, depositi i soldi, e poi puoi comprare azioni, ETF, obbligazioni.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario pratico",
        content: "Vuoi comprare azioni Apple (AAPL). Il prezzo è 180$. Hai 500€ da investire. Quante azioni puoi comprare?",
        pollAreas: [
          {
            id: "widget-scenario-14",
            prompt: "Calcola il numero di azioni",
            options: [
              "2-3 azioni (considerando cambio EUR/USD e commissioni)",
              "Esattamente 500/180 = 2.77 azioni",
              "Non puoi - servono almeno 1.000€",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Con 500€, considerando il cambio EUR/USD (~1:1.1) e le commissioni del broker, puoi comprare **2-3 azioni** Apple. Non puoi comprare frazioni (tranne con alcuni broker specifici).",
            wrongExplanation: "Non puoi comprare 2.77 azioni - le azioni si comprano intere (salvo broker che offrono frazioni).\n\n**Calcolo:**\n- 500€ ≈ 550$ (cambio approssimativo)\n- 550$ ÷ 180$ = 3 azioni circa\n- Meno commissioni = 2-3 azioni realisticamente",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Apro conto titoli", "Imparo i ticker", "Calcolo i costi"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      {
        kind: "focus",
        title: "⚡ Il rischio delle singole azioni",
        content: "Comprare singole azioni è più rischioso che comprare ETF. Perché?\n\n**Rischio di concentrazione:**\n- Se compri solo 5 azioni e una fallisce → perdi il 20% del portafoglio\n- Se compri un ETF con 500 azioni e una fallisce → perdi lo 0.2%\n\n**Casi reali di crolli:**\n- Enron (2001): da 90$ a 0$ (frode contabile)\n- Nokia (2007-2012): da 40€ a 2€ (-95%)\n- Lehman Brothers (2008): fallimento totale\n- Meta/Facebook (2022): da 380$ a 90$ (-76%)\n\n**La lezione:** anche aziende 'sicure' possono crollare. La diversificazione tramite ETF riduce questo rischio specifico.",
      },
      {
        kind: "explain",
        title: "📌 Quando ha senso comprare singole azioni",
        content: "Comprare singole azioni può avere senso in questi casi:\n\n**1. Hai già un core diversificato**\n- Il grosso del portafoglio è in ETF globali\n- Le singole azioni sono il 'satellite' (10-20%)\n\n**2. Sei disposto a fare analisi**\n- Studi i bilanci dell'azienda\n- Capisci il business model\n- Hai una tesi d'investimento chiara\n\n**3. Accetti di poter perdere tutto**\n- Quei soldi non ti servono\n- Non cambierà la tua vita se vanno a zero\n\n**Quando NON ha senso:**\n- È il tuo unico investimento\n- Compri 'perché ne parlano tutti'\n- Non sai cosa fa l'azienda\n- Ti serve quei soldi entro pochi anni",
      },
      {
        kind: "question",
        title: "🧠 Verifica comprensione",
        content: "Qual è il rischio principale di concentrarsi su poche azioni?",
        pollAreas: [
          {
            id: "challenge-verify-14",
            prompt: "Seleziona il rischio corretto",
            options: [
              "Se un'azienda fallisce, perdi una parte significativa del portafoglio",
              "Le commissioni sono più alte",
              "Non puoi venderle quando vuoi",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Il **rischio di concentrazione** significa che il destino del tuo portafoglio dipende da poche aziende. Se una va male, l'impatto è devastante.",
            wrongExplanation: "Le commissioni e la liquidità non sono il problema principale.\n\n**Il rischio vero:** concentrazione. Con 5 azioni, se una perde l'80% del valore, hai perso il 16% del portafoglio. Con un ETF di 500 titoli, lo stesso evento pesa lo 0.16%.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario critico",
        content: "Un tuo collega ha investito tutti i suoi risparmi (50.000€) in un'unica azione 'sicura' perché 'non può fallire'. Cosa ne pensi?",
        pollAreas: [
          {
            id: "challenge-scenario-14",
            prompt: "Valuta la situazione",
            options: [
              "Molto rischioso - nessuna azione è sicura e la concentrazione è pericolosa",
              "Accettabile se l'azienda è grande e solida",
              "Ottima strategia - meglio concentrarsi su una buona azienda",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **Nessuna azione è sicura**. Enron, Lehman Brothers, Nokia erano tutte aziende 'sicure'. Investire tutto in un solo titolo è una scommessa, non un investimento.",
            wrongExplanation: "Anche le aziende più grandi possono crollare. Nokia era il leader mondiale dei cellulari prima di perdere il 95%. Lehman Brothers era una banca storica prima di fallire.\n\n**La regola:** mai investire tutto in un solo titolo, per quanto 'sicuro' sembri.",
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
        title: "🧠 Quiz finale: le azioni",
        content: "Hai imparato cosa sono le azioni, come si guadagna, come si comprano, e i rischi delle singole azioni.\n\n**Concetti chiave:**\n- Azione = quota di proprietà dell'azienda\n- Guadagni: capital gain + dividendi\n- Serve un conto titoli presso un broker\n- Singole azioni = rischio concentrazione\n- Per la maggior parte: meglio ETF\n\nVerifichiamo la comprensione.",
      },
      {
        kind: "question",
        title: "❓ Domanda 1",
        content: "Qual è la differenza tra azioni e obbligazioni?",
        pollAreas: [
          {
            id: "quiz-q1-14",
            prompt: "Seleziona la risposta corretta",
            options: [
              "Azioni = proprietà; Obbligazioni = prestito",
              "Azioni = prestito; Obbligazioni = proprietà",
              "Sono la stessa cosa con nomi diversi",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! Con le **azioni** diventi socio (proprietario). Con le **obbligazioni** presti soldi e ricevi interessi. Rischi e rendimenti sono diversi.",
            wrongExplanation: "È il contrario!\n\n**Azioni:** compri una quota dell'azienda, partecipi a profitti e perdite\n**Obbligazioni:** presti soldi, ricevi interessi fissi, ti restituiscono il capitale",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 2",
        content: "Se un'azione che hai comprato a 100€ ora vale 70€, hai:",
        pollAreas: [
          {
            id: "quiz-q2-14",
            prompt: "Seleziona la risposta corretta",
            options: [
              "Una perdita su carta - diventa reale solo se vendi",
              "Una perdita reale di 30€",
              "Un guadagno perché potresti comprarne altre a sconto",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Finché non vendi, è una **perdita su carta** (unrealized loss). Diventa reale solo al momento della vendita. Ecco perché vendere nel panico è l'errore peggiore.",
            wrongExplanation: "La perdita diventa reale solo quando vendi.\n\n**Perdita su carta:** il valore è sceso ma non hai venduto - può recuperare\n**Perdita reale:** hai venduto - i soldi sono andati\n\nQuesto è il motivo per cui non devi guardare il portafoglio ogni giorno e non devi vendere durante i crolli.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 3",
        content: "Per la maggior parte degli investitori, le singole azioni sono:",
        pollAreas: [
          {
            id: "quiz-q3-14",
            prompt: "Completa la frase",
            options: [
              "Troppo rischiose come unico investimento - meglio ETF diversificati",
              "Il modo migliore per investire",
              "Completamente da evitare in ogni caso",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Le singole azioni hanno **rischio di concentrazione**. Per la maggior parte delle persone, gli ETF diversificati sono più adatti. Le azioni singole possono essere un 'satellite' (10-20%).",
            wrongExplanation: "Le singole azioni non sono 'da evitare sempre' - possono far parte di un portafoglio satellite. Ma non dovrebbero essere l'unico investimento.\n\n**La regola:** prima diversifica con ETF (core), poi eventualmente aggiungi singole azioni (satellite).",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco le azioni", "Riconosco i rischi", "Preferisco diversificare"],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "✅ Cosa hai imparato: le azioni",
        content: "Complimenti! Hai completato la lezione sulle azioni.\n\n**Principi fondamentali:**\n\n1. **Azione = proprietà** - diventi socio dell'azienda\n2. **Guadagni** - capital gain (aumento valore) + dividendi\n3. **Volatilità** - i prezzi oscillano, le perdite sono 'su carta' finché non vendi\n4. **Rischio concentrazione** - singole azioni sono rischiose\n5. **Per la maggior parte** - ETF diversificati sono più adatti\n\nNelle prossime lezioni vedrai come analizzare le aziende (analisi fondamentale) e strumenti alternativi (obbligazioni, ETF, fondi).",
      },
      {
        kind: "explain",
        title: "📌 Collegamento con le lezioni precedenti",
        content: "Le azioni si collegano a tutto ciò che hai imparato:\n\n- **Rischio e rendimento:** le azioni hanno il rendimento storico più alto ma anche la volatilità più alta\n- **Interesse composto:** reinvestire i dividendi amplifica il compounding\n- **Diversificazione:** singole azioni hanno rischio specifico eliminabile con ETF\n- **Orizzonte temporale:** le azioni hanno senso solo con orizzonti lunghi (10+ anni)\n- **Profilo investitore:** difensivo = ETF; intraprendente = può includere singole azioni\n\nOgni lezione costruisce sulla precedente. Stai costruendo un sistema coerente.",
      },
      {
        kind: "question",
        title: "🎯 Il tuo prossimo passo",
        content: "Come userai le azioni nel tuo portafoglio?",
        pollAreas: [
          {
            id: "feedback-action-14",
            prompt: "Indica la tua strategia",
            options: [
              "Solo tramite ETF - diversificazione automatica",
              "ETF core + alcune azioni satellite",
              "Voglio imparare ad analizzare singole aziende",
            ],
            correctIndex: 0,
            correctExplanation: "Ottima scelta! Gli **ETF** ti danno esposizione alle azioni con diversificazione automatica. È l'approccio più efficiente per la maggior parte delle persone.",
            wrongExplanation: "Qualsiasi scelta è valida se consapevole!\n\n- Solo ETF: più semplice e diversificato\n- ETF + satellite: compromesso flessibile\n- Analisi singole: richiede tempo e studio\n\nL'importante è che il grosso del portafoglio sia sempre diversificato.",
            allowText: false,
          },
        ],
      },
    ],
    suggestedPrompts: [
      "Quali ETF mi danno esposizione alle azioni globali?",
      "Come funzionano i dividendi e la loro tassazione?",
      "Voglio capire come analizzare un'azienda",
    ],
  },
};

const lesson14Definition = createStaticLessonDefinition("14", content);

export default lesson14Definition;
