import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  BookText,
  CheckCircle2,
  ChevronDown,
  Clipboard,
  FileClock,
  FileText,
  ImagePlus,
  Plus,
  Search,
  ShieldAlert,
  Sparkles,
  Trash2,
  Wand2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";
import { toast } from "@/hooks/use-toast";
import { slugifySection } from "@/lib/academy";
import { resolveLessonDefinition } from "@/components/academy/lesson-structures";
import type { NodeBlockKind, StepType, StructuredLessonContent } from "@/components/academy/lesson-structures/types";

type AcademySection = {
  id: string;
  slug: string;
  title: string;
  description: string;
  sort_order: number;
};

type AcademyLesson = {
  id: string;
  lesson_id: string;
  titolo: string;
  content: string;
  updated_at: string;
  section_id?: string | null;
  card_image_url?: string | null;
};

type DeleteMode = "move" | "delete_lessons";
type EditorMode = "structured" | "preview";

const NODE_ORDER: StepType[] = ["concept", "widget", "challenge", "feedback"];
const BLOCK_ORDER: NodeBlockKind[] = ["focus", "explain", "question", "exercise"];

const requiredSections = [
  "Introduzione",
  "Come funziona",
  "Cosa fare nella pratica",
  "Errori comuni",
  "In sintesi",
];

const LAST_SELECTED_LESSON_KEY = "academy-admin:last-lesson-id";
const LAST_SELECTED_SECTION_KEY = "academy-admin:last-section-id";

const getMarkdownTemplate = (titoloLezione: string): string => `### Introduzione
Spiega in modo semplice che cosa significa "${titoloLezione}" e perche e utile nella vita quotidiana.

### Come funziona
Descrivi il meccanismo passo dopo passo, con esempi concreti in euro.

### Cosa fare nella pratica
Elenca azioni immediate che l'utente puo fare oggi.

### Errori comuni
Indica gli errori piu frequenti e come evitarli.

### In sintesi
Riassumi in 3-4 frasi i punti chiave della lezione.
`;

function splitMarkdownByH3(markdown: string): Array<{ id: string; title: string; body: string }> {
  const re = /^###\s+(.+)$/gm;
  const headings: Array<{ title: string; index: number; raw: string }> = [];
  let match: RegExpExecArray | null = null;
  while ((match = re.exec(markdown)) !== null) {
    headings.push({ title: match[1].trim(), index: match.index, raw: match[0] });
  }
  if (headings.length === 0) {
    return [{ id: "full", title: "Contenuto completo", body: markdown.trim() || "_Nessun contenuto_" }];
  }

  const sections: Array<{ id: string; title: string; body: string }> = [];
  for (let i = 0; i < headings.length; i++) {
    const current = headings[i];
    const next = headings[i + 1];
    const start = current.index + current.raw.length;
    const end = next ? next.index : markdown.length;
    sections.push({
      id: `${i}-${current.title.toLowerCase().replace(/\s+/g, "-")}`,
      title: current.title,
      body: markdown.slice(start, end).trim() || "_Nessun contenuto_",
    });
  }
  return sections;
}

function normalizeSections(markdown: string): string {
  const parts = splitMarkdownByH3(markdown);
  const map = new Map(parts.map((p) => [p.title.toLowerCase(), p.body]));
  const ordered = requiredSections
    .map((title) => {
      const body = map.get(title.toLowerCase());
      return body ? `### ${title}\n${body}` : null;
    })
    .filter((entry): entry is string => !!entry);
  if (ordered.length === requiredSections.length) return ordered.join("\n\n");
  return markdown.trim();
}

function cloneStructuredContent(value: StructuredLessonContent): StructuredLessonContent {
  return JSON.parse(JSON.stringify(value)) as StructuredLessonContent;
}

function lessonPlaceholderContent(lessonId: string): string {
  return [
    "### Concept",
    `Contenuto lezione gestito da file locale: src/components/academy/lesson-structures/lesson-${lessonId}.ts`,
    "### Widget",
    `Contenuto lezione gestito da file locale: src/components/academy/lesson-structures/lesson-${lessonId}.ts`,
    "### Challenge",
    `Contenuto lezione gestito da file locale: src/components/academy/lesson-structures/lesson-${lessonId}.ts`,
    "### Feedback",
    `Contenuto lezione gestito da file locale: src/components/academy/lesson-structures/lesson-${lessonId}.ts`,
  ].join("\n");
}

function buildLessonPatch(lessonId: string, content: StructuredLessonContent): string {
  const json = JSON.stringify(content, null, 2);
  return [
    `import { createStaticLessonDefinition } from "./defaultLessonDefinition";`,
    `import type { StructuredLessonContent } from "./types";`,
    "",
    `const content: StructuredLessonContent = ${json};`,
    "",
    `const lesson${lessonId}Definition = createStaticLessonDefinition("${lessonId}", content);`,
    "",
    `export default lesson${lessonId}Definition;`,
  ].join("\n");
}

function structuredContentToPreview(content: StructuredLessonContent): string {
  return NODE_ORDER.map((nodeKey, idx) => {
    const section = content[nodeKey];
    const title = `### ${idx + 1}. ${nodeKey.toUpperCase()}`;
    const blocks = section.blocks
      .map((block) => `#### ${block.title}\n${block.content}`)
      .join("\n\n");
    return `${title}\n${blocks}`;
  }).join("\n\n");
}

