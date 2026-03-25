import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "caring"],
    blocks: [
      {
        kind: "focus",
        title: "💡 Indici di mercato: i benchmark del mondo",
        content: "Un **indice di mercato** è un paniere di titoli che rappresenta un mercato o un segmento. Gli indici servono come benchmark per misurare la performance.\n\n**A cosa servono:**\n- Misurare l'andamento di un mercato\n- Confrontare la performance dei tuoi investimenti\n- Base per gli ETF (che li replicano)\n\n**Esempi famosi:**\n- S&P 500: 500 grandi aziende USA\n- MSCI World: mercati sviluppati globali\n- FTSE MIB: 40 aziende italiane\n\nQuando i giornali dicono 'la borsa è salita', di solito si riferiscono a un indice.",
      },
      {
        kind: "explain",
        title: "📌 I principali indici mondiali",
        content: "Ecco gli indici che ogni investitore dovrebbe conoscere:\n\n**USA:**\n- **S&P 500**: 500 grandi aziende USA, il più seguito al mondo\n- **Dow Jones**: 30 blue chip USA, storico ma meno rappresentativo\n- **NASDAQ 100**: 100 tech USA (Apple, Microsoft, Amazon, etc.)\n\n**Globali:**\n- **MSCI World**: 1.500+ aziende, 23 paesi sviluppati\n- **MSCI ACWI**: World + emergenti (~3.000 aziende)\n- **FTSE All-World**: simile a ACWI (~4.000 aziende)\n\n**Europa:**\n- **STOXX Europe 600**: 600 aziende europee\n- **Euro Stoxx 50**: 50 blue chip eurozona\n\n**Italia:**\n- **FTSE MIB**: 40 principali aziende italiane\n\n**Emergenti:**\n- **MSCI Emerging Markets**: Cina, India, Brasile, etc.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Se vuoi seguire l'andamento delle borse mondiali, quale indice guardi?",
        pollAreas: [
          {
            id: "concept-verify-20",
            prompt: "Seleziona l'indice corretto",
            options: [
              "MSCI World o MSCI ACWI",
              "FTSE MIB",
              "Dow Jones",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **MSCI World** (o ACWI che include emergenti) è l'indice più rappresentativo del mercato globale. FTSE MIB è solo Italia, Dow Jones solo 30 aziende USA.",
            wrongExplanation: "FTSE MIB rappresenta solo l'Italia (0.7% del mercato mondiale). Il Dow Jones ha solo 30 titoli USA.\n\n**Per visione globale:** MSCI World (sviluppati) o MSCI ACWI (sviluppati + emergenti).",
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🎯 Come sono costruiti gli indici",
        content: "Gli indici usano diversi metodi di ponderazione:\n\n**Per capitalizzazione (market cap):**\n- Aziende più grandi pesano di più\n- Apple pesa più di una small cap\n- È il metodo più comune (S&P 500, MSCI World)\n\n**Equal weight:**\n- Tutte le aziende pesano uguale\n- Più esposizione a small/mid cap\n- Meno usato\n\n**Per prezzo:**\n- Azioni con prezzo più alto pesano di più\n- Usato dal Dow Jones (metodo antiquato)\n\n**La differenza pratica:**\nNegli indici cap-weighted, le top 10 aziende possono pesare il 20-30%. Quando Apple sale del 5%, l'indice sale di più che se salisse un'azienda piccola.",
      },
      {
        kind: "question",
        title: "🧠 Verifica: ponderazione",
        content: "Nell'S&P 500 cap-weighted, Apple vale circa il 7% dell'indice. Cosa significa?",
        pollAreas: [
          {
            id: "concept-solve-20",
            prompt: "Interpreta il dato",
            options: [
              "Se Apple sale del 10%, l'indice sale di circa 0.7%",
              "Apple vale il 7% di ogni azienda USA",
              "Il 7% degli americani possiede Apple",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Se Apple pesa il 7% e sale del 10%, il suo contributo all'indice è 7% × 10% = **0.7%** di movimento sull'intero S&P 500.",
            wrongExplanation: "Il peso indica l'impatto sull'indice, non la proprietà.\n\n**Il calcolo:**\nPeso Apple (7%) × variazione Apple (10%) = impatto sull'indice (0.7%)\n\nEcco perché le grandi tech influenzano molto gli indici cap-weighted.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Conosco gli indici principali", "Capisco la ponderazione", "So interpretare i movimenti"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "integration"],
    blocks: [
      {
        kind: "focus",
        title: "🛠️ Usare gli indici nella pratica",
        content: "Gli indici sono utili per:\n\n**1. Confrontare la tua performance**\n- Il tuo portafoglio è salito del 5%? L'S&P 500 ha fatto +8%?\n- Stai facendo meglio o peggio del mercato?\n- Se fai costantemente peggio, forse meglio un ETF passivo\n\n**2. Capire il contesto**\n- 'Il mercato' è salito o sceso?\n- Il tuo settore sta andando bene o male?\n- Confronta sempre con il benchmark appropriato\n\n**3. Scegliere ETF**\n- Gli ETF replicano indici\n- Conoscere l'indice = sapere cosa compri\n- MSCI World? FTSE All-World? S&P 500? Ora sai cosa sono",
      },
      {
        kind: "explain",
        title: "📌 MSCI vs FTSE: le differenze",
        content: "MSCI e FTSE sono i due principali fornitori di indici. Ecco le differenze:\n\n**MSCI World vs FTSE Developed:**\n- Molto simili (23 vs 25 paesi sviluppati)\n- FTSE include Corea del Sud come sviluppato, MSCI no\n- Differenza pratica minima\n\n**MSCI ACWI vs FTSE All-World:**\n- Entrambi includono emergenti\n- FTSE ha più titoli (4.000 vs 3.000)\n- Include small cap, MSCI tendenzialmente no\n\n**Nella pratica:**\nLa differenza di performance è minima (< 0.5% annuo). Scegli in base a:\n- Disponibilità sul broker\n- TER dell'ETF che li replica\n- Non stressarti troppo sulla scelta MSCI vs FTSE",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Un ETF replica MSCI World, un altro FTSE Developed. Quale scegli?",
        pollAreas: [
          {
            id: "widget-verify-20",
            prompt: "Come decidi?",
            options: [
              "Quello con TER più basso e dimensione maggiore - la differenza di indice è minima",
              "MSCI è sempre meglio",
              "FTSE è sempre meglio",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! La **differenza tra MSCI e FTSE è minima**. Scegli in base a TER, dimensione, liquidità - non al nome dell'indice.",
            wrongExplanation: "Né MSCI né FTSE è 'sempre meglio'. Sono molto simili.\n\n**Il criterio reale:** quale ETF ha costi più bassi, dimensione maggiore, e disponibilità sul tuo broker? Quello vince.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario pratico",
        content: "Il tuo portafoglio è salito del 6% quest'anno. L'MSCI World ha fatto +12%. Come interpreti?",
        pollAreas: [
          {
            id: "widget-scenario-20",
            prompt: "Qual è l'interpretazione corretta?",
            options: [
              "Hai sottoperformato il benchmark - valuta se la tua strategia ha senso",
              "6% è comunque positivo, va bene così",
              "Gli indici non sono comparabili con i portafogli reali",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Se fai costantemente peggio del benchmark, devi chiederti **perché**. Se non hai una risposta convincente, forse un ETF passivo è la scelta migliore.",
            wrongExplanation: "Guadagnare è positivo, ma il confronto con il benchmark è importante.\n\n**La domanda:** se un ETF MSCI World avrebbe fatto +12% con meno sforzo, perché stai facendo strategie più complesse per ottenere +6%?",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Confronto con benchmark", "Capisco MSCI vs FTSE", "Valuto la mia strategia"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      {
        kind: "focus",
        title: "⚡ I limiti degli indici",
        content: "Gli indici sono utili ma hanno limiti da conoscere:\n\n**Concentrazione:**\nGli indici cap-weighted sono concentrati sulle aziende più grandi. Nell'S&P 500, le top 10 pesano ~30%. Se la tech crolla, l'intero indice crolla.\n\n**Survivorship bias:**\nGli indici mostrano solo i vincitori. Le aziende fallite vengono rimosse. La storia sembra migliore di quanto fosse.\n\n**Non sono 'il mercato':**\nGli indici rappresentano una selezione. Il FTSE MIB non è 'la borsa italiana', sono solo 40 aziende.\n\n**Costi non inclusi:**\nI rendimenti degli indici non includono costi di transazione, tasse, spread. Il tuo rendimento reale sarà leggermente inferiore.",
      },
      {
        kind: "explain",
        title: "📌 Usare gli indici intelligentemente",
        content: "Ecco come usare gli indici nel modo giusto:\n\n**Per il confronto:**\n- Usa il benchmark appropriato (non confrontare un portafoglio italiano con l'S&P 500)\n- Confronta su periodi lunghi (1 anno è poco significativo)\n- Includi i costi nella tua valutazione\n\n**Per la costruzione del portafoglio:**\n- Gli indici globali (MSCI World, FTSE All-World) sono ottimi core\n- Considera la concentrazione sulle tech USA\n- Puoi bilanciare con emergenti, Europa, small cap\n\n**Per seguire i mercati:**\n- Non controllare ogni giorno (rumore)\n- Guarda trend di lungo periodo\n- Ricorda che i media amplificano le oscillazioni",
      },
      {
        kind: "question",
        title: "🧠 Verifica comprensione",
        content: "Perché è importante conoscere la concentrazione degli indici?",
        pollAreas: [
          {
            id: "challenge-verify-20",
            prompt: "Seleziona la ragione corretta",
            options: [
              "Per capire che 'diversificazione' globale può essere meno diversificata di quanto sembri",
              "Per scegliere sempre gli indici più concentrati",
              "Per evitare completamente gli indici concentrati",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Un ETF MSCI World sembra diversificato (1.500 titoli) ma il 30% è nelle top 10 aziende. **Sapere questo** ti aiuta a decidere se aggiungere diversificazione extra.",
            wrongExplanation: "Non devi evitare gli indici concentrati, solo essere consapevole.\n\n**Il punto:** sapere che le top 10 aziende pesano il 30% ti permette di decidere consapevolmente se va bene così o se vuoi bilanciare con emergenti, small cap, etc.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario critico",
        content: "I titoli tech USA (Apple, Microsoft, etc.) pesano ~20% dell'MSCI World. Se la tech crolla del 30%, cosa succede?",
        pollAreas: [
          {
            id: "challenge-scenario-20",
            prompt: "Quale impatto sull'indice?",
            options: [
              "L'indice perde circa il 6% solo per la tech (20% × 30%)",
              "L'indice non è influenzato - è diversificato",
              "L'indice perde il 30%",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! 20% peso × 30% calo = **6% di perdita** solo dalla tech, a cui si sommano i movimenti degli altri settori. La concentrazione amplifica gli impatti.",
            wrongExplanation: "L'indice È diversificato, ma la concentrazione sulle big tech ha un impatto.\n\n**Il calcolo:**\n- Tech pesa 20%\n- Tech crolla 30%\n- Contributo: 20% × 30% = 6%\n\nPiù il resto del mercato. Ecco perché la concentrazione conta.",
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
        title: "🧠 Quiz finale: indici di mercato",
        content: "Hai imparato cosa sono gli indici, quali sono i principali, come sono costruiti, e i loro limiti.\n\n**Concetti chiave:**\n- Gli indici rappresentano mercati o segmenti\n- S&P 500 (USA), MSCI World (globale) i più importanti\n- Ponderazione per capitalizzazione è lo standard\n- MSCI vs FTSE: differenze minime\n- Attenzione alla concentrazione\n\nVerifichiamo la comprensione.",
      },
      {
        kind: "question",
        title: "❓ Domanda 1",
        content: "Quale indice rappresenta meglio il mercato azionario globale?",
        pollAreas: [
          {
            id: "quiz-q1-20",
            prompt: "Seleziona l'indice più rappresentativo",
            options: [
              "MSCI ACWI o FTSE All-World",
              "S&P 500",
              "FTSE MIB",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! **MSCI ACWI** e **FTSE All-World** includono sia mercati sviluppati che emergenti, coprendo ~95% della capitalizzazione mondiale.",
            wrongExplanation: "L'S&P 500 copre solo gli USA (~60% del mercato mondiale). FTSE MIB solo l'Italia (~0.7%).\n\n**Per visione globale:** MSCI ACWI o FTSE All-World.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 2",
        content: "In un indice cap-weighted, le aziende più grandi:",
        pollAreas: [
          {
            id: "quiz-q2-20",
            prompt: "Completa la frase",
            options: [
              "Pesano di più e influenzano maggiormente l'indice",
              "Pesano quanto le piccole",
              "Sono escluse per favorire le piccole",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Nella ponderazione per capitalizzazione, **le grandi pesano di più**. Apple può valere il 7% dell'indice, mentre una small cap lo 0.01%.",
            wrongExplanation: "Cap-weighted significa ponderato per capitalizzazione.\n\n**Come funziona:** azienda grande = peso grande. Se Apple vale $3 trilioni e una small cap $1 miliardo, Apple pesa 3.000 volte di più nell'indice.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 3",
        content: "La differenza pratica tra MSCI World e FTSE Developed è:",
        pollAreas: [
          {
            id: "quiz-q3-20",
            prompt: "Seleziona la risposta corretta",
            options: [
              "Minima - scegli in base a costo e disponibilità dell'ETF",
              "Enorme - devi studiare attentamente quale scegliere",
              "MSCI è sempre superiore",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! La **differenza è minima** (< 0.5% annuo storicamente). Scegli l'ETF con costi più bassi e maggiore disponibilità, non stressarti sul nome dell'indice.",
            wrongExplanation: "MSCI e FTSE sono entrambi eccellenti. La scelta dell'indice conta meno della scelta dell'ETF (costi, dimensione).\n\n**Differenze:** FTSE include Corea nei sviluppati, MSCI no. Praticamente irrilevante per il tuo portafoglio.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Conosco gli indici", "Capisco la ponderazione", "So confrontare con benchmark"],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "✅ Cosa hai imparato: indici di mercato",
        content: "Complimenti! Hai completato la lezione sugli indici.\n\n**Principi chiave:**\n\n1. **Indici = benchmark** per misurare mercati\n2. **Principali:** S&P 500 (USA), MSCI World (globale), MSCI ACWI (tutto)\n3. **Cap-weighted:** le grandi pesano di più\n4. **MSCI vs FTSE:** differenze minime\n5. **Limiti:** concentrazione, survivorship bias\n\nOra quando senti 'il mercato è salito/sceso' sai esattamente cosa significa.",
      },
      {
        kind: "explain",
        title: "📌 Applicazione pratica",
        content: "Come usare questa conoscenza:\n\n**Quando leggi notizie:**\n- 'Borsa in calo' = quale indice? Quanto?\n- Contestualizza: -1% è normale, -10% è significativo\n\n**Quando costruisci il portafoglio:**\n- Scegli l'indice che vuoi replicare\n- Trova l'ETF migliore che lo replica\n- Non ossessionarti con MSCI vs FTSE\n\n**Quando valuti performance:**\n- Confronta col benchmark appropriato\n- Periodi lunghi (3-5+ anni)\n- Se sottoperformi costantemente, valuta ETF passivo\n\n**Regola finale:** capire gli indici ti rende un investitore più consapevole, ma non complicare troppo. Un ETF MSCI World o FTSE All-World copre tutto ciò che serve.",
      },
      {
        kind: "question",
        title: "🎯 Il tuo prossimo passo",
        content: "Cosa farai con questa conoscenza?",
        pollAreas: [
          {
            id: "feedback-action-20",
            prompt: "Indica come userai gli indici",
            options: [
              "Per scegliere ETF consapevolmente",
              "Per confrontare la mia performance con i benchmark",
              "Per capire meglio le notizie finanziarie",
            ],
            correctIndex: 0,
            correctExplanation: "Ottimo! Scegliere ETF **consapevolmente** è l'applicazione più diretta. Ora sai cosa significano MSCI World, S&P 500, e puoi scegliere con cognizione di causa.",
            wrongExplanation: "Tutte le applicazioni sono valide!\n\n- Scegliere ETF: applicazione diretta\n- Confrontare performance: capire se stai facendo bene\n- Capire le news: essere un investitore informato\n\nOgni uso degli indici ti rende più consapevole.",
            allowText: false,
          },
        ],
      },
    ],
    suggestedPrompts: [
      "Quale indice è più adatto per il mio portafoglio?",
      "Come confronto la mia performance con il benchmark?",
      "Quali sono le differenze pratiche tra S&P 500 e MSCI World?",
    ],
  },
};

const lesson20Definition = createStaticLessonDefinition("20", content);

export default lesson20Definition;
