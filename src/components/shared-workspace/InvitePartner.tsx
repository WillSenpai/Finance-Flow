import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Copy,
  Share2,
  CheckCircle2,
  Loader2,
  UserPlus,
  Clock,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSharedWorkspace } from "@/hooks/useSharedWorkspace";
import { toast } from "sonner";

interface InvitePartnerProps {
  onClose?: () => void;
  compact?: boolean;
}

export function InvitePartner({ onClose, compact = false }: InvitePartnerProps) {
  const { workspaceName, inviteMember, members } = useSharedWorkspace();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if there are pending members
  const pendingMembers = members.filter(
    (m) => m.status === "active" && m.role === "member"
  ).length;
  const maxMembers = 5;
  const canInvite = pendingMembers < maxMembers - 1; // -1 for owner

  const handleInvite = async () => {
    if (!email.trim()) {
      setError("Inserisci un'email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email non valida");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await inviteMember(email.trim());
      if (!result.ok) {
        setError(result.error || "Errore nell'invio dell'invito");
        return;
      }

      setSuccess(true);
      toast.success(`Invito inviato a ${email}`);
      setEmail("");

      // Reset success state after a delay
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore nell'invio");
    } finally {
      setIsLoading(false);
    }
  };

  const shareInvite = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Unisciti a ${workspaceName} su Finance Flow`,
          text: "Ti ho invitato a gestire le finanze insieme!",
        });
      } catch {
        toast.info("Condivisione annullata");
      }
    } else {
      toast.info("Condivisione non supportata su questo dispositivo");
    }
  };

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 border rounded-lg"
      >
        <div className="flex items-center gap-3 mb-3">
          <UserPlus className="w-5 h-5 text-primary" />
          <p className="font-medium">Invita un partner</p>
        </div>
        <div className="flex gap-2">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@esempio.com"
            className="flex-1"
            disabled={!canInvite}
          />
          <Button
            onClick={handleInvite}
            disabled={isLoading || !canInvite}
            size="icon"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : success ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <Mail className="w-4 h-4" />
            )}
          </Button>
        </div>
        {error && <p className="text-xs text-destructive mt-2">{error}</p>}
        {!canInvite && (
          <p className="text-xs text-muted-foreground mt-2">
            Hai raggiunto il limite massimo di membri
          </p>
        )}
      </motion.div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Invita Partner</CardTitle>
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        <CardDescription>
          Invita qualcuno a unirsi a "{workspaceName}"
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {success ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center py-6"
          >
            <CheckCircle2 className="w-12 h-12 text-green-500 mb-3" />
            <p className="font-medium">Invito inviato!</p>
            <p className="text-sm text-muted-foreground text-center mt-1">
              Abbiamo inviato un'email con le istruzioni per unirsi
            </p>
          </motion.div>
        ) : (
          <>
            <div>
              <label className="text-sm font-medium">Email del partner</label>
              <div className="flex gap-2 mt-1">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="partner@email.com"
                  disabled={!canInvite}
                />
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            {!canInvite && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Hai raggiunto il limite massimo di {maxMembers} membri
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={handleInvite}
                disabled={isLoading || !canInvite}
                className="flex-1"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Mail className="w-4 h-4 mr-2" />
                )}
                Invia Invito
              </Button>
              <Button variant="outline" onClick={shareInvite}>
                <Share2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                L'invito scade dopo 7 giorni
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
