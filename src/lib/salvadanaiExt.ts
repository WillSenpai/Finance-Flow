export type SalvadanaiCategoria =
  | "viaggi"
  | "casa"
  | "auto"
  | "emergenza"
  | "altro";

export const SALVADANAIO_CATEGORIE: { id: SalvadanaiCategoria; label: string; emoji: string }[] = [
  { id: "viaggi", label: "Viaggi", emoji: "✈️" },
  { id: "casa", label: "Casa", emoji: "🏠" },
  { id: "auto", label: "Auto", emoji: "🚗" },
  { id: "emergenza", label: "Emergenza", emoji: "🆘" },
  { id: "altro", label: "Altro", emoji: "📦" },
];

export interface Versamento {
  id: string;
  data: string; // ISO date
  importo: number;
  nota?: string;
}

export interface SalvadanaioPatch {
  categoria?: SalvadanaiCategoria;
  scadenza?: string; // ISO date
  descrizione?: string;
  versamenti?: Versamento[];
}

type SalvadanaiExtMap = Record<string, SalvadanaioPatch>; // keyed by salvadanaio name

const STORAGE_KEY = "financeflow_salvadanai_ext";

export function loadSalvadanaiExt(): SalvadanaiExtMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SalvadanaiExtMap) : {};
  } catch {
    return {};
  }
}

export function saveSalvadanaiExt(map: SalvadanaiExtMap): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function getSalvadanaioPatch(nome: string): SalvadanaioPatch {
  return loadSalvadanaiExt()[nome] ?? {};
}

export function setSalvadanaioPatch(nome: string, patch: SalvadanaioPatch): void {
  const map = loadSalvadanaiExt();
  map[nome] = patch;
  saveSalvadanaiExt(map);
}

export function addVersamento(nome: string, versamento: Omit<Versamento, "id">): void {
  const map = loadSalvadanaiExt();
  const existing = map[nome] ?? {};
  map[nome] = {
    ...existing,
    versamenti: [
      ...(existing.versamenti ?? []),
      { ...versamento, id: crypto.randomUUID() },
    ],
  };
  saveSalvadanaiExt(map);
}

/** Months to reach goal at current savings rate (last 3 versamenti avg). Returns null if no data. */
export function proiezioneMesi(
  attuale: number,
  obiettivo: number,
  versamenti: Versamento[],
): number | null {
  if (attuale >= obiettivo) return 0;
  if (versamenti.length === 0) return null;
  const sorted = [...versamenti].sort((a, b) => b.data.localeCompare(a.data));
  const recent = sorted.slice(0, 3);
  const avgMonthly = recent.reduce((s, v) => s + v.importo, 0) / recent.length;
  if (avgMonthly <= 0) return null;
  return Math.ceil((obiettivo - attuale) / avgMonthly);
}
