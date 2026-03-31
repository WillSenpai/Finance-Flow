export type WorldNodeType = "level" | "checkpoint" | "exit";
export type WorldNodeStatus = "locked" | "available" | "completed";

export type WorldNode = {
  code: string;
  title: string;
  description: string;
  type: WorldNodeType;
  position: { x: number; y: number };
  reward: { coins: number; xp: number; energyCost: number };
  status: WorldNodeStatus;
};

export type WorldProfile = {
  id: string;
  xp: number;
  currentZoneCode: string;
  completedNodes: string[];
};

export type WorldRun = {
  id: string;
  status: "active" | "finished" | "abandoned";
  reward_multiplier: number;
  total_coins_delta: number;
  total_energy_delta: number;
  total_xp_delta: number;
};

export type WorldStateResponse = {
  profile: WorldProfile;
  activeRun: WorldRun | null;
  zone: {
    code: string;
    title: string;
    objective: string;
    nodes: WorldNode[];
  };
  canClaimMainRewardToday: boolean;
};

export type LevelPrompt = {
  nodeCode: string;
  title: string;
  description: string;
  fields: Array<
    | {
        kind: "multi";
        id: string;
        label: string;
        options: { value: string; label: string }[];
        maxSelections: number;
      }
    | {
        kind: "number";
        id: string;
        label: string;
        placeholder: string;
      }
    | {
        kind: "single";
        id: string;
        label: string;
        options: { value: string; label: string }[];
      }
  >;
};

export const WORLD_LEVEL_PROMPTS: Record<string, LevelPrompt> = {
  budget_basics: {
    nodeCode: "budget_basics",
    title: "Bilancio Rapido",
    description: "Seleziona le 2 priorita corrette per un budget sano.",
    fields: [
      {
        kind: "multi",
        id: "selected",
        label: "Scegli 2 opzioni",
        maxSelections: 2,
        options: [
          { value: "necessita", label: "Necessita" },
          { value: "risparmio", label: "Risparmio" },
          { value: "lusso", label: "Acquisti impulsivi" },
          { value: "speculazione", label: "Scommesse ad alto rischio" },
        ],
      },
    ],
  },
  emergency_fund: {
    nodeCode: "emergency_fund",
    title: "Fondo Emergenza",
    description: "Inserisci il target corretto per 3 mesi di spese fisse da 1200 euro.",
    fields: [
      { kind: "number", id: "months", label: "Mesi copertura", placeholder: "3" },
      { kind: "number", id: "monthlyCost", label: "Costo mensile", placeholder: "1200" },
      { kind: "number", id: "target", label: "Target totale", placeholder: "3600" },
    ],
  },
  risk_balance: {
    nodeCode: "risk_balance",
    title: "Rischio & Rendimento",
    description: "Profilo bilanciato: quale portafoglio e coerente?",
    fields: [
      {
        kind: "single",
        id: "profile",
        label: "Profilo",
        options: [
          { value: "prudente", label: "Prudente" },
          { value: "bilanciato", label: "Bilanciato" },
          { value: "dinamico", label: "Dinamico" },
        ],
      },
      {
        kind: "single",
        id: "portfolio",
        label: "Portafoglio",
        options: [
          { value: "obbligazioni", label: "Prevalenza obbligazionaria" },
          { value: "mix", label: "Mix azioni/obbligazioni" },
          { value: "azionario", label: "Prevalenza azionaria" },
        ],
      },
    ],
  },
};

export function xpLevel(xp: number): number {
  return Math.max(1, Math.floor(xp / 100) + 1);
}

export function worldNodeTone(status: WorldNodeStatus): "muted" | "ready" | "done" {
  if (status === "completed") return "done";
  if (status === "available") return "ready";
  return "muted";
}

