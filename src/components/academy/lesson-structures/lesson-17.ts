import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "caring"],
    blocks: [
      {
        kind: "focus",
        title: "💡 Fondi comuni: investire insieme ad altri",
        content: "Un **fondo comune d'investimento** raccoglie i soldi di molti investitori e li investe in un portafoglio di titoli gestito da professionisti.\n\n**Come funziona:**\n1. Tu versi soldi nel fondo\n2. Un gestore professionista investe per tutti\n3. Possiedi 'quote' del fondo\n4. Il valore delle quote cambia in base ai titoli sottostanti\n\n**Vantaggi:**\n- Diversificazione automatica\n- Gestione professionale\n- Accessibile anche con piccoli importi\n\n**Svantaggi:**\n- Costi di gestione (spesso alti)\n- Poca trasparenza sui titoli posseduti\n- Rendimenti spesso inferiori al mercato",
      },
      {
        kind: "explain",
        title: "📌 Fondi attivi vs passivi",
        content: "I fondi si dividono in due grandi categorie:\n\n**Fondi attivi:**\n- Un gestore sceglie quali titoli comprare/vendere\n- Obiettivo: battere il benchmark (es. battere l'S&P 500)\n- Costi alti: 1-2.5% annuo\n- Problema: la maggior parte NON batte il benchmark nel lungo termine\n\n**Fondi passivi (index fund):**\n- Replicano un indice automaticamente\n- Non cercano di battere il mercato, lo copiano\n- Costi bassi: 0.1-0.5% annuo\n- Nel lungo termine, battono la maggior parte dei fondi attivi\n\n**Dato importante:** il 90% dei fondi attivi sottoperforma il benchmark su 15 anni. Paghi di più per ottenere di meno.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Perché la maggior parte dei fondi attivi non batte il mercato?",
        pollAreas: [
          {
            id: "concept-verify-17",
            prompt: "Seleziona la ragione principale",
            options: [
              "I costi di gestione erodono i rendimenti",
              "I gestori non sono competenti",
              "Il mercato è sempre in calo",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! I **costi** sono il problema principale. Un fondo attivo che costa il 2% deve battere il mercato del 2% ogni anno solo per pareggiare. È molto difficile farlo costantemente.",
            wrongExplanation: "I gestori sono spesso competenti, ma il mercato è molto efficiente.\n\n**Il problema dei costi:**\n- Fondo attivo: -2% di costi\n- Mercato: +7%\n- Per pareggiare il fondo deve fare +9%\n\nFarlo ogni anno per decenni è quasi impossibile.",
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🎯 I costi dei fondi: il nemico nascosto",
        content: "I costi dei fondi comuni sono spesso nascosti e devastanti nel lungo periodo.\n\n**TER (Total Expense Ratio):**\nIl costo annuo totale. Include:\n- Commissione di gestione\n- Costi amministrativi\n- Costi di transazione\n\n**Commissioni di ingresso/uscita:**\nAlcuni fondi caricano il 3-5% quando entri o esci. Da evitare.\n\n**Impatto dei costi su 30 anni:**\n100.000€ al 7% lordo:\n- Fondo con 0.2% costi → 719.000€\n- Fondo con 2.0% costi → 432.000€\n- **Differenza: 287.000€** persi in commissioni!\n\nIl costo sembra piccolo (1.8% di differenza) ma su decenni distrugge la ricchezza.",
      },
      {
        kind: "question",
        title: "🧠 Verifica: impatto dei costi",
        content: "Un fondo attivo costa il 2% l'anno, un ETF equivalente costa lo 0.2%. Su 100.000€ in 20 anni, quanto di più paghi con il fondo attivo?",
        pollAreas: [
          {
            id: "concept-solve-17",
            prompt: "Stima la differenza",
            options: [
              "Circa 80.000-100.000€ in più",
              "Circa 10.000€ in più",
              "La differenza è trascurabile",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Su 20 anni, l'1.8% di differenza annua si compone e diventa una **differenza enorme** - facilmente 80.000-100.000€ persi in commissioni.",
            wrongExplanation: "L'1.8% sembra poco, ma si compone per 20 anni.\n\n**Calcolo approssimativo:**\n- ETF (6.8% netto): 100.000€ → ~370.000€\n- Fondo (5% netto): 100.000€ → ~265.000€\n- Differenza: ~105.000€\n\nI costi sono il nemico numero uno dell'investitore.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco fondi attivi vs passivi", "Controllo sempre i costi", "Preferisco costi bassi"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "integration"],
    blocks: [
      {
        kind: "focus",
        title: "🛠️ Come leggere il KIID di un fondo",
        content: "Il **KIID** (Key Investor Information Document) è il documento che riassume le caratteristiche di un fondo. Ecco cosa guardare:\n\n**1. Obiettivo e politica d'investimento**\nIn cosa investe? Azioni, obbligazioni, misto? Quale area geografica?\n\n**2. Profilo di rischio/rendimento**\nScala da 1 (basso) a 7 (alto). Ti dice quanto è volatile.\n\n**3. Spese (FONDAMENTALE)**\n- Spese correnti (TER): il costo annuo\n- Commissioni di ingresso/uscita\n- Commissioni di performance\n\n**4. Rendimenti passati**\nCome si è comportato negli anni. Ricorda: rendimenti passati non garantiscono quelli futuri.\n\n**5. Informazioni pratiche**\nCome comprare, vendere, contatti.",
      },
      {
        kind: "explain",
        title: "📌 Check-list prima di comprare un fondo",
        content: "Prima di investire in qualsiasi fondo, verifica:\n\n**✅ Costi totali (TER)**\n- Fondi azionari: idealmente < 0.5%\n- Fondi obbligazionari: idealmente < 0.3%\n- Sopra l'1% → quasi certamente non vale la pena\n\n**✅ Commissioni di ingresso/uscita**\n- Idealmente: 0%\n- Se ci sono → cerca alternative\n\n**✅ Performance vs benchmark**\n- Confronta con l'indice di riferimento\n- Se sottoperforma costantemente → non ha senso\n\n**✅ Dimensione del fondo**\n- Troppo piccolo (< 50M€) → rischio liquidità\n- Troppo grande → potrebbe avere problemi a muoversi\n\n**La regola d'oro:** se non batte il benchmark e costa di più di un ETF, perché pagare di più?",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Un fondo azionario ha TER del 2.1% e commissione di ingresso del 3%. Cosa ne pensi?",
        pollAreas: [
          {
            id: "widget-verify-17",
            prompt: "Valuta il fondo",
            options: [
              "Costi eccessivi - quasi certamente esistono alternative migliori",
              "Costi nella norma per un fondo attivo",
              "Se il gestore è bravo, ne vale la pena",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **TER 2.1% + ingresso 3%** sono costi molto alti. Esistono ETF equivalenti che costano lo 0.1-0.3% senza commissioni di ingresso.",
            wrongExplanation: "Questi costi sono alti anche per fondi attivi.\n\n**Il problema:**\n- 3% perso subito all'ingresso\n- 2.1% ogni anno\n- Per battere un ETF allo 0.2%, il gestore deve fare +2% extra ogni anno\n\nStoricamente, quasi nessuno ci riesce costantemente.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario pratico",
        content: "La tua banca ti propone un fondo con costi del 2% ma 'gestione professionale eccellente'. Un ETF equivalente costa lo 0.15%. Cosa scegli?",
        pollAreas: [
          {
            id: "widget-scenario-17",
            prompt: "Quale opzione?",
            options: [
              "L'ETF - i dati mostrano che la 'gestione eccellente' raramente batte il mercato",
              "Il fondo della banca - mi fido dei professionisti",
              "Metà e metà per diversificare",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! I dati sono chiari: il **90% dei fondi attivi sottoperforma** gli indici su 15 anni. La 'gestione eccellente' è spesso marketing. L'ETF a basso costo è statisticamente superiore.",
            wrongExplanation: "La 'gestione professionale' suona bene, ma i dati dicono altro:\n\n**Fatto:** il 90% dei fondi attivi non batte il benchmark su 15 anni.\n\nQuindi statisticamente, scegliendo il fondo attivo hai il 90% di probabilità di fare peggio dell'ETF E pagare di più.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Leggo il KIID", "Confronto con ETF", "Scelgo costi bassi"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      {
        kind: "focus",
        title: "⚡ Il conflitto di interesse delle banche",
        content: "Le banche guadagnano di più vendendo fondi costosi che ETF a basso costo. Questo crea un **conflitto di interesse**.\n\n**Come funziona:**\n- La banca ti vende un fondo con TER 2%\n- Di quel 2%, una parte (1-1.5%) torna alla banca come 'retrocessione'\n- Più è costoso il fondo, più guadagna la banca\n\n**Conseguenza:**\n- Ti propongono fondi della 'casa' o partner\n- Gli ETF a basso costo non vengono quasi mai menzionati\n- Il consulente bancario ha incentivi diversi dai tuoi\n\n**La protezione:**\n- Informati autonomamente\n- Confronta sempre con gli ETF\n- Chiedi esplicitamente i costi totali\n- Considera consulenti indipendenti (fee-only)",
      },
      {
        kind: "explain",
        title: "📌 Quando i fondi attivi hanno senso",
        content: "I fondi attivi hanno senso solo in casi specifici:\n\n**1. Mercati inefficienti**\n- Small cap, mercati emergenti, situazioni speciali\n- Qui la ricerca attiva può aggiungere valore\n- Ma anche qui, molti fondi attivi falliscono\n\n**2. Strategie specifiche non replicabili**\n- Hedge fund con strategie uniche\n- Private equity\n- Ma richiedono capitali alti e competenza\n\n**3. Consulenza integrata**\n- Se il fondo include pianificazione finanziaria vera\n- Se il costo extra è giustificato dal servizio\n\n**Per la maggior parte degli investitori retail:**\nGli ETF a basso costo sono la scelta migliore. Non serve pagare per 'gestione attiva' che statisticamente non funziona.",
      },
      {
        kind: "question",
        title: "🧠 Verifica comprensione",
        content: "Perché le banche tendono a proporre fondi costosi?",
        pollAreas: [
          {
            id: "challenge-verify-17",
            prompt: "Seleziona la ragione principale",
            options: [
              "Guadagnano commissioni più alte (retrocessioni)",
              "I fondi costosi sono oggettivamente migliori",
              "Gli ETF sono troppo rischiosi per i clienti",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Le banche ricevono **retrocessioni** dai fondi. Più costoso il fondo, più guadagna la banca. È un conflitto di interesse strutturale.",
            wrongExplanation: "I fondi costosi non sono migliori - anzi, spesso sono peggiori.\n\n**Il meccanismo:**\nUn fondo con TER 2% paga alla banca distributrice l'1-1.5% come 'retrocessione'. La banca ha interesse a vendere fondi costosi, non quelli migliori per te.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario critico",
        content: "Il consulente bancario dice: 'Questo fondo ha battuto il mercato negli ultimi 3 anni, quindi continuerà a farlo.' È un'argomentazione valida?",
        pollAreas: [
          {
            id: "challenge-scenario-17",
            prompt: "Valuta l'affermazione",
            options: [
              "No - i rendimenti passati non predicono quelli futuri",
              "Sì - se ha funzionato, continuerà",
              "Dipende dal gestore",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! I **rendimenti passati non garantiscono quelli futuri**. Studi mostrano che i fondi che battono il mercato un anno spesso sottoperformano l'anno dopo. È un errore cognitivo comune.",
            wrongExplanation: "La performance passata non predice quella futura.\n\n**Dati:** dei fondi nel primo quartile (top 25%) in un periodo di 5 anni, meno del 20% resta nel primo quartile nei 5 anni successivi.\n\nIl successo passato potrebbe essere fortuna, non abilità.",
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
        title: "🧠 Quiz finale: fondi comuni",
        content: "Hai imparato come funzionano i fondi comuni, la differenza tra attivi e passivi, l'impatto dei costi, e i conflitti di interesse.\n\n**Concetti chiave:**\n- Fondi attivi: costi alti, spesso sottoperformano\n- Fondi passivi/ETF: costi bassi, replicano il mercato\n- Il 90% dei fondi attivi non batte il benchmark\n- Le banche hanno conflitti di interesse\n\nVerifichiamo la comprensione.",
      },
      {
        kind: "question",
        title: "❓ Domanda 1",
        content: "Qual è la principale differenza tra fondi attivi e passivi?",
        pollAreas: [
          {
            id: "quiz-q1-17",
            prompt: "Seleziona la risposta corretta",
            options: [
              "Attivi cercano di battere il mercato; passivi lo replicano",
              "Attivi investono in azioni; passivi in obbligazioni",
              "Attivi sono per esperti; passivi per principianti",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! I fondi **attivi** hanno gestori che scelgono i titoli cercando di battere il benchmark. I **passivi** replicano un indice automaticamente.",
            wrongExplanation: "La differenza non è negli asset ma nell'approccio:\n\n- **Attivi:** gestione discrezionale, cerca di battere il mercato\n- **Passivi:** replica automatica di un indice\n\nEntrambi possono investire in azioni, obbligazioni o misti.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 2",
        content: "Perché i costi dei fondi sono così importanti?",
        pollAreas: [
          {
            id: "quiz-q2-17",
            prompt: "Seleziona la ragione principale",
            options: [
              "Si compongono nel tempo e possono costare centinaia di migliaia di euro",
              "Determinano la qualità della gestione",
              "Sono l'unica cosa che conta nella scelta di un fondo",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! I costi si **compongono negativamente** per decenni. Una differenza dell'1.5% annuo può costare 200.000-300.000€ su 30 anni.",
            wrongExplanation: "I costi alti non significano qualità migliore - spesso è il contrario.\n\n**L'importanza dei costi:** sono l'unico fattore prevedibile. La performance futura è incerta, i costi sono certi. Minimizzarli è una delle poche cose sotto il tuo controllo.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 3",
        content: "Per un investitore retail, qual è generalmente la scelta migliore?",
        pollAreas: [
          {
            id: "quiz-q3-17",
            prompt: "Seleziona la scelta ottimale",
            options: [
              "ETF a basso costo che replicano indici globali",
              "Fondi attivi consigliati dalla banca",
              "Il fondo con i migliori rendimenti degli ultimi 3 anni",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! Gli **ETF a basso costo** sono statisticamente la scelta migliore: costano poco, diversificano bene, e battono la maggior parte dei fondi attivi nel lungo termine.",
            wrongExplanation: "I fondi della banca hanno spesso conflitti di interesse. I rendimenti passati non predicono quelli futuri.\n\n**La scelta statisticamente migliore:** ETF a basso costo. Semplici, economici, efficaci.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Preferisco ETF", "Controllo sempre i costi", "Ignoro i rendimenti passati"],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "✅ Cosa hai imparato: fondi comuni",
        content: "Complimenti! Hai completato la lezione sui fondi comuni.\n\n**Principi chiave:**\n\n1. **Fondi attivi vs passivi:** attivi cercano di battere il mercato, passivi lo replicano\n2. **I costi fanno la differenza:** il 90% dei fondi attivi sottoperforma, principalmente per i costi\n3. **Conflitto di interesse:** le banche guadagnano di più vendendo fondi costosi\n4. **La soluzione:** per la maggior parte delle persone, ETF a basso costo\n\nNella prossima lezione approfondirai gli ETF in dettaglio.",
      },
      {
        kind: "explain",
        title: "📌 Cosa fare se hai già fondi costosi",
        content: "Se hai fondi attivi con costi alti, ecco come procedere:\n\n**1. Calcola i costi totali**\n- TER + commissioni varie\n- Confronta con ETF equivalenti\n\n**2. Valuta le penali di uscita**\n- Ci sono commissioni di uscita?\n- Implicazioni fiscali?\n\n**3. Pianifica la transizione**\n- Se i costi di uscita sono bassi → considera di vendere\n- Se ci sono penali significative → valuta il break-even\n- Per nuovi versamenti → usa ETF\n\n**4. Non versare più**\n- Almeno, smetti di alimentare fondi costosi\n- I nuovi soldi investili in ETF\n\nNon serve fare tutto subito. Inizia a reindirizzare i nuovi flussi.",
      },
      {
        kind: "question",
        title: "🎯 Il tuo prossimo passo",
        content: "Cosa farai dopo questa lezione?",
        pollAreas: [
          {
            id: "feedback-action-17",
            prompt: "Indica il tuo prossimo passo",
            options: [
              "Verifico i costi dei fondi che possiedo",
              "Cerco ETF alternativi ai miei fondi attuali",
              "Non ho fondi, partirò direttamente con ETF",
            ],
            correctIndex: 0,
            correctExplanation: "Ottimo primo passo! **Conoscere i costi** è fondamentale. Potresti scoprire di pagare molto più di quanto pensassi.",
            wrongExplanation: "Qualsiasi passo è valido! L'importante è agire:\n\n- Verificare i costi dei fondi esistenti\n- Cercare alternative a basso costo\n- Partire direttamente con ETF se non hai investimenti\n\nL'azione più importante: non rimanere passivo.",
            allowText: false,
          },
        ],
      },
    ],
    suggestedPrompts: [
      "Come faccio a sapere quanto paghi in commissioni sui miei fondi?",
      "Conviene vendere i fondi costosi o tenerli?",
      "Quali ETF corrispondono ai fondi che ho già?",
    ],
  },
};

const lesson17Definition = createStaticLessonDefinition("17", content);

export default lesson17Definition;
