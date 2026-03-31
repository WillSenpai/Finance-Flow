import { describe, expect, it } from "vitest";
import { WORLD_LEVEL_PROMPTS, worldNodeTone, xpLevel } from "@/lib/gameWorld";

describe("gameWorld helpers", () => {
  it("computes xp level bands", () => {
    expect(xpLevel(0)).toBe(1);
    expect(xpLevel(99)).toBe(1);
    expect(xpLevel(100)).toBe(2);
    expect(xpLevel(245)).toBe(3);
  });

  it("maps node status to ui tone", () => {
    expect(worldNodeTone("locked")).toBe("muted");
    expect(worldNodeTone("available")).toBe("ready");
    expect(worldNodeTone("completed")).toBe("done");
  });

  it("exposes all 3 level prompts for vertical slice", () => {
    expect(Object.keys(WORLD_LEVEL_PROMPTS).sort()).toEqual([
      "budget_basics",
      "emergency_fund",
      "risk_balance",
    ]);
  });
});
