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
};

export const DEFAULT_SECTION_SEED: Array<Pick<AcademySection, "slug" | "title" | "description" | "sortOrder">> = [
  {
    slug: "basics",
    title: "Le Basi del Denaro",
    description: "Impara a gestire le tue finanze quotidiane con sicurezza",
    sortOrder: 10,
  },
  {
    slug: "investing",
    title: "Come iniziare a investire",
    description: "Muovi i primi passi nel mondo degli investimenti",
    sortOrder: 20,
  },
  {
    slug: "protection",
    title: "Proteggersi dagli imprevisti",
    description: "Costruisci una rete di sicurezza per il tuo futuro",
    sortOrder: 30,
  },
  {
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
