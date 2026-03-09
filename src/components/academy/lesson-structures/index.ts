import { createDefaultLessonDefinition, getDefaultLessonVisualConfig } from "./defaultLessonDefinition";
import lesson1Definition from "./lesson-1";
import lesson2Definition from "./lesson-2";
import lesson3Definition from "./lesson-3";
import lesson4Definition from "./lesson-4";
import lesson5Definition from "./lesson-5";
import lesson6Definition from "./lesson-6";
import lesson7Definition from "./lesson-7";
import lesson8Definition from "./lesson-8";
import type { LessonDefinition, LessonVisualConfig } from "./types";

const lessonRegistry: Record<string, LessonDefinition> = {
  "1": lesson1Definition,
  "2": lesson2Definition,
  "3": lesson3Definition,
  "4": lesson4Definition,
  "5": lesson5Definition,
  "6": lesson6Definition,
  "7": lesson7Definition,
  "8": lesson8Definition,
};

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
