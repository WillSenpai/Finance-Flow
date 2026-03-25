import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Send,
  Trash2,
  Loader2,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useSharedWorkspace } from "@/hooks/useSharedWorkspace";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { it } from "date-fns/locale";
import { toast } from "sonner";

interface Comment {
  id: string;
  expense_id: string;
  workspace_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  userName?: string;
}

interface ExpenseCommentsProps {
  expenseId: string;
  showInput?: boolean;
  maxComments?: number;
  onCommentAdded?: () => void;
}

export function ExpenseComments({
  expenseId,
  showInput = true,
  maxComments,
  onCommentAdded,
}: ExpenseCommentsProps) {
  const { workspaceId, members } = useSharedWorkspace();
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchComments = async () => {
    if (!expenseId || !workspaceId) return;

    setIsLoading(true);
    try {
      let query = supabase
        .from("expense_comments")
        .select("*")
        .eq("expense_id", expenseId)
        .order("created_at", { ascending: true });

      if (maxComments) {
        query = query.limit(maxComments);
      }

      const { data, error } = await query;

      if (error) throw error;

      const commentsWithNames = (data || []).map((comment) => {
        const member = members.find((m) => m.userId === comment.user_id);
        return {
          ...comment,
          userName: member?.name || "Utente",
        };
      });

      setComments(commentsWithNames);
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();

    // Subscribe to realtime updates
    if (expenseId && workspaceId) {
      const channel = supabase
        .channel(`expense-comments-${expenseId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "expense_comments",
            filter: `expense_id=eq.${expenseId}`,
          },
          (payload) => {
            if (payload.eventType === "INSERT") {
              const newComment = payload.new as Comment;
              const member = members.find((m) => m.userId === newComment.user_id);
              setComments((prev) => [
                ...prev,
                { ...newComment, userName: member?.name || "Utente" },
              ]);
            } else if (payload.eventType === "DELETE") {
              const deletedId = (payload.old as { id: string }).id;
              setComments((prev) => prev.filter((c) => c.id !== deletedId));
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [expenseId, workspaceId, members]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user || !workspaceId) return;

    setIsSending(true);
    try {
      const { error } = await supabase.from("expense_comments").insert({
        expense_id: expenseId,
        workspace_id: workspaceId,
        user_id: user.id,
        content: newComment.trim(),
      });

      if (error) throw error;

      setNewComment("");
      onCommentAdded?.();

      // Also log activity
      await supabase.from("workspace_activities").insert({
        workspace_id: workspaceId,
        user_id: user.id,
        action_type: "comment_added",
        target_type: "expense",
        target_id: expenseId,
        metadata: { preview: newComment.trim().slice(0, 50) },
      });
    } catch (err) {
      console.error("Error adding comment:", err);
      toast.error("Errore nell'invio del commento");
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    setDeletingId(commentId);
    try {
      const { error } = await supabase
        .from("expense_comments")
        .delete()
        .eq("id", commentId)
        .eq("user_id", user?.id);

      if (error) throw error;

      toast.success("Commento eliminato");
    } catch (err) {
      console.error("Error deleting comment:", err);
      toast.error("Errore nell'eliminazione");
    } finally {
      setDeletingId(null);
    }
  };

  if (!workspaceId) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Comments list */}
      {isLoading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-2">
          Nessun commento
        </p>
      ) : (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {comments.map((comment) => {
              const isOwn = comment.user_id === user?.id;
              return (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  layout
                  className={cn(
                    "flex gap-2 p-2 rounded-lg",
                    isOwn ? "bg-primary/10" : "bg-muted/50"
                  )}
                >
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-medium">
                        {isOwn ? "Tu" : comment.userName}
                      </p>
                      <div className="flex items-center gap-1">
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.created_at), {
                            addSuffix: true,
                            locale: it,
                          })}
                        </p>
                        {isOwn && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleDelete(comment.id)}
                            disabled={deletingId === comment.id}
                          >
                            {deletingId === comment.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Trash2 className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm mt-0.5">{comment.content}</p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Input */}
      {showInput && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Scrivi un commento..."
            maxLength={500}
            disabled={isSending}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!newComment.trim() || isSending}
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
      )}
    </div>
  );
}

// Compact version for inline use
export function ExpenseCommentsCount({ expenseId }: { expenseId: string }) {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const fetchCount = async () => {
      const { count: commentCount } = await supabase
        .from("expense_comments")
        .select("*", { count: "exact", head: true })
        .eq("expense_id", expenseId);

      setCount(commentCount ?? 0);
    };

    fetchCount();
  }, [expenseId]);

  if (count === 0) return null;

  return (
    <div className="flex items-center gap-1 text-muted-foreground">
      <MessageCircle className="w-3 h-3" />
      <span className="text-xs">{count}</span>
    </div>
  );
}
