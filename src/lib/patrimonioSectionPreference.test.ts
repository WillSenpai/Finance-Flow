import {
  getPatrimonioSectionPreference,
  setPatrimonioSectionPreference,
} from "./patrimonioSectionPreference";

describe("patrimonioSectionPreference", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("defaults to salvadanai when no preference is stored", () => {
    expect(getPatrimonioSectionPreference("user-1")).toBe("salvadanai");
  });

  it("persists the selected section per user", () => {
    setPatrimonioSectionPreference("user-1", "spese");

    expect(getPatrimonioSectionPreference("user-1")).toBe("spese");
    expect(getPatrimonioSectionPreference("user-2")).toBe("salvadanai");
  });

  it("falls back to salvadanai for missing user ids", () => {
    expect(getPatrimonioSectionPreference()).toBe("salvadanai");
  });
});
