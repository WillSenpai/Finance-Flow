import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Mail,
  QrCode,
  Link as LinkIcon,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Copy,
  Share2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useSharedWorkspace } from "@/hooks/useSharedWorkspace";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CreateWorkspaceWizardProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

type WizardStep = "name" | "invite" | "confirm";

export function CreateWorkspaceWizard({ onComplete, onCancel }: CreateWorkspaceWizardProps) {
  const { createWorkspace, inviteMember, refreshAll } = useSharedWorkspace();

  const [currentStep, setCurrentStep] = useState<WizardStep>("name");
  const [workspaceName, setWorkspaceName] = useState("");
  const [partnerEmail, setPartnerEmail] = useState("");
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [workspaceCreated, setWorkspaceCreated] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);

  const steps: { id: WizardStep; title: string; description: string }[] = [
    { id: "name", title: "Nome Spazio", description: "Scegli un nome per il vostro spazio condiviso" },
    { id: "invite", title: "Invita Partner", description: "Invita il tuo partner a unirsi" },
    { id: "confirm", title: "Tutto pronto!", description: "Lo spazio condiviso è pronto" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleCreateWorkspace = async () => {
    if (!workspaceName.trim()) {
      setError("Inserisci un nome per lo spazio condiviso");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await createWorkspace(workspaceName.trim());
      if (!result.ok) {
        setError(result.error || "Errore nella creazione dello spazio");
        return;
      }

      setWorkspaceCreated(true);
      setCurrentStep("invite");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore nella creazione");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvitePartner = async () => {
    if (!partnerEmail.trim()) {
      setError("Inserisci l'email del tuo partner");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(partnerEmail)) {
      setError("Inserisci un'email valida");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await inviteMember(partnerEmail.trim());
      if (!result.ok) {
        setError(result.error || "Errore nell'invio dell'invito");
        return;
      }

      setInviteSent(true);
      setCurrentStep("confirm");
      await refreshAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore nell'invio");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipInvite = () => {
    setCurrentStep("confirm");
  };

  const handleComplete = () => {
    onComplete?.();
  };

  const handleBack = () => {
    setError(null);
    if (currentStep === "invite") {
      setCurrentStep("name");
    } else if (currentStep === "confirm") {
      setCurrentStep("invite");
    }
  };

  const copyInviteLink = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
      toast.success("Link copiato!");
    }
  };

  const shareInvite = async () => {
    if (!inviteLink) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Unisciti a ${workspaceName} su Finance Flow`,
          text: "Ti ho invitato a gestire le finanze insieme!",
          url: inviteLink,
        });
      } catch {
        copyInviteLink();
      }
    } else {
      copyInviteLink();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "name":
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-8 h-8 text-primary" />
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold">Crea uno Spazio Condiviso</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Gestisci patrimonio e spese insieme al tuo partner
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nome dello spazio</label>
                <Input
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  placeholder="Es. Casa Nostra, Famiglia Rossi"
                  className="mt-1"
                />
              </div>

              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  Lo spazio condiviso ti permette di:
                </p>
                <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                  <li>• Tracciare le spese comuni</li>
                  <li>• Gestire salvadanai di coppia</li>
                  <li>• Visualizzare il patrimonio condiviso</li>
                </ul>
              </div>
            </div>
          </motion.div>
        );

      case "invite":
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold">Spazio "{workspaceName}" creato!</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Ora invita il tuo partner a unirsi
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email del partner
                </label>
                <Input
                  type="email"
                  value={partnerEmail}
                  onChange={(e) => setPartnerEmail(e.target.value)}
                  placeholder="partner@email.com"
                  className="mt-1"
                />
              </div>

              {inviteLink && (
                <div className="p-3 border rounded-lg space-y-2">
                  <p className="text-xs text-muted-foreground">Oppure condividi questo link:</p>
                  <div className="flex gap-2">
                    <Input value={inviteLink} readOnly className="text-xs" />
                    <Button variant="outline" size="icon" onClick={copyInviteLink}>
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={shareInvite}>
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );

      case "confirm":
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold">Tutto pronto!</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {inviteSent
                  ? `Abbiamo inviato l'invito a ${partnerEmail}`
                  : "Il tuo spazio condiviso è pronto"}
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">{workspaceName}</p>
                    <p className="text-xs text-muted-foreground">
                      {inviteSent
                        ? "In attesa che il partner accetti l'invito"
                        : "Puoi invitare il partner in qualsiasi momento"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  Prossimi passi:
                </p>
                <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                  <li>• Configura le categorie di patrimonio condiviso</li>
                  <li>• Crea il primo salvadanaio di coppia</li>
                  <li>• Inizia a registrare le spese comuni</li>
                </ul>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{steps[currentStepIndex]?.title}</CardTitle>
            <CardDescription>{steps[currentStepIndex]?.description}</CardDescription>
          </div>
          <span className="text-sm text-muted-foreground">
            {currentStepIndex + 1}/{steps.length}
          </span>
        </div>
        <Progress value={progress} className="h-2 mt-2" />
      </CardHeader>

      <CardContent className="pt-4">
        <AnimatePresence mode="wait">
          {renderStepContent()}
        </AnimatePresence>

        {error && (
          <p className="text-sm text-destructive text-center mt-4">{error}</p>
        )}

        <div className="flex gap-3 mt-6">
          {currentStep !== "name" && currentStep !== "confirm" && (
            <Button variant="outline" onClick={handleBack} disabled={isLoading}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              Indietro
            </Button>
          )}

          {currentStep === "name" && (
            <>
              {onCancel && (
                <Button variant="outline" onClick={onCancel} className="flex-1">
                  Annulla
                </Button>
              )}
              <Button onClick={handleCreateWorkspace} disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Continua
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>
            </>
          )}

          {currentStep === "invite" && (
            <>
              <Button variant="ghost" onClick={handleSkipInvite} disabled={isLoading}>
                Salta
              </Button>
              <Button onClick={handleInvitePartner} disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Invia Invito
                    <Mail className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>
            </>
          )}

          {currentStep === "confirm" && (
            <Button onClick={handleComplete} className="w-full">
              Inizia ad usare lo spazio
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
