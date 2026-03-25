import { createDefaultLessonDefinition, getDefaultLessonVisualConfig } from "./defaultLessonDefinition";
import { generatedLessonDefinitions } from "./generatedLessons";
<<<<<<< HEAD
import type { LessonDefinition, LessonVisualConfig } from "./types";

const lessonRegistry: Record<string, LessonDefinition> = generatedLessonDefinitions;
=======
import { intelligentInvestorLessonDefinitions } from "./intelligentInvestorLessons";
import type { LessonDefinition, LessonVisualConfig } from "./types";

// Import all static lesson definitions
import lesson1Definition from "./lesson-1";
import lesson2Definition from "./lesson-2";
import lesson3Definition from "./lesson-3";
import lesson4Definition from "./lesson-4";
import lesson5Definition from "./lesson-5";
import lesson6Definition from "./lesson-6";
import lesson7Definition from "./lesson-7";
import lesson8Definition from "./lesson-8";
import lesson9Definition from "./lesson-9";
import lesson10Definition from "./lesson-10";
import lesson11Definition from "./lesson-11";
import lesson12Definition from "./lesson-12";
import lesson13Definition from "./lesson-13";
import lesson14Definition from "./lesson-14";
import lesson15Definition from "./lesson-15";
import lesson16Definition from "./lesson-16";
import lesson17Definition from "./lesson-17";
import lesson18Definition from "./lesson-18";
import lesson19Definition from "./lesson-19";
import lesson20Definition from "./lesson-20";
import lesson21Definition from "./lesson-21";
import lesson22Definition from "./lesson-22";
import lesson23Definition from "./lesson-23";
import lesson24Definition from "./lesson-24";
import lesson25Definition from "./lesson-25";
import lesson26Definition from "./lesson-26";
import lesson27Definition from "./lesson-27";
import lesson28Definition from "./lesson-28";
import lesson29Definition from "./lesson-29";
import lesson30Definition from "./lesson-30";
import lesson31Definition from "./lesson-31";
import lesson32Definition from "./lesson-32";
import lesson33Definition from "./lesson-33";
import lesson34Definition from "./lesson-34";
import lesson35Definition from "./lesson-35";
import lesson36Definition from "./lesson-36";
import lesson37Definition from "./lesson-37";
import lesson38Definition from "./lesson-38";
import lesson39Definition from "./lesson-39";
import lesson40Definition from "./lesson-40";

// Static lesson definitions (highest priority - override all other sources)
const staticLessonDefinitions: Record<string, LessonDefinition> = {
  "1": lesson1Definition,
  "2": lesson2Definition,
  "3": lesson3Definition,
  "4": lesson4Definition,
  "5": lesson5Definition,
  "6": lesson6Definition,
  "7": lesson7Definition,
  "8": lesson8Definition,
  "9": lesson9Definition,
  "10": lesson10Definition,
  "11": lesson11Definition,
  "12": lesson12Definition,
  "13": lesson13Definition,
  "14": lesson14Definition,
  "15": lesson15Definition,
  "16": lesson16Definition,
  "17": lesson17Definition,
  "18": lesson18Definition,
  "19": lesson19Definition,
  "20": lesson20Definition,
  "21": lesson21Definition,
  "22": lesson22Definition,
  "23": lesson23Definition,
  "24": lesson24Definition,
  "25": lesson25Definition,
  "26": lesson26Definition,
  "27": lesson27Definition,
  "28": lesson28Definition,
  "29": lesson29Definition,
  "30": lesson30Definition,
  "31": lesson31Definition,
  "32": lesson32Definition,
  "33": lesson33Definition,
  "34": lesson34Definition,
  "35": lesson35Definition,
  "36": lesson36Definition,
  "37": lesson37Definition,
  "38": lesson38Definition,
  "39": lesson39Definition,
  "40": lesson40Definition,
};

// Merge registries: staticLessonDefinitions override intelligentInvestorLessonDefinitions
// which override generatedLessonDefinitions (priority: static > intelligent > generated)
const lessonRegistry: Record<string, LessonDefinition> = {
  ...generatedLessonDefinitions,
  ...intelligentInvestorLessonDefinitions,
  ...staticLessonDefinitions,
};
>>>>>>> 6c8f038a135601d721670ce50a860c69236251e8

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
