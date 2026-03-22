import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "caring"],
    blocks: [
      {
        kind: "focus",
        title: "💡 Cos'è davvero un'assicurazione?",
        content: "Nelle lezioni precedenti hai costruito il tuo sistema finanziario: budget, risparmio, gestione debiti, obiettivi e fondo emergenza. Ora aggiungiamo l'ultimo livello di protezione: le **assicurazioni**.\n\nMolti pensano alle assicurazioni come 'un costo inutile finché non succede niente'. È il modo sbagliato di vederle.\n\n**Assicurarsi significa trasferire rischi gravi** - quelli che non puoi o non vuoi sostenere da solo - a qualcun altro (la compagnia assicurativa) in cambio di un premio.\n\n**Esempio concreto:**\n• Rischio: incidente grave con danni da 200.000€\n• Senza assicurazione: perdi tutto, vai in rovina\n• Con assicurazione: paghi 500€/anno di premio, il resto lo copre la compagnia\n\nL'assicurazione non elimina il rischio. Lo **trasferisce**. E per rischi gravi, questo trasferimento vale il costo.",
      },
      {
        kind: "explain",
        title: "📌 La regola per scegliere cosa assicurare",
        content: "Non puoi (e non devi) assicurare tutto. La regola d'oro è semplice:\n\n**Assicura i rischi ad ALTO IMPATTO, anche se a BASSA FREQUENZA.**\n\n**Rischi ad alta priorità:**\n• **Salute**: una malattia grave può costare centinaia di migliaia di euro e azzerare il reddito\n• **Responsabilità civile**: un danno causato a terzi può distruggerti finanziariamente\n• **Reddito**: se perdi la capacità di lavorare, come paghi le spese?\n• **Casa**: un incendio o un danno grave è raro, ma devastante\n\n**Cosa NON serve assicurare:**\nRischi piccoli che puoi coprire col fondo emergenza. Assicurare lo smartphone o l'estensione garanzia elettrodomestici spesso non conviene.\n\nQuesto principio 'alto impatto, bassa frequenza' ti aiuta a concentrare le risorse dove servono davvero.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Perché il criterio 'alto impatto, bassa frequenza' è centrale?",
        pollAreas: [
          {
            id: "concept-verify-7",
            prompt: "Seleziona la risposta corretta",
            options: [
              "Questi eventi sono rari ma devastanti se non coperti",
              "I rischi frequenti sono più importanti",
              "Non serve assicurarsi",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Gli eventi **rari ma devastanti** sono quelli da assicurare.\n\nSe un evento è frequente ma piccolo (es. rottura smartphone), lo copri col fondo emergenza.\nSe un evento è raro ma devastante (es. malattia grave), lo trasferisci all'assicurazione.",
            wrongExplanation: "Il criterio 'alto impatto, bassa frequenza' funziona perché:\n\n**1. Alto impatto**: eventi che possono rovinarti finanziariamente\n**2. Bassa frequenza**: non succedono spesso, quindi il premio è sostenibile\n\nAssicurare eventi frequenti e piccoli costa troppo rispetto al beneficio.",
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🎯 Come mappare i tuoi rischi personali",
        content: "Prima di scegliere qualsiasi polizza, devi fare una **mappatura** dei tuoi rischi. È lo stesso approccio del budget: prima capisci la situazione, poi decidi.\n\n**Come mappare i rischi:**\n\n1. **Elenca i rischi** che ti riguardano:\n   • Salute (malattie gravi, infortuni)\n   • Responsabilità civile (danni a terzi)\n   • Reddito (perdita lavoro, invalidità)\n   • Casa (incendio, furto, danni)\n   • Auto (incidenti, furto)\n   • Famiglia (morte del percettore di reddito)\n\n2. **Stima l'impatto economico** di ciascuno:\n   • Malattia grave: 50.000-200.000€\n   • Danni a terzi: potenzialmente illimitati\n   • Perdita reddito per 2 anni: 60.000€+\n   • Incendio casa: 150.000€+\n\n3. **Ordina per impatto** e copri prima i più gravi\n\nQuesto esercizio ti mostra dove concentrare le risorse assicurative.",
      },
      {
        kind: "question",
        title: "🧠 Verifica: priorità dei rischi",
        content:
          "Hai identificato 4 rischi personali:\n\n1) Rischio salute: impatto 50.000€\n2) Rischio casa: impatto 30.000€\n3) Rischio auto: impatto 15.000€\n4) Rischio smartphone: impatto 800€",
        pollAreas: [
          {
            id: "concept-solve-7",
            prompt: "Qual è il criterio corretto per stabilire le priorità?",
            options: [
              "Impatto economico massimo potenziale",
              "Frequenza dell'evento nella vita quotidiana",
              "Costo della polizza più bassa disponibile",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! La priorità va ai rischi con **impatto economico massimo potenziale**.\n\nIn questo caso: Salute (50.000€) > Casa (30.000€) > Auto (15.000€) > Smartphone (800€, copri col fondo emergenza)",
            wrongExplanation: "Il criterio corretto è l'**impatto economico massimo potenziale**.\n\n• Salute: 50.000€ - PRIORITÀ ALTA\n• Casa: 30.000€ - PRIORITÀ MEDIA\n• Auto: 15.000€ - DA VALUTARE\n• Smartphone: 800€ - USA IL FONDO EMERGENZA\n\nLa frequenza conta, ma l'impatto economico è il driver principale.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Mappo i rischi", "Ordino per impatto", "Definisco priorità di copertura"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "integration"],
    blocks: [
      {
        kind: "focus",
        title: "🛠️ Come valutare una polizza: i quattro elementi chiave",
        content: "Quando valuti una polizza assicurativa, il **prezzo** è solo uno dei fattori. Spesso il più importante è cosa c'è scritto nel contratto.\n\n**I quattro elementi da controllare sempre:**\n\n**1. Coperture**: cosa è coperto dalla polizza? Quali eventi? Quali tipologie di danno?\n\n**2. Esclusioni**: cosa NON è coperto? Questa è la parte che molti non leggono e poi si pentono. Es: 'danni da sport estremi esclusi'\n\n**3. Franchigia**: quanto paghi tu prima che intervenga l'assicurazione? Es: franchigia 500€ significa che i primi 500€ di danno li paghi tu.\n\n**4. Massimale**: qual è il massimo che l'assicurazione paga? Se hai un massimale di 50.000€ ma il danno è 100.000€, i restanti 50.000€ li paghi tu.\n\nQuesto approccio 'guarda oltre il prezzo' è lo stesso che userai quando valuterai investimenti: il costo apparente è solo una parte della storia.",
      },
      {
        kind: "explain",
        title: "📌 Il prezzo basso non basta",
        content: "Una polizza economica può essere un affare o una trappola. Dipende da cosa c'è dentro.\n\n**Esempio di polizza trappola:**\n• Premio: 80€/anno (sembra conveniente!)\n• Franchigia: 1.000€\n• Massimale: 20.000€\n• Esclusioni: malattie pregresse, sport, viaggi\n\n**Risultato**: quando hai bisogno della polizza, scopri che non copre quasi nulla.\n\n**Come evitare la trappola:**\n\n1. Leggi SEMPRE le esclusioni (sono nel contratto, anche se in piccolo)\n2. Verifica che il massimale sia adeguato al rischio reale\n3. Calcola il costo EFFETTIVO: premio + franchigia + rischio non coperto\n4. Confronta polizze simili su questi criteri, non solo sul prezzo",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Quale clausola controlli prima di confrontare il premio?",
        pollAreas: [
          {
            id: "widget-verify-7",
            prompt: "Seleziona la clausola chiave",
            options: [
              "Esclusioni e franchigia",
              "Solo il premio annuale",
              "Il colore del contratto",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Prima di guardare il premio, controlla **esclusioni** (cosa non è coperto) e **franchigia** (quanto paghi tu).\n\nUna polizza economica con esclusioni ampie è spesso peggio di una più cara con copertura completa.",
            wrongExplanation: "Le clausole fondamentali da controllare prima del premio sono:\n\n**1. Esclusioni**: cosa NON copre la polizza?\n**2. Franchigia**: quanto pago io prima che intervenga l'assicurazione?\n\nSolo dopo aver verificato queste, ha senso confrontare i premi.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Verifica: confronto polizze",
        content:
          "Polizza A: premio 240€/anno, franchigia 500€\nPolizza B: premio 320€/anno, franchigia 150€\n\nSinistro tipico stimato: 1.000€",
        pollAreas: [
          {
            id: "widget-scenario-7",
            prompt: "Qual è il ragionamento corretto per scegliere?",
            options: [
              "Valutare costo annuo + impatto franchigia su sinistro tipico",
              "Scegliere sempre la polizza con premio più basso",
              "Scegliere a caso tanto sono simili",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Devi valutare il **costo totale**: premio + franchigia in caso di sinistro.\n\n• Polizza A: 240€ + 500€ = 740€ nel caso peggiore\n• Polizza B: 320€ + 150€ = 470€ nel caso peggiore\n\nLa B costa meno se il sinistro si verifica!",
            wrongExplanation: "Il ragionamento corretto considera **premio + franchigia** in caso di sinistro:\n\n• **Polizza A**: 240€ premio + 500€ franchigia = 740€ costo totale\n• **Polizza B**: 320€ premio + 150€ franchigia = 470€ costo totale\n\nLa polizza B, apparentemente più cara, costa meno se usi la copertura.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Confronto clausole", "Valuto franchigia", "Controllo massimale"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      {
        kind: "focus",
        title: "⚡ La trappola delle polizze 'convenienti'",
        content: "Il rischio tipico quando si cercano assicurazioni è farsi attrarre dal prezzo basso senza controllare cosa c'è dentro.\n\n**Come funziona la trappola:**\n\n1. Trovi una polizza a 100€/anno invece di 300€\n2. Pensi 'che affare!' e firmi\n3. Dopo 2 anni succede qualcosa e chiedi il rimborso\n4. Scopri che il tuo caso rientra nelle esclusioni\n5. Hai pagato 200€ di premi per niente\n\n**Perché succede:**\nLe polizze economiche spesso compensano il prezzo basso con:\n• Esclusioni molto ampie\n• Franchigie alte\n• Massimali insufficienti\n• Procedure di rimborso complicate\n\nÈ lo stesso principio dei debiti 'a tasso zero': il costo vero è nascosto altrove.",
      },
      {
        kind: "explain",
        title: "📌 La checklist pre-firma",
        content: "Prima di firmare QUALSIASI polizza assicurativa, completa questa checklist:\n\n**1. Leggi le esclusioni principali**\nChiedi esplicitamente: 'Cosa NON copre questa polizza?' Fatti dare risposta scritta.\n\n**2. Verifica il massimale**\nÈ adeguato al rischio che vuoi coprire? Se il rischio è 100.000€ e il massimale è 30.000€, hai un problema.\n\n**3. Controlla la franchigia**\nQuanto paghi tu prima che intervenga l'assicurazione? È sostenibile per te?\n\n**4. Capisci le condizioni di rimborso**\nCosa devi fare per ottenere il rimborso? Entro quanto tempo? Con quali documenti?\n\n**5. Confronta con almeno 2 alternative**\nNon firmare la prima polizza che trovi. Confronta su criteri oggettivi.",
      },
      {
        kind: "question",
        title: "🧠 Verifica comprensione",
        content: "Quali 3 condizioni minime pretendi in una nuova polizza?",
        pollAreas: [
          {
            id: "challenge-verify-7",
            prompt: "Seleziona le condizioni chiave",
            options: [
              "Massimale adeguato, franchigia accettabile, esclusioni chiare",
              "Solo prezzo basso",
              "Nessuna condizione particolare",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Le tre condizioni minime sono:\n\n• **Massimale adeguato**: copre il rischio reale\n• **Franchigia accettabile**: sostenibile per te\n• **Esclusioni chiare**: sai cosa non è coperto",
            wrongExplanation: "Le tre condizioni minime per qualsiasi polizza sono:\n\n**1. Massimale adeguato**: deve coprire il rischio reale (non 20.000€ su un rischio da 100.000€)\n**2. Franchigia accettabile**: la parte che paghi tu deve essere sostenibile\n**3. Esclusioni chiare**: devi sapere esattamente cosa non è coperto",
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🛡️ Il principio della copertura proporzionata",
        content: "Un errore comune è scegliere la copertura in base al premio ('quanto costa?') invece che in base al rischio ('da cosa mi protegge?').\n\n**Il principio corretto: la copertura deve essere proporzionata al rischio.**\n\n**Esempio sbagliato:**\n• Rischio reale: danno potenziale 80.000€\n• Polizza scelta: massimale 25.000€, premio 80€/anno\n• Risultato: paghi poco, ma sei coperto solo per il 30% del rischio\n\n**Esempio corretto:**\n• Rischio reale: danno potenziale 80.000€\n• Polizza scelta: massimale 100.000€, premio 200€/anno\n• Risultato: paghi di più, ma sei effettivamente protetto\n\n**Come applicare il principio:**\n1. Stima prima il rischio (nella mappatura che hai fatto)\n2. Scegli una copertura che copra almeno l'80-90% del rischio\n3. Solo dopo valuta il premio\n\nMeglio avere poche coperture adeguate che molte coperture insufficienti.",
      },
      {
        kind: "question",
        title: "🧠 Verifica: massimale vs rischio",
        content:
          "Ti propongono una polizza con:\n- Premio molto basso: 80€/anno\n- Massimale: 20.000€\n\nIl tuo rischio potenziale è stimato in 80.000€.",
        pollAreas: [
          {
            id: "challenge-scenario-7",
            prompt: "Qual è il problema principale di questa polizza?",
            options: [
              "Il massimale copre solo il 25% del rischio potenziale",
              "Il premio è troppo basso, quindi è sospetta",
              "Non c'è nessun problema, il premio è conveniente",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Il massimale (20.000€) copre solo il **25%** del rischio (80.000€).\n\nSe succede qualcosa, ti restano 60.000€ scoperti. Questa polizza non ti protegge davvero.",
            wrongExplanation: "Il problema è il **gap di copertura**:\n\n• Rischio: 80.000€\n• Massimale: 20.000€\n• **Gap scoperto**: 60.000€ (75% del rischio!)\n\nUna polizza con massimale insufficiente non ti protegge. È come avere un ombrello con un buco enorme.",
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
        title: "🧠 Quiz finale: scegliere coperture con metodo",
        content: "Hai imparato cosa significa davvero assicurarsi, come mappare i rischi, come valutare una polizza, e come evitare le trappole delle 'polizze convenienti'.\n\nOra mettiamo tutto insieme con un quiz pratico.\n\n**Ricorda i principi chiave:**\n• Assicura rischi ad alto impatto, bassa frequenza\n• Mappa i rischi e ordinali per impatto economico\n• I quattro elementi: coperture, esclusioni, franchigia, massimale\n• Checklist pre-firma prima di qualsiasi polizza\n• Copertura proporzionata al rischio, non al premio",
      },
      {
        kind: "explain",
        title: "📌 Come rispondere: priorità, clausole, rapporto costo/protezione",
        content: "Quando rispondi alle domande sulle assicurazioni, applica questo **metodo a tre step**:\n\n**Step 1: Priorità del rischio**\nQuesto rischio è ad alto impatto? Merita di essere assicurato? Oppure è un rischio che posso coprire col fondo emergenza?\n\n**Step 2: Lettura delle clausole**\nLe esclusioni mi espongono a rischi inaccettabili? Il massimale è adeguato? La franchigia è sostenibile?\n\n**Step 3: Rapporto costo/protezione**\nQuanto pago (premio) rispetto a quanto sono protetto (massimale - esclusioni)? Il rapporto ha senso?\n\nSe una risposta salta uno di questi step (es. sceglie solo in base al prezzo), è quasi sempre sbagliata.",
      },
      {
        kind: "question",
        title: "❓ Domanda 1",
        content: "Qual è il primo criterio di scelta di una polizza?",
        pollAreas: [
          {
            id: "quiz-q1-7",
            prompt: "Seleziona la risposta più corretta",
            options: [
              "Adeguatezza della copertura al rischio da proteggere",
              "Premio più basso in assoluto",
              "Numero di pagine del contratto",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Il primo criterio è l'**adeguatezza della copertura al rischio**.\n\nPrima capisci cosa devi proteggere, poi cerchi la polizza che lo fa meglio. Il prezzo viene dopo.",
            wrongExplanation: "Il criterio principale è l'**adeguatezza della copertura**:\n\n1. Identifica il rischio da coprire e il suo impatto\n2. Cerca polizze con massimale e condizioni adeguate\n3. Solo dopo confronta i premi\n\nPartire dal prezzo ti espone a coperture insufficienti.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 2",
        content: "Rischio stimato 120.000€, massimale proposto 40.000€. Qual è il problema?",
        pollAreas: [
          {
            id: "quiz-q2-7",
            prompt: "Qual è il problema principale?",
            options: [
              "Massimale insufficiente rispetto al rischio",
              "Premio troppo basso",
              "Contratto troppo breve",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Il massimale (40.000€) copre solo il **33%** del rischio (120.000€).\n\nGap scoperto: 80.000€ che pagheresti tu.",
            wrongExplanation: "Il problema è il **massimale insufficiente**:\n\n• Rischio: 120.000€\n• Massimale: 40.000€\n• Gap: 80.000€ (67% scoperto)\n\nQuesta polizza lascia la maggior parte del rischio sulle tue spalle.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Verifica: gap di copertura",
        content:
          "Rischio stimato: 120.000€\nMassimale proposto: 40.000€\n\nGap di copertura: 80.000€ scoperti",
        pollAreas: [
          {
            id: "quiz-scenario-7",
            prompt: "Cosa devi fare con questo gap di copertura?",
            options: [
              "Cercare un'opzione con massimale adeguato al rischio reale",
              "Accettare comunque perché qualcosa è meglio di niente",
              "Ignorare il gap e sperare che non succeda nulla",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Con un gap così grande, devi cercare un'**opzione con massimale adeguato**.\n\nAccettare una copertura al 33% è quasi come non essere assicurati per eventi gravi.",
            wrongExplanation: "Con 80.000€ di gap (67% del rischio scoperto), devi:\n\n**1. Cercare alternative** con massimale più alto\n**2. Valutare se il premio maggiore** è sostenibile\n**3. Se non lo è**, almeno sapere che non sei veramente protetto\n\n'Qualcosa è meglio di niente' è pericoloso quando il gap è così grande.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Prioritizzo rischio", "Confronto clausole", "Scelgo copertura adeguata"],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "✅ Cosa hai imparato: proteggere la stabilità",
        content: "Complimenti! Hai completato la lezione sulle assicurazioni essenziali - l'ultima delle fondamenta finanziarie.\n\n**Il percorso completo che hai costruito:**\n• **Budget**: sai dove vanno i soldi\n• **Risparmio automatico**: accumuli costantemente\n• **Gestione debiti**: liberi risorse\n• **Obiettivi SMART**: hai direzione\n• **Fondo emergenza**: cuscinetto per imprevisti\n• **Assicurazioni**: protezione contro eventi gravi\n\n**Il valore delle assicurazioni** non è solo finanziario. È la **tranquillità** di sapere che eventi gravi non ti distruggeranno economicamente.\n\nNella prossima lezione inizia la sezione sugli investimenti: imparerai la differenza tra investire e speculare.",
      },
      {
        kind: "explain",
        title: "📌 Meglio poche coperture, ma ben comprese",
        content: "L'errore da evitare è accumulare polizze senza capire cosa coprono davvero. Meglio avere **poche coperture comprese a fondo** che molte coperture superficiali.\n\n**Le coperture essenziali per la maggior parte delle persone:**\n• RC Auto (obbligatoria)\n• Salute/Infortuni (se non coperto dal datore di lavoro)\n• Responsabilità civile famiglia\n• Protezione reddito/invalidità (se sei l'unico percettore)\n\n**Cosa fare ora:**\n1. Rivedi le polizze che hai già → capisci cosa coprono davvero?\n2. Mappa i tuoi rischi → ci sono buchi di copertura?\n3. Pianifica una revisione annuale → le esigenze cambiano nel tempo\n\nQuesta è la fine delle **lezioni fondamentali**. Nelle prossime lezioni approfondirai investimenti, strumenti specifici, strategie avanzate. Ma ricorda: le fondamenta che hai costruito sono il prerequisito per tutto il resto.",
      },
      {
        kind: "question",
        title: "🎯 La tua revisione",
        content: "Quale polizza vuoi rivedere per prima con criteri migliori?",
        pollAreas: [
          {
            id: "feedback-rule-7",
            prompt: "Seleziona la polizza prioritaria",
            options: [
              "Assicurazione sanitaria",
              "Responsabilità civile",
              "Protezione reddito/casa",
            ],
            allowText: true,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Verifica finale: il tuo piano revisione",
        content:
          "Per gestire le tue polizze in modo efficace hai bisogno di un piano di revisione annuale.",
        pollAreas: [
          {
            id: "feedback-revisione-7",
            prompt: "Quali elementi deve contenere il piano di revisione?",
            options: [
              "Checklist standard + confronto offerte + data fissa annuale",
              "Solo controllare se il premio è aumentato",
              "Nessun piano, le polizze non vanno mai riviste",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Un piano di revisione efficace contiene:\n\n• **Checklist standard**: cosa verificare ogni anno\n• **Confronto offerte**: almeno 2-3 alternative\n• **Data fissa**: revisione annuale programmata\n\nQuesto ti assicura di avere sempre coperture adeguate al miglior prezzo.",
            wrongExplanation: "Un piano di revisione annuale dovrebbe includere:\n\n**1. Checklist standard**: massimale, franchigia, esclusioni ancora adeguati?\n**2. Confronto offerte**: il mercato cambia, verifica le alternative\n**3. Data fissa**: metti in calendario la revisione\n\nSolo controllare il premio ignora il 90% di ciò che conta.",
            allowText: false,
          },
        ],
      },
    ],
    suggestedPrompts: [
      "Dammi una checklist base per confrontare polizze",
      "Come valuto se una copertura è davvero adeguata?",
      "Quali clausole devo leggere sempre prima di firmare?",
    ],
  },
};

const lesson7Definition = createStaticLessonDefinition("7", content);

export default lesson7Definition;
