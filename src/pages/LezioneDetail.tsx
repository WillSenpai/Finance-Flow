import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { usePoints } from "@/contexts/PointsContext";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { invokeWithAuth } from "@/lib/invokeWithAuth";
import { toast } from "@/hooks/use-toast";
import LessonStepper from "@/components/academy/LessonStepper";
import LessonIntro from "@/components/academy/LessonIntro";
import { getAcademyLessonMeta, getDefaultLessonTitle } from "@/lib/academy";

type ChatMessage = { role: "user" | "assistant"; content: string };
const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/academy-lesson`;
const ILLUSTRATIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-lesson-illustrations`;

function parseStepTitles(markdown: string): { title: string; description: string }[] {
  const sections = markdown.split(/(?=^###\s)/m).filter((s) => s.trim());
  return sections.map((section) => {
    const match = section.match(/^###\s+(.+)/);
    const title = match ? match[1].trim() : "Sezione";
    const content = match ? section.replace(/^###\s+.+\n?/, "").trim() : section.trim();
    const firstSentence = content.split(/[.!?]\s/)[0];
    return { title, description: firstSentence ? firstSentence.slice(0, 120) : "" };
  });
}

const LezioneDetail = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { awardPoints } = usePoints();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const lessonId = id || "1";
  const lessonMeta = getAcademyLessonMeta(lessonId);
  const skillIdFromUrl = searchParams.get("skill");

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [localCompleted, setLocalCompleted] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const getAccessToken = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session?.access_token) {
      throw new Error("Sessione non valida. Effettua nuovamente il login.");
    }
    return data.session.access_token;
  };

  const { data: lessonSkill } = useQuery({
    queryKey: ["academy-skill-for-lesson", lessonId, skillIdFromUrl],
    queryFn: async () => {
      if (skillIdFromUrl) return { id: skillIdFromUrl };
      const { data, error } = await supabase
        .from("academy_skills" as any)
        .select("id")
        .eq("lesson_id", lessonId)
        .eq("is_active", true)
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return (data as { id: string } | null) ?? null;
    },
  });

  const skillId = lessonSkill?.id ?? null;

  const { data: masteryData } = useQuery({
    queryKey: ["user-skill-mastery", user?.id, skillId],
    queryFn: async () => {
      if (!user || !skillId) return null;
      const { data, error } = await supabase
        .from("user_skill_mastery" as any)
        .select("mastery_score")
        .eq("user_id", user.id)
        .eq("skill_id", skillId)
        .maybeSingle();
      if (error) throw error;
      return data as { mastery_score: number } | null;
    },
    enabled: !!user && !!skillId,
  });

  const isCompleted = localCompleted || (masteryData?.mastery_score ?? 0) >= 80;

  const { data: lessonData, isLoading: explanationLoading } = useQuery({
    queryKey: ["academy-lesson-cache", lessonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("academy_lessons_cache")
        .select("titolo, content")
        .eq("lesson_id", lessonId)
        .maybeSingle();
      if (error) throw error;
      return data || null;
    },
    staleTime: 30 * 60 * 1000,
  });

  const lessonTitle = lessonData?.titolo || getDefaultLessonTitle(lessonId);
  const explanation = lessonData?.content || null;

  const { data: illustrations, isLoading: illustrationsLoading } = useQuery({
    queryKey: ["lesson-illustrations", lessonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lesson_illustrations")
        .select("*")
        .eq("lesson_id", lessonId)
        .order("step_index");
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const generateMutation = useMutation({
    mutationFn: async () => {
      if (!explanation) throw new Error("No lesson content");
      const steps = parseStepTitles(explanation);
      const accessToken = await getAccessToken();
      const resp = await fetch(ILLUSTRATIONS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ lessonId, steps }),
      });
      if (!resp.ok) throw new Error("Generation failed");
      return resp.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson-illustrations", lessonId] });
    },
    onError: () => {
      toast({ title: "Errore", description: "Impossibile generare le illustrazioni.", variant: "destructive" });
      setShowIntro(false);
    },
  });

  useEffect(() => {
    const shouldGenerate =
      !illustrationsLoading &&
      illustrations?.length === 0 &&
      explanation &&
      !generateMutation.isPending &&
      !generateMutation.isSuccess &&
      showIntro;
    if (shouldGenerate) generateMutation.mutate();
  }, [illustrationsLoading, illustrations, explanation, generateMutation.isPending, generateMutation.isSuccess, showIntro]);

  const trackSkillEvent = async (eventType: "concept" | "widget" | "challenge" | "review" | "feedback", extra?: Record<string, unknown>) => {
    if (!skillId) return;

    const suffix = eventType === "review"
      ? new Date().toISOString().slice(0, 10)
      : "v1";

    const eventId = `${lessonId}:${skillId}:${eventType}:${suffix}`;
    const payload = {
      event_type: eventType,
      skill_id: skillId,
      event_id: eventId,
      ...(extra || {}),
    };

    await invokeWithAuth("academy-skill-event", { body: payload });

    queryClient.invalidateQueries({ queryKey: ["user-skill-mastery", user?.id, skillId] });
    queryClient.invalidateQueries({ queryKey: ["academy-graph-v1"] });
  };

  const handleComplete = async () => {
    if (!user || !skillId) return;

    try {
      const legacyInsert = await supabase.from("lesson_progress").insert({
        user_id: user.id,
        lesson_id: lessonId,
      });

      if (legacyInsert.error && !legacyInsert.error.message.toLowerCase().includes("duplicate")) {
        console.warn("lesson_progress fallback insert warning:", legacyInsert.error.message);
      }

      awardPoints("complete_lesson");
      awardPoints("view_lesson");
      queryClient.invalidateQueries({ queryKey: ["lesson-progress"] });
      setLocalCompleted(true);
      toast({ title: "Skill completata", description: "Mastery aggiornata e review pianificata." });
    } catch (e) {
      console.error("Error completing skill:", e);
      toast({ title: "Errore", description: "Non è stato possibile salvare il progresso.", variant: "destructive" });
    }
  };

  const sendChatMessage = async () => {
    const text = chatInput.trim();
    if (!text || isChatLoading) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    const allMessages = [...chatMessages, userMsg];
    setChatMessages(allMessages);
    setChatInput("");
    setIsChatLoading(true);

    let assistantContent = "";

    try {
      const accessToken = await getAccessToken();
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          lessonId,
          titolo: lessonTitle,
          messages: allMessages,
        }),
      });

      if (!resp.ok || !resp.body) throw new Error("Stream failed");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              assistantContent += delta;
              setChatMessages([...allMessages, { role: "assistant", content: assistantContent }]);
            }
          } catch {
            // Ignore malformed stream chunk.
          }
        }
      }

      if (!assistantContent) {
        setChatMessages([...allMessages, { role: "assistant", content: "Non sono riuscito a rispondere. Riprova." }]);
      }
    } catch (e) {
      console.error("Chat error:", e);
      setChatMessages([...allMessages, { role: "assistant", content: "Errore nella risposta. Riprova." }]);
    }

    setIsChatLoading(false);
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const hasIllustrations = illustrations && illustrations.length > 0;
  const isGenerating = generateMutation.isPending;

  return (
    <div className="flex h-screen flex-col overflow-hidden px-5 pt-10 pb-4">
      {!(showIntro && (hasIllustrations || isGenerating)) && (
        <>
          <button onClick={() => navigate(-1)} className="mb-2 flex items-center gap-1 text-sm font-medium text-primary">
            <ArrowLeft size={18} /> Torna al graph
          </button>
          <div className="mb-3 flex items-center gap-3">
            <motion.span initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="text-3xl">
              {lessonMeta.emoji}
            </motion.span>
            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-xl font-semibold tracking-tight">
              {lessonTitle}
            </motion.h1>
          </div>
        </>
      )}

      {showIntro && hasIllustrations ? (
        <LessonIntro
          vignettes={illustrations.map((ill) => ({
            title: ill.title,
            description: ill.description,
            imageUrl: ill.image_url,
          }))}
          lessonTitle={lessonTitle}
          lessonEmoji={lessonMeta.emoji}
          onComplete={() => setShowIntro(false)}
          onSkip={() => setShowIntro(false)}
        />
      ) : showIntro && isGenerating ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
            <Loader2 size={32} className="text-primary" />
          </motion.div>
          <p className="text-sm text-muted-foreground">Preparo le vignette della lezione...</p>
          <button onClick={() => setShowIntro(false)} className="mt-2 text-xs text-muted-foreground underline">
            Salta e vai alla lezione
          </button>
        </div>
      ) : (
        <>
          {explanationLoading ? (
            <div className="flex-1 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[90%]" />
            </div>
          ) : explanation ? (
            <LessonStepper
              markdown={explanation}
              isCompleted={isCompleted}
              onComplete={handleComplete}
              onTrackEvent={trackSkillEvent}
              chatMessages={chatMessages}
              chatInput={chatInput}
              onChatInputChange={setChatInput}
              onSendChat={sendChatMessage}
              isChatLoading={isChatLoading}
            />
          ) : (
            <p className="text-sm italic text-muted-foreground">Contenuto della lezione non ancora disponibile.</p>
          )}
        </>
      )}
    </div>
  );
};

export default LezioneDetail;
