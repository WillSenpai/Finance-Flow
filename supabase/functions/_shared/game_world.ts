export type WorldNodeType = "level" | "checkpoint" | "exit";

export type WorldNodeDefinition = {
  code: string;
  title: string;
  description: string;
  type: WorldNodeType;
  position: { x: number; y: number };
  reward: { coins: number; xp: number; energyCost: number };
};

export const WORLD_ZONE_CODE = "zone_alpha";

export const WORLD_NODES: WorldNodeDefinition[] = [
  {
    code: "budget_basics",
    title: "Bilancio Rapido",
    description: "Scegli le priorita corrette per il budget mensile.",
    type: "level",
    position: { x: 84, y: 84 },
    reward: { coins: 18, xp: 20, energyCost: 1 },
  },
  {
    code: "emergency_fund",
    title: "Fondo Emergenza",
    description: "Calcola il target minimo in base alle spese fisse.",
    type: "level",
    position: { x: 250, y: 130 },
    reward: { coins: 20, xp: 24, energyCost: 1 },
  },
  {
    code: "risk_balance",
    title: "Rischio & Rendimento",
    description: "Seleziona il portafoglio coerente col profilo indicato.",
    type: "level",
    position: { x: 172, y: 236 },
    reward: { coins: 22, xp: 26, energyCost: 1 },
  },
  {
    code: "checkpoint_camp",
    title: "Checkpoint",
    description: "Recupera risorse e salva la run.",
    type: "checkpoint",
    position: { x: 86, y: 318 },
    reward: { coins: 8, xp: 8, energyCost: 0 },
  },
  {
    code: "zone_exit",
    title: "Uscita Zona",
    description: "Esci dalla zona dopo aver completato almeno 3 livelli.",
    type: "exit",
    position: { x: 260, y: 328 },
    reward: { coins: 30, xp: 40, energyCost: 0 },
  },
];

const LEVEL_NODE_CODES = WORLD_NODES.filter((node) => node.type === "level").map((node) => node.code);

export function computeNodeStatus(completedNodes: string[], nodeCode: string): "locked" | "available" | "completed" {
  if (completedNodes.includes(nodeCode)) return "completed";

  if (nodeCode === "budget_basics") return "available";
  if (nodeCode === "emergency_fund") return completedNodes.includes("budget_basics") ? "available" : "locked";
  if (nodeCode === "risk_balance") return completedNodes.includes("emergency_fund") ? "available" : "locked";
  if (nodeCode === "checkpoint_camp") return completedNodes.includes("budget_basics") ? "available" : "locked";
  if (nodeCode === "zone_exit") {
    const completedLevelCount = LEVEL_NODE_CODES.filter((code) => completedNodes.includes(code)).length;
    return completedLevelCount >= 3 ? "available" : "locked";
  }

  return "locked";
}

export function evaluateLevelNode(nodeCode: string, answers: Record<string, unknown>) {
  if (nodeCode === "budget_basics") {
    const selected = Array.isArray(answers.selected) ? (answers.selected as string[]) : [];
    const expected = ["necessita", "risparmio"];
    const isCorrect = expected.every((entry) => selected.includes(entry)) && selected.length === expected.length;
    return {
      success: isCorrect,
      reason: isCorrect ? "priorita corrette" : "le priorita del budget non sono corrette",
    };
  }

  if (nodeCode === "emergency_fund") {
    const months = Number(answers.months);
    const monthlyCost = Number(answers.monthlyCost);
    const target = Number(answers.target);
    const expectedTarget = months * monthlyCost;
    const isCorrect = Number.isFinite(months) && Number.isFinite(monthlyCost) && Number.isFinite(target)
      ? Math.abs(target - expectedTarget) <= Math.max(1, expectedTarget * 0.05)
      : false;
    return {
      success: isCorrect,
      reason: isCorrect ? "target fondo emergenza corretto" : "calcolo fondo emergenza non corretto",
    };
  }

  if (nodeCode === "risk_balance") {
    const profile = String(answers.profile ?? "").toLowerCase();
    const portfolio = String(answers.portfolio ?? "").toLowerCase();
    const mapping: Record<string, string> = {
      prudente: "obbligazioni",
      bilanciato: "mix",
      dinamico: "azionario",
    };
    const expected = mapping[profile];
    const isCorrect = Boolean(expected) && portfolio === expected;
    return {
      success: isCorrect,
      reason: isCorrect ? "profilo rischio allineato" : "profilo rischio non allineato",
    };
  }

  return { success: false, reason: "nodo livello sconosciuto" };
}

export function scaleReward(value: number, multiplier: number): number {
  return Math.round(value * multiplier);
}

export function normalizeCompletedNodes(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is string => typeof entry === "string");
}

