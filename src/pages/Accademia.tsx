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

  const { data: completedLessons } = useQuery({
    queryKey: ["lesson-progress", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("lesson_progress")
        .select("lesson_id")
        .eq("user_id", user.id);
      if (error) throw error;
      return data.map((d: { lesson_id: string }) => d.lesson_id);
    },
    enabled: !!user,
    staleTime: 60 * 1000,
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

  const completedSet = new Set(completedLessons || []);

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
        <p className="text-muted-foreground mt-1 text-sm">Impara al tuo ritmo, senza fretta</p>
      </motion.div>

      <div className="mt-6 space-y-8">
        {groupedCourses.map((courseGroup, catIdx) => {
          const { section, lessons } = courseGroup;
          if (lessons.length === 0) return null;
          const completateCount = lessons.filter((l) => completedSet.has(l.lesson_id)).length;
          const progressPct = Math.round((completateCount / lessons.length) * 100);

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
                {completateCount}/{lessons.length} completate ({progressPct}%)
              </p>

              <div className="scrollbar-hide flex gap-3 overflow-x-auto px-5 pb-2">
                {lessons.map((lesson, idx) => {
                  const isCompleted = completedSet.has(lesson.lesson_id);
                  const imageFallback = imageFallbacks[(catIdx + idx) % imageFallbacks.length];

                  return (
                    <motion.button
                      key={lesson.lesson_id}
                      onClick={() => navigate(`/lezione/${lesson.lesson_id}`)}
                      whileTap={{ scale: 0.96 }}
                      whileHover={{ scale: 1.03 }}
                      className={`relative flex h-52 w-44 flex-shrink-0 flex-col justify-end overflow-hidden rounded-2xl border px-4 pb-4 pt-16 text-left transition-shadow hover:shadow-md ${
                        isCompleted ? "border-primary/30 bg-primary/5" : "border-border/50 bg-card"
                      }`}
                    >
                      <div className="absolute inset-x-0 top-0 h-[50%]">
                        {lesson.card_image_url ? (
                          <img
                            src={lesson.card_image_url}
                            alt={lesson.titolo}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className={`h-full w-full bg-gradient-to-br ${imageFallback}`} />
                        )}
                        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-card/95 to-transparent" />
                      </div>

                      <p className="mb-2 text-sm font-medium leading-snug">
                        {lesson.titolo || getDefaultLessonTitle(lesson.lesson_id)}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="mr-2 h-1.5 flex-1 rounded-full bg-muted">
                          <div
                            className="h-1.5 rounded-full bg-primary transition-all"
                            style={{ width: isCompleted ? "100%" : "0%" }}
                          />
                        </div>
                        {isCompleted ? (
                          <CheckCircle2 size={14} className="flex-shrink-0 text-primary" />
                        ) : (
                          <span className="whitespace-nowrap text-[10px] text-muted-foreground">0%</span>
                        )}
                      </div>
                      <div className="mt-3 flex items-center gap-1 text-xs font-medium text-primary">
                        {isCompleted ? "Rivedi" : "Inizia"} <ChevronRight size={14} />
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
