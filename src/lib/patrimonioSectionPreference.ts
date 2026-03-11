export type PatrimonioSection = "salvadanai" | "spese";

const KEY_PREFIX = "financeflow:patrimonio:section:";
const DEFAULT_SECTION: PatrimonioSection = "salvadanai";

function keyFor(userId: string) {
  return `${KEY_PREFIX}${userId}`;
}

function isPatrimonioSection(value: string | null): value is PatrimonioSection {
  return value === "salvadanai" || value === "spese";
}

export function getPatrimonioSectionPreference(userId?: string | null): PatrimonioSection {
  if (!userId) return DEFAULT_SECTION;
  const raw = window.localStorage.getItem(keyFor(userId));
  return isPatrimonioSection(raw) ? raw : DEFAULT_SECTION;
}

export function setPatrimonioSectionPreference(userId: string, section: PatrimonioSection): void {
  window.localStorage.setItem(keyFor(userId), section);
}
