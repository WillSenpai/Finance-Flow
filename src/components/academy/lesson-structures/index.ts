import { createDefaultLessonDefinition, getDefaultLessonVisualConfig } from "./defaultLessonDefinition";
import { generatedLessonDefinitions } from "./generatedLessons";
import type { LessonDefinition, LessonVisualConfig } from "./types";

const lessonRegistry: Record<string, LessonDefinition> = generatedLessonDefinitions;

export function resolveLessonDefinition(lessonId: string): LessonDefinition {
  return lessonRegistry[lessonId] || createDefaultLessonDefinition(lessonId);
}

export function resolveLessonVisualConfig(definition: LessonDefinition): LessonVisualConfig {
  const base = getDefaultLessonVisualConfig();
  const visual = definition.visual;

  if (!visual) return base;

  return {
    nodeBadgeTitles: {
      ...base.nodeBadgeTitles,
      ...(visual.nodeBadgeTitles || {}),
    },
    blockLabels: {
      ...base.blockLabels,
      ...(visual.blockLabels || {}),
    },
  };
}
