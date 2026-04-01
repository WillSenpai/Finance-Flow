export interface Passivita {
  id: string;
  nome: string;
  tipo: "mutuo" | "finanziamento" | "carta";
  importoResiduo: number;
  rataMensile: number;
  dataFine: string;
  assetCollegato?: string;
}

const STORAGE_KEY = "financeflow_passivita";

export function loadPassivita(): Passivita[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Passivita[];
  } catch {
    return [];
  }
}

export function savePassivita(items: Passivita[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function createPassivita(
  data: Omit<Passivita, "id">,
): Passivita {
  return { ...data, id: crypto.randomUUID() };
}
