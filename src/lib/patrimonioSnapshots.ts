export interface PatrimonioSnapshot {
  month: string; // "YYYY-MM"
  netWorth: number;
  assets: number;
  liabilities: number;
  savedAt: string;
}

const STORAGE_KEY = "financeflow_patrimonio_snapshots";

export function loadSnapshots(): PatrimonioSnapshot[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as PatrimonioSnapshot[];
  } catch {
    return [];
  }
}

function currentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function maybeRecordSnapshot(assets: number, liabilities: number): void {
  const month = currentMonth();
  const snapshots = loadSnapshots();
  if (snapshots.some((s) => s.month === month)) return;

  const next: PatrimonioSnapshot = {
    month,
    netWorth: assets - liabilities,
    assets,
    liabilities,
    savedAt: new Date().toISOString(),
  };

  const updated = [...snapshots, next]
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-12); // keep last 12 months

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
