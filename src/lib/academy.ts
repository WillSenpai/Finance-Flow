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
