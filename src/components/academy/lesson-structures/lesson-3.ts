import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "caring"],
    blocks: [
      {
        kind: "focus",
        title: "💡 Cos'è un debito e quando è 'buono'?",
        content: "Nelle lezioni precedenti hai imparato a gestire il budget e a risparmiare automaticamente. Ora affrontiamo un tema che spaventa molti: il **debito**.\n\nPrima cosa da capire: non tutti i debiti sono uguali.\n\n**Debito buono**: crea valore futuro. Esempi: mutuo per la casa (acquisti un bene che potrebbe apprezzarsi), prestito per formazione (aumenti il tuo potenziale di guadagno).\n\n**Debito cattivo**: erode il tuo margine senza ritorno. Esempi: finanziamento per una vacanza (consumi qualcosa che finisce), rateizzazione per l'ultimo smartphone (perdi valore immediato).\n\nLa domanda chiave prima di indebitarsi: 'Questo debito mi porterà più valore di quanto mi costa?'",
      },
      {
        kind: "explain",
        title: "📌 Le tre leve per valutare un debito",
        content: "Prima di accettare qualsiasi finanziamento, analizza tre elementi. Sono le stesse 'leve' che useresti per decidere una spesa importante nel budget.\n\n**1. Costo totale**: non guardare solo la rata mensile, ma quanto pagherai IN TUTTO. Un prestito da 5.000€ con interessi può costarti 6.200€ alla fine.\n\n**2. Durata**: più lungo è il prestito, più interessi paghi. Un prestito di 3 anni costa meno (in totale) dello stesso prestito spalmato su 6 anni.\n\n**3. Impatto sul cashflow mensile**: la rata mensile quanto pesa rispetto al tuo margine? Se supera il 30% del tuo reddito disponibile, rischi di non riuscire più a risparmiare.\n\nQueste tre leve ti danno il quadro completo, non solo il 'prezzo attraente' che vedi in pubblicità.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Perché il tasso da solo non basta per giudicare un debito?",
        pollAreas: [
          {
            id: "concept-verify-3",
            prompt: "Seleziona la risposta corretta",
            options: [
              "Conta anche la durata e l'impatto mensile",
              "Il tasso è l'unico indicatore",
              "La durata non influisce sul costo totale",
            ],
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "⚖️ La distinzione fondamentale: Valore vs Consumo",
        content: "Ecco una regola semplice per distinguere debiti buoni e cattivi: **il debito finanzia qualcosa che crea valore nel tempo, o qualcosa che consumi subito?**\n\n**Debiti che creano valore:**\n• Mutuo prima casa: acquisti un bene che può apprezzarsi e riduci l'affitto\n• Prestito per formazione qualificante: aumenti il tuo reddito futuro\n• Finanziamento per attività produttiva: generi flussi di cassa\n\n**Debiti che erodono patrimonio:**\n• Finanziamento vacanze: l'esperienza finisce, il debito resta\n• Rateizzazione elettronica: il valore del bene crolla, paghi ancora\n• Credito al consumo per shopping: consumi oggi, paghi domani con interessi\n\nNella lezione sul budget hai imparato a distinguere spese essenziali da variabili. Qui applichi lo stesso principio: prima di indebitarti, chiediti 'questo mi dà valore duraturo?'",
      },
      {
        kind: "question",
        title: "🧠 Verifica: confronto prestiti",
        content:
          "Prestito A: 180€/mese per 48 mesi = 8.640€ totali\nPrestito B: 140€/mese per 72 mesi = 10.080€ totali\n\nDevi scegliere quale prestito è migliore per te.",
        pollAreas: [
          {
            id: "concept-solve-3",
            prompt: "Qual è il criterio decisivo per scegliere?",
            options: [
              "Bilanciamento tra costo complessivo e tenuta mensile",
              "Sempre la rata più bassa possibile",
              "Sempre la durata più corta possibile",
            ],
            allowText: false,
          },
        ],
      },
    ],
    options: ["Valuto costo totale", "Valuto sostenibilità mensile", "Distinguo valore da consumo"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "integration"],
    blocks: [
      {
        kind: "focus",
        title: "🛠️ Come gestire più debiti: la strategia dell'ordine",
        content: "Se hai più debiti attivi contemporaneamente (mutuo, finanziamento auto, carta di credito...), serve una strategia chiara per uscirne.\n\nIl primo passo è **ordinare** i debiti per priorità. Ci sono due criteri validi:\n\n**1. Priorità per tasso (Avalanche)**: estingui prima quello con tasso più alto. Risparmi più interessi nel lungo termine.\n\n**2. Priorità per impatto psicologico (Snowball)**: estingui prima quello più piccolo. Ogni debito chiuso ti dà motivazione.\n\nEntrambi funzionano. La scelta dipende da cosa ti serve di più: risparmio matematico o spinta emotiva.\n\nQuesto approccio ordinato è lo stesso del budget: non puoi gestire tutto insieme, devi dare priorità.",
      },
      {
        kind: "explain",
        title: "📌 La strategia del debito target",
        content: "Una volta ordinati i debiti, ecco la strategia operativa:\n\n**1. Mantieni i minimi su tutti i debiti**: non saltare mai una rata, per evitare penali e segnalazioni.\n\n**2. Concentra l'extra su UN solo debito**: se hai 80€ extra dopo le rate minime, mettili tutti sul debito 'target' (quello in cima alla tua lista).\n\n**3. Quando chiudi il target, passa al successivo**: l'importo che usavi per il debito chiuso si somma all'extra per il prossimo.\n\nQuesto metodo è chiamato 'debt stacking' o 'palla di neve'. Funziona perché concentri le forze invece di disperderle.\n\nÈ lo stesso principio del risparmio automatico: meglio un'azione costante e concentrata che tanti piccoli sforzi dispersi.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Quando conviene priorità per tasso e quando per sollievo di cassa?",
        pollAreas: [
          {
            id: "widget-verify-3",
            prompt: "Seleziona l'approccio migliore",
            options: [
              "Dipende dalla pressione mensile e dalla stabilità del reddito",
              "Sempre per tasso più alto",
              "Non importa l'ordine",
            ],
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Verifica: strategia debiti multipli",
        content:
          "Hai 3 debiti con rate:\n- Debito 1: 90€/mese\n- Debito 2: 120€/mese\n- Debito 3: 210€/mese\n\nHai 80€ extra da destinare ai debiti.",
        pollAreas: [
          {
            id: "widget-scenario-3",
            prompt: "Qual è la strategia corretta?",
            options: [
              "Scegliere un debito target e allocare tutti gli 80€ su quello",
              "Dividere gli 80€ equamente tra i tre debiti",
              "Usare gli 80€ per spese personali e pagare solo i minimi",
            ],
            allowText: false,
          },
        ],
      },
    ],
    options: ["Scelgo debito target", "Aggiungo quota extra", "Rivedo ogni mese"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      {
        kind: "focus",
        title: "⚡ Il vero rischio: la spirale del nuovo debito",
        content: "Stai lavorando per ridurre i tuoi debiti, e poi arriva l'offerta: 'Nuovo finanziamento a tasso zero!' oppure 'Paga a rate senza interessi!'.\n\nQuesto è il momento critico. Il vero rischio non è il singolo debito che stai pagando, ma **aggiungere nuove rate prima di aver ridotto quelle attuali**.\n\nOgni nuova rata:\n• Riduce il margine disponibile per risparmiare\n• Allunga il tempo per uscire dai debiti\n• Aumenta lo stress finanziario\n\nRicorda la lezione sul budget: il tuo cash flow mensile è limitato. Ogni rata in più è una fetta in meno per risparmio, fondo emergenza e libertà.",
      },
      {
        kind: "explain",
        title: "📌 La regola anti-nuovo-debito",
        content: "Prima di accettare QUALSIASI nuovo debito, applica questa regola:\n\n**Un nuovo debito è accettabile SOLO SE:**\n\n1. **Non compromette gli obiettivi esistenti**: puoi continuare a risparmiare la quota prevista? Puoi mantenere il fondo emergenza?\n\n2. **Mantiene il margine di sicurezza**: dopo la nuova rata, ti resta abbastanza margine per coprire imprevisti?\n\n3. **Crea valore reale**: il debito finanzia qualcosa che aumenta il tuo patrimonio o reddito?\n\nSe anche UNA di queste condizioni non è soddisfatta, la risposta è NO.\n\nQuesto filtro ti protegge dalle decisioni impulsive. Nella lezione sul fondo emergenza vedrai perché il margine di sicurezza è così importante.",
      },
      {
        kind: "question",
        title: "🧠 Verifica comprensione",
        content: "Quale vincolo personale imposti prima di accettare una nuova rata?",
        pollAreas: [
          {
            id: "challenge-verify-3",
            prompt: "Seleziona il vincolo chiave",
            options: [
              "Il margine residuo deve coprire imprevisti",
              "Non serve nessun vincolo",
              "Accetto sempre se la rata è bassa",
            ],
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🛡️ Il buffer imprevisti: perché non puoi ignorarlo",
        content: "Nella lezione sul budget hai visto l'importanza del margine mensile. Nella lezione sul risparmio hai imparato a costruire un fondo di sicurezza. Ora vediamo come il debito interagisce con entrambi.\n\nIl **buffer imprevisti** è il margine che ti resta dopo aver pagato tutte le rate e le spese essenziali. È quello che ti permette di gestire bollette alte, riparazioni urgenti, spese mediche.\n\n**Il problema**: se accetti un nuovo debito che riduce il buffer a zero (o quasi), cosa succede al primo imprevisto?\n\n• Non puoi coprirlo con il margine (non ce n'è più)\n• Devi usare il fondo emergenza (che si svuota)\n• O peggio: devi fare un ALTRO debito per coprire l'emergenza\n\nQuesto è l'inizio della spirale. Per evitarla, mantieni sempre un buffer minimo del 10-15% del reddito, anche con debiti attivi.",
      },
      {
        kind: "question",
        title: "🧠 Verifica: valutazione nuovo debito",
        content:
          "Ti propongono un finanziamento con rata 75€/mese.\n\nIl tuo margine mensile attuale è 95€.\n\nAccettando, il nuovo margine sarebbe 20€.",
        pollAreas: [
          {
            id: "challenge-scenario-3",
            prompt: "Cosa dovresti fare?",
            options: [
              "Rinviare o ridurre l'importo perché il buffer diventa troppo basso",
              "Accettare perché la rata è inferiore al margine disponibile",
              "Accettare e ridurre altre spese per compensare",
            ],
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
        title: "🧠 Quiz finale: decidere sui debiti con metodo",
        content: "Hai imparato a distinguere debiti buoni da cattivi, a ordinare i debiti esistenti per priorità, e a proteggerti dalla spirale del nuovo debito.\n\nOra mettiamo tutto insieme con un quiz pratico. Le domande simulano decisioni reali che potresti dover prendere.\n\n**Ricorda i principi chiave:**\n• Debito buono = crea valore futuro\n• Strategia = concentrare le forze su un debito target\n• Regola anti-nuovo-debito = verificare obiettivi + margine + valore\n\nApplica il metodo, non l'istinto. E ricorda: ogni errore è un'opportunità per capire meglio.",
      },
      {
        kind: "explain",
        title: "📌 Come rispondere: il criterio guida",
        content: "Quando rispondi alle domande sul debito, cerca sempre l'opzione che **protegge insieme tre elementi**:\n\n**1. Cashflow mensile**: la scelta preserva il tuo flusso di cassa? Riesci ancora a respirare ogni mese?\n\n**2. Costo totale**: la scelta minimizza quanto pagherai in tutto (capitale + interessi)?\n\n**3. Sostenibilità comportamentale**: la scelta è realistica per te? Riesci a mantenerla nel tempo senza stress eccessivo?\n\nUna risposta che ottimizza solo uno di questi elementi (es. 'la rata più bassa possibile') potrebbe essere sbagliata se peggiora gli altri (es. allungando la durata e aumentando il costo totale).\n\nQuesto equilibrio tra fattori è lo stesso del budget: non esiste la soluzione perfetta, esiste la soluzione bilanciata.",
      },
      {
        kind: "question",
        title: "❓ Domanda 1",
        content: "Hai due prestiti: X tasso alto ma rata piccola, Y tasso medio ma rata pesante. Da dove parti?",
        pollAreas: [
          {
            id: "quiz-q1-3",
            prompt: "Scelta più coerente",
            options: [
              "Priorità al debito che libera più respiro mensile",
              "Priorità casuale senza criterio",
              "Nuovo prestito per coprire le rate",
            ],
            allowText: true,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 2",
        content: "Margine libero 220€/mese, extra per debiti 70€. Qual è il pilastro del piano?",
        pollAreas: [
          {
            id: "quiz-q2-3",
            prompt: "Qual è il pilastro che non deve mancare?",
            options: [
              "Importo extra costante sul debito target",
              "Decisioni improvvisate",
              "Nessun monitoraggio",
            ],
            allowText: true,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Verifica: piano 90 giorni",
        content:
          "Devi creare un piano di 90 giorni per gestire i tuoi debiti.\n\nIl piano deve includere elementi concreti e misurabili.",
        pollAreas: [
          {
            id: "quiz-scenario-3",
            prompt: "Quali sono i tre elementi essenziali del piano?",
            options: [
              "Debito target + extra fisso mensile + regola anti-nuove-rate",
              "Solo decidere di pagare quando possibile",
              "Chiedere un nuovo prestito per consolidare",
            ],
            allowText: false,
          },
        ],
      },
    ],
    options: ["Applico criterio", "Difendo il margine", "Chiudo con regola 90 giorni"],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "✅ Cosa hai imparato: dal budget alla gestione del debito",
        content: "Complimenti! Hai completato la lezione sui debiti buoni vs cattivi. Ecco cosa hai costruito:\n\n**Dalle lezioni precedenti** hai imparato a gestire il budget e a risparmiare automaticamente.\n\n**In questa lezione** hai aggiunto la capacità di valutare e gestire i debiti in modo strategico.\n\nGestire i debiti bene significa **recuperare controllo** - sia economico che mentale. Quando sai esattamente quanto devi, a chi, e quando finirai di pagare, lo stress diminuisce drasticamente.\n\nQuesto senso di controllo è lo stesso che hai costruito con il budget: sapere i numeri ti dà potere sulle tue finanze.",
      },
      {
        kind: "explain",
        title: "📌 La strategia sostenibile: 12 mesi, non 12 giorni",
        content: "L'errore più comune nella gestione dei debiti è partire con troppa aggressività: 'Voglio estinguere tutto in 6 mesi!', e poi mollare dopo poche settimane perché è insostenibile.\n\n**La regola d'oro**: scegli una strategia che puoi mantenere per 12 mesi, non per 12 giorni.\n\nQuesto significa:\n• Una quota extra realistica (non tutto il margine disponibile)\n• Un piano che lascia spazio agli imprevisti\n• Obiettivi intermedi che ti danno soddisfazione\n\nÈ lo stesso principio del risparmio automatico: la continuità batte l'intensità. Meglio 80€ extra sul debito ogni mese per 2 anni, che 200€ per 3 mesi e poi niente.\n\nNelle prossime lezioni sul fondo emergenza e sugli investimenti vedrai come bilanciare riduzione debiti, risparmio e crescita del patrimonio.",
      },
      {
        kind: "question",
        title: "🎯 Il tuo piano",
        content: "Qual è la tua decisione operativa da oggi sui debiti?",
        pollAreas: [
          {
            id: "feedback-rule-3",
            prompt: "Seleziona la tua priorità",
            options: [
              "Identifico il debito target da aggredire",
              "Definisco l'extra mensile fisso",
              "Creo regola anti-nuovo-debito",
            ],
            allowText: true,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Verifica finale: il tuo piano debiti",
        content:
          "Per gestire efficacemente i debiti devi definire un piano con elementi specifici.",
        pollAreas: [
          {
            id: "feedback-piano-3",
            prompt: "Quali tre informazioni deve contenere il tuo piano?",
            options: [
              "Debito target + importo extra mensile + giorno di revisione",
              "Solo l'importo totale del debito",
              "Solo la data di estinzione prevista",
            ],
            allowText: false,
          },
        ],
      },
    ],
    suggestedPrompts: [
      "Aiutami a ordinare i debiti per priorità",
      "Come definisco una rata davvero sostenibile?",
      "Dammi una regola anti-nuovo-debito",
    ],
  },
};

const lesson3Definition = createStaticLessonDefinition("3", content);

export default lesson3Definition;
