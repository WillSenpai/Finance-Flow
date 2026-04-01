export interface AssetMetadata {
  istituto?: string;
  dataAcquisizione?: string; // ISO date
  frequenzaAggiornamento?: "mensile" | "trimestrale" | "annuale" | null;
  autoAggiornamento?: boolean;
  coProprietà?: {
    attivo: boolean;
    percentuale: number; // 0-100, share belonging to the owner
    partnerName?: string;
  } | null;
  lastUpdated?: string; // ISO date of last value edit
}

// Keyed by category name (lowercased)
type AssetMetadataMap = Record<string, AssetMetadata>;

const STORAGE_KEY = "financeflow_asset_metadata";

export function loadAssetMetadata(): AssetMetadataMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AssetMetadataMap) : {};
  } catch {
    return {};
  }
}

export function saveAssetMetadata(map: AssetMetadataMap): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function getAssetMeta(nome: string): AssetMetadata {
  return loadAssetMetadata()[nome.toLowerCase()] ?? {};
}

export function setAssetMeta(nome: string, meta: AssetMetadata): void {
  const map = loadAssetMetadata();
  map[nome.toLowerCase()] = meta;
  saveAssetMetadata(map);
}

export function markAssetUpdated(nome: string): void {
  const map = loadAssetMetadata();
  const key = nome.toLowerCase();
  map[key] = { ...(map[key] ?? {}), lastUpdated: new Date().toISOString() };
  saveAssetMetadata(map);
}

/** Returns true if lastUpdated is more than 30 days ago (or never set). */
export function isAssetStale(nome: string): boolean {
  const meta = getAssetMeta(nome);
  if (!meta.lastUpdated) return false; // never tracked — don't show badge yet
  const diff = Date.now() - new Date(meta.lastUpdated).getTime();
  return diff > 30 * 86400000;
}
