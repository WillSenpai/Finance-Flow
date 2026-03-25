import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Wallet,
  PiggyBank,
  Tags,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useSharedWorkspace, type SharedSalvadanaio } from "@/contexts/SharedWorkspaceContext";
import { cn } from "@/lib/utils";

interface JointSetupProps {
  onComplete?: () => void;
}

type SetupStep = "welcome" | "salvadanaio" | "categories" | "complete";

export function JointSetup({ onComplete }: JointSetupProps) {
  const navigate = useNavigate();
  const {
    workspaceName,
    members,
    setSalvadanai,
    salvadanai,
    categorie,
  } = useSharedWorkspace();

  const [currentStep, setCurrentStep] = useState<SetupStep>("welcome");
  const [salvadanaiName, setSalvadanaiName] = useState("Fondo Comune");
  const [salvadanaiGoal, setSalvadanaiGoal] = useState<number>(5000);
  const [isLoading, setIsLoading] = useState(false);

  const steps: { id: SetupStep; title: string }[] = [
    { id: "welcome", title: "Benvenuti" },
    { id: "salvadanaio", title: "Primo Obiettivo" },
    { id: "categories", title: "Categorie" },
    { id: "complete", title: "Completato" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const memberNames = members
    .filter((m) => m.status === "active")
    .map((m) => m.name)
    .join(" e ");

  const handleCreateSalvadanaio = async () => {
    if (!salvadanaiName.trim() || salvadanaiGoal <= 0) return;

    setIsLoading(true);
    try {
      const newSalvadanaio: SharedSalvadanaio = {
        id: crypto.randomUUID(),
        nome: salvadanaiName.trim(),
        obiettivo: salvadanaiGoal,
        attuale: 0,
      };

      await setSalvadanai([...salvadanai, newSalvadanaio]);
      setCurrentStep("categories");
    } catch (err) {
      console.error("Error creating salvadanaio:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipSalvadanaio = () => {
    setCurrentStep("categories");
  };

  const handleGoToCategories = () => {
    navigate("/patrimonio/condiviso/gestisci");
  };

  const handleComplete = () => {
    setCurrentStep("complete");
  };

  const handleFinish = () => {
    onComplete?.();
    navigate("/patrimonio/condiviso");
  };

  const suggestedSalvadanai = [
    { nome: "Vacanza Insieme", obiettivo: 3000, emoji: "✈️" },
    { nome: "Fondo Emergenza", obiettivo: 6000, emoji: "🛡️" },
    { nome: "Progetto Casa", obiettivo: 20000, emoji: "🏠" },
    { nome: "Spese Comuni", obiettivo: 2000, emoji: "🛒" },
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case "welcome":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 text-center"
          >
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-10 h-10 text-primary" />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold">Benvenuti in "{workspaceName}"!</h3>
              <p className="text-muted-foreground mt-2">
                {memberNames}, siete pronti per gestire le vostre finanze insieme.
              </p>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg text-left">
              <p className="text-sm font-medium mb-2">Cosa potete fare insieme:</p>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-primary" />
                  Tracciare il patrimonio condiviso
                </li>
                <li className="flex items-center gap-2">
                  <PiggyBank className="w-4 h-4 text-primary" />
                  Risparmiare per obiettivi comuni
                </li>
                <li className="flex items-center gap-2">
                  <Tags className="w-4 h-4 text-primary" />
                  Registrare e analizzare le spese
                </li>
              </ul>
            </div>
          </motion.div>
        );

      case "salvadanaio":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-center">
              <PiggyBank className="w-12 h-12 text-primary" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold">Create il vostro primo obiettivo</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Un salvadanaio condiviso per risparmiare insieme
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {suggestedSalvadanai.map((s, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSalvadanaiName(s.nome);
                    setSalvadanaiGoal(s.obiettivo);
                  }}
                  className={cn(
                    "p-3 rounded-lg border text-left transition-all",
                    salvadanaiName === s.nome
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <span className="text-lg">{s.emoji}</span>
                  <p className="text-sm font-medium mt-1">{s.nome}</p>
                  <p className="text-xs text-muted-foreground">
                    €{s.obiettivo.toLocaleString("it-IT")}
                  </p>
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Nome obiettivo</label>
                <Input
                  value={salvadanaiName}
                  onChange={(e) => setSalvadanaiName(e.target.value)}
                  placeholder="Es. Vacanza Insieme"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Obiettivo (€)</label>
                <Input
                  type="number"
                  value={salvadanaiGoal}
                  onChange={(e) => setSalvadanaiGoal(Number(e.target.value))}
                  min={1}
                />
              </div>
            </div>
          </motion.div>
        );

      case "categories":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-center">
              <Tags className="w-12 h-12 text-primary" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold">Configurate il patrimonio</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Abbiamo creato delle categorie predefinite per voi
              </p>
            </div>

            <div className="space-y-2">
              {categorie.slice(0, 4).map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{cat.emoji}</span>
                    <span className="font-medium">{cat.nome}</span>
                  </div>
                  <span className="text-muted-foreground">
                    €{cat.valore.toLocaleString("it-IT")}
                  </span>
                </div>
              ))}
            </div>

            <Button variant="outline" onClick={handleGoToCategories} className="w-full">
              <Wallet className="w-4 h-4 mr-2" />
              Personalizza Patrimonio
            </Button>
          </motion.div>
        );

      case "complete":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 text-center"
          >
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold">Configurazione completata!</h3>
              <p className="text-muted-foreground mt-2">
                Siete pronti per iniziare a gestire le vostre finanze insieme.
              </p>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium mb-2">Riepilogo:</p>
              <ul className="text-sm text-muted-foreground space-y-1 text-left">
                <li>• Spazio: {workspaceName}</li>
                <li>• Membri: {members.filter((m) => m.status === "active").length}</li>
                <li>• Salvadanai: {salvadanai.length}</li>
                <li>• Categorie patrimonio: {categorie.length}</li>
              </ul>
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
        <CardTitle className="text-lg">{steps[currentStepIndex]?.title}</CardTitle>
        <Progress value={progress} className="h-2 mt-2" />
      </CardHeader>

      <CardContent className="pt-4">
        {renderStepContent()}

        <div className="flex gap-3 mt-6">
          {currentStep === "welcome" && (
            <Button onClick={() => setCurrentStep("salvadanaio")} className="w-full">
              Iniziamo
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}

          {currentStep === "salvadanaio" && (
            <>
              <Button variant="ghost" onClick={handleSkipSalvadanaio}>
                Salta
              </Button>
              <Button
                onClick={handleCreateSalvadanaio}
                disabled={isLoading || !salvadanaiName.trim()}
                className="flex-1"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Crea Salvadanaio
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>
            </>
          )}

          {currentStep === "categories" && (
            <Button onClick={handleComplete} className="w-full">
              Continua
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}

          {currentStep === "complete" && (
            <Button onClick={handleFinish} className="w-full">
              Vai allo Spazio Condiviso
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
