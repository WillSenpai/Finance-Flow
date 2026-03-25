import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, CheckCircle2, Pencil } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/hooks/useUser";
import {
  DEFAULT_SECTION_SEED,
  DEFAULT_SECTION_SLUG_BY_LESSON_ID,
  getDefaultLessonTitle,
} from "@/lib/academy";

type AcademySectionRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  sort_order: number;
};

type AcademyLessonRow = {
  lesson_id: string;
  titolo: string;
  section_id?: string | null;
  card_image_url?: string | null;
};

type LessonProgressStats = {
  completed: number;
  total: number;
};

const imageFallbacks = [
  "from-emerald-200/60 to-cyan-100/60",
  "from-amber-200/60 to-rose-100/60",
  "from-sky-200/60 to-indigo-100/60",
  "from-lime-200/60 to-teal-100/60",
];

const Accademia = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin } = useUser();

  const { data: lessonNodeStats = new Map<string, LessonProgressStats>() } = useQuery({
    queryKey: ["lesson-node-progress", user?.id],
    queryFn: async () => {
      if (!user) return new Map<string, LessonProgressStats>();
      const { data, error } = await supabase
        .from("user_lesson_node_progress" as never)
        .select("lesson_id,status")
        .eq("user_id", user.id);

      if (error) throw error;

      const map = new Map<string, LessonProgressStats>();
      for (const row of (data || []) as Array<{ lesson_id: string; status: string }>) {
        const current = map.get(row.lesson_id) ?? { completed: 0, total: 0 };
        current.total += 1;
        if (row.status === "completed") current.completed += 1;
        map.set(row.lesson_id, current);
      }

      return map;
    },
    enabled: !!user,
    staleTime: 30 * 1000,
  });

  const { data: catalog = { sections: [], lessons: [] } } = useQuery({
    queryKey: ["academy-lessons-catalog"],
    queryFn: async () => {
      const lessonsWithSections = await supabase
        .from("academy_lessons_cache")
        .select("lesson_id, titolo, section_id, card_image_url")
        .order("lesson_id", { ascending: true });

      let lessons: AcademyLessonRow[] = [];
      if (lessonsWithSections.error) {
        const legacyLessons = await supabase
          .from("academy_lessons_cache")
          .select("lesson_id, titolo")
          .order("lesson_id", { ascending: true });
        if (legacyLessons.error) throw legacyLessons.error;
        lessons = (legacyLessons.data || []) as AcademyLessonRow[];
      } else {
        lessons = (lessonsWithSections.data || []) as AcademyLessonRow[];
      }

      const sectionsResp = await supabase
        .from("academy_sections" as never)
        .select("id, slug, title, description, sort_order")
        .order("sort_order", { ascending: true });

      return {
        sections: (sectionsResp.data || []) as AcademySectionRow[],
        lessons,
      };
    },
    staleTime: 60 * 1000,
  });

  const groupedCourses = useMemo(() => {
    const sections = catalog.sections.length
      ? catalog.sections
      : DEFAULT_SECTION_SEED.map((s, idx) => ({
        id: `fallback-${s.slug}-${idx}`,
        slug: s.slug,
        title: s.title,
        description: s.description,
        sort_order: s.sortOrder,
      }));

    const sectionById = new Map(sections.map((section) => [section.id, section]));
    const sectionBySlug = new Map(sections.map((section) => [section.slug, section]));

    const grouped = new Map<string, { section: AcademySectionRow; lessons: AcademyLessonRow[] }>();

    for (const lesson of catalog.lessons) {
      const fallbackSlug = DEFAULT_SECTION_SLUG_BY_LESSON_ID[lesson.lesson_id];
      const section =
        (lesson.section_id ? sectionById.get(lesson.section_id) : undefined) ||
        (fallbackSlug ? sectionBySlug.get(fallbackSlug) : undefined) ||
        sections[0];
      if (!section) continue;

      if (!grouped.has(section.id)) {
        grouped.set(section.id, { section, lessons: [] });
      }
      grouped.get(section.id)?.lessons.push(lesson);
    }

    return Array.from(grouped.values())
      .sort((a, b) => a.section.sort_order - b.section.sort_order)
      .map((entry) => ({
        ...entry,
        lessons: entry.lessons.sort((a, b) => Number(a.lesson_id) - Number(b.lesson_id)),
      }));
  }, [catalog.lessons, catalog.sections]);

  return (
    <div className="pt-14 pb-4">
      <motion.div
        className="px-5"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">Accademia 🎓</h1>
          {isAdmin && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/profilo/admin-accademia")}
              className="inline-flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-2.5 py-1.5 text-[11px] font-medium text-primary"
            >
              <Pencil size={12} />
              Modifica
            </motion.button>
          )}
        </div>
        <p className="text-muted-foreground mt-1 text-sm">Avanza nodo dopo nodo, senza poter saltare passaggi (a meno che tu non sia Pro)</p>
      </motion.div>

      <div className="mt-6 space-y-8">
        {groupedCourses.map((courseGroup, catIdx) => {
          const { section, lessons } = courseGroup;
          if (lessons.length === 0) return null;

          const completionRows = lessons.map((lesson) => lessonNodeStats.get(lesson.lesson_id) ?? { completed: 0, total: 4 });
          const totalCompleted = completionRows.reduce((sum, row) => sum + row.completed, 0);
          const totalNodes = completionRows.reduce((sum, row) => sum + Math.max(row.total, 4), 0);
          const progressPct = totalNodes > 0 ? Math.round((totalCompleted / totalNodes) * 100) : 0;

          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + catIdx * 0.1, duration: 0.35 }}
            >
              <h2 className="mb-1 px-5 text-base font-semibold">{section.title}</h2>
              <p className="mb-1 px-5 text-xs text-muted-foreground">{section.description}</p>
              <p className="mb-3 px-5 text-[11px] text-muted-foreground">
                {totalCompleted}/{totalNodes} nodi completati ({progressPct}%)
              </p>

              <div className="scrollbar-hide flex gap-3 overflow-x-auto px-5 pb-2">
                {lessons.map((lesson, idx) => {
                  const stats = lessonNodeStats.get(lesson.lesson_id) ?? { completed: 0, total: 4 };
                  const total = Math.max(stats.total, 4);
                  const isCompleted = stats.completed >= total && total > 0;
                  const lessonProgressPct = Math.round((stats.completed / total) * 100);
                  const imageFallback = imageFallbacks[(catIdx + idx) % imageFallbacks.length];

                  return (
                    <motion.button
                      key={lesson.lesson_id}
                      onClick={() => navigate(`/lezione/${lesson.lesson_id}`)}
                      whileTap={{ scale: 0.97 }}
                      whileHover={{ scale: 1.02 }}
                      className={`group relative flex h-56 w-40 flex-shrink-0 flex-col overflow-hidden rounded-2xl border text-left transition-all duration-200 hover:shadow-lg ${
                        isCompleted
                          ? "border-emerald-500/30 bg-gradient-to-b from-emerald-50/50 to-card dark:from-emerald-950/20"
                          : "border-border/50 bg-card hover:border-primary/30"
                      }`}
                    >
                      {/* Image section - fixed height */}
                      <div className="relative h-24 w-full flex-shrink-0 overflow-hidden">
                        {lesson.card_image_url ? (
                          <img
                            src={lesson.card_image_url}
                            alt={lesson.titolo}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className={`h-full w-full bg-gradient-to-br ${imageFallback}`} />
                        )}
                        {/* Completed badge */}
                        {isCompleted && (
                          <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 shadow-md">
                            <CheckCircle2 size={14} className="text-white" />
                          </div>
                        )}
                      </div>

                      {/* Content section - grows to fill remaining space */}
                      <div className="flex flex-1 flex-col justify-between p-3">
                        {/* Title - fully visible, no overlap */}
                        <h3 className="text-[13px] font-semibold leading-tight text-foreground line-clamp-3">
                          {lesson.titolo || getDefaultLessonTitle(lesson.lesson_id)}
                        </h3>

                        {/* Bottom section: progress + chevron */}
                        <div className="mt-2 flex items-end justify-between gap-2">
                          {/* Progress indicator */}
                          <div className="flex-1">
                            <div className="mb-1 flex items-center justify-between">
                              <span className="text-[9px] font-medium uppercase tracking-wide text-muted-foreground">
                                {isCompleted ? "Completata" : "Progresso"}
                              </span>
                              <span className="text-[10px] font-semibold text-muted-foreground">
                                {lessonProgressPct}%
                              </span>
                            </div>
                            <div className="h-1 w-full overflow-hidden rounded-full bg-muted/60">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  isCompleted ? "bg-emerald-500" : "bg-primary"
                                }`}
                                style={{ width: `${lessonProgressPct}%` }}
                              />
                            </div>
                          </div>

                          {/* Chevron button */}
                          <div
                            className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
                              isCompleted
                                ? "bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white dark:text-emerald-400"
                                : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                            }`}
                          >
                            <ChevronRight size={16} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Accademia;
