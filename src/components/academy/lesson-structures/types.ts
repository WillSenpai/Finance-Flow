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

export type NodeBlock = {
  kind: NodeBlockKind;
  title: string;
  content: string;
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

export type LessonDefinition = {
  id: string;
  buildStructuredContent: () => StructuredLessonContent;
  visual?: Partial<LessonVisualConfig>;
  renderNodeHeader?: (step: StepType) => ReactNode;
};