const AdminAccademia = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const uploadRef = useRef<HTMLInputElement | null>(null);
  const hasAutoRestoredLessonRef = useRef(false);
  const { isAdmin, loadingData } = useUser();

  const [selectedSectionId, setSelectedSectionId] = useState<string>("");
  const [selectedLessonId, setSelectedLessonId] = useState<string>("");
  const [searchInModal, setSearchInModal] = useState("");
  const [isSectionDropdownOpen, setIsSectionDropdownOpen] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [isSectionsManagerOpen, setIsSectionsManagerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<EditorMode>("structured");
  const [hasDraftLoaded, setHasDraftLoaded] = useState(false);
  const [editorVersion, setEditorVersion] = useState(0);

  const [titolo, setTitolo] = useState("");
  const [content, setContent] = useState("");
  const [sectionIdForLesson, setSectionIdForLesson] = useState("");
  const [structuredContent, setStructuredContent] = useState<StructuredLessonContent | null>(null);
  const [structuredInitialHash, setStructuredInitialHash] = useState("");
  const [activeNode, setActiveNode] = useState<StepType>("concept");

  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newSectionDescription, setNewSectionDescription] = useState("");

  const [deleteSectionId, setDeleteSectionId] = useState("");
  const [deleteMode, setDeleteMode] = useState<DeleteMode>("move");
  const [targetSectionId, setTargetSectionId] = useState("");

  const { data: sections = [], isLoading: sectionsLoading } = useQuery({
    queryKey: ["academy-sections-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("academy_sections" as any)
        .select("id, slug, title, description, sort_order")
        .order("sort_order", { ascending: true });
      if (error) return [] as AcademySection[];
      return (data || []) as AcademySection[];
    },
    enabled: isAdmin,
  });

  const { data: lessons = [], isLoading: lessonsLoading } = useQuery({
    queryKey: ["admin-academy-lessons"],
    queryFn: async () => {
      const next = await supabase
        .from("academy_lessons_cache")
        .select("id, lesson_id, titolo, content, updated_at, section_id, card_image_url")
        .order("lesson_id", { ascending: true });
      if (next.error) {
        const legacy = await supabase
          .from("academy_lessons_cache")
          .select("id, lesson_id, titolo, content, updated_at")
          .order("lesson_id", { ascending: true });
        if (legacy.error) throw legacy.error;
        return (legacy.data || []).map((row: any) => ({
          ...row,
          section_id: null,
          card_image_url: null,
        })) as AcademyLesson[];
      }
      return (next.data || []) as AcademyLesson[];
    },
    enabled: isAdmin,
  });

  const { data: lessonNodeDraft } = useQuery({
    queryKey: ["academy-lesson-node-draft", selectedLessonId],
    queryFn: async () => {
      if (!selectedLessonId) return null;
      const { data, error } = await supabase
        .from("academy_lesson_node_drafts" as any)
        .select("payload, updated_at")
        .eq("lesson_id", selectedLessonId)
        .maybeSingle();
      if (error) return null;
      return data as { payload?: StructuredLessonContent; updated_at?: string } | null;
    },
    enabled: isAdmin && !!selectedLessonId,
  });

  useEffect(() => {
    if (!selectedSectionId && sections.length > 0) {
      setSelectedSectionId(sections[0].id);
      return;
    }
    if (!selectedSectionId && sections.length === 0 && lessons.length > 0) {
      setSelectedSectionId("__unassigned__");
    }
  }, [selectedSectionId, sections, lessons.length]);

  const selectedSection = useMemo(
    () => sections.find((section) => section.id === selectedSectionId) || null,
    [sections, selectedSectionId],
  );
  const selectedSectionLabel = selectedSection?.title || (selectedSectionId === "__unassigned__" ? "Tutte le lezioni" : "Seleziona macrosezione");

  const selectedLesson = useMemo(
    () => lessons.find((lesson) => lesson.lesson_id === selectedLessonId) || null,
    [lessons, selectedLessonId],
  );
  const selectedLessonSectionId = selectedLesson?.section_id ?? "";

  const lessonsBySection = useMemo(() => {
    const map = new Map<string, AcademyLesson[]>();
    for (const section of sections) map.set(section.id, []);
    for (const lesson of lessons) {
      const key = lesson.section_id || "__unassigned__";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(lesson);
    }
    for (const grouped of map.values()) {
      grouped.sort((a, b) => Number(a.lesson_id) - Number(b.lesson_id));
    }
    return map;
  }, [lessons, sections]);

  const modalLessons = useMemo(() => {
    const source = lessonsBySection.get(selectedSectionId) || [];
    const term = searchInModal.trim().toLowerCase();
    if (!term) return source;
    return source.filter((lesson) =>
      `${lesson.lesson_id} ${lesson.titolo}`.toLowerCase().includes(term),
    );
  }, [lessonsBySection, searchInModal, selectedSectionId]);

  const previewMarkdown = useMemo(
    () => (structuredContent ? structuredContentToPreview(structuredContent) : content),
    [structuredContent, content],
  );
  const previewSections = useMemo(() => splitMarkdownByH3(previewMarkdown), [previewMarkdown]);

  const words = useMemo(() => (previewMarkdown.trim() ? previewMarkdown.trim().split(/\s+/).length : 0), [previewMarkdown]);
  const estimatedMinutes = Math.max(1, Math.round(words / 180));

  const sectionStatus = useMemo(() => {
    const done =
      structuredContent &&
      NODE_ORDER.every((nodeKey) =>
        BLOCK_ORDER.every((blockKind) =>
          Boolean(structuredContent[nodeKey].blocks.find((block) => block.kind === blockKind)?.content?.trim()),
        ),
      );
    return requiredSections.map((section, index) => ({
      section,
      ok: done ? true : index === 0,
    }));
  }, [structuredContent]);
  const completedSections = sectionStatus.filter((section) => section.ok).length;

  const isDirty = useMemo(() => {
    if (!selectedLesson) return false;
    const structuredHash = structuredContent ? JSON.stringify(structuredContent) : "";
    return (
      titolo.trim() !== selectedLesson.titolo ||
      structuredHash !== structuredInitialHash ||
      sectionIdForLesson !== selectedLessonSectionId
    );
  }, [sectionIdForLesson, selectedLesson, selectedLessonSectionId, structuredContent, structuredInitialHash, titolo]);

  const getAuthHeaders = async () => {
    const session = await supabase.auth.getSession();
    const accessToken = session.data.session?.access_token;
    if (!accessToken) throw new Error("Sessione non valida. Rieffettua il login.");
    return {
      Authorization: `Bearer ${accessToken}`,
      apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    };
  };

  const refreshAcademyData = () => {
    queryClient.invalidateQueries({ queryKey: ["academy-sections-admin"] });
    queryClient.invalidateQueries({ queryKey: ["admin-academy-lessons"] });
    queryClient.invalidateQueries({ queryKey: ["academy-lessons-catalog"] });
    queryClient.invalidateQueries({ queryKey: ["academy-lesson-cache"] });
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!selectedLesson) throw new Error("Seleziona una lezione");
      if (!structuredContent) throw new Error("Contenuto nodi non disponibile");
      const payload: Record<string, unknown> = {
        titolo: titolo.trim(),
        content: lessonPlaceholderContent(selectedLesson.lesson_id),
        updated_at: new Date().toISOString(),
      };
      if (sectionIdForLesson) {
        payload.section_id = sectionIdForLesson;
      }
      const attempt = await supabase
        .from("academy_lessons_cache")
        .update(payload as any)
        .eq("id", selectedLesson.id);
      if (!attempt.error) return;

      // Legacy fallback when section_id column is not yet present.
      if (String(attempt.error.message || "").toLowerCase().includes("section_id")) {
        const legacy = await supabase
          .from("academy_lessons_cache")
          .update({
            titolo: titolo.trim(),
            content: lessonPlaceholderContent(selectedLesson.lesson_id),
            updated_at: new Date().toISOString(),
          } as any)
          .eq("id", selectedLesson.id);
        if (legacy.error) throw legacy.error;
      } else {
        throw attempt.error;
      }

      const { error: draftError } = await supabase
        .from("academy_lesson_node_drafts" as any)
        .upsert(
          {
            lesson_id: selectedLesson.lesson_id,
            payload: structuredContent,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "lesson_id" },
        );
      if (draftError) throw draftError;
    },
    onSuccess: () => {
      if (selectedLessonId) {
        localStorage.removeItem(`academy-lesson-draft:${selectedLessonId}`);
      }
      if (structuredContent) {
        setStructuredInitialHash(JSON.stringify(structuredContent));
      }
      setHasDraftLoaded(false);
      refreshAcademyData();
      queryClient.invalidateQueries({ queryKey: ["academy-lesson-node-draft", selectedLessonId] });
      toast({ title: "Lezione aggiornata" });
    },
    onError: (error) => {
      toast({
        title: "Errore salvataggio",
        description: error instanceof Error ? error.message : "Errore sconosciuto",
        variant: "destructive",
      });
    },
  });

  const createSectionMutation = useMutation({
    mutationFn: async () => {
      const title = newSectionTitle.trim();
      const description = newSectionDescription.trim();
      if (!title || !description) throw new Error("Titolo e descrizione sono obbligatori");
      const slugBase = slugifySection(title);
      if (!slugBase) throw new Error("Titolo non valido per creare uno slug");

      const slugSet = new Set(sections.map((section) => section.slug));
      let slug = slugBase;
      let suffix = 2;
      while (slugSet.has(slug)) {
        slug = `${slugBase}-${suffix}`;
        suffix += 1;
      }

      const maxSort = sections.reduce((max, section) => Math.max(max, section.sort_order), 0);
      const { error } = await supabase.from("academy_sections" as any).insert({
        slug,
        title,
        description,
        sort_order: maxSort + 10,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setNewSectionTitle("");
      setNewSectionDescription("");
      refreshAcademyData();
      toast({ title: "Macrosezione creata" });
    },
    onError: (error) =>
      toast({
        title: "Creazione fallita",
        description: error instanceof Error ? error.message : "Errore sconosciuto",
        variant: "destructive",
      }),
  });

  const updateSectionMutation = useMutation({
    mutationFn: async (section: AcademySection) => {
      const { error } = await supabase
        .from("academy_sections" as any)
        .update({
          title: section.title.trim(),
          description: section.description.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", section.id);
      if (error) throw error;
    },
    onSuccess: () => {
      refreshAcademyData();
      toast({ title: "Macrosezione aggiornata" });
    },
    onError: (error) =>
      toast({
        title: "Aggiornamento fallito",
        description: error instanceof Error ? error.message : "Errore sconosciuto",
        variant: "destructive",
      }),
  });

  const reorderSectionMutation = useMutation({
    mutationFn: async ({ sectionId, direction }: { sectionId: string; direction: -1 | 1 }) => {
      const index = sections.findIndex((section) => section.id === sectionId);
      const targetIndex = index + direction;
      if (index < 0 || targetIndex < 0 || targetIndex >= sections.length) return;

      const current = sections[index];
      const target = sections[targetIndex];

      const updates = [
        supabase.from("academy_sections" as any).update({ sort_order: target.sort_order }).eq("id", current.id),
        supabase.from("academy_sections" as any).update({ sort_order: current.sort_order }).eq("id", target.id),
      ];
      const [first, second] = await Promise.all(updates);
      if (first.error) throw first.error;
      if (second.error) throw second.error;
    },
    onSuccess: () => refreshAcademyData(),
    onError: (error) =>
      toast({
        title: "Riordino fallito",
        description: error instanceof Error ? error.message : "Errore sconosciuto",
        variant: "destructive",
      }),
  });

  const deleteSectionMutation = useMutation({
    mutationFn: async () => {
      if (!deleteSectionId) throw new Error("Seleziona una macrosezione");
      const lessonsInSection = lessonsBySection.get(deleteSectionId) || [];

      if (lessonsInSection.length > 0) {
        if (deleteMode === "move") {
          if (!targetSectionId || targetSectionId === deleteSectionId) {
            throw new Error("Scegli una macrosezione di destinazione valida");
          }
          const { error: moveError } = await supabase
            .from("academy_lessons_cache")
            .update({ section_id: targetSectionId } as any)
            .eq("section_id", deleteSectionId);
          if (moveError) throw moveError;
        } else {
          const { error: deleteLessonsError } = await supabase
            .from("academy_lessons_cache")
            .delete()
            .eq("section_id", deleteSectionId);
          if (deleteLessonsError) throw deleteLessonsError;
        }
      }

      const { error } = await supabase.from("academy_sections" as any).delete().eq("id", deleteSectionId);
      if (error) throw error;
    },
    onSuccess: () => {
      setDeleteSectionId("");
      setTargetSectionId("");
      if (selectedSectionId === deleteSectionId) {
        const fallback = sections.find((section) => section.id !== deleteSectionId);
        setSelectedSectionId(fallback?.id || "");
      }
      refreshAcademyData();
      toast({ title: "Macrosezione eliminata" });
    },
    onError: (error) =>
      toast({
        title: "Eliminazione fallita",
        description: error instanceof Error ? error.message : "Errore sconosciuto",
        variant: "destructive",
      }),
  });

  const generateImagesMutation = useMutation({
    mutationFn: async (payload: { batch?: boolean; lessonId?: string; force?: boolean }) => {
      const headers = await getAuthHeaders();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-lesson-illustrations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
          body: JSON.stringify({ ...payload, mode: "card" }),
        },
      );
      const json = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(json.error || "Errore generazione immagini");
      return json;
    },
    onSuccess: (data) => {
      refreshAcademyData();
      const generatedCount = Array.isArray(data?.results)
        ? data.results.filter((entry: any) => entry.status === "generated").length
        : 0;
      toast({ title: "Generazione completata", description: `${generatedCount} immagini generate` });
    },
    onError: (error) =>
      toast({
        title: "Generazione fallita",
        description: error instanceof Error ? error.message : "Errore sconosciuto",
        variant: "destructive",
      }),
  });

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!selectedLesson) throw new Error("Seleziona una lezione");
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const filePath = `cards/manual-lesson-${selectedLesson.lesson_id}-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("lesson-illustrations")
        .upload(filePath, file, {
          contentType: file.type || "image/jpeg",
          upsert: true,
        });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("lesson-illustrations").getPublicUrl(filePath);
      const { error: updateError } = await supabase
        .from("academy_lessons_cache")
        .update({
          card_image_url: data.publicUrl,
          card_image_updated_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as any)
        .eq("id", selectedLesson.id);
      if (updateError) throw updateError;
    },
    onSuccess: () => {
      refreshAcademyData();
      toast({ title: "Immagine card aggiornata" });
    },
    onError: (error) =>
      toast({
        title: "Upload fallito",
        description: error instanceof Error ? error.message : "Errore sconosciuto",
        variant: "destructive",
      }),
  });

  const selectLesson = useCallback((lesson: AcademyLesson) => {
    const sectionForFilter = lesson.section_id || "__unassigned__";
    const sectionForEditor = lesson.section_id || sections[0]?.id || "";

    setSelectedSectionId(sectionForFilter);
    setSelectedLessonId(lesson.lesson_id);
    setTitolo(lesson.titolo);
    setContent(lessonPlaceholderContent(lesson.lesson_id));
    setSectionIdForLesson(sectionForEditor);
    const fromFile = cloneStructuredContent(resolveLessonDefinition(lesson.lesson_id).buildStructuredContent());
    setStructuredContent(fromFile);
    setStructuredInitialHash(JSON.stringify(fromFile));
    setActiveNode("concept");
    setHasDraftLoaded(false);
    setActiveTab("structured");
    setEditorVersion((value) => value + 1);
    localStorage.setItem(LAST_SELECTED_LESSON_KEY, lesson.lesson_id);
    localStorage.setItem(LAST_SELECTED_SECTION_KEY, sectionForFilter);
  }, [sections]);

  const handleSelectLesson = (lesson: AcademyLesson) => {
    selectLesson(lesson);
  };

  useEffect(() => {
    if (hasAutoRestoredLessonRef.current) return;
    if (selectedLessonId) {
      hasAutoRestoredLessonRef.current = true;
      return;
    }
    if (lessons.length === 0) return;

    const lastLessonId = localStorage.getItem(LAST_SELECTED_LESSON_KEY);
    if (!lastLessonId) {
      hasAutoRestoredLessonRef.current = true;
      return;
    }

    const lessonToRestore = lessons.find((lesson) => lesson.lesson_id === lastLessonId);
    if (!lessonToRestore) {
      localStorage.removeItem(LAST_SELECTED_LESSON_KEY);
      localStorage.removeItem(LAST_SELECTED_SECTION_KEY);
      hasAutoRestoredLessonRef.current = true;
      return;
    }

    const lastSectionId = localStorage.getItem(LAST_SELECTED_SECTION_KEY);
    if (lastSectionId) {
      setSelectedSectionId(lastSectionId);
    }

    selectLesson(lessonToRestore);
    hasAutoRestoredLessonRef.current = true;
  }, [lessons, selectedLessonId, selectLesson]);

  useEffect(() => {
    if (!selectedLessonId || !selectedLesson) return;
    if (lessonNodeDraft?.payload) {
      const dbHash = JSON.stringify(lessonNodeDraft.payload);
      if (dbHash !== structuredInitialHash) {
        const dbDraft = cloneStructuredContent(lessonNodeDraft.payload);
        setStructuredContent(dbDraft);
        setStructuredInitialHash(dbHash);
      }
      setHasDraftLoaded(true);
      return;
    }
    const raw = localStorage.getItem(`academy-lesson-draft:${selectedLessonId}`);
    if (!raw) return;
    try {
      const draft = JSON.parse(raw) as {
        titolo: string;
        sectionId: string;
        structuredContent?: StructuredLessonContent;
      };
      setTitolo(draft.titolo || selectedLesson.titolo);
      setSectionIdForLesson(draft.sectionId || selectedLessonSectionId);
      if (draft.structuredContent) {
        const localHash = JSON.stringify(draft.structuredContent);
        if (localHash !== structuredInitialHash) {
          setStructuredContent(cloneStructuredContent(draft.structuredContent));
          setStructuredInitialHash(localHash);
        }
      }
      setHasDraftLoaded(true);
    } catch {
      localStorage.removeItem(`academy-lesson-draft:${selectedLessonId}`);
    }
  }, [lessonNodeDraft, selectedLesson, selectedLessonId, selectedLessonSectionId, structuredInitialHash]);

  useEffect(() => {
    if (!selectedLessonId || !structuredContent) return;
    localStorage.setItem(
      `academy-lesson-draft:${selectedLessonId}`,
      JSON.stringify({ titolo, sectionId: sectionIdForLesson, structuredContent }),
    );
  }, [selectedLessonId, titolo, sectionIdForLesson, structuredContent]);

  useEffect(() => {
    const onSave = (event: KeyboardEvent) => {
      const isSave = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s";
      if (!isSave) return;
      event.preventDefault();
      if (!selectedLesson || !isDirty || saveMutation.isPending) return;
      if (!titolo.trim() || !structuredContent) return;
      saveMutation.mutate();
    };
    window.addEventListener("keydown", onSave);
    return () => window.removeEventListener("keydown", onSave);
  }, [selectedLesson, isDirty, saveMutation, titolo, structuredContent]);

  const onUploadChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    uploadImageMutation.mutate(file);
  };

  const updateNodeBlock = (nodeKey: StepType, blockKind: NodeBlockKind, value: string) => {
    setStructuredContent((prev) => {
      if (!prev) return prev;
      const next = cloneStructuredContent(prev);
      const block = next[nodeKey].blocks.find((entry) => entry.kind === blockKind);
      if (block) block.content = value;
      return next;
    });
  };

  const updateNodeOptions = (nodeKey: StepType, value: string) => {
    setStructuredContent((prev) => {
      if (!prev) return prev;
      const next = cloneStructuredContent(prev);
      next[nodeKey].options = value
        .split("\n")
        .map((entry) => entry.trim())
        .filter(Boolean);
      return next;
    });
  };

  const updateSuggestedPrompts = (nodeKey: StepType, value: string) => {
    setStructuredContent((prev) => {
      if (!prev) return prev;
      const next = cloneStructuredContent(prev);
      next[nodeKey].suggestedPrompts = value
        .split("\n")
        .map((entry) => entry.trim())
        .filter(Boolean);
      return next;
    });
  };

  if (loadingData) {
    return <div className="px-5 pt-14 pb-4 text-sm text-muted-foreground">Caricamento area admin...</div>;
  }

  if (!isAdmin) {
    return (
      <motion.div className="px-5 pt-14 pb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <button
          onClick={() => navigate("/profilo")}
          className="mb-4 flex items-center gap-1 text-sm font-medium text-primary"
        >
          <ArrowLeft size={18} />
          Torna al profilo
        </button>
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4">
          <div className="mb-2 flex items-center gap-2 text-destructive">
            <ShieldAlert size={18} />
            <p className="text-sm font-semibold">Accesso riservato</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Solo gli utenti admin possono modificare le lezioni dell&apos;Accademia.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div className="px-5 pt-14 pb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <input ref={uploadRef} type="file" accept="image/*" className="hidden" onChange={onUploadChange} />

      <div className="mb-5 flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/profilo")}
          className="-ml-2 rounded-xl p-2 hover:bg-muted"
        >
          <ArrowLeft size={20} />
        </motion.button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">Gestione Accademia</h1>
          <p className="text-xs text-muted-foreground">Macrosezioni, lezioni e card AI</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border/50 bg-card p-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsSectionDropdownOpen((open) => !open)}
            className="inline-flex items-center gap-2 rounded-xl border border-border/60 px-3 py-2 text-xs"
          >
            <span className="font-medium">{selectedSectionLabel}</span>
            <ChevronDown size={14} className={isSectionDropdownOpen ? "rotate-180 transition-transform" : "transition-transform"} />
          </button>

          <button
            onClick={() => setIsSectionsManagerOpen((open) => !open)}
            className="rounded-xl border border-border/60 px-3 py-2 text-xs text-muted-foreground"
          >
            Gestisci macrosezioni
          </button>

          <button
            onClick={() => generateImagesMutation.mutate({ batch: true })}
            disabled={generateImagesMutation.isPending}
            className="inline-flex items-center gap-1 rounded-xl border border-border/60 px-3 py-2 text-xs text-muted-foreground disabled:opacity-50"
          >
            <Wand2 size={12} />
            {generateImagesMutation.isPending ? "Generazione..." : "Genera immagini batch"}
          </button>
        </div>

        <AnimatePresence initial={false}>
          {isSectionDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="mt-3 overflow-hidden"
            >
              <div className="space-y-2 rounded-xl border border-border/40 bg-background p-2">
                {sections.map((section) => {
                  const count = (lessonsBySection.get(section.id) || []).length;
                  return (
                    <button
                      key={section.id}
                      onClick={() => {
                        setSelectedSectionId(section.id);
                        setSearchInModal("");
                        setIsLessonModalOpen(true);
                        setIsSectionDropdownOpen(false);
                      }}
                      className={`w-full rounded-lg border px-3 py-2 text-left text-xs transition-colors ${selectedSectionId === section.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/50 bg-card hover:bg-muted"
                        }`}
                    >
                      <p className="font-semibold">{section.title}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">{count} lezioni</p>
                    </button>
                  );
                })}
                {sections.length === 0 && lessons.length > 0 && (
                  <button
                    onClick={() => {
                      setSelectedSectionId("__unassigned__");
                      setSearchInModal("");
                      setIsLessonModalOpen(true);
                      setIsSectionDropdownOpen(false);
                    }}
                    className="w-full rounded-lg border border-border/50 bg-card px-3 py-2 text-left text-xs transition-colors hover:bg-muted"
                  >
                    <p className="font-semibold">Tutte le lezioni</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{lessons.length} lezioni</p>
                  </button>
                )}
                {sections.length === 0 && !sectionsLoading && (
                  <p className="px-2 py-1 text-xs text-muted-foreground">Nessuna macrosezione disponibile.</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isSectionsManagerOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="mt-3 rounded-2xl border border-border/50 bg-card p-4"
          >
            <h2 className="text-sm font-semibold">Macrosezioni</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Puoi modificare titolo/descrizione, riordinare, creare e rimuovere sezioni.
            </p>

            <div className="mt-3 grid gap-2 md:grid-cols-2">
              <input
                value={newSectionTitle}
                onChange={(event) => setNewSectionTitle(event.target.value)}
                placeholder="Titolo nuova macrosezione"
                className="h-9 rounded-xl border border-border/60 bg-background px-3 text-xs outline-none"
              />
              <input
                value={newSectionDescription}
                onChange={(event) => setNewSectionDescription(event.target.value)}
                placeholder="Descrizione nuova macrosezione"
                className="h-9 rounded-xl border border-border/60 bg-background px-3 text-xs outline-none"
              />
            </div>
            <button
              onClick={() => createSectionMutation.mutate()}
              disabled={createSectionMutation.isPending}
              className="mt-2 inline-flex items-center gap-1 rounded-xl border border-border/60 px-3 py-2 text-xs disabled:opacity-50"
            >
              <Plus size={12} />
              Crea macrosezione
            </button>

            <div className="mt-4 space-y-2">
              {sections.map((section, index) => (
                <SectionRow
                  key={section.id}
                  section={section}
                  lessonCount={(lessonsBySection.get(section.id) || []).length}
                  disableUp={index === 0}
                  disableDown={index === sections.length - 1}
                  onSave={(next) => updateSectionMutation.mutate(next)}
                  onMoveUp={() => reorderSectionMutation.mutate({ sectionId: section.id, direction: -1 })}
                  onMoveDown={() => reorderSectionMutation.mutate({ sectionId: section.id, direction: 1 })}
                  onDelete={() => {
                    setDeleteSectionId(section.id);
                    setDeleteMode("move");
                    setTargetSectionId("");
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedLesson ? (
        <motion.div
          key={editorVersion}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.32, ease: [0.2, 0.7, 0.2, 1] }}
          className="mt-4 rounded-2xl border border-border/50 bg-card p-4"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-[10px] font-medium text-primary">
              <BookText size={11} />
              Lezione {selectedLesson.lesson_id}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-[10px] text-muted-foreground">
              <FileText size={11} />
              {words} parole
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-[10px] text-muted-foreground">
              <FileClock size={11} />
              ~{estimatedMinutes} min lettura
            </span>
            {isDirty && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-1 text-[10px] font-medium text-amber-700">
                <Sparkles size={11} />
                Modifiche non salvate
              </span>
            )}
            {hasDraftLoaded && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-medium text-emerald-700">
                <CheckCircle2 size={11} />
                Draft locale caricato
              </span>
            )}
          </div>

          <div className="mt-4 flex flex-col gap-4">
            <div className="space-y-4">
              <div className="flex flex-col gap-3">
                <div>
                  <p className="mb-1.5 text-xs font-medium text-muted-foreground">Titolo lezione</p>
                  <input
                    value={titolo}
                    onChange={(event) => setTitolo(event.target.value)}
                    className="h-10 w-full rounded-xl border border-border/60 bg-background px-3 text-sm outline-none transition-colors focus:border-primary"
                  />
                </div>

                <div>
                  <p className="mb-1.5 text-xs font-medium text-muted-foreground">Macrosezione</p>
                  <select
                    value={sectionIdForLesson}
                    onChange={(event) => setSectionIdForLesson(event.target.value)}
                    className="h-10 w-full rounded-xl border border-border/60 bg-background px-3 text-sm outline-none transition-colors focus:border-primary"
                  >
                    {sections.map((section) => (
                      <option key={section.id} value={section.id}>
                        {section.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="rounded-2xl border border-border/50 bg-background/50 p-1">
                <div className="flex flex-col gap-2 p-2">
                  <div className="inline-flex rounded-lg bg-muted/50 p-0.5">
                    <button
                      onClick={() => setActiveTab("structured")}
                      className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-all ${activeTab === "structured" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      Editor nodi
                    </button>
                    <button
                      onClick={() => setActiveTab("preview")}
                      className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-all ${activeTab === "preview" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      Anteprima
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      onClick={async () => {
                        if (!structuredContent || !selectedLesson) return;
                        const patch = buildLessonPatch(selectedLesson.lesson_id, structuredContent);
                        try {
                          await navigator.clipboard.writeText(patch);
                          toast({ title: "Patch TypeScript copiata" });
                        } catch {
                          toast({ title: "Impossibile copiare", variant: "destructive" });
                        }
                      }}
                      className="inline-flex items-center gap-1 rounded-lg border border-border/60 bg-background px-2 py-1.5 text-[10px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <Clipboard size={12} />
                      Esporta patch TS
                    </button>
                  </div>
                </div>

                <div className="px-1 pb-1">
                  {activeTab === "structured" ? (
                    <div className="grid min-h-[460px] gap-3 rounded-xl border border-border/60 bg-background p-3 md:grid-cols-[170px_1fr]">
                      <div className="space-y-2">
                        {NODE_ORDER.map((nodeKey) => (
                          <button
                            key={nodeKey}
                            onClick={() => setActiveNode(nodeKey)}
                            className={`w-full rounded-xl border px-3 py-2 text-left text-xs font-semibold transition-colors ${
                              activeNode === nodeKey ? "border-primary bg-primary/10 text-primary" : "border-border/60 bg-card hover:bg-muted"
                            }`}
                          >
                            {nodeKey.toUpperCase()}
                          </button>
                        ))}
                      </div>

                      {structuredContent ? (
                        <div className="space-y-3">
                          {BLOCK_ORDER.map((blockKind) => {
                            const block = structuredContent[activeNode].blocks.find((entry) => entry.kind === blockKind);
                            return (
                              <div key={`${activeNode}-${blockKind}`} className="space-y-1">
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{blockKind}</p>
                                <textarea
                                  value={block?.content || ""}
                                  onChange={(event) => updateNodeBlock(activeNode, blockKind, event.target.value)}
                                  className="min-h-[92px] w-full rounded-xl border border-border/60 bg-background p-3 text-sm leading-relaxed outline-none transition-colors focus:border-primary"
                                />
                              </div>
                            );
                          })}

                          <div className="space-y-1">
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">options (una per riga)</p>
                            <textarea
                              value={(structuredContent[activeNode].options || []).join("\n")}
                              onChange={(event) => updateNodeOptions(activeNode, event.target.value)}
                              className="min-h-[80px] w-full rounded-xl border border-border/60 bg-background p-3 text-xs leading-relaxed outline-none transition-colors focus:border-primary"
                            />
                          </div>

                          <div className="space-y-1">
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">suggested prompts (una per riga)</p>
                            <textarea
                              value={(structuredContent[activeNode].suggestedPrompts || []).join("\n")}
                              onChange={(event) => updateSuggestedPrompts(activeNode, event.target.value)}
                              className="min-h-[80px] w-full rounded-xl border border-border/60 bg-background p-3 text-xs leading-relaxed outline-none transition-colors focus:border-primary"
                            />
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div className="min-h-[360px] space-y-3 rounded-xl border border-border/60 bg-background p-4">
                      {previewSections.map((section) => (
                        <details key={section.id} className="group rounded-xl border border-border/50 bg-card/40 transition-colors hover:bg-card/80">
                          <summary className="cursor-pointer select-none px-4 py-3 text-sm font-semibold text-foreground">
                            {section.title}
                          </summary>
                          <article className="prose prose-sm mx-4 mb-4 max-w-none border-t border-border/30 pt-3 text-muted-foreground">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{section.body}</ReactMarkdown>
                          </article>
                        </details>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 rounded-2xl border border-border/50 bg-card p-4">
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-sm font-semibold">Immagine card</p>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Top 35%</span>
                </div>
                <div className="relative mb-2 aspect-square w-full overflow-hidden rounded-xl border border-border/40 bg-muted/30">
                  {selectedLesson.card_image_url ? (
                    <img src={selectedLesson.card_image_url} alt={selectedLesson.titolo} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-100/50 to-cyan-100/50">
                      <ImagePlus size={24} className="text-emerald-700/20" />
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => uploadRef.current?.click()}
                    disabled={uploadImageMutation.isPending}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border/60 bg-muted/30 px-2 py-2.5 text-[11px] font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
                  >
                    <ImagePlus size={14} />
                    {uploadImageMutation.isPending ? "Upload..." : "Manuale"}
                  </button>
                  <button
                    onClick={() => generateImagesMutation.mutate({ lessonId: selectedLesson.lesson_id, force: true })}
                    disabled={generateImagesMutation.isPending}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border/60 bg-muted/30 px-2 py-2.5 text-[11px] font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
                  >
                    <Wand2 size={14} />
                    {generateImagesMutation.isPending ? "Genero..." : "AI Gen"}
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-border/50 bg-card p-4">
                <p className="mb-3 text-sm font-semibold">Checklist struttura</p>
                <div className="space-y-2">
                  {sectionStatus.map((section) => (
                    <div
                      key={section.section}
                      className="flex items-center justify-between rounded-xl border border-border/40 bg-card/50 px-3 py-2.5"
                    >
                      <span className="text-xs font-medium">{section.section}</span>
                      {section.ok ? (
                        <CheckCircle2 size={16} className="text-emerald-600" />
                      ) : (
                        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">Manca</span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3">
                  <div className="text-[11px] font-medium text-muted-foreground">
                    Completamento
                  </div>
                  <div className="text-xs font-semibold text-primary">
                    {completedSections} / {requiredSections.length}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => saveMutation.mutate()}
                  disabled={saveMutation.isPending || !titolo.trim() || !structuredContent || !isDirty}
                  className="rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  {saveMutation.isPending ? "Salvataggio..." : "Salva modifiche"}
                </button>
                <button
                  onClick={() => {
                    if (!selectedLesson) return;
                    setTitolo(selectedLesson.titolo);
                    const fromFile = cloneStructuredContent(resolveLessonDefinition(selectedLesson.lesson_id).buildStructuredContent());
                    setStructuredContent(fromFile);
                    setStructuredInitialHash(JSON.stringify(fromFile));
                    setContent(lessonPlaceholderContent(selectedLesson.lesson_id));
                    setSectionIdForLesson(selectedLessonSectionId);
                    if (selectedLessonId) localStorage.removeItem(`academy-lesson-draft:${selectedLessonId}`);
                    setHasDraftLoaded(false);
                  }}
                  disabled={!isDirty && !hasDraftLoaded}
                  className="rounded-xl border border-border/60 bg-background px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
                >
                  Ripristina
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="mt-4 rounded-2xl border border-border/50 bg-card p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Apri il dropdown macrosezioni, scegli una macrosezione e poi una lezione dal modale.
          </p>
        </div>
      )}

      <AnimatePresence>
        {isLessonModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 md:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-lg rounded-2xl border border-border/50 bg-card p-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">
                  {selectedSection?.title || "Lezioni macrosezione"}
                </h3>
                <button
                  onClick={() => setIsLessonModalOpen(false)}
                  className="rounded-lg border border-border/60 px-2 py-1 text-xs text-muted-foreground"
                >
                  Chiudi
                </button>
              </div>
              <div className="relative mt-3">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={searchInModal}
                  onChange={(event) => setSearchInModal(event.target.value)}
                  placeholder="Cerca lezione..."
                  className="h-9 w-full rounded-xl border border-border/60 bg-background pl-9 pr-3 text-xs outline-none"
                />
              </div>

              <motion.div
                initial={{ x: 16, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="mt-3 max-h-[48vh] space-y-2 overflow-y-auto pr-1"
              >
                {modalLessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      handleSelectLesson(lesson);
                      setIsLessonModalOpen(false);
                    }}
                    className="w-full rounded-xl border border-border/50 bg-background p-3 text-left hover:bg-muted"
                  >
                    <p className="text-xs font-semibold">Lezione {lesson.lesson_id}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{lesson.titolo}</p>
                  </button>
                ))}

                {modalLessons.length === 0 && (
                  <p className="rounded-xl border border-border/50 bg-background p-3 text-xs text-muted-foreground">
                    Nessuna lezione trovata in questa macrosezione.
                  </p>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!!deleteSectionId && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 md:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="w-full max-w-md rounded-2xl border border-border/50 bg-card p-4"
            >
              <h3 className="text-sm font-semibold">Elimina macrosezione</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Se contiene lezioni, scegli se spostarle o eliminarle insieme alla macrosezione.
              </p>

              <div className="mt-3 space-y-2 text-xs">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={deleteMode === "move"}
                    onChange={() => setDeleteMode("move")}
                  />
                  Sposta lezioni verso un&apos;altra macrosezione
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={deleteMode === "delete_lessons"}
                    onChange={() => setDeleteMode("delete_lessons")}
                  />
                  Elimina anche le lezioni della macrosezione
                </label>
              </div>

              {deleteMode === "move" && (
                <select
                  value={targetSectionId}
                  onChange={(event) => setTargetSectionId(event.target.value)}
                  className="mt-3 h-10 w-full rounded-xl border border-border/60 bg-background px-3 text-xs outline-none"
                >
                  <option value="">Seleziona destinazione</option>
                  {sections
                    .filter((section) => section.id !== deleteSectionId)
                    .map((section) => (
                      <option key={section.id} value={section.id}>
                        {section.title}
                      </option>
                    ))}
                </select>
              )}

              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setDeleteSectionId("");
                    setTargetSectionId("");
                  }}
                  className="rounded-xl border border-border/60 px-3 py-2 text-xs text-muted-foreground"
                >
                  Annulla
                </button>
                <button
                  onClick={() => deleteSectionMutation.mutate()}
                  disabled={deleteSectionMutation.isPending}
                  className="inline-flex items-center gap-1 rounded-xl bg-destructive px-3 py-2 text-xs font-medium text-destructive-foreground disabled:opacity-50"
                >
                  <Trash2 size={12} />
                  {deleteSectionMutation.isPending ? "Elimino..." : "Conferma eliminazione"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {(lessonsLoading || sectionsLoading) && (
        <p className="mt-3 text-xs text-muted-foreground">Caricamento lezioni e macrosezioni...</p>
      )}
    </motion.div>
  );
};

type SectionRowProps = {
  section: AcademySection;
  lessonCount: number;
  disableUp: boolean;
  disableDown: boolean;
  onSave: (section: AcademySection) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
};

const SectionRow = ({
  section,
  lessonCount,
  disableUp,
  disableDown,
  onSave,
  onMoveUp,
  onMoveDown,
  onDelete,
}: SectionRowProps) => {
  const [title, setTitle] = useState(section.title);
  const [description, setDescription] = useState(section.description);

  useEffect(() => {
    setTitle(section.title);
    setDescription(section.description);
  }, [section.description, section.title]);

  const dirty = title.trim() !== section.title || description.trim() !== section.description;

  return (
    <div className="rounded-xl border border-border/50 bg-background p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold">{lessonCount} lezioni</p>
        <div className="flex gap-1">
          <button
            onClick={onMoveUp}
            disabled={disableUp}
            className="rounded-lg border border-border/60 px-2 py-1 text-[10px] disabled:opacity-40"
          >
            Su
          </button>
          <button
            onClick={onMoveDown}
            disabled={disableDown}
            className="rounded-lg border border-border/60 px-2 py-1 text-[10px] disabled:opacity-40"
          >
            Giu
          </button>
        </div>
      </div>
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        className="h-8 w-full rounded-lg border border-border/60 bg-card px-2 text-xs outline-none"
      />
      <input
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        className="mt-2 h-8 w-full rounded-lg border border-border/60 bg-card px-2 text-xs outline-none"
      />
      <div className="mt-2 flex justify-between">
        <button
          onClick={onDelete}
          className="inline-flex items-center gap-1 rounded-lg border border-destructive/50 px-2 py-1 text-[10px] text-destructive"
        >
          <Trash2 size={11} />
          Elimina
        </button>
        <button
          onClick={() => onSave({ ...section, title, description })}
          disabled={!dirty || !title.trim() || !description.trim()}
          className="rounded-lg border border-border/60 px-2 py-1 text-[10px] disabled:opacity-50"
        >
          Salva
        </button>
      </div>
    </div>
  );
};

export default AdminAccademia;
