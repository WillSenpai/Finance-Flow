export type MasteryLevel = "base" | "foundation" | "intermediate" | "advanced";

export function clampMastery(score: number): number {
  if (!Number.isFinite(score)) return 0;
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function masteryLevelFromScore(score: number): MasteryLevel {
  const clamped = clampMastery(score);
  if (clamped <= 29) return "base";
  if (clamped <= 59) return "foundation";
  if (clamped <= 79) return "intermediate";
  return "advanced";
}

export function nextDifficulty(current: number, isCorrect: boolean): number {
  const base = Number.isFinite(current) ? current : 2;
  if (isCorrect) return Math.min(5, base + 1);
  return Math.max(1, base - 1);
}

export function challengeDelta(result: string | undefined): number {
  switch (result) {
    case "perfect":
      return 40;
    case "good":
      return 25;
    case "weak":
      return 10;
    default:
      return 10;
  }
}

export function eventDelta(eventType: string, payload?: { challengeResult?: string; reviewSuccess?: boolean }): number {
  switch (eventType) {
    case "concept":
      return 5;
    case "widget":
      return 15;
    case "challenge":
      return challengeDelta(payload?.challengeResult);
    case "review":
      return payload?.reviewSuccess ? 10 : -15;
    case "feedback":
      return 0;
    default:
      return 0;
  }
}

export function nextReviewStep(current: 1 | 3 | 7 | 14, isSuccess: boolean): 1 | 3 | 7 | 14 {
  if (!isSuccess) return 1;
  if (current === 1) return 3;
  if (current === 3) return 7;
  return 14;
}

export function dueDateFromStep(days: 1 | 3 | 7 | 14): string {
  const now = new Date();
  now.setUTCDate(now.getUTCDate() + days);
  return now.toISOString();
}
