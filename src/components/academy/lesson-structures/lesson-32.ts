import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "caring"],
    blocks: [
      {
        kind: "focus",
        title: "💡 Cicli economici: l'economia respira",
        content: "L'economia non cresce in linea retta. Si muove in **cicli** di espansione e contrazione.\n\n**Le 4 fasi del ciclo:**\n\n1. **Espansione**: crescita, occupazione in aumento, ottimismo\n2. **Picco**: massima espansione, possibile surriscaldamento\n3. **Contrazione/Recessione**: crescita rallenta o negativa, disoccupazione sale\n4. **Minimo (Trough)**: punto più basso, l'economia tocca il fondo\n\n**Poi il ciclo ricomincia.**\n\n**Perché contano per te:**\n- Ogni fase ha asset che performano meglio\n- Capire dove siamo aiuta le decisioni\n- Non puoi prevedere esattamente, ma puoi prepararti\n\n**Durata tipica:** 5-10 anni per un ciclo completo, ma varia molto.",
      },
      {
        kind: "explain",
        title: "📌 Cosa succede in ogni fase",
        content: "**1. Espansione (early cycle):**\n- PIL in crescita\n- Disoccupazione in calo\n- Profitti aziendali in aumento\n- Inflazione moderata\n- Banche centrali ancora accomodanti\n- *Asset: azioni ciclichi, small cap*\n\n**2. Picco (late cycle):**\n- Crescita al massimo\n- Disoccupazione ai minimi\n- Inflazione che sale\n- Banche centrali alzano i tassi\n- *Asset: commodities, value, difensivi*\n\n**3. Contrazione/Recessione:**\n- PIL in calo (2+ trimestri = recessione tecnica)\n- Disoccupazione sale\n- Profitti in calo\n- Banche centrali tagliano i tassi\n- *Asset: obbligazioni, oro, cash*\n\n**4. Minimo:**\n- Economia tocca il fondo\n- Pessimismo massimo\n- Valutazioni depresse\n- *Asset: preparati per la ripresa*",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "In quale fase del ciclo la disoccupazione tende a essere più bassa?",
        pollAreas: [
          {
            id: "concept-verify-32",
            prompt: "Seleziona la fase corretta",
            options: [
              "Picco - l'economia è al massimo",
              "Minimo - le aziende assumono",
              "Contrazione - c'è più lavoro disponibile",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Al **picco** l'economia è al massimo: piena occupazione, tutti lavorano, difficile trovare dipendenti. È anche quando l'inflazione tende a salire.",
            wrongExplanation: "In contrazione la disoccupazione SALE, non scende.\n\n**Il ciclo:**\n- Espansione: disoccupazione cala\n- Picco: minimo storico\n- Contrazione: disoccupazione sale\n- Minimo: massimo storico",
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🎯 Indicatori anticipatori e ritardati",
        content: "Non tutti gli indicatori si muovono insieme:\n\n**Indicatori anticipatori (leading):**\nSi muovono PRIMA dell'economia\n- Ordini industriali\n- Permessi di costruzione\n- Borsa (le azioni sono forward-looking)\n- Curva dei rendimenti\n- Fiducia dei consumatori\n\n**Indicatori coincidenti:**\nSi muovono CON l'economia\n- PIL\n- Produzione industriale\n- Vendite al dettaglio\n\n**Indicatori ritardati (lagging):**\nSi muovono DOPO l'economia\n- Disoccupazione\n- Inflazione\n- Profitti aziendali\n\n**Perché conta:**\nQuando la disoccupazione è alta, l'economia potrebbe già essere in ripresa. Quando è bassa, il picco potrebbe essere passato.",
      },
      {
        kind: "question",
        title: "🧠 Verifica: indicatori",
        content: "La curva dei rendimenti si inverte. Cosa potrebbe indicare?",
        pollAreas: [
          {
            id: "concept-solve-32",
            prompt: "Seleziona il segnale",
            options: [
              "Possibile recessione in arrivo (indicatore anticipatorio)",
              "L'economia è già in recessione",
              "L'economia sta crescendo forte",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! La **curva invertita** è un indicatore anticipatorio classico di recessione. Anticipa di 6-18 mesi. Non significa recessione certa, ma aumenta la probabilità.",
            wrongExplanation: "La curva invertita anticipa, non conferma la recessione.\n\n**Curva invertita:**\n- Tassi brevi > tassi lunghi\n- Il mercato si aspetta che i tassi scenderanno\n- Storicamente anticipa recessioni",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco i cicli", "Conosco le fasi", "So leggere gli indicatori"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "integration"],
    blocks: [
      {
        kind: "focus",
        title: "🛠️ Asset allocation per fase del ciclo",
        content: "Diverse asset class performano meglio in diverse fasi:\n\n**Early cycle (ripresa iniziale):**\n- Azioni ciclische (auto, costruzioni, banche)\n- Small cap\n- High yield bonds\n- *Evitare: cash, oro*\n\n**Mid cycle (espansione):**\n- Azioni in generale\n- Immobiliare\n- Corporate bonds\n- *Equilibrio tra rischio e difesa*\n\n**Late cycle (picco):**\n- Commodities\n- Value stocks\n- Difensivi (utilities, healthcare)\n- *Ridurre: growth aggressivo*\n\n**Recessione:**\n- Obbligazioni governative\n- Oro\n- Cash\n- Azioni difensive\n- *Evitare: ciclici, high yield*\n\n**Attenzione:** queste sono tendenze, non regole assolute.",
      },
      {
        kind: "explain",
        title: "📌 Il problema: sapere dove siamo",
        content: "La difficoltà è capire in quale fase del ciclo ci troviamo:\n\n**Perché è difficile:**\n- Lo sappiamo con certezza solo dopo\n- I dati arrivano in ritardo\n- Ogni ciclo è diverso\n- Gli shock possono accelerare/rallentare\n\n**Come approssimare:**\n1. Guarda gli indicatori anticipatori (PMI, curva rendimenti)\n2. Considera il comportamento delle banche centrali\n3. Osserva i settori che guidano il mercato\n4. Nota il sentiment (euforia o panico)\n\n**Approccio pragmatico:**\n- Non cercare di 'timing' perfetto\n- Mantieni un portafoglio bilanciato sempre\n- Aggiusta i pesi moderatamente\n- La diversificazione funziona in tutte le fasi",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "In quale fase del ciclo le azioni cicliche tendono a performare meglio?",
        pollAreas: [
          {
            id: "widget-verify-32",
            prompt: "Seleziona la fase corretta",
            options: [
              "Early cycle - la ripresa iniziale beneficia i settori sensibili all'economia",
              "Recessione - le aziende soffrono meno",
              "Late cycle - prima del crollo",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! I **ciclici** beneficiano della ripresa iniziale. Auto, costruzioni, banche vedono la domanda tornare dopo la recessione. In late cycle sono vulnerabili.",
            wrongExplanation: "In recessione i ciclici soffrono. In late cycle iniziano a rallentare.\n\n**I ciclici:**\n- Dipendono dalla crescita economica\n- Migliori in early/mid cycle\n- Peggiori in late cycle e recessione",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario pratico",
        content: "L'inflazione è alta, i tassi salgono, la disoccupazione è ai minimi. In che fase siamo probabilmente?",
        pollAreas: [
          {
            id: "widget-scenario-32",
            prompt: "Identifica la fase",
            options: [
              "Late cycle - segnali di surriscaldamento",
              "Early cycle - la ripresa inizia",
              "Recessione - l'economia si contrae",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! Inflazione alta + tassi che salgono + disoccupazione ai minimi = **late cycle**. L'economia è 'calda', le BC frenano, il rischio di recessione aumenta.",
            wrongExplanation: "In early cycle l'inflazione è bassa e i tassi pure. In recessione la disoccupazione è alta.\n\n**Segnali late cycle:**\n- Inflazione alta\n- Tassi in salita\n- Disoccupazione ai minimi\n- BC aggressive",
            allowText: false,
          },
        ],
      },
    ],
    options: ["So allocare per fase", "Capisco le difficoltà", "Ho un approccio pragmatico"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      {
        kind: "focus",
        title: "⚡ Recessioni storiche: cosa ci insegnano",
        content: "Le recessioni sono normali e inevitabili:\n\n**Recessioni USA recenti:**\n- 2001 (dot-com): -0.3%, durata 8 mesi\n- 2008-09 (GFC): -4.3%, durata 18 mesi\n- 2020 (COVID): -3.4%, durata 2 mesi\n\n**Cosa succede durante:**\n- Mercati azionari: -30/50% tipicamente\n- Profitti aziendali: crollano\n- Licenziamenti: aumentano\n- Sentiment: panico, pessimismo\n\n**Cosa succede dopo:**\n- Mercati recuperano (spesso velocemente)\n- Chi ha venduto nel panico perde il rimbalzo\n- Nuove opportunità emergono\n\n**Le lezioni:**\n1. Le recessioni finiscono sempre\n2. Vendere nel panico è spesso un errore\n3. Chi ha liquidità può comprare a sconto\n4. I cicli si ripetono con variazioni",
      },
      {
        kind: "explain",
        title: "📌 Prepararsi alla recessione (prima che arrivi)",
        content: "Non puoi prevedere la recessione, ma puoi prepararti:\n\n**Prima della recessione:**\n1. **Fondo emergenza robusto** (6-12 mesi spese)\n2. **Debiti sotto controllo** (no rate insostenibili)\n3. **Portafoglio bilanciato** (non tutto in azioni)\n4. **Diversificazione** (settori, geografie)\n5. **Liquidità disponibile** (per opportunità)\n\n**Durante la recessione:**\n1. **Non vendere nel panico**\n2. **Rivedi il budget** (taglia se necessario)\n3. **Mantieni il piano** (continua i PAC)\n4. **Cerca opportunità** (se hai liquidità)\n\n**Dopo la recessione:**\n1. **Non cercare il bottom perfetto** (impossibile)\n2. **Incrementa gradualmente** (se hai venduto)\n3. **Ricostruisci il fondo emergenza**\n\n**Il principio:** chi è preparato trasforma le crisi in opportunità.",
      },
      {
        kind: "question",
        title: "🧠 Verifica comprensione",
        content: "Qual è l'errore più comune durante una recessione?",
        pollAreas: [
          {
            id: "challenge-verify-32",
            prompt: "Seleziona l'errore più comune",
            options: [
              "Vendere nel panico e perdere il successivo rimbalzo",
              "Mantenere le posizioni",
              "Continuare i piani di accumulo",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **Vendere nel panico** è l'errore classico. Si cristallizza la perdita e si perde il rimbalzo che spesso arriva velocemente. La storia mostra che restare investiti premia.",
            wrongExplanation: "Mantenere e continuare i PAC sono generalmente azioni corrette.\n\n**L'errore da evitare:**\n- Vendere quando tutti vendono\n- Comprare quando tutti comprano\n- Seguire le emozioni invece del piano",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario critico",
        content: "I mercati sono crollati del 30%. I giornali titolano 'crisi epocale'. Cosa fai?",
        pollAreas: [
          {
            id: "challenge-scenario-32",
            prompt: "Quale azione prendi?",
            options: [
              "Mantengo il piano - le recessioni finiscono sempre",
              "Vendo tutto - non voglio perdere altro",
              "Aspetto che i giornali diano buone notizie",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! **Mantenere il piano** è la scelta giusta. Le recessioni finiscono. I titoli sensazionalistici spesso segnano il fondo. Chi vende a -30% spesso vende al minimo.",
            wrongExplanation: "Vendere dopo -30% cristallizza la perdita. Aspettare buone notizie significa comprare ai massimi.\n\n**La storia insegna:**\n- Pessimismo estremo = spesso vicini al fondo\n- Chi mantiene viene premiato\n- Il rimbalzo è sempre inatteso",
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
        title: "🧠 Quiz finale: cicli economici",
        content: "Hai imparato le 4 fasi del ciclo, gli indicatori anticipatori/ritardati e come prepararsi.\n\n**Concetti chiave:**\n- Ciclo: espansione → picco → contrazione → minimo\n- Indicatori anticipatori: si muovono prima (PMI, curva, borsa)\n- Indicatori ritardati: si muovono dopo (disoccupazione)\n- Asset per fase: diversi settori performano in fasi diverse\n- Preparazione: fondo emergenza, debiti, diversificazione\n\nVerifichiamo la comprensione.",
      },
      {
        kind: "question",
        title: "❓ Domanda 1",
        content: "Quante sono le fasi principali del ciclo economico?",
        pollAreas: [
          {
            id: "quiz-q1-32",
            prompt: "Seleziona il numero corretto",
            options: [
              "4: espansione, picco, contrazione, minimo",
              "2: crescita e crisi",
              "6: varie sfumature",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Le fasi sono 4: **espansione, picco, contrazione, minimo**. Poi il ciclo ricomincia.",
            wrongExplanation: "Il ciclo ha 4 fasi distinte.\n\n**Le 4 fasi:**\n1. Espansione (crescita)\n2. Picco (massimo)\n3. Contrazione (calo)\n4. Minimo (fondo)",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 2",
        content: "La disoccupazione è un indicatore:",
        pollAreas: [
          {
            id: "quiz-q2-32",
            prompt: "Seleziona la classificazione corretta",
            options: [
              "Ritardato - si muove dopo l'economia",
              "Anticipatore - prevede il ciclo",
              "Coincidente - si muove con l'economia",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! La disoccupazione è **ritardata**. Le aziende licenziano dopo che l'economia è già in recessione, e assumono dopo che è già in ripresa.",
            wrongExplanation: "La disoccupazione segue, non anticipa.\n\n**Indicatori:**\n- Anticipatori: PMI, curva rendimenti, borsa\n- Coincidenti: PIL, produzione\n- Ritardati: disoccupazione, inflazione",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 3",
        content: "Durante una recessione, qual è l'errore da evitare?",
        pollAreas: [
          {
            id: "quiz-q3-32",
            prompt: "Seleziona l'errore da evitare",
            options: [
              "Vendere nel panico",
              "Mantenere il piano",
              "Continuare i PAC",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **Vendere nel panico** è l'errore classico. Cristallizza le perdite e fa perdere il rimbalzo.",
            wrongExplanation: "Mantenere il piano e continuare i PAC sono azioni corrette.\n\n**L'errore:**\n- Vendere quando tutti vendono\n- Seguire le emozioni\n- Reagire ai titoli sensazionalistici",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco i cicli", "Conosco gli indicatori", "So prepararmi"],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "✅ Cosa hai imparato: cicli economici",
        content: "Complimenti! Hai completato la lezione sui cicli.\n\n**Principi chiave:**\n\n1. **4 fasi**: espansione, picco, contrazione, minimo\n2. **Indicatori**: anticipatori (prevedono), ritardati (confermano)\n3. **Asset per fase**: ciclici in ripresa, difensivi in recessione\n4. **Preparazione**: fondo emergenza, debiti controllati\n5. **Comportamento**: non vendere nel panico\n\nI cicli sono inevitabili. La preparazione fa la differenza.",
      },
      {
        kind: "explain",
        title: "📌 Collegamento con la sezione",
        content: "Questa lezione fa parte della sezione **Macroeconomia**.\n\n**Percorso:**\n- Inflazione\n- Tassi d'interesse\n- Banche centrali\n- **Cicli economici** (questa lezione)\n- Indicatori economici (prossima)\n- Geopolitica\n\nI cicli sono il risultato dell'interazione tra inflazione, tassi e politiche delle banche centrali.",
      },
      {
        kind: "question",
        title: "🎯 Il tuo prossimo passo",
        content: "Cosa farai con questa conoscenza?",
        pollAreas: [
          {
            id: "feedback-action-32",
            prompt: "Indica il tuo prossimo passo",
            options: [
              "Verifico se ho un fondo emergenza adeguato",
              "Analizzo in quale fase del ciclo potremmo essere",
              "Continuo con la lezione sugli indicatori",
            ],
            correctIndex: 0,
            correctExplanation: "Ottima scelta! Il **fondo emergenza** è la prima difesa contro le recessioni. Se non ce l'hai, costruiscilo prima di pensare ad altro.",
            wrongExplanation: "Tutte le scelte sono valide!\n\n- Fondo emergenza: priorità pratica\n- Analizzare il ciclo: utile ma incerto\n- Continuare: per completare la sezione",
            allowText: false,
          },
        ],
      },
    ],
    suggestedPrompts: [
      "In che fase del ciclo potremmo essere oggi?",
      "Come costruisco un portafoglio resiliente?",
      "Quali settori performano meglio in recessione?",
    ],
  },
};

const lesson32Definition = createStaticLessonDefinition("32", content);

export default lesson32Definition;
