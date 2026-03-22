import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "caring"],
    blocks: [
      {
        kind: "focus",
        title: "💡 Fiscalità degli investimenti: cosa devi sapere",
        content: "In Italia, i guadagni sugli investimenti sono tassati. Capire la fiscalità ti aiuta a evitare sorprese e ottimizzare i rendimenti netti.\n\n**Aliquota standard: 26%**\nSi applica a:\n- Capital gain (plusvalenze)\n- Dividendi\n- Interessi obbligazionari\n- Cedole ETF a distribuzione\n\n**Eccezione: 12.5%**\nSi applica a:\n- Titoli di Stato italiani (BTP, BOT)\n- Titoli di Stato white list (Germania, USA, etc.)\n- ETF che contengono prevalentemente titoli di stato\n\n**La buona notizia:** in regime amministrato, il broker gestisce tutto automaticamente.",
      },
      {
        kind: "explain",
        title: "📌 Capital gain vs dividendi",
        content: "Ci sono due modi per guadagnare con gli investimenti:\n\n**Capital gain (plusvalenza):**\n- Compri a 100€, vendi a 130€ → gain 30€\n- Tassato al 26% → paghi 7.80€\n- Netto: 22.20€\n- La tassa si paga SOLO quando vendi\n\n**Dividendi/cedole:**\n- L'azienda/ETF ti paga periodicamente\n- Tassato al 26% alla fonte\n- Netto: ricevi già il valore dopo le tasse\n- La tassa si paga quando ricevi il dividendo\n\n**Implicazione pratica:**\nGli ETF ad accumulazione sono più efficienti fiscalmente: i dividendi vengono reinvestiti senza passare per le tue tasche, quindi niente tasse fino a quando vendi.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Quando paghi le tasse sul capital gain?",
        pollAreas: [
          {
            id: "concept-verify-22",
            prompt: "Seleziona il momento corretto",
            options: [
              "Quando vendi in profitto",
              "Ogni anno a prescindere",
              "Mai - le plusvalenze non sono tassate",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Il capital gain è tassato **solo al momento della vendita in profitto**. Finché non vendi, non devi nulla. Questo è il vantaggio del 'buy and hold'.",
            wrongExplanation: "Non paghi ogni anno e le plusvalenze SONO tassate.\n\n**La regola:** tasse solo quando vendi in profitto. Se compri a 100€ e il valore sale a 200€ ma non vendi, non devi nulla. Vendi a 150€? Paghi il 26% su 50€.",
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🎯 Minusvalenze: come recuperarle",
        content: "Se vendi in perdita, generi una **minusvalenza**. Questa può essere usata per compensare future plusvalenze.\n\n**Come funziona:**\n1. Vendi titolo A in perdita: -1.000€ (minusvalenza)\n2. Vendi titolo B in profitto: +1.500€ (plusvalenza)\n3. Plusvalenza netta: 1.500€ - 1.000€ = 500€\n4. Tasse: 26% su 500€ = 130€ (invece di 390€)\n\n**Limiti importanti:**\n- Le minusvalenze scadono dopo 4 anni\n- Compensano SOLO i capital gain, non i dividendi\n- ETF armonizzati: minusvalenze compensano solo altri ETF armonizzati o azioni\n\n**Strategia:** se hai minusvalenze in scadenza, considera di realizzare plusvalenze per sfruttarle.",
      },
      {
        kind: "question",
        title: "🧠 Verifica: minusvalenze",
        content: "Hai minusvalenze per 2.000€ che scadranno tra 6 mesi. Hai un ETF con plusvalenza latente di 3.000€. Cosa fai?",
        pollAreas: [
          {
            id: "concept-solve-22",
            prompt: "Qual è la strategia fiscale corretta?",
            options: [
              "Valuto di vendere e ricomprare l'ETF per usare le minusvalenze",
              "Non faccio nulla - le minusvalenze si accumulano",
              "Le minusvalenze non servono a nulla",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Vendendo l'ETF realizzi 3.000€ di plusvalenza, ma compensi 2.000€ di minusvalenze. Paghi il 26% solo su 1.000€. Poi ricompri. **Attenzione:** alcuni broker/fiscalisti consigliano di aspettare qualche giorno prima di ricomprare.",
            wrongExplanation: "Le minusvalenze scadono dopo 4 anni. Se non le usi, le perdi.\n\n**La strategia:** realizzare plusvalenze per compensarle. Se hai +3.000€ latenti e -2.000€ di minus in scadenza, vendendo e ricomprando 'resetti' la plusvalenza pagando meno tasse.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco le aliquote", "So come funzionano le minusvalenze", "Ottimizzo la fiscalità"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "integration"],
    blocks: [
      {
        kind: "focus",
        title: "🛠️ Regime amministrato vs dichiarativo in pratica",
        content: "Ecco cosa cambia concretamente:\n\n**Regime amministrato:**\n- Il broker calcola le tasse su ogni operazione\n- Trattiene il 26% (o 12.5%) automaticamente\n- Gestisce le minusvalenze\n- Tu non fai nulla nella dichiarazione dei redditi\n- Disponibile solo con broker italiani\n\n**Regime dichiarativo:**\n- Ricevi report annuale dal broker\n- Devi compilare quadri RW, RT, RM\n- Calcoli tu (o il commercialista) le tasse\n- Paghi con F24 a giugno/luglio\n- Puoi compensare minus tra broker diversi\n- Obbligatorio con broker esteri",
      },
      {
        kind: "explain",
        title: "📌 Dichiarazione dei redditi: i quadri da compilare",
        content: "Se sei in regime dichiarativo, devi conoscere questi quadri:\n\n**Quadro RW - Monitoraggio fiscale:**\n- Valore degli investimenti all'estero\n- Obbligatorio se hai > 15.000€ su broker estero\n- Serve per IVAFE (imposta 0.2% annuo)\n\n**Quadro RT - Capital gain:**\n- Plusvalenze e minusvalenze\n- Calcolo dell'imposta dovuta\n\n**Quadro RM - Dividendi:**\n- Dividendi esteri non già tassati\n- Credito d'imposta per doppie imposizioni\n\n**Il costo:**\n- Commercialista: 200-500€/anno\n- Software fai-da-te: 50-100€ (ma devi sapere cosa fare)\n\n**Consiglio:** se non hai esperienza, usa un commercialista o scegli regime amministrato.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Hai un conto su Trade Republic (broker estero). Devi dichiarare qualcosa?",
        pollAreas: [
          {
            id: "widget-verify-22",
            prompt: "Seleziona l'obbligo corretto",
            options: [
              "Sì - quadri RW, RT, RM nella dichiarazione dei redditi",
              "No - i broker esteri sono esentasse",
              "Solo se supero 100.000€",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Con broker estero sei in **regime dichiarativo obbligato**. Devi compilare i quadri fiscali anche per importi bassi (RW sopra 15.000€, RT/RM sempre se hai operazioni).",
            wrongExplanation: "I broker esteri NON sono esentasse. Semplicemente non gestiscono le tasse per te.\n\n**L'obbligo:** devi dichiarare tu. Se non lo fai, rischi sanzioni.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario pratico",
        content: "Hai 10.000€ su Degiro e 5.000€ su Fineco. Come gestisci la fiscalità?",
        pollAreas: [
          {
            id: "widget-scenario-22",
            prompt: "Quale approccio è corretto?",
            options: [
              "Degiro: dichiarazione (quadri RW, RT, RM). Fineco: automatico (amministrato)",
              "Tutto automatico - i broker si parlano",
              "Tutto in dichiarazione dei redditi",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **Degiro è estero** → regime dichiarativo → devi compilare tu i quadri. **Fineco è italiano** → regime amministrato → gestisce tutto lui. Due sistemi separati.",
            wrongExplanation: "I broker non si parlano.\n\n**La situazione:**\n- Degiro: dichiarativo, compili tu\n- Fineco: amministrato, fa lui\n\nAttenzione: le minusvalenze di un broker non compensano automaticamente le plusvalenze dell'altro.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Capisco i due regimi", "So cosa dichiarare", "Gestisco broker multipli"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      {
        kind: "focus",
        title: "⚡ Ottimizzazione fiscale: strategie lecite",
        content: "Puoi ridurre legalmente il carico fiscale con queste strategie:\n\n**1. ETF ad accumulazione**\n- I dividendi vengono reinvestiti internamente\n- Non paghi il 26% sui dividendi ogni anno\n- Paghi solo quando vendi (differimento)\n\n**2. Holding period lungo**\n- Finché non vendi, non paghi capital gain\n- Il differimento fiscale amplifica il compounding\n\n**3. Compensazione minusvalenze**\n- Usa le perdite per ridurre le tasse sui guadagni\n- Non lasciarle scadere (4 anni)\n\n**4. Titoli di stato**\n- Tassazione 12.5% invece di 26%\n- Utile per la parte obbligazionaria\n\n**5. Timing delle vendite**\n- Realizza plusvalenze quando hai minus da compensare\n- Evita di realizzare tutto nello stesso anno",
      },
      {
        kind: "explain",
        title: "📌 Errori fiscali da evitare",
        content: "Evita questi errori comuni:\n\n**Errore #1: Ignorare le minusvalenze**\n- Scadono dopo 4 anni\n- Se non le usi, le perdi\n\n**Errore #2: Non dichiarare il broker estero**\n- Sanzioni: dal 3% al 15% del valore non dichiarato\n- Possibile anche responsabilità penale\n\n**Errore #3: Confondere i regimi**\n- Pensare che Degiro sia amministrato\n- Pensare che Fineco sia dichiarativo se non opti\n\n**Errore #4: Dimenticare IVAFE**\n- 0.2% annuo sul valore degli investimenti esteri\n- Si paga anche se non hai guadagnato\n\n**Errore #5: Non tenere traccia**\n- Perdere gli estratti conto\n- Non sapere i prezzi di acquisto\n- Difficile ricostruire dopo anni",
      },
      {
        kind: "question",
        title: "🧠 Verifica comprensione",
        content: "Perché gli ETF ad accumulazione sono più efficienti fiscalmente?",
        pollAreas: [
          {
            id: "challenge-verify-22",
            prompt: "Seleziona il motivo corretto",
            options: [
              "I dividendi reinvestiti internamente non sono tassati fino alla vendita",
              "Non pagano mai tasse",
              "Hanno aliquota ridotta al 12.5%",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Negli ETF ad accumulazione, i **dividendi vengono reinvestiti senza passare per le tue tasche**. Non paghi il 26% ogni anno → più soldi che lavorano → più compounding.",
            wrongExplanation: "Anche gli ETF ad accumulazione pagano tasse (quando vendi). Non hanno aliquota ridotta.\n\n**Il vantaggio:** differimento fiscale. Invece di pagare 26% ogni anno sui dividendi, li reinvesti. Paghi tutto alla fine, ma intanto crescono.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Scenario critico",
        content: "Hai broker estero con 50.000€ e non hai mai dichiarato nulla. Cosa rischi?",
        pollAreas: [
          {
            id: "challenge-scenario-22",
            prompt: "Quali sono le conseguenze?",
            options: [
              "Sanzioni dal 3-15% del valore + interessi + possibili conseguenze penali",
              "Nessuna conseguenza se non hai guadagnato",
              "Solo una piccola multa",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! La **mancata dichiarazione** del quadro RW comporta sanzioni pesanti. Anche se non hai guadagnato, devi dichiarare la consistenza. Consulta un commercialista per regolarizzare.",
            wrongExplanation: "Anche senza guadagni, devi dichiarare le consistenze estere.\n\n**Le sanzioni:**\n- Omessa dichiarazione RW: 3-15% del valore\n- Omesso versamento imposte: 30% + interessi\n- Casi gravi: rilevanza penale\n\nMeglio regolarizzare subito.",
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
        title: "🧠 Quiz finale: fiscalità degli investimenti",
        content: "Hai imparato le aliquote, la differenza tra capital gain e dividendi, le minusvalenze, e i due regimi fiscali.\n\n**Concetti chiave:**\n- Aliquota standard: 26% (12.5% per titoli di stato)\n- Capital gain tassato alla vendita\n- Minusvalenze compensano (scadenza 4 anni)\n- Amministrato = semplice; Dichiarativo = fai da te\n- ETF accumulazione = più efficienti\n\nVerifichiamo la comprensione.",
      },
      {
        kind: "question",
        title: "❓ Domanda 1",
        content: "Qual è l'aliquota fiscale standard sugli investimenti finanziari in Italia?",
        pollAreas: [
          {
            id: "quiz-q1-22",
            prompt: "Seleziona l'aliquota corretta",
            options: [
              "26% (12.5% per titoli di stato)",
              "20%",
              "Dipende dal reddito",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! **26%** è l'aliquota standard per capital gain, dividendi, interessi. I titoli di stato italiani e white list godono del **12.5%**.",
            wrongExplanation: "L'aliquota non dipende dal reddito (è proporzionale, non progressiva).\n\n**Le aliquote:**\n- 26%: azioni, ETF, obbligazioni corporate\n- 12.5%: BTP, titoli di stato white list",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 2",
        content: "Le minusvalenze:",
        pollAreas: [
          {
            id: "quiz-q2-22",
            prompt: "Seleziona l'affermazione corretta",
            options: [
              "Compensano le plusvalenze e scadono dopo 4 anni",
              "Si accumulano per sempre",
              "Compensano anche i dividendi",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Le minusvalenze **compensano le plusvalenze** (non i dividendi) e **scadono dopo 4 anni**. Usale prima che scadano.",
            wrongExplanation: "Le minusvalenze non compensano i dividendi e scadono.\n\n**Regole:**\n- Compensano SOLO capital gain\n- Scadenza: 4 anni\n- Se non le usi, le perdi",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 3",
        content: "Con un broker estero (es. Degiro, Trade Republic) sei in:",
        pollAreas: [
          {
            id: "quiz-q3-22",
            prompt: "Seleziona il regime corretto",
            options: [
              "Regime dichiarativo - devi compilare tu la dichiarazione dei redditi",
              "Regime amministrato - il broker gestisce tutto",
              "Nessun regime - i broker esteri sono esentasse",
            ],
            correctIndex: 0,
            correctExplanation: "Perfetto! I broker esteri non sono sostituti d'imposta in Italia. Sei **obbligatoriamente in regime dichiarativo**: devi compilare RW, RT, RM.",
            wrongExplanation: "I broker esteri NON gestiscono le tasse italiane e NON sono esentasse.\n\n**Regime dichiarativo:** devi dichiarare tutto tu (o con commercialista). Sanzioni se non lo fai.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Conosco le aliquote", "So gestire le minusvalenze", "Capisco i regimi fiscali"],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "✅ Cosa hai imparato: fiscalità degli investimenti",
        content: "Complimenti! Hai completato la lezione sulla fiscalità.\n\n**Principi chiave:**\n\n1. **Aliquote:** 26% standard, 12.5% titoli di stato\n2. **Capital gain:** tassato alla vendita\n3. **Minusvalenze:** compensano plusvalenze, scadono in 4 anni\n4. **Regimi:** amministrato (semplice) vs dichiarativo (broker estero)\n5. **Ottimizzazione:** ETF accumulazione, differimento, compensazione\n\nQuesta è l'ultima lezione della sezione 'Strumenti'. Ora sei pronto per esplorare asset alternativi.",
      },
      {
        kind: "explain",
        title: "📌 Riepilogo pratico",
        content: "Come applicare questa conoscenza:\n\n**Se usi broker italiano (Fineco, Directa):**\n- Regime amministrato attivo di default\n- Non devi fare nulla in dichiarazione\n- Monitora le minusvalenze nell'area dedicata\n\n**Se usi broker estero (Degiro, IBKR, TR):**\n- Devi dichiarare ogni anno\n- Conserva tutti gli estratti conto\n- Valuta un commercialista\n\n**Per ottimizzare:**\n- Preferisci ETF ad accumulazione\n- Usa le minusvalenze prima che scadano\n- Non vendere inutilmente (differimento)\n\n**Quando chiedere aiuto:**\n- Situazioni complesse (eredità, espatrio)\n- Dubbi su cosa dichiarare\n- Primo anno con broker estero",
      },
      {
        kind: "question",
        title: "🎯 Il tuo prossimo passo",
        content: "Cosa farai con questa conoscenza?",
        pollAreas: [
          {
            id: "feedback-action-22",
            prompt: "Indica il tuo prossimo passo",
            options: [
              "Verifico il mio regime fiscale attuale",
              "Controllo se ho minusvalenze da usare",
              "Procedo alla sezione sugli asset alternativi",
            ],
            correctIndex: 0,
            correctExplanation: "Ottimo! **Verificare il regime** è fondamentale. Se hai broker estero senza aver mai dichiarato, è meglio regolarizzare prima possibile.",
            wrongExplanation: "Tutte le azioni sono valide!\n\n- Verificare il regime: priorità se hai dubbi\n- Controllare minus: per non perderle\n- Continuare il corso: per completare la formazione\n\nL'importante è essere consapevole della propria situazione fiscale.",
            allowText: false,
          },
        ],
      },
    ],
    suggestedPrompts: [
      "Come verifico se ho minusvalenze da usare?",
      "Devo dichiarare il mio conto Degiro?",
      "Quale ETF è più efficiente fiscalmente?",
    ],
  },
};

const lesson22Definition = createStaticLessonDefinition("22", content);

export default lesson22Definition;
