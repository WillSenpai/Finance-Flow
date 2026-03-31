export type GameCampaignState = {
  id: string;
  current_level: number;
  board_position: number;
  coins: number;
  energy: number;
  streak_days: number;
  last_run_at: string | null;
};

export function canPlayDailyRun(lastRunAt: string | null, now = new Date()): boolean {
  if (!lastRunAt) return true;
  const previous = new Date(lastRunAt);
  return !(
    previous.getUTCFullYear() === now.getUTCFullYear() &&
    previous.getUTCMonth() === now.getUTCMonth() &&
    previous.getUTCDate() === now.getUTCDate()
  );
}

export function boardProgressPercent(position: number, boardSize = 24): number {
  if (boardSize <= 0) return 0;
  const normalized = ((position % boardSize) + boardSize) % boardSize;
  return Math.round((normalized / boardSize) * 100);
}

export function coinsTone(coins: number): "good" | "warning" | "critical" {
  if (coins >= 120) return "good";
  if (coins >= 40) return "warning";
  return "critical";
}

export function streakLabel(streakDays: number): string {
  if (streakDays <= 0) return "No streak";
  if (streakDays === 1) return "1 day streak";
  return `${streakDays} days streak`;
}
