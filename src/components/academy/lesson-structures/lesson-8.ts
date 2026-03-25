import { createStaticLessonDefinition } from "./defaultLessonDefinition";
import type { StructuredLessonContent } from "./types";

const content: StructuredLessonContent = {
  concept: {
    nodeKey: "concept",
    criteria: ["foundational", "caring"],
    blocks: [
      {
        kind: "focus",
        title: "💡 Cos'è davvero un investimento?",
        content: "Hai costruito le fondamenta: budget, risparmio, debiti, obiettivi, fondo emergenza e assicurazioni. Ora inizia il percorso sugli **investimenti**.\n\nMa prima di parlare di azioni, obbligazioni o ETF, devi capire una distinzione fondamentale: **investire non è speculare**.\n\n**Investire** significa comprare valore economico con una **tesi verificabile**. Acquisti qualcosa perché genera utili, dividendi, interessi - valore reale nel tempo.\n\n**Speculare** significa scommettere su un **movimento di prezzo**. Compri perché pensi che il prezzo salirà, senza una tesi sul valore sottostante.\n\n**Esempio:**\n• Investimento: compri un ETF azionario perché le aziende al suo interno generano utili crescenti\n• Speculazione: compri un asset perché 'sta salendo' e 'ne parlano tutti'\n\nQuesta distinzione determina il tipo di rischio che assumi.",
      },
      {
        kind: "explain",
        title: "📌 Perché la distinzione è fondamentale",
        content: "La differenza tra investimento e speculazione determina il **tipo di rischio** che corri:\n\n**Rischio dell'investitore:**\n• Volatilità temporanea (il prezzo oscilla ma il valore sottostante cresce)\n• Possibile perdita se la tesi era sbagliata\n• Tempo come alleato: più aspetti, più il valore emerge\n\n**Rischio dello speculatore:**\n• Perdita permanente di capitale se il timing è sbagliato\n• Nessuna rete di sicurezza: il prezzo è l'unica cosa che conta\n• Tempo come nemico: ogni giorno può andare contro di te\n\n**La regola pratica:**\nPrima di acquistare qualsiasi asset, scrivi in 2 righe:\n1. Perché questo asset genera valore?\n2. Quando la mia tesi diventa falsa?\n\nSe non riesci a rispondere, stai speculando, non investendo.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Qual è la differenza fondamentale tra investire e speculare?",
        pollAreas: [
          {
            id: "concept-verify-8",
            prompt: "Seleziona la risposta corretta",
            options: [
              "Investire si basa su una tesi verificabile sul valore; speculare sul movimento del prezzo",
              "Investire è per i ricchi, speculare per tutti",
              "Non c'è differenza, sono sinonimi",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! **Investire** = acquistare valore con una tesi verificabile.\n**Speculare** = scommettere sul movimento del prezzo.\n\nL'investitore si chiede: 'Questo asset genera valore?'\nLo speculatore si chiede: 'Il prezzo salirà?'",
            wrongExplanation: "La differenza è fondamentale:\n\n**Investire**: comprare valore economico reale (utili, dividendi, interessi) con una tesi che puoi verificare\n\n**Speculare**: scommettere che il prezzo si muoverà nella direzione che speri\n\nNon c'entra la ricchezza. C'entra l'approccio mentale.",
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🚫 L'errore più comune: confondere prezzo e valore",
        content: "L'errore più frequente è confondere un **titolo che sale** con un **buon investimento**.\n\n**Esempio di trappola:**\nUn'azione passa da 10€ a 30€ in 6 mesi. Tutti ne parlano, i social esplodono. Tu compri a 30€ pensando 'sta salendo, non posso perdere!'\n\nMa non hai verificato:\n• L'azienda fa utili?\n• Il prezzo è ragionevole rispetto agli utili?\n• C'è una ragione per cui il valore dovrebbe crescere?\n\nSe non puoi rispondere, stai comprando **solo perché sale**. Questo è speculare.\n\n**Cosa succede spesso:**\nQuando il sentiment cambia, il prezzo crolla. Chi ha comprato senza tesi vende in panico. Chi aveva una tesi solida può valutare se la tesi è ancora valida.\n\n**La regola:** non comprare mai qualcosa solo perché il prezzo sta salendo.",
      },
      {
        kind: "question",
        title: "🧠 Verifica: distinguere investimento da speculazione",
        content:
          "Scenario: un titolo fa +35% in 6 settimane.\n\nNon trovi miglioramenti nei fondamentali dell'azienda (utili, fatturato, margini stabili).",
        pollAreas: [
          {
            id: "concept-solve-8",
            prompt: "Cosa fai?",
            options: [
              "Resto fuori finché non ho una tesi e un prezzo coerenti",
              "Compro una quota per non perdere il treno",
              "Entro e incremento se continua a salire",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Senza tesi verificabile e senza un prezzo ragionevole rispetto al valore, **restare fuori** è la scelta da investitore.\n\nComprare 'per non perdere il treno' è speculazione pura.",
            wrongExplanation: "La risposta corretta è **restare fuori** finché non hai:\n\n1. Una **tesi verificabile**: perché questo asset genera valore?\n2. Un **prezzo ragionevole**: il prezzo attuale è coerente con il valore?\n\n'Non perdere il treno' è emotività, non investimento. Spesso il treno va a sbattere.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Definisco la mia tesi", "Verifico i fondamentali", "Distinguo prezzo da valore"],
  },
  widget: {
    nodeKey: "widget",
    criteria: ["application", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "🛠️ Come costruire una tesi d'investimento",
        content: "Una **tesi d'investimento** è la ragione per cui compri un asset. Deve essere:\n\n**1. Verificabile**\nDeve basarsi su fatti che puoi controllare: utili, fatturato, margini, dividendi, tasso di crescita.\n\n**2. Falsificabile**\nDevi sapere quando la tesi diventa falsa. Es: 'Compro finché i margini restano sopra il 15%'\n\n**3. Scritta**\nScrivere la tesi ti costringe a pensare. 'Mi sembra buono' non è una tesi.\n\n**Esempio di tesi ben fatta:**\n'Compro questo ETF azionario globale perché storicamente le aziende mondiali hanno generato rendimenti reali del 5-7% annuo. La mia tesi diventa falsa se l'economia globale entra in declino strutturale permanente (non una recessione temporanea).'\n\n**Esempio di non-tesi:**\n'Compro perché sta salendo e ne parlano tutti.'",
      },
      {
        kind: "explain",
        title: "📌 I tre criteri minimi pre-acquisto",
        content: "Prima di comprare qualsiasi asset, verifica questi **tre criteri minimi**:\n\n**1. Tesi verificabile**\nPerché questo asset genera valore? Puoi dimostrarlo con dati?\n\n**2. Valutazione ragionevole**\nIl prezzo che paghi è coerente con il valore? Non basta che l'asset sia 'buono' - deve essere a un prezzo sensato.\n\n**3. Rischio downside**\nCosa può andare storto? Quanto puoi perdere? Puoi sopportare quella perdita?\n\n**La regola:**\nSe un'idea non passa tutti e tre i criteri, **non comprare**.\n\nMeglio perdere un'opportunità che perdere capitale. Le opportunità tornano sempre. Il capitale perso no.\n\nQuesto approccio metodico è lo stesso delle lezioni precedenti: criteri definiti in anticipo battono le decisioni emotive.",
      },
      {
        kind: "question",
        title: "🧠 Verifica veloce",
        content: "Quale elemento rende una tesi d'investimento valida?",
        pollAreas: [
          {
            id: "widget-verify-8",
            prompt: "Seleziona la caratteristica chiave",
            options: [
              "Deve essere verificabile con dati e falsificabile",
              "Deve essere positiva e ottimista",
              "Deve essere condivisa da molte persone",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Una tesi valida è **verificabile** (puoi controllarla con dati) e **falsificabile** (sai quando diventa falsa).\n\n'Tutti la pensano così' non è un criterio. L'ottimismo non è una tesi.",
            wrongExplanation: "Una tesi valida ha due caratteristiche fondamentali:\n\n**1. Verificabile**: basata su fatti che puoi controllare (utili, margini, crescita)\n**2. Falsificabile**: sai quando la tesi diventa falsa e devi vendere\n\nIl consenso popolare o l'ottimismo non rendono valida una tesi.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Verifica: applicazione dei criteri",
        content:
          "Ti propongono di investire in un nuovo fondo.\n\nI tre criteri minimi pre-acquisto sono:\n1) Tesi verificabile\n2) Valutazione ragionevole\n3) Rischio downside",
        pollAreas: [
          {
            id: "widget-scenario-8",
            prompt: "Cosa fai se il fondo non passa il criterio 2 (valutazione ragionevole)?",
            options: [
              "Non compro, anche se tesi e rischio sono ok",
              "Compro comunque, 2 su 3 è sufficiente",
              "Chiedo a un amico cosa ne pensa",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Se anche **un solo criterio** non passa, non compri.\n\nUn asset 'buono' a un prezzo eccessivo non è un buon investimento. Paghi per valore, non per qualità astratta.",
            wrongExplanation: "I tre criteri sono **tutti necessari**:\n\n• Tesi senza valutazione = potresti pagare troppo\n• Valutazione senza tesi = non sai perché compri\n• Senza analisi del rischio = non sai cosa può andare storto\n\nSe manca anche solo un criterio, l'acquisto è rischioso.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Scrivo la mia tesi", "Verifico i tre criteri", "Definisco quando vendere"],
  },
  challenge: {
    nodeKey: "challenge",
    criteria: ["learning", "application"],
    blocks: [
      {
        kind: "focus",
        title: "⚡ Le fasi euforiche: quando tutti comprano",
        content: "Le fasi euforiche di mercato sono i momenti più pericolosi per chi non distingue investimento da speculazione.\n\n**Come funziona l'euforia:**\n\n1. Un asset inizia a salire\n2. I media ne parlano, i social esplodono\n3. Sempre più persone comprano 'per non perdere il treno'\n4. Il prezzo sale ancora (ma non il valore sottostante)\n5. A un certo punto il sentiment cambia\n6. Chi ha comprato senza tesi vende in panico\n7. Il prezzo crolla\n\n**Il caso tipico:**\nDurante fasi euforiche, molti comprano società senza utili solo perché salgono. 'Non può scendere, guarda quanto sta salendo!'\n\nQuando il sentiment cambia, il prezzo crolla e non c'è nessun valore sottostante a cui aggrapparsi.\n\n**La protezione:** una tesi verificabile ti permette di valutare se il prezzo riflette il valore. Se non lo fa, resti fuori.",
      },
      {
        kind: "explain",
        title: "📌 Come resistere alla FOMO",
        content: "**FOMO** (Fear Of Missing Out) è la paura di perdere un'opportunità. È l'emozione che ti spinge a comprare 'perché tutti lo stanno facendo'.\n\n**Come resistere alla FOMO:**\n\n**1. Applica i tre criteri**\nOgni volta che senti FOMO, fermati e verifica: tesi verificabile? Valutazione ragionevole? Rischio downside?\n\n**2. Scrivi la tesi**\nSe non riesci a scrivere in 2 righe perché stai comprando, è FOMO, non investimento.\n\n**3. Aspetta 48 ore**\nLa FOMO è urgente ('devo comprare ORA!'). L'investimento intelligente non lo è. Se dopo 48 ore la tesi è ancora valida, puoi procedere.\n\n**4. Ricorda le opportunità mancate che non ti hanno rovinato**\nHai 'perso' mille treni nella vita. Sei ancora qui. Le opportunità tornano. Il capitale perso no.\n\n**La regola:** se senti urgenza di comprare, è quasi sempre FOMO.",
      },
      {
        kind: "question",
        title: "🧠 Verifica comprensione",
        content: "Come riconosci se stai investendo o speculando?",
        pollAreas: [
          {
            id: "challenge-verify-8",
            prompt: "Seleziona il segnale chiave",
            options: [
              "Ho una tesi scritta e verificabile con criteri di uscita",
              "Sto guadagnando, quindi è un investimento",
              "Mi sento sicuro, quindi è un investimento",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Il segnale che distingue investimento da speculazione è avere una **tesi scritta, verificabile, con criteri di uscita**.\n\nGuadagnare non significa investire bene. Puoi guadagnare speculando (per un po').",
            wrongExplanation: "Il segnale chiave è la **tesi scritta e verificabile**:\n\n• Perché questo asset genera valore?\n• A quale prezzo è ragionevole?\n• Quando la tesi diventa falsa?\n\nGuadagnare o 'sentirsi sicuri' non significano nulla. Puoi guadagnare speculando fino al giorno in cui perdi tutto.",
            allowText: false,
          },
        ],
      },
      {
        kind: "focus",
        title: "🛡️ La checklist dell'investitore intelligente",
        content: "Prima di acquistare qualsiasi asset, completa questa **checklist**:\n\n**1. Tesi verificabile**\n'Perché questo asset genera valore?' Risposta in 2 righe, basata su dati.\n\n**2. Valutazione ragionevole**\n'Il prezzo attuale è coerente con il valore?' Confronta con metriche oggettive.\n\n**3. Rischio downside**\n'Cosa può andare storto? Quanto posso perdere?' Quantifica il rischio.\n\n**4. Orizzonte coerente**\n'Per quanto tempo devo tenere questo asset perché la tesi si realizzi?' Il tuo orizzonte deve essere compatibile.\n\n**La regola:**\nSe anche solo un punto non passa, **non comprare**.\n\nMeglio perdere un'opportunità che perdere capitale. Le opportunità tornano sempre. Il capitale perso richiede rendimenti enormi per essere recuperato (perdere 50% significa dover guadagnare 100% per tornare in pari).",
      },
      {
        kind: "question",
        title: "🧠 Verifica: applicazione della checklist",
        content:
          "Un amico ti consiglia un titolo:\n'È salito del 200% quest'anno, non puoi perdertelo!'\n\nNon conosci l'azienda né i suoi fondamentali.",
        pollAreas: [
          {
            id: "challenge-scenario-8",
            prompt: "Cosa rispondi?",
            options: [
              "Prima verifico fondamentali e valutazione, poi decido",
              "Compro subito per non perdere il treno",
              "Se è salito così tanto deve essere buono",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Prima di qualsiasi acquisto, **verifichi i fondamentali**.\n\n'È salito' non è una tesi. '+200%' potrebbe significare che ora è sopravvalutato, non che continuerà a salire.",
            wrongExplanation: "La risposta corretta è **verificare prima di decidere**.\n\n• Un titolo salito del 200% potrebbe essere sopravvalutato\n• 'Non perdere il treno' è FOMO, non analisi\n• Senza tesi verificabile stai speculando\n\nLe opportunità perse non ti rovinano. Gli acquisti emotivi sì.",
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
        title: "🧠 Quiz finale: investitore o speculatore?",
        content: "Hai imparato la differenza tra investire e speculare, come costruire una tesi verificabile, e come resistere alla FOMO.\n\nOra mettiamo tutto insieme.\n\n**Ricorda i principi chiave:**\n• Investire = comprare valore con tesi verificabile\n• Speculare = scommettere su movimenti di prezzo\n• I tre criteri: tesi, valutazione, rischio downside\n• La checklist prima di ogni acquisto\n• FOMO è il nemico dell'investitore intelligente",
      },
      {
        kind: "explain",
        title: "📌 Come rispondere: tesi, criteri, disciplina",
        content: "Quando rispondi alle domande sull'investimento, applica questo **metodo**:\n\n**Step 1: Ho una tesi verificabile?**\nPosso spiegare in 2 righe perché questo asset genera valore?\n\n**Step 2: Passano i tre criteri?**\nTesi + Valutazione + Rischio = tutti devono essere verificati\n\n**Step 3: Sto decidendo con calma o con urgenza?**\nL'urgenza è quasi sempre FOMO. L'investimento intelligente non ha fretta.\n\nSe una risposta ignora la tesi e si basa su 'sta salendo' o 'lo fanno tutti', è speculazione.\n\nQuesto approccio disciplinato è la base di tutto il percorso sugli investimenti.",
      },
      {
        kind: "question",
        title: "❓ Domanda 1",
        content: "Quale frase descrive meglio un investimento intelligente?",
        pollAreas: [
          {
            id: "quiz-q1-8",
            prompt: "Seleziona la risposta corretta",
            options: [
              "Acquisto con margine di sicurezza e tesi verificabile",
              "Acquisto perché il prezzo sta salendo",
              "Acquisto perché ne parlano tutti",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Un investimento intelligente si basa su **tesi verificabile** e **margine di sicurezza** (pagare meno del valore stimato).\n\n'Sta salendo' e 'ne parlano tutti' sono segnali di speculazione.",
            wrongExplanation: "L'investimento intelligente richiede:\n\n**1. Tesi verificabile**: perché genera valore?\n**2. Margine di sicurezza**: pago meno del valore stimato\n\n'Sta salendo' è momentum, non valore.\n'Ne parlano tutti' è consenso, non analisi.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "❓ Domanda 2",
        content: "Prima di acquistare un asset, cosa devi avere scritto?",
        pollAreas: [
          {
            id: "quiz-q2-8",
            prompt: "Seleziona l'elemento essenziale",
            options: [
              "Tesi in 2 righe + criterio di uscita",
              "Solo il target di prezzo",
              "Niente, si decide sul momento",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Prima di comprare devi avere **scritto**:\n\n• Tesi in 2 righe: perché genera valore\n• Criterio di uscita: quando la tesi diventa falsa\n\nSenza questo, stai speculando.",
            wrongExplanation: "Gli elementi essenziali da scrivere sono:\n\n**1. Tesi**: perché questo asset genera valore?\n**2. Criterio di uscita**: quando vendo perché la tesi è falsa?\n\nSolo il target di prezzo è speculazione. 'Sul momento' è emotività pura.",
            allowText: false,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Verifica: la tua regola d'investimento",
        content:
          "Hai definito tre criteri minimi pre-acquisto:\n1) Tesi verificabile\n2) Valutazione ragionevole\n3) Rischio downside",
        pollAreas: [
          {
            id: "quiz-scenario-8",
            prompt: "Cosa fai con questi criteri?",
            options: [
              "Li applico a ogni acquisto senza eccezioni",
              "Li applico solo per investimenti grandi",
              "Li ignoro se mi sento sicuro",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! I criteri si applicano a **ogni acquisto, senza eccezioni**.\n\nGli errori spesso vengono dagli 'acquisti piccoli' fatti senza metodo.",
            wrongExplanation: "I criteri vanno applicati **sempre**, per ogni acquisto:\n\n• Gli errori 'piccoli' si accumulano\n• 'Sentirsi sicuri' non sostituisce l'analisi\n• La disciplina è ciò che distingue investitori da speculatori\n\nNessuna eccezione.",
            allowText: false,
          },
        ],
      },
    ],
    options: ["Scrivo la mia tesi", "Definisco i criteri", "Pianifico la disciplina"],
  },
  feedback: {
    nodeKey: "feedback",
    criteria: ["human", "learning"],
    blocks: [
      {
        kind: "focus",
        title: "✅ Cosa hai imparato: la mentalità dell'investitore",
        content: "Complimenti! Hai completato la prima lezione sugli investimenti.\n\n**Cosa hai imparato:**\n• La differenza fondamentale tra investire e speculare\n• Come costruire una tesi verificabile\n• I tre criteri minimi pre-acquisto\n• Come resistere alla FOMO\n• La checklist dell'investitore intelligente\n\n**Perché questo conta:**\nQuesta mentalità è il fondamento di tutto ciò che imparerai sugli investimenti. Senza distinguere investimento da speculazione, ogni strumento (azioni, obbligazioni, ETF) può diventare una scommessa.\n\nNelle prossime lezioni vedrai rischio e rendimento, interesse composto, diversificazione e strumenti specifici. Ma tutto si basa su questa distinzione fondamentale.",
      },
      {
        kind: "explain",
        title: "📌 Il tuo piano d'azione",
        content: "Ecco cosa fare da oggi:\n\n**1. Definisci 3 criteri minimi pre-acquisto**\nScrivi i tuoi criteri personali. Devono essere specifici e misurabili.\n\n**2. Rifiuta ogni idea che non supera i 3 criteri**\nNessuna eccezione. Se non passa i criteri, non compri.\n\n**3. Rivedi i criteri ogni 30 giorni**\nI criteri possono evolversi con la tua esperienza. Ma devono sempre esistere.\n\n**La regola d'oro:**\nMeglio perdere un'opportunità che perdere capitale.\n\nLe opportunità tornano sempre. Il capitale perso richiede rendimenti enormi per essere recuperato. Questo principio guiderà tutto il tuo percorso di investimento.",
      },
      {
        kind: "question",
        title: "🎯 Il tuo primo impegno",
        content: "Quale azione inizi oggi per applicare questa lezione?",
        pollAreas: [
          {
            id: "feedback-rule-8",
            prompt: "Seleziona la tua prima azione",
            options: [
              "Scrivo 3 criteri pre-acquisto personali",
              "Rivedo un acquisto passato con i nuovi criteri",
              "Mi impegno ad aspettare 48h prima di ogni acquisto",
            ],
            allowText: true,
          },
        ],
      },
      {
        kind: "question",
        title: "🧠 Verifica finale: il tuo sistema",
        content:
          "Per distinguere sempre investimento da speculazione hai bisogno di un sistema.",
        pollAreas: [
          {
            id: "feedback-sistema-8",
            prompt: "Quali elementi deve contenere il tuo sistema?",
            options: [
              "Criteri scritti + tesi per ogni acquisto + revisione periodica",
              "Solo intuito e fiducia nei consigli",
              "Seguire cosa fanno gli altri investitori",
            ],
            correctIndex: 0,
            correctExplanation: "Esatto! Il tuo sistema deve avere:\n\n• **Criteri scritti**: decidono se comprare o no\n• **Tesi per ogni acquisto**: perché stai comprando\n• **Revisione periodica**: i criteri evolvono con te\n\nQuesto sistema ti protegge dalle decisioni emotive.",
            wrongExplanation: "Un sistema solido richiede:\n\n**1. Criteri scritti**: regole chiare pre-acquisto\n**2. Tesi per ogni acquisto**: motivazione verificabile\n**3. Revisione periodica**: aggiornamento dei criteri\n\nIntuito e 'seguire gli altri' sono ricette per speculare, non investire.",
            allowText: false,
          },
        ],
      },
    ],
    suggestedPrompts: [
      "Aiutami a scrivere i miei 3 criteri pre-acquisto",
      "Come faccio a verificare se una tesi è solida?",
      "Quali segnali indicano che sto speculando invece di investire?",
    ],
  },
};

const lesson8Definition = createStaticLessonDefinition("8", content);

export default lesson8Definition;
