import { ArrowLeft, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useSharedWorkspace } from "@/hooks/useSharedWorkspace";
import { toast } from "sonner";
import { useState } from "react";

const InvitiPatrimonio = () => {
  const navigate = useNavigate();
  const { pendingInvites, respondToInvite } = useSharedWorkspace();
  const [busyId, setBusyId] = useState<string | null>(null);

  const onDecision = async (inviteId: string, decision: "accept" | "decline") => {
    setBusyId(inviteId);
    const result = await respondToInvite(inviteId, decision);
    setBusyId(null);
    if (!result.ok) {
      toast.error(result.error ?? "Operazione non riuscita");
      return;
    }
    if (decision === "accept") {
      toast.success("Invito accettato ✅");
      navigate("/patrimonio/condiviso");
      return;
    }
    toast.success("Invito rifiutato");
  };

  return (
    <motion.div className="px-5 pt-14 pb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-primary text-sm font-medium mb-6">
        <ArrowLeft size={18} /> Indietro
      </button>

      <h1 className="text-2xl font-semibold tracking-tight mb-1">Inviti Condivisione ✉️</h1>
      <p className="text-xs text-muted-foreground mb-6">
        Accetta o rifiuta gli inviti ricevuti per i workspace condivisi.
      </p>

      {pendingInvites.length === 0 ? (
        <div className="bg-card border border-border/50 rounded-2xl p-6 text-center">
          <p className="text-3xl mb-2">📭</p>
          <p className="text-sm font-medium">Nessun invito in sospeso</p>
          <p className="text-xs text-muted-foreground mt-1">Quando riceverai nuovi inviti li vedrai qui.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingInvites.map((invite) => (
            <div key={invite.id} className="bg-card border border-border/50 rounded-2xl p-4">
              <p className="text-sm font-semibold">{invite.workspaceName}</p>
              <p className="text-xs text-muted-foreground mt-1">Invitato da {invite.inviterName}</p>
              <p className="text-xs text-muted-foreground">Scade: {new Date(invite.expiresAt).toLocaleString("it-IT")}</p>
              <div className="mt-3 flex gap-2">
                <Button
                  className="rounded-xl h-10 flex-1 gap-1"
                  disabled={busyId === invite.id}
                  onClick={() => void onDecision(invite.id, "accept")}
                >
                  <Check size={14} /> Accetta
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl h-10 flex-1 gap-1"
                  disabled={busyId === invite.id}
                  onClick={() => void onDecision(invite.id, "decline")}
                >
                  <X size={14} /> Rifiuta
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default InvitiPatrimonio;
