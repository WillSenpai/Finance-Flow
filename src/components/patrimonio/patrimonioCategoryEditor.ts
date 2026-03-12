import type { CategoriaPatrimonio } from "@/hooks/useUser";

export type DraftCategoria = CategoriaPatrimonio & { localId: string };

export const patrimonioColorPalette = [
  { label: "Bronzo", value: "hsl(36 27% 43%)" },
  { label: "Salvia", value: "hsl(101 10% 54%)" },
  { label: "Sabbia", value: "hsl(39 39% 75%)" },
  { label: "Crema", value: "hsl(45 42% 84%)" },
  { label: "Muschio", value: "hsl(101 10% 34%)" },
  { label: "Terracotta", value: "hsl(18 58% 52%)" },
];

export const formatEuro = (n: number) =>
  new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

export const createLocalId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
};

export const toDraft = (categoria: CategoriaPatrimonio): DraftCategoria => ({
  ...categoria,
  localId: createLocalId(),
});

export const emptyCategory = (): DraftCategoria => ({
  localId: createLocalId(),
  nome: "",
  valore: 0,
  colore: patrimonioColorPalette[0].value,
  emoji: "🪙",
});
