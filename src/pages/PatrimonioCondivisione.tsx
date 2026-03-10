import { useMemo, useState } from "react";
import { ArrowLeft, Mail, Users, UserMinus, DoorOpen, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useSharedWorkspace } from "@/hooks/useSharedWorkspace";
import { useAuth } from "@/contexts/AuthContext";

const PatrimonioCondivisione = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    loading,
    hasActiveWorkspace,
    workspaceName,
    myRole,
    members,
    createWorkspace,
    inviteMember,
    removeMember,
    leaveWorkspace,
  } = useSharedWorkspace();

  const [workspaceInput, setWorkspaceInput] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const inviteEmailTrimmed = inviteEmail.trim();
  const isInviteEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmailTrimmed);

  const activeMembers = useMemo(() => members.filter((m) => m.status === "active"), [members]);

  const handleCreateWorkspace = async () => {
    setBusy(true);
    const result = await createWorkspace(workspaceInput);
    setBusy(false);
    if (!result.ok) {
      toast.error(result.error ?? "Impossibile creare workspace");
      return;
    }
    setWorkspaceInput("");
    toast.success("Workspace condiviso creato ✅");
  };

  const handleInvite = async () => {
    if (!isInviteEmailValid) return;
    setBusy(true);
    const result = await inviteMember(inviteEmailTrimmed);
    setBusy(false);
    if (!result.ok) {
      toast.error(result.error ?? "Invio invito fallito");
      return;
    }
    setInviteEmail("");
    toast.success(result.emailSent ? "Invito inviato via email ✅" : "Invito registrato. L'utente lo troverà in app.");
  };

  const handleRemove = async (targetUserId: string) => {
    setBusy(true);
    const result = await removeMember(targetUserId);
    setBusy(false);
    if (!result.ok) {
      toast.error(result.error ?? "Impossibile rimuovere membro");
      return;
    }
    toast.success("Membro rimosso");
  };

  const handleLeave = async () => {
    setBusy(true);
    const result = await leaveWorkspace();
    setBusy(false);
    if (!result.ok) {
      toast.error(result.error ?? "Impossibile uscire dal workspace");
      return;
    }
    toast.success("Hai lasciato il workspace condiviso");
    navigate("/patrimonio");
  };

  return (
    <motion.div className="px-5 pt-14 pb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-primary text-sm font-medium mb-6">
        <ArrowLeft size={18} /> Indietro
      </button>

      <h1 className="text-2xl font-semibold tracking-tight mb-1">Condivisione Patrimonio 🤝</h1>
      <p className="text-xs text-muted-foreground mb-6">
        Invita partner, amici o familiari per gestire insieme spese e patrimonio.
      </p>

      {loading && <div className="text-sm text-muted-foreground">Caricamento workspace...</div>}

      {!loading && !hasActiveWorkspace && (
        <div className="bg-card border border-border/50 rounded-2xl p-4 space-y-3">
          <p className="text-sm font-semibold">Crea il tuo spazio condiviso</p>
          <Input
            placeholder="Nome workspace (es. Casa Rossi)"
            value={workspaceInput}
            onChange={(e) => setWorkspaceInput(e.target.value)}
            className="rounded-xl h-11"
          />
          <Button onClick={handleCreateWorkspace} disabled={busy} className="w-full rounded-xl h-11 gap-2">
            <Plus size={16} /> Crea workspace
          </Button>
          <p className="text-[11px] text-muted-foreground">Workspace iniziale vuoto. Limite v1: massimo 5 membri.</p>
        </div>
      )}

      {!loading && hasActiveWorkspace && (
        <div className="space-y-4">
          <div className="bg-card border border-border/50 rounded-2xl p-4">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Workspace attivo</p>
            <p className="text-base font-semibold mt-1">{workspaceName}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Ruolo: {myRole === "owner" ? "Owner" : "Membro"} • {activeMembers.length}/5 membri
            </p>
            <div className="mt-3 flex gap-2">
              <Button variant="outline" className="rounded-xl h-10 flex-1" onClick={() => navigate("/patrimonio/condiviso")}>
                Apri dashboard condivisa
              </Button>
              <Button variant="outline" className="rounded-xl h-10 flex-1" onClick={() => navigate("/patrimonio/inviti")}>
                Inviti ricevuti
              </Button>
            </div>
          </div>

          {myRole === "owner" && (
            <div className="bg-card border border-border/50 rounded-2xl p-4">
              <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Mail size={16} /> Invita un membro
              </p>
              <div className="grid grid-cols-[1fr_auto] items-center gap-2">
                <Input
                  placeholder="email@esempio.com"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") void handleInvite();
                  }}
                  className="rounded-xl h-10 min-h-10 max-h-10"
                />
                <Button
                  onClick={handleInvite}
                  disabled={busy || !isInviteEmailValid}
                  className="rounded-xl h-10 min-h-10 px-4 shrink-0"
                >
                  Invia
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground mt-2">Gli inviti scadono in 24 ore.</p>
            </div>
          )}

          <div className="bg-card border border-border/50 rounded-2xl p-4">
            <p className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Users size={16} /> Membri attivi
            </p>
            <div className="space-y-2">
              {activeMembers.map((member) => {
                const isMe = member.userId === user?.id;
                return (
                  <div key={member.userId} className="rounded-xl border border-border/50 px-3 py-2 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{member.name}{isMe ? " (Tu)" : ""}</p>
                      <p className="text-[11px] text-muted-foreground">{member.role === "owner" ? "Owner" : "Membro"}</p>
                    </div>
                    <div className="flex gap-2">
                      {myRole === "owner" && !isMe && member.role !== "owner" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-lg gap-1"
                          onClick={() => void handleRemove(member.userId)}
                          disabled={busy}
                        >
                          <UserMinus size={14} /> Rimuovi
                        </Button>
                      )}
                      {isMe && myRole !== "owner" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-lg gap-1"
                          onClick={() => void handleLeave()}
                          disabled={busy}
                        >
                          <DoorOpen size={14} /> Esci
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PatrimonioCondivisione;
