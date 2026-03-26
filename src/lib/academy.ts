export type AcademySection = {
  id: string;
  slug: string;
  title: string;
  description: string;
  sortOrder: number;
};

export type AcademyLessonMeta = {
  emoji: string;
};

export const DEFAULT_LESSON_TITLES: Record<string, string> = {
<<<<<<< HEAD
  "1": "Cos'e un budget?",
  "2": "Risparmiare senza fatica",
  "3": "Debiti buoni e cattivi",
  "4": "Che cos'e un investimento?",
  "5": "I fondi spiegati semplice",
  "6": "Rischio: non e una parolaccia",
  "7": "Fondo emergenza: perche serve",
  "8": "Assicurazioni in parole povere",
  "9": "Investimento vs Speculazione",
  "10": "Risultati attesi e obiettivi realistici",
  "11": "Inflazione e potere d'acquisto",
  "12": "Asset allocation e ribilanciamento",
  "13": "Profilo Defensive Investor",
  "14": "Profilo Enterprising Investor",
  "15": "Mr. Market e volatilita",
  "16": "Fondi e index investing",
  "17": "Analisi di bilancio per investitori",
  "18": "Selezione titoli: difensivo vs intraprendente",
  "19": "Errori tipici dell'investitore",
  "20": "Margin of safety",
=======
  // LIVELLO 1: FONDAMENTA (7 lezioni)
  "1": "Cos'è la finanza personale",
  "2": "Budget e controllo del cash flow",
  "3": "Risparmio automatico e abitudini",
  "4": "Debiti buoni vs cattivi",
  "5": "Obiettivi finanziari SMART",
  "6": "Fondo emergenza",
  "7": "Assicurazioni essenziali",
  // LIVELLO 2: CONCETTI D'INVESTIMENTO (6 lezioni)
  "8": "Cos'è un investimento (vs speculazione)",
  "9": "Rischio e rendimento",
  "10": "L'interesse composto",
  "11": "La diversificazione",
  "12": "Orizzonte temporale e obiettivi",
  "13": "Profilo investitore: difensivo vs intraprendente",
  // LIVELLO 3: STRUMENTI TRADIZIONALI (9 lezioni)
  "14": "Azioni: cosa sono e come funzionano",
  "15": "Analisi fondamentale base",
  "16": "Obbligazioni e reddito fisso",
  "17": "Fondi comuni d'investimento",
  "18": "ETF: cosa sono",
  "19": "ETF: come sceglierli",
  "20": "Indici di mercato (S&P 500, MSCI, etc)",
  "21": "Broker, costi e commissioni",
  "22": "Fiscalità degli investimenti (Italia)",
  // LIVELLO 4: ASSET ALTERNATIVI (6 lezioni)
  "23": "Crypto: blockchain e Bitcoin",
  "24": "Altcoin, token e smart contract",
  "25": "DeFi e staking (basics)",
  "26": "Commodities (oro, petrolio, etc)",
  "27": "Real Estate e REIT",
  "28": "Rischi degli asset alternativi",
  // LIVELLO 5: MACROECONOMIA (6 lezioni)
  "29": "Inflazione e potere d'acquisto",
  "30": "Tassi d'interesse e loro impatto",
  "31": "Banche centrali e politica monetaria",
  "32": "Cicli economici",
  "33": "Indicatori economici chiave",
  "34": "Geopolitica e mercati",
  // LIVELLO 6: STRATEGIE (6 lezioni)
  "35": "Asset allocation e ribilanciamento",
  "36": "Dollar Cost Averaging (PAC)",
  "37": "Value investing",
  "38": "Margin of safety",
  "39": "Mr. Market e psicologia",
  "40": "Errori comuni dell'investitore",
>>>>>>> 6c8f038a135601d721670ce50a860c69236251e8
};

export const DEFAULT_SECTION_SEED: Array<Pick<AcademySection, "slug" | "title" | "description" | "sortOrder">> = [
  {
    slug: "fondamenta",
    title: "Fondamenta",
    description: "Le basi della gestione finanziaria personale",
    sortOrder: 10,
  },
  {
    slug: "investire",
    title: "Concetti d'Investimento",
    description: "I principi fondamentali per iniziare a investire",
    sortOrder: 20,
  },
  {
    slug: "strumenti",
    title: "Strumenti Tradizionali",
    description: "Azioni, obbligazioni, fondi ed ETF spiegati",
    sortOrder: 30,
  },
  {
<<<<<<< HEAD
    slug: "intelligent-investor",
    title: "The Intelligent Investor",
    description: "Lezioni pratiche dai principi di Benjamin Graham",
    sortOrder: 40,
  },
];

export const DEFAULT_SECTION_SLUG_BY_LESSON_ID: Record<string, string> = {
  "1": "basics",
  "2": "basics",
  "3": "basics",
  "4": "investing",
  "5": "investing",
  "6": "investing",
  "7": "protection",
  "8": "protection",
  "9": "intelligent-investor",
  "10": "intelligent-investor",
  "11": "intelligent-investor",
  "12": "intelligent-investor",
  "13": "intelligent-investor",
  "14": "intelligent-investor",
  "15": "intelligent-investor",
  "16": "intelligent-investor",
  "17": "intelligent-investor",
  "18": "intelligent-investor",
  "19": "intelligent-investor",
  "20": "intelligent-investor",
};

