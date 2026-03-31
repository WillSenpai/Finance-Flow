export type CampaignSnapshot = {
  id: string;
  current_level: number;
  board_position: number;
  coins: number;
  energy: number;
  streak_days: number;
  last_run_at: string | null;
};

export type RunEvent = {
  type: "bonus" | "tax" | "learning" | "opportunity";
  title: string;
  coinsDelta: number;
  energyDelta: number;
  positionDelta: number;
};

const BOARD_SIZE = 24;

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function isSameUtcDay(a: Date, b: Date): boolean {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
}

export function isPreviousUtcDay(previous: Date, current: Date): boolean {
  const p = Date.UTC(previous.getUTCFullYear(), previous.getUTCMonth(), previous.getUTCDate());
  const c = Date.UTC(current.getUTCFullYear(), current.getUTCMonth(), current.getUTCDate());
  return c - p === 86_400_000;
}

export function computeFinancialModifier(currentWeek: number, previousWeek: number): number {
  if (previousWeek <= 0) return 0;
  const deltaPct = ((currentWeek - previousWeek) / previousWeek) * 100;
  if (deltaPct <= -10) return 2;
  if (deltaPct < 0) return 1;
  if (deltaPct >= 20) return -2;
  if (deltaPct > 0) return -1;
  return 0;
}

export function buildDailyRunEvents(seed: string, modifier: number): RunEvent[] {
  const catalog: RunEvent[] = [
    { type: "bonus", title: "Cashback settimanale", coinsDelta: 18, energyDelta: 0, positionDelta: 2 },
    { type: "tax", title: "Spesa impulsiva", coinsDelta: -12, energyDelta: -1, positionDelta: 1 },
    { type: "learning", title: "Lezione completata", coinsDelta: 10, energyDelta: 1, positionDelta: 2 },
    { type: "opportunity", title: "Sconto bolletta", coinsDelta: 14, energyDelta: 0, positionDelta: 3 },
    { type: "tax", title: "Commissione bancaria", coinsDelta: -8, energyDelta: 0, positionDelta: 1 },
    { type: "bonus", title: "Vendita usato", coinsDelta: 16, energyDelta: 0, positionDelta: 2 },
  ];

  const base = hashString(seed);
  const events: RunEvent[] = [];
  for (let i = 0; i < 3; i += 1) {
    const index = (base + i * 7) % catalog.length;
    const selected = catalog[index];
    const adjustedCoins = selected.coinsDelta + modifier * (selected.coinsDelta >= 0 ? 2 : -2);
    events.push({ ...selected, coinsDelta: adjustedCoins });
  }
  return events;
}

export function applyRun(snapshot: CampaignSnapshot, events: RunEvent[]) {
  const totals = events.reduce(
    (acc, event) => {
      acc.coins += event.coinsDelta;
      acc.energy += event.energyDelta;
      acc.position += event.positionDelta;
      return acc;
    },
    { coins: 0, energy: 0, position: 0 },
  );

  const nextCoins = Math.max(0, snapshot.coins + totals.coins);
  const nextEnergy = Math.max(0, snapshot.energy + totals.energy);
  const nextPosition = (snapshot.board_position + totals.position) % BOARD_SIZE;

  const levelUps = Math.floor((snapshot.board_position + totals.position) / BOARD_SIZE);
  const nextLevel = snapshot.current_level + Math.max(0, levelUps);

  return {
    nextCoins,
    nextEnergy,
    nextPosition,
    nextLevel,
    rewardCoins: Math.max(5, 12 + Math.floor(totals.coins / 4)),
    totals,
  };
}
