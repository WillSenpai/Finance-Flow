import {
  isOpeningLoaderEnabled,
  resolveOpeningLoaderEnabled,
  setOpeningLoaderEnabled,
} from "./openingLoaderPreference";

describe("openingLoaderPreference", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns unknown while auth is still loading", () => {
    expect(resolveOpeningLoaderEnabled({ authLoading: true, userId: "user-1" })).toBeNull();
  });

  it("resolves to false for a user who disabled the opening loader", () => {
    setOpeningLoaderEnabled("user-1", false);

    expect(isOpeningLoaderEnabled("user-1")).toBe(false);
    expect(resolveOpeningLoaderEnabled({ authLoading: false, userId: "user-1" })).toBe(false);
  });

  it("defaults to enabled once auth is resolved and no preference is stored", () => {
    expect(resolveOpeningLoaderEnabled({ authLoading: false, userId: null })).toBe(true);
  });
});