export const ACADEMY_LESSON_META: Record<string, AcademyLessonMeta> = {
  "1": { emoji: "📊" },
  "2": { emoji: "🪴" },
  "3": { emoji: "⚖️" },
  "4": { emoji: "🌱" },
  "5": { emoji: "🧺" },
  "6": { emoji: "🎲" },
  "7": { emoji: "🆘" },
  "8": { emoji: "☂️" },
  "9": { emoji: "🧭" },
  "10": { emoji: "🎯" },
  "11": { emoji: "🛒" },
  "12": { emoji: "⚓" },
  "13": { emoji: "🛡️" },
  "14": { emoji: "🏗️" },
  "15": { emoji: "📉" },
  "16": { emoji: "🧺" },
  "17": { emoji: "📑" },
  "18": { emoji: "🔎" },
  "19": { emoji: "🧠" },
  "20": { emoji: "🧱" },
=======
    slug: "alternativi",
    title: "Asset Alternativi",
    description: "Crypto, commodities e real estate",
    sortOrder: 40,
  },
  {
    slug: "macro",
    title: "Macroeconomia",
    description: "Inflazione, tassi e cicli economici",
    sortOrder: 50,
  },
  {
    slug: "strategie",
    title: "Strategie",
    description: "Asset allocation, value investing e gestione del rischio",
    sortOrder: 60,
  },
];

export const DEFAULT_SECTION_SLUG_BY_LESSON_ID: Record<string, string> = {
  // LIVELLO 1: FONDAMENTA
  "1": "fondamenta",
  "2": "fondamenta",
  "3": "fondamenta",
  "4": "fondamenta",
  "5": "fondamenta",
  "6": "fondamenta",
  "7": "fondamenta",
  // LIVELLO 2: CONCETTI D'INVESTIMENTO
  "8": "investire",
  "9": "investire",
  "10": "investire",
  "11": "investire",
  "12": "investire",
  "13": "investire",
  // LIVELLO 3: STRUMENTI TRADIZIONALI
  "14": "strumenti",
  "15": "strumenti",
  "16": "strumenti",
  "17": "strumenti",
  "18": "strumenti",
  "19": "strumenti",
  "20": "strumenti",
  "21": "strumenti",
  "22": "strumenti",
  // LIVELLO 4: ASSET ALTERNATIVI
  "23": "alternativi",
  "24": "alternativi",
  "25": "alternativi",
  "26": "alternativi",
  "27": "alternativi",
  "28": "alternativi",
  // LIVELLO 5: MACROECONOMIA
  "29": "macro",
  "30": "macro",
  "31": "macro",
  "32": "macro",
  "33": "macro",
  "34": "macro",
  // LIVELLO 6: STRATEGIE
  "35": "strategie",
  "36": "strategie",
  "37": "strategie",
  "38": "strategie",
  "39": "strategie",
  "40": "strategie",
};

export const ACADEMY_LESSON_META: Record<string, AcademyLessonMeta> = {
  // LIVELLO 1: FONDAMENTA
  "1": { emoji: "🏠" },
  "2": { emoji: "📊" },
  "3": { emoji: "🪴" },
  "4": { emoji: "⚖️" },
  "5": { emoji: "🎯" },
  "6": { emoji: "🆘" },
  "7": { emoji: "☂️" },
  // LIVELLO 2: CONCETTI D'INVESTIMENTO
  "8": { emoji: "🌱" },
  "9": { emoji: "🎲" },
  "10": { emoji: "📈" },
  "11": { emoji: "🧺" },
  "12": { emoji: "⏳" },
  "13": { emoji: "🛡️" },
  // LIVELLO 3: STRUMENTI TRADIZIONALI
  "14": { emoji: "📈" },
  "15": { emoji: "📑" },
  "16": { emoji: "📜" },
  "17": { emoji: "🧺" },
  "18": { emoji: "📦" },
  "19": { emoji: "🔍" },
  "20": { emoji: "📊" },
  "21": { emoji: "🏦" },
  "22": { emoji: "🧾" },
  // LIVELLO 4: ASSET ALTERNATIVI
  "23": { emoji: "₿" },
  "24": { emoji: "🪙" },
  "25": { emoji: "🔗" },
  "26": { emoji: "🛢️" },
  "27": { emoji: "🏠" },
  "28": { emoji: "⚠️" },
  // LIVELLO 5: MACROECONOMIA
  "29": { emoji: "🛒" },
  "30": { emoji: "📉" },
  "31": { emoji: "🏛️" },
  "32": { emoji: "🔄" },
  "33": { emoji: "📊" },
  "34": { emoji: "🌍" },
  // LIVELLO 6: STRATEGIE
  "35": { emoji: "⚓" },
  "36": { emoji: "📅" },
  "37": { emoji: "💎" },
  "38": { emoji: "🧱" },
  "39": { emoji: "🎭" },
  "40": { emoji: "🧠" },
>>>>>>> 6c8f038a135601d721670ce50a860c69236251e8
};

export function getAcademyLessonMeta(lessonId: string): AcademyLessonMeta {
  return ACADEMY_LESSON_META[lessonId] || { emoji: "📘" };
}

export function getDefaultLessonTitle(lessonId: string): string {
  return DEFAULT_LESSON_TITLES[lessonId] || "Lezione";
}

export function slugifySection(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}
