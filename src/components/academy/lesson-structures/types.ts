import type { ReactNode } from "react";

export type StepType = string;
export type NodeStatus = "locked" | "available" | "completed" | "skipped";

export type CriterionKey =
  | "foundational"
  | "integration"
  | "application"
  | "caring"
  | "learning"
  | "human";

export type NodeBlockKind = "focus" | "explain" | "question" | "exercise";

export type PollOption = {
  text: string;
  isCorrect?: boolean;
  explanation?: string;
};

export type BlockPollArea = {
  id: string;
  prompt: string;
  options?: string[];
  /** Opzioni avanzate con spiegazioni per il branching didattico */
  richOptions?: PollOption[];
  /** Indice della risposta corretta (0-based) se si usano options semplici */
  correctIndex?: number;
  /** Spiegazione mostrata se l'utente risponde correttamente */
  correctExplanation?: string;
  /** Spiegazione dettagliata mostrata se l'utente sbaglia - guida verso la comprensione */
  wrongExplanation?: string;
  allowText?: boolean;
};

export type NodeBlock = {
  kind: NodeBlockKind;
  title: string;
  content: string;
  pollAreas?: BlockPollArea[];
};

export type ExplainFlowOption = {
  label: string;
  followup: string;
};

export type ExplainFlowStep = {
  id: string;
  prompt: string;
  options: ExplainFlowOption[];
  nextHint: string;
};

export type StructuredNodeContent = {
  nodeKey: string;
  semanticType?: string;
  goal?: string;
  estimatedMinutes?: number;
  checkpointPrompt?: string;
  criteria: CriterionKey[];
  blocks: NodeBlock[];
  explainFlow?: ExplainFlowStep[];
  options?: string[];
  suggestedPrompts?: string[];
};

export type BlockVisual = {
  emoji: string;
  title: string;
  subtitle: string;
};

export type LessonVisualConfig = {
  nodeBadgeTitles: Record<string, string>;
  blockLabels: Record<string, Record<NodeBlockKind, BlockVisual>>;
};

export type StructuredLessonContent = Record<string, StructuredNodeContent>;
export type DynamicLessonContent = StructuredNodeContent[];

export type LessonDefinition = {
  id: string;
  buildStructuredContent: () => StructuredLessonContent;
  buildDynamicContent?: () => DynamicLessonContent;
  visual?: Partial<LessonVisualConfig>;
  renderNodeHeader?: (step: StepType) => ReactNode;
};
