import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";

const LAST_BACKGROUND_AT_KEY = "financeflow:last-background-at";
const LAST_ROUTE_PREFIX = "financeflow:last-route:";
export const SOFT_RESUME_WINDOW_MS = 15 * 60 * 1000;

function isNative() {
  return Capacitor.isNativePlatform();
}

function safeLocalStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

function routeKey(userId?: string | null) {
  return `${LAST_ROUTE_PREFIX}${userId ?? "guest"}`;
}

export function shouldSkipOpeningLoaderSync(now = Date.now()): boolean {
  const storage = safeLocalStorage();
  const raw = storage?.getItem(LAST_BACKGROUND_AT_KEY);
  if (!raw) return false;
  const timestamp = Number(raw);
  return Number.isFinite(timestamp) && now - timestamp <= SOFT_RESUME_WINDOW_MS;
}

export async function persistBackgroundTimestamp(timestamp = Date.now()): Promise<void> {
  const value = String(timestamp);
  safeLocalStorage()?.setItem(LAST_BACKGROUND_AT_KEY, value);

  if (!isNative()) return;

  try {
    await Preferences.set({ key: LAST_BACKGROUND_AT_KEY, value });
  } catch {
    // Best-effort persistence for native resume.
  }
}

export async function readBackgroundTimestamp(): Promise<number | null> {
  const storageValue = safeLocalStorage()?.getItem(LAST_BACKGROUND_AT_KEY);
  if (storageValue) {
    const timestamp = Number(storageValue);
    if (Number.isFinite(timestamp)) return timestamp;
  }

  if (!isNative()) return null;

  try {
    const { value } = await Preferences.get({ key: LAST_BACKGROUND_AT_KEY });
    if (!value) return null;
    const timestamp = Number(value);
    return Number.isFinite(timestamp) ? timestamp : null;
  } catch {
    return null;
  }
}

export async function persistLastRoute(path: string, userId?: string | null): Promise<void> {
  const trimmedPath = path.trim();
  if (!trimmedPath) return;

  const key = routeKey(userId);
  safeLocalStorage()?.setItem(key, trimmedPath);

  if (!isNative()) return;

  try {
    await Preferences.set({ key, value: trimmedPath });
  } catch {
    // Best-effort persistence for native resume.
  }
}

export function readLastRouteSync(userId?: string | null): string | null {
  return safeLocalStorage()?.getItem(routeKey(userId)) ?? null;
}
