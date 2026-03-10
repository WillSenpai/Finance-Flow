import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Sparkles, Loader2, ArrowDown, History, MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/hooks/useUser";
import { usePoints } from "@/contexts/PointsContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import ChatMarkdown from "@/components/chat/ChatMarkdown";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { toast } from "sonner";

interface Messaggio {
  id: string;
  testo: string;
  mittente: "assistant" | "user";
  createdAt?: string;
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

const corsiAccademia = [
  { titolo: "Cos'è un budget?", completate: 3, totali: 5 },
  { titolo: "Risparmiare senza fatica", completate: 1, totali: 4 },
  { titolo: "Debiti buoni e cattivi", completate: 0, totali: 3 },
  { titolo: "Che cos'è un investimento?", completate: 2, totali: 5 },
  { titolo: "I fondi spiegati semplice", completate: 0, totali: 4 },
  { titolo: "Rischio: non è una parolaccia", completate: 0, totali: 6 },
  { titolo: "Fondo emergenza: perché serve", completate: 4, totali: 4 },
  { titolo: "Assicurazioni in parole povere", completate: 1, totali: 5 },
];

const fallbackSuggestions = [
  "Analizza le mie spese del mese",
  "Spiegami cos'è un ETF",
  "Come posso risparmiare di più?",
];

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

function getWelcomeMessage(name: string): string {
  return `Ciao ${name}! 👋 Sono **Mark**, la tua guida finanziaria personale.\n\nPosso aiutarti con:\n- 📊 **Analisi spese** con tabelle dettagliate\n- 🗺️ **Mappe concettuali** per studiare concetti finanziari\n- 🧭 **Navigazione** rapida nell'app\n\nChiedimi qualsiasi cosa!`;
}

function buildConversationTitle(text: string): string {
  const singleLine = text.replace(/\s+/g, " ").trim();
  if (!singleLine) return "Nuova chat";
  return singleLine.length > 60 ? `${singleLine.slice(0, 57)}...` : singleLine;
}

function formatConversationDate(isoDate: string): string {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

const Coach = () => {
  const { user } = useAuth();
  const { userData, categorie, salvadanai, investimenti, spese, categorieSpese } = useUser();
  const { points, streak, badges, challenges } = usePoints();

  const [messaggi, setMessaggi] = useState<Messaggio[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isConversationLoading, setIsConversationLoading] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>(fallbackSuggestions);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isStreamingRef = useRef(false);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const userScrolledUp = useRef(false);

  const checkIfScrolledUp = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return false;
    const { scrollTop, scrollHeight, clientHeight } = container;
    return scrollHeight - scrollTop - clientHeight > 100;
  }, []);

  useEffect(() => {
    if (isStreamingRef.current) return;
    if (!userScrolledUp.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messaggi]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const isUp = checkIfScrolledUp();
      userScrolledUp.current = isUp;
      setShowScrollDown(isUp);
    };
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [checkIfScrolledUp]);

