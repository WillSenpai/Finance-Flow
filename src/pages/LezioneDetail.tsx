import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { usePoints } from "@/contexts/PointsContext";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import LessonStepper from "@/components/academy/LessonStepper";
import LessonIntro from "@/components/academy/LessonIntro";
import { getAcademyLessonMeta, getDefaultLessonTitle } from "@/lib/academy";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { isNativeBillingPlatform, loadBillingOfferingMetadata, loadBillingOffers } from "@/lib/billing/revenuecat";

type ChatMessage = { role: "user" | "assistant"; content: string };
type StepType = string;

type LessonNodeRuntime = {
  lesson_node_id: string;
  node_key: StepType;
  title: string;
  description: string;
  sort_order: number;
  status: "locked" | "available" | "completed" | "skipped";
};

type LessonNodesPayload = {
  lesson_id: string;
  total_nodes: number;
  completed_nodes: number;
  skipped_nodes: number;
  lesson_completed: boolean;
  nodes: LessonNodeRuntime[];
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/academy-lesson`;
const ILLUSTRATIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-lesson-illustrations`;
const LESSON_NODES_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/academy-lesson-nodes`;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

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
  const navigate = useNavigate();
  const { awardPoints } = usePoints();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const lessonId = id || "1";
  const lessonMeta = getAcademyLessonMeta(lessonId);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [showProPopup, setShowProPopup] = useState(false);
  const completionSyncedRef = useRef(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const invokeLessonNodes = async <T,>(body: Record<string, unknown>): Promise<T> => {
    const response = await fetch(LESSON_NODES_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_PUBLISHABLE_KEY,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message =
        (typeof data?.error === "string" && data.error) ||
        (typeof data?.message === "string" && data.message) ||
        `HTTP ${response.status}`;
      throw new Error(message);
    }

    return data as T;
  };

  const getAccessToken = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session?.access_token) {
      throw new Error("Sessione non valida. Effettua nuovamente il login.");
    }
    return data.session.access_token;
  };

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
  const explanation =
    lessonData?.content ||
    "### Concept\nContenuto gestito da file locale.\n### Widget\nContenuto gestito da file locale.\n### Challenge\nContenuto gestito da file locale.\n### Feedback\nContenuto gestito da file locale.";

  const { data: nodeRuntime, isLoading: nodesLoading } = useQuery({
    queryKey: ["academy-lesson-nodes", user?.id, lessonId],
    queryFn: async (): Promise<LessonNodesPayload> => {
      return invokeLessonNodes<LessonNodesPayload>({
        action: "get",
        lesson_id: lessonId,
        user_id: user?.id,
      });
    },
    enabled: !!user,
    staleTime: 15 * 1000,
  });

  const { data: legacyCompletion } = useQuery({
    queryKey: ["lesson-progress-single", user?.id, lessonId],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("lesson_progress")
        .select("lesson_id")
        .eq("user_id", user.id)
        .eq("lesson_id", lessonId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
    staleTime: 60 * 1000,
  });

  const { data: planData } = useQuery({
    queryKey: ["user-ai-plan", user?.id],
    queryFn: async () => {
      if (!user) return { plan: "free" as "free" | "pro" };
      const { data } = await supabase
        .from("user_ai_plans" as never)
        .select("plan")
        .eq("user_id", user.id)
        .maybeSingle();
      const plan = (data as { plan?: string } | null)?.plan === "pro" ? "pro" : "free";
      return { plan };
    },
    enabled: !!user,
    staleTime: 60 * 1000,
  });

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

  const generateIllustrations = generateMutation.mutate;
  const isGeneratingIntro = generateMutation.isPending;
  const isGenerationDone = generateMutation.isSuccess;

  useEffect(() => {
    const shouldGenerate =
      !illustrationsLoading &&
      illustrations?.length === 0 &&
      explanation &&
      !isGeneratingIntro &&
      !isGenerationDone &&
      showIntro;
    if (shouldGenerate) generateIllustrations();
  }, [illustrationsLoading, illustrations, explanation, generateIllustrations, isGeneratingIntro, isGenerationDone, showIntro]);

  useEffect(() => {
    if (!user || !nodeRuntime?.lesson_completed || completionSyncedRef.current) return;
    if (legacyCompletion?.lesson_id) {
      completionSyncedRef.current = true;
      return;
    }

    const syncLegacy = async () => {
      const insertRes = await supabase.from("lesson_progress").insert({ user_id: user.id, lesson_id: lessonId });
      if (insertRes.error && !insertRes.error.message.toLowerCase().includes("duplicate")) {
        console.warn("lesson_progress sync warning:", insertRes.error.message);
        return;
      }

      completionSyncedRef.current = true;
      awardPoints("complete_lesson");
      awardPoints("view_lesson");
      queryClient.invalidateQueries({ queryKey: ["lesson-progress"] });
      queryClient.invalidateQueries({ queryKey: ["lesson-progress-single", user.id, lessonId] });
      toast({ title: "Lezione completata", description: "Hai completato tutti i nodi della lezione." });
    };

    syncLegacy();
  }, [awardPoints, legacyCompletion?.lesson_id, lessonId, nodeRuntime?.lesson_completed, queryClient, user]);

  const advanceNode = async (nodeKey: StepType, payload?: Record<string, unknown>) => {
    await invokeLessonNodes({
      action: "advance",
      lesson_id: lessonId,
      user_id: user?.id,
      node_key: nodeKey,
      payload: payload || {},
    });

    queryClient.invalidateQueries({ queryKey: ["academy-lesson-nodes", user?.id, lessonId] });
    queryClient.invalidateQueries({ queryKey: ["lesson-node-progress", user?.id] });
  };

  const skipNode = async (nodeKey: StepType) => {
    try {
      await invokeLessonNodes({
        action: "skip",
        lesson_id: lessonId,
        user_id: user?.id,
        node_key: nodeKey,
      });

      queryClient.invalidateQueries({ queryKey: ["academy-lesson-nodes", user?.id, lessonId] });
      queryClient.invalidateQueries({ queryKey: ["lesson-node-progress", user?.id] });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Errore durante lo skip";
      if (message.includes("PRO_REQUIRED_FOR_SKIP")) {
        setShowProPopup(true);
        throw new Error("PRO_REQUIRED_FOR_SKIP");
      }
      throw error;
    }
  };

  const submitOptionalQuiz = async (score: number, passed: boolean) => {
    await invokeLessonNodes({
      action: "submit_optional_quiz",
      lesson_id: lessonId,
      user_id: user?.id,
      score,
      passed,
    });

    toast({ title: "Quiz salvato", description: "Risultato del quiz facoltativo registrato." });
  };

  const openProPage = async () => {
    if (user?.id && isNativeBillingPlatform()) {
      await Promise.allSettled([
        queryClient.prefetchQuery({
          queryKey: ["billing-offers", user.id],
          queryFn: () => loadBillingOffers(user.id),
        }),
        queryClient.prefetchQuery({
          queryKey: ["billing-offering-metadata", user.id],
          queryFn: () => loadBillingOfferingMetadata(user.id),
        }),
      ]);
    }
    navigate("/profilo/pro");
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
  const isLessonCompleted = Boolean(nodeRuntime?.lesson_completed);

  return (
    <div className="flex h-full min-h-full flex-col overflow-hidden px-5 pt-10 pb-4">
      {!(showIntro && (hasIllustrations || isGenerating)) && (
        <>
          <div className="mb-3 flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1 whitespace-nowrap text-sm font-medium text-primary"
            >
              <ArrowLeft size={18} /> Torna all&apos;Accademia
            </button>
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
          {explanationLoading || nodesLoading ? (
            <div className="flex-1 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[90%]" />
            </div>
          ) : (
            <LessonStepper
              lessonId={lessonId}
              nodes={nodeRuntime?.nodes || []}
              isLessonCompleted={isLessonCompleted}
              isProUser={planData?.plan === "pro"}
              onAdvanceNode={async (nodeKey, payload) => {
                try {
                  await advanceNode(nodeKey, payload);
                } catch (e) {
                  toast({
                    title: "Errore",
                    description: e instanceof Error ? e.message : "Impossibile completare il nodo.",
                    variant: "destructive",
                  });
                  throw e;
                }
              }}
              onSkipNode={async (nodeKey) => {
                try {
                  await skipNode(nodeKey);
                } catch (e) {
                  if (e instanceof Error && e.message === "PRO_REQUIRED_FOR_SKIP") {
                    return Promise.reject(e);
                  }
                  toast({
                    title: "Errore",
                    description: e instanceof Error ? e.message : "Impossibile skippare il nodo.",
                    variant: "destructive",
                  });
                  throw e;
                }
              }}
              onSubmitOptionalQuiz={async (score, passed) => {
                try {
                  await submitOptionalQuiz(score, passed);
                } catch (e) {
                  toast({
                    title: "Errore",
                    description: e instanceof Error ? e.message : "Impossibile inviare il quiz.",
                    variant: "destructive",
                  });
                  throw e;
                }
              }}
              chatMessages={chatMessages}
              chatInput={chatInput}
              onChatInputChange={setChatInput}
              onSendChat={sendChatMessage}
              isChatLoading={isChatLoading}
            />
          )}
        </>
      )}

      <Dialog open={showProPopup} onOpenChange={setShowProPopup}>
        <DialogContent className="max-w-[360px] rounded-2xl" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Skip disponibile solo con Pro</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Con il piano Pro puoi skippare i nodi temporaneamente e tornare dopo. Per completare la lezione dovrai comunque completarli tutti.
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => setShowProPopup(false)}>Chiudi</Button>
            <Button onClick={() => void openProPage()}>Vai a Pro</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LezioneDetail;
