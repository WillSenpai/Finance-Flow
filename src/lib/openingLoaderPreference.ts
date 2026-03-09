const KEY_PREFIX = "financeflow:opening-loader:enabled:";
export const OPENING_LOADER_PREF_EVENT = "financeflow:opening-loader-pref-changed";

function keyFor(userId: string) {
  return `${KEY_PREFIX}${userId}`;
}

export function isOpeningLoaderEnabled(userId?: string | null): boolean {
  if (!userId) return true;
  const raw = window.localStorage.getItem(keyFor(userId));
  if (raw === null) return true;
  return raw === "1";
}

export function setOpeningLoaderEnabled(userId: string, enabled: boolean): void {
  window.localStorage.setItem(keyFor(userId), enabled ? "1" : "0");
  window.dispatchEvent(
    new CustomEvent(OPENING_LOADER_PREF_EVENT, {
      detail: { userId, enabled },
    }),
  );
}