  const scrollToBottom = () => {
    userScrolledUp.current = false;
    setShowScrollDown(false);
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getAccessToken = useCallback(async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session?.access_token) {
      throw new Error("Sessione non valida. Effettua nuovamente il login.");
    }
    return data.session.access_token;
  }, []);

  const buildContext = useCallback(() => {
    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const monthlySpese = spese.filter((s) => s.data.startsWith(thisMonth));
    const speseThisMonth = monthlySpese.reduce((a, s) => a + s.importo, 0);
    const patrimonio = categorie.reduce((a, c) => a + c.valore, 0) + investimenti.reduce((a, i) => a + i.valore, 0);

    const spesePerCategoria = categorieSpese
      .map((cat) => {
        const totale = monthlySpese.filter((s) => s.categoriaId === cat.id).reduce((a, s) => a + s.importo, 0);
        return { nome: `${cat.emoji} ${cat.nome}`, totale };
      })
      .filter((c) => c.totale > 0);

    return {
      name: userData.name,
      level: userData.level,
      goals: userData.goals,
      patrimonio,
      salvadanai: salvadanai.map((s) => ({ nome: s.nome, attuale: s.attuale, obiettivo: s.obiettivo })),
      investimenti: investimenti.map((i) => ({ nome: i.nome, valore: i.valore })),
      speseThisMonth,
      spesePerCategoria,
      points,
      streak,
      badgeSbloccati: badges.filter((b) => b.sbloccato).map((b) => `${b.emoji} ${b.nome}`),
      badgeDaSbloccare: badges.filter((b) => !b.sbloccato).map((b) => `${b.emoji} ${b.nome}`),
      sfideAttive: challenges.map((c) => ({ nome: c.nome, progresso: c.progresso, target: c.target, completata: c.completata })),
      corsi: corsiAccademia,
    };
  }, [userData, categorie, salvadanai, investimenti, spese, categorieSpese, points, streak, badges, challenges]);

  const fetchSuggestions = useCallback(
    async (baseMessages: Messaggio[]) => {
      const serialized = baseMessages.slice(-10).map((m) => ({
        role: m.mittente === "user" ? "user" : "assistant",
        content: m.testo,
      }));

      setIsSuggestionsLoading(true);
      try {
        const accessToken = await getAccessToken();
        const resp = await fetch(CHAT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            mode: "suggestions",
            messages: serialized,
            context: buildContext(),
          }),
        });

        if (!resp.ok) {
          setSuggestions(fallbackSuggestions);
          return;
        }

        const data = (await resp.json().catch(() => ({}))) as { suggestions?: string[] };
        const nextSuggestions = Array.isArray(data.suggestions) && data.suggestions.length === 3
          ? data.suggestions
          : fallbackSuggestions;
        setSuggestions(nextSuggestions);
      } catch {
        setSuggestions(fallbackSuggestions);
      } finally {
        setIsSuggestionsLoading(false);
      }
    },
    [buildContext, getAccessToken],
  );

  const refreshConversations = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("coach_conversations")
      .select("id, title, created_at, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Failed to load conversations", error);
      return;
    }

    setConversations(data ?? []);
  }, [user]);

  const loadMessagesForConversation = useCallback(
    async (conversationId: string) => {
      setIsConversationLoading(true);
      const { data, error } = await supabase
        .from("coach_messages")
        .select("id, role, content, created_at")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) {
        toast.error("Impossibile caricare i messaggi");
        setIsConversationLoading(false);
        return;
      }

      const loadedMessages: Messaggio[] = (data ?? []).map((m) => ({
        id: m.id,
        testo: m.content,
        mittente: m.role === "user" ? "user" : "assistant",
        createdAt: m.created_at,
      }));

      setMessaggi(loadedMessages);
      setCurrentConversationId(conversationId);
      setIsConversationLoading(false);
      void fetchSuggestions(loadedMessages);
    },
    [fetchSuggestions],
  );

  const createConversation = useCallback(
    async (options?: { withGreeting?: boolean }) => {
      if (!user) return null;

      const { data: created, error } = await supabase
        .from("coach_conversations")
        .insert({ user_id: user.id, title: "Nuova chat" })
        .select("id, title, created_at, updated_at")
        .single();

      if (error || !created) {
        toast.error("Impossibile creare una nuova chat");
        return null;
      }

      let localMessages: Messaggio[] = [];
      if (options?.withGreeting) {
        const welcome = getWelcomeMessage(userData.name);
        const { data: insertedGreeting } = await supabase
          .from("coach_messages")
          .insert({
            conversation_id: created.id,
            user_id: user.id,
            role: "assistant",
            content: welcome,
          })
          .select("id, created_at")
          .single();

        localMessages = [
          {
            id: insertedGreeting?.id ?? `welcome-${Date.now()}`,
            testo: welcome,
            mittente: "assistant",
            createdAt: insertedGreeting?.created_at,
          },
        ];
      }

      setCurrentConversationId(created.id);
      setMessaggi(localMessages);
      setConversations((prev) => [created, ...prev]);
      void fetchSuggestions(localMessages);

      return created;
    },
    [fetchSuggestions, user, userData.name],
  );

  const handleCreateNewChat = useCallback(async () => {
    setIsHistoryOpen(false);
    await createConversation({ withGreeting: true });
  }, [createConversation]);

  useEffect(() => {
    if (!user) {
      setMessaggi([{ id: "welcome-local", testo: getWelcomeMessage(userData.name), mittente: "assistant" }]);
      setConversations([]);
      setCurrentConversationId(null);
      setIsBootstrapping(false);
      void fetchSuggestions([]);
      return;
    }

    let cancelled = false;
    const bootstrap = async () => {
      setIsBootstrapping(true);
      const { data, error } = await supabase
        .from("coach_conversations")
        .select("id, title, created_at, updated_at")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (cancelled) return;

      if (error) {
        console.error("Failed to bootstrap coach", error);
        toast.error("Errore nel caricamento dello storico");
        setIsBootstrapping(false);
        return;
      }

      const loadedConversations = data ?? [];
      setConversations(loadedConversations);

      if (loadedConversations.length === 0) {
        await createConversation({ withGreeting: true });
      } else {
        await loadMessagesForConversation(loadedConversations[0].id);
      }

      if (!cancelled) setIsBootstrapping(false);
    };

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, [createConversation, fetchSuggestions, loadMessagesForConversation, user, userData.name]);

  const inviaMessaggio = async (testo: string) => {
    const cleaned = testo.trim();
    if (!cleaned || isLoading) return;

    if (!user) {
      toast.error("Accedi per salvare e continuare la conversazione");
      return;
    }

    setIsHistoryOpen(false);
    setInput("");
    setIsLoading(true);

    let activeConversationId = currentConversationId;
    if (!activeConversationId) {
      const created = await createConversation({ withGreeting: true });
      activeConversationId = created?.id ?? null;
    }

    if (!activeConversationId) {
      setIsLoading(false);
      return;
    }

    const userMessage: Messaggio = {
      id: `user-${Date.now()}`,
      testo: cleaned,
      mittente: "user",
      createdAt: new Date().toISOString(),
    };

    const updatedMessages = [...messaggi, userMessage];
    setMessaggi(updatedMessages);

    const hasAnyUserMessage = messaggi.some((m) => m.mittente === "user");
    if (!hasAnyUserMessage) {
      const nextTitle = buildConversationTitle(cleaned);
      await supabase
        .from("coach_conversations")
        .update({ title: nextTitle })
        .eq("id", activeConversationId)
        .eq("user_id", user.id);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversationId
            ? { ...c, title: nextTitle, updated_at: new Date().toISOString() }
            : c,
        ),
      );
    }

    const { error: insertUserError } = await supabase.from("coach_messages").insert({
      conversation_id: activeConversationId,
      user_id: user.id,
      role: "user",
      content: cleaned,
    });

    if (insertUserError) {
      console.error(insertUserError);
      toast.error("Impossibile salvare il messaggio");
      setIsLoading(false);
      return;
    }

    const aiMessages = updatedMessages.map((m) => ({
      role: m.mittente === "user" ? ("user" as const) : ("assistant" as const),
      content: m.testo,
    }));

    try {
      isStreamingRef.current = true;
      const accessToken = await getAccessToken();
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ messages: aiMessages, context: buildContext() }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Errore di rete" }));
        toast.error(err.error || `Errore ${resp.status}`);
        setIsLoading(false);
        return;
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let assistantSoFar = "";
      const assistantTempId = `assistant-${Date.now()}`;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (!content) continue;

            assistantSoFar += content;
            const currentText = assistantSoFar;
            setMessaggi((prev) => {
              const last = prev[prev.length - 1];
              if (last?.mittente === "assistant" && last.id === assistantTempId) {
                return prev.map((m, i) => (i === prev.length - 1 ? { ...m, testo: currentText } : m));
              }
              return [...prev, { id: assistantTempId, testo: currentText, mittente: "assistant" }];
            });
          } catch {
            textBuffer = `${line}\n${textBuffer}`;
            break;
          }
        }
      }

      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (!content) continue;

            assistantSoFar += content;
            const currentText = assistantSoFar;
            setMessaggi((prev) => {
              const last = prev[prev.length - 1];
              if (last?.mittente === "assistant" && last.id === assistantTempId) {
                return prev.map((m, i) => (i === prev.length - 1 ? { ...m, testo: currentText } : m));
              }
              return [...prev, { id: assistantTempId, testo: currentText, mittente: "assistant" }];
            });
          } catch {
            // ignore malformed line
          }
        }
      }

      if (!assistantSoFar) {
        assistantSoFar = "Mi dispiace, non sono riuscito a rispondere. Riprova! 🙏";
        setMessaggi((prev) => [...prev, { id: assistantTempId, testo: assistantSoFar, mittente: "assistant" }]);
      }

      const { data: insertedAssistant } = await supabase
        .from("coach_messages")
        .insert({
          conversation_id: activeConversationId,
          user_id: user.id,
          role: "assistant",
          content: assistantSoFar,
        })
        .select("id, created_at")
        .single();

      if (insertedAssistant) {
        setMessaggi((prev) =>
          prev.map((m) =>
            m.id === assistantTempId
              ? { ...m, id: insertedAssistant.id, createdAt: insertedAssistant.created_at }
              : m,
          ),
        );
      }

      await refreshConversations();
      void fetchSuggestions([...updatedMessages, { id: "assistant-final", testo: assistantSoFar, mittente: "assistant" }]);
    } catch (e) {
      console.error("Chat error:", e);
      toast.error("Errore di connessione. Riprova.");
    } finally {
      isStreamingRef.current = false;
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full min-h-full flex-col overflow-hidden">
      <div className="relative px-5 pb-4 text-center border-b border-border/50 pt-[36px]">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setIsHistoryOpen(true)}
          className="absolute right-5 top-6 rounded-full"
          aria-label="Apri storico conversazioni"
        >
          <History size={18} />
        </Button>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2"
        >
          <Sparkles size={28} className="text-primary" />
        </motion.div>
        <h1 className="text-lg font-semibold">Mark, la tua guida AI</h1>
        <p className="text-xs text-muted-foreground">Tabelle · Mappe concettuali · Navigazione 💡</p>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <div ref={scrollContainerRef} className="h-full overflow-y-auto px-5 py-4 space-y-3">
          {(isBootstrapping || isConversationLoading) && (
            <div className="flex justify-center py-8">
              <Loader2 size={20} className="animate-spin text-primary" />
            </div>
          )}

          <AnimatePresence initial={false}>
            {!isBootstrapping && !isConversationLoading && messaggi.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className={`flex ${msg.mittente === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.mittente === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-card border border-border/50 text-foreground rounded-bl-md"
                  }`}
                >
                  {msg.mittente === "assistant" ? <ChatMarkdown content={msg.testo} /> : msg.testo}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && messaggi[messaggi.length - 1]?.mittente === "user" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="bg-card border border-border/50 rounded-2xl rounded-bl-md px-4 py-3">
                <Loader2 size={18} className="animate-spin text-primary" />
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        <AnimatePresence>
          {showScrollDown && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollToBottom}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 w-9 h-9 rounded-full bg-card border border-border/50 shadow-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowDown size={18} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="px-5 border-t border-border/50 bg-background pt-2 pb-0">
        <div className="flex gap-2 overflow-x-auto mb-3 pb-1 scrollbar-hide">
          {isSuggestionsLoading && (
            <div className="text-xs text-muted-foreground px-2 py-1">Aggiorno i suggerimenti...</div>
          )}
          {suggestions.map((chip) => (
            <motion.button
              key={chip}
              whileTap={{ scale: 0.92 }}
              onClick={() => inviaMessaggio(chip)}
              disabled={isLoading || isBootstrapping || isConversationLoading}
              className="flex-shrink-0 text-xs bg-accent text-accent-foreground px-3 py-1.5 rounded-full font-medium hover:bg-primary/20 transition-colors disabled:opacity-50"
            >
              {chip}
            </motion.button>
          ))}
        </div>

        <div className="grid grid-cols-[1fr_auto] items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && inviaMessaggio(input)}
            placeholder="Scrivi un messaggio..."
            className="h-10 min-h-10 max-h-10 rounded-full bg-card border-border/50"
            disabled={isLoading || isBootstrapping || isConversationLoading}
          />

          <motion.div whileTap={{ scale: 0.9 }} className="h-10 w-10">
            <Button
              onClick={() => inviaMessaggio(input)}
              size="icon"
              className="h-10 w-10 min-h-10 min-w-10 rounded-full p-0 shrink-0"
              disabled={isLoading || isBootstrapping || isConversationLoading}
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </Button>
          </motion.div>
        </div>
      </div>

      <Sheet open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <SheetContent side="right" className="w-[90vw] max-w-sm p-0 pt-[env(safe-area-inset-top)]">
          <SheetHeader className="px-4 py-3 border-b border-border/50 space-y-0.5">
            <SheetTitle className="text-base">Storico conversazioni</SheetTitle>
            <SheetDescription className="text-xs">Conservazione massima: 30 giorni</SheetDescription>
          </SheetHeader>

          <div className="px-3 py-2.5 border-b border-border/50">
            <Button onClick={handleCreateNewChat} className="w-full h-9 rounded-full gap-1.5 text-[13px]">
              <MessageSquarePlus size={14} />
              Nuova chat
            </Button>
          </div>

          <div className="max-h-[calc(var(--app-height)-10rem-env(safe-area-inset-top))] overflow-y-auto p-1.5">
            {conversations.length === 0 ? (
              <div className="text-xs text-muted-foreground px-2.5 py-3">Nessuna conversazione salvata.</div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  type="button"
                  onClick={() => {
                    setIsHistoryOpen(false);
                    void loadMessagesForConversation(conv.id);
                  }}
                  className={`w-full text-left rounded-lg px-2.5 py-2 mb-0.5 border transition-colors ${
                    conv.id === currentConversationId
                      ? "bg-primary/10 border-primary/30"
                      : "bg-card border-border/40 hover:bg-muted/40"
                  }`}
                >
                  <p className="text-[13px] font-medium truncate">{conv.title}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{formatConversationDate(conv.updated_at)}</p>
                </button>
              ))
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Coach;
