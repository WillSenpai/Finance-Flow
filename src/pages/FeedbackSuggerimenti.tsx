import { useState } from "react";
import { ArrowLeft, Loader2, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type SuggestionCategory = "bug" | "idea" | "ux" | "altro";

const FeedbackSuggerimenti = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userData } = useUser();
  const [suggestionCategory, setSuggestionCategory] = useState<SuggestionCategory>("idea");
  const [suggestionMessage, setSuggestionMessage] = useState("");
  const [submittingSuggestion, setSubmittingSuggestion] = useState(false);

  const handleSubmitSuggestion = async () => {
    if (!user) {
      toast.error("Devi essere autenticato per inviare un suggerimento.");
      return;
    }

    const message = suggestionMessage.trim();
    if (!message || message.length < 10 || message.length > 2000) {
      toast.error("Il messaggio deve contenere tra 10 e 2000 caratteri.");
      return;
    }

    setSubmittingSuggestion(true);
    try {
      const userEmail = user.email || userData.email || "email-non-disponibile";
      const { error } = await supabase.from("user_suggestions").insert({
        user_id: user.id,
        user_email: userEmail,
        category: suggestionCategory,
        message,
      });
      if (error) throw error;

      toast.success("Suggerimento inviato, grazie!");
      navigate("/profilo");
    } catch (err) {
      console.error("Suggestion submit failed:", err);
      toast.error("Impossibile inviare il suggerimento. Riprova.");
    } finally {
      setSubmittingSuggestion(false);
    }
  };

  return (
    <motion.div className="px-5 pt-14 pb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <ArrowLeft size={18} /> Indietro
      </button>

      <div className="bg-card border border-border/50 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-1">
          <MessageSquare size={16} className="text-primary" />
          <p className="text-sm font-semibold">Suggerisci un miglioramento</p>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Inviaci idee o problemi: il suggerimento verra associato alla tua email account per ricontattarti.
        </p>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium">Categoria</label>
            <select
              value={suggestionCategory}
              onChange={(e) => setSuggestionCategory(e.target.value as SuggestionCategory)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="bug">Bug</option>
              <option value="idea">Idea</option>
              <option value="ux">UX</option>
              <option value="altro">Altro</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium">Il tuo suggerimento</label>
            <Textarea
              value={suggestionMessage}
              onChange={(e) => setSuggestionMessage(e.target.value)}
              placeholder="Raccontaci cosa miglioreresti..."
              className="mt-1 min-h-[110px]"
              maxLength={2000}
            />
            <p className="mt-1 text-[10px] text-muted-foreground">{suggestionMessage.trim().length}/2000</p>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmitSuggestion}
            disabled={submittingSuggestion || suggestionMessage.trim().length < 10}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
          >
            {submittingSuggestion ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Invio...
              </>
            ) : (
              "Invia suggerimento"
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default FeedbackSuggerimenti;
