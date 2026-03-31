import { describe, expect, it } from "vitest";
import { boardProgressPercent, canPlayDailyRun, coinsTone, streakLabel } from "@/lib/gameCampaign";

describe("gameCampaign utils", () => {
  it("allows daily run when no previous run exists", () => {
    expect(canPlayDailyRun(null, new Date("2026-03-31T12:00:00Z"))).toBe(true);
  });

  it("blocks daily run on same UTC day", () => {
    expect(canPlayDailyRun("2026-03-31T08:10:00Z", new Date("2026-03-31T22:00:00Z"))).toBe(false);
  });

  it("computes board percentage with normalization", () => {
    expect(boardProgressPercent(12, 24)).toBe(50);
    expect(boardProgressPercent(-1, 24)).toBe(96);
  });

  it("maps coin ranges to tone", () => {
    expect(coinsTone(150)).toBe("good");
    expect(coinsTone(80)).toBe("warning");
    expect(coinsTone(5)).toBe("critical");
  });

  it("formats streak labels", () => {
    expect(streakLabel(0)).toBe("No streak");
    expect(streakLabel(1)).toBe("1 day streak");
    expect(streakLabel(4)).toBe("4 days streak");
  });
});
