import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Target, Plane, TrendingUp, Home, Sprout, Award, Rocket, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/useUser";
import { useAuth } from "@/contexts/AuthContext";
import type { UserData } from "@/contexts/UserContext";

const goals = [
{ label: "Creare un fondo emergenza", icon: Target, emoji: "🛟" },
{ label: "Risparmiare per un viaggio", icon: Plane, emoji: "✈️" },
{ label: "Iniziare a investire", icon: TrendingUp, emoji: "📈" },
{ label: "Comprare casa", icon: Home, emoji: "🏠" }];


const levels = [
{ value: "beginner" as const, label: "Parto da zero", description: "Non ho mai gestito i miei soldi attivamente", icon: Sprout, emoji: "🌱" },
{ value: "intermediate" as const, label: "Me la cavo", description: "Risparmio già, ma voglio migliorare", icon: Award, emoji: "💪" },
{ value: "pro" as const, label: "Sono un pro", description: "Investo attivamente e gestisco il mio patrimonio", icon: Rocket, emoji: "🚀" }];


const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 })
};

const Onboarding = () => {
  const navigate = useNavigate();
  const { completeOnboarding, userData } = useUser();
  const { user } = useAuth();
  const isAlreadyAuthenticated = !!user;
  const [step, setStep] = useState(isAlreadyAuthenticated ? 1 : 0);
  const [direction, setDirection] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [level, setLevel] = useState<UserData["level"] | "">("");
  const [loading, setLoading] = useState(false);
  const [signupError, setSignupError] = useState("");

  const isStep0Valid =
  name.trim().length > 0 &&
  email.trim().length > 0 &&
  phone.trim().length > 0 &&
  !!birthDate &&
  password.length >= 6 &&
  password === confirmPassword;

  const next = () => {setDirection(1);setStep((s) => s + 1);};
  const back = () => {setDirection(-1);setStep((s) => s - 1);};

  const toggleGoal = (label: string) => {
    setSelectedGoals((prev) =>
    prev.includes(label) ? prev.filter((g) => g !== label) : [...prev, label]
    );
  };

  const handleSignupAndNext = async () => {
    setLoading(true);
    setSignupError("");

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: name.trim(),
            phone: phone.trim(),
            birth_date: birthDate ? format(birthDate, "yyyy-MM-dd") : undefined,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        const msg = error.message.includes("already registered")
          ? "Questa email è già registrata. Prova ad accedere."
          : error.message;
        setSignupError(msg);
        return;
      }

      // Se non c'è sessione, l'email va verificata prima del login
      if (!data.session) {
        toast({
          title: "Controlla la tua email",
          description: "Ti abbiamo inviato un link di verifica. Dopo la conferma, accedi.",
        });
        navigate("/login", { replace: true });
        return;
      }

      next();
    } catch (err) {
      console.error("Errore signup:", err);
      setSignupError("Errore durante la registrazione. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  const finish = async () => {
    setLoading(true);
    try {
      const finalGoals = selectedGoals.length > 0 ? selectedGoals : ["Risparmiare per un obiettivo"];
      const finalLevel = level as UserData["level"] || "beginner";

      await completeOnboarding({
        name: name.trim() || userData?.name || "Utente",
        email: email.trim() || userData?.email || user?.email || "",
        phone: phone.trim() || userData?.phone || "",
        birthDate: birthDate ? format(birthDate, "yyyy-MM-dd") : userData?.birthDate || "",
        goals: finalGoals,
        level: finalLevel,
      });
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Errore completamento onboarding:", error);
      toast({ title: "Errore", description: "Impossibile completare la registrazione. Riprova.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      {/* Progress dots */}
      <div className="flex gap-2 mb-10">
        {[0, 1, 2].map((i) =>
        <motion.div
          key={i}
          className="h-2 rounded-full"
          animate={{ width: i === step ? 32 : 8, backgroundColor: i <= step ? "hsl(var(--primary))" : "hsl(var(--muted))" }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }} />

        )}
      </div>

      <div className="w-full max-w-[380px] min-h-[400px] relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          {step === 0 &&
          <motion.div
            key="step0"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex flex-col items-center text-center">
            
              <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
              className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              
                <span className="text-3xl">🤔</span>
              </motion.div>
              <h1 className="text-xl font-bold mb-1">Parlaci di te</h1>
              <p className="text-muted-foreground text-xs mb-4">Così sapremo come personalizzare tutto!</p>
              
              <div className="w-full space-y-2.5 mx-0 my-0 rounded-none px-[19px] py-[27px]">
                <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome completo *"
                className="rounded-2xl h-11 text-center text-sm bg-card"
                />
              
                <Input
                value={email}
                onChange={(e) => {setEmail(e.target.value);setSignupError("");}}
                placeholder="Email *"
                type="email"
                className="rounded-2xl h-11 text-center text-sm bg-card" />
              
                <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Numero di telefono *"
                type="tel"
                className="rounded-2xl h-11 text-center text-sm bg-card" />
              
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "w-full rounded-2xl h-11 text-sm bg-card border border-input px-3 flex items-center justify-center gap-2",
                        !birthDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon size={14} />
                      {birthDate ? format(birthDate, "dd/MM/yyyy") : "Data di nascita *"}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center">
                    <Calendar
                      mode="single"
                      selected={birthDate}
                      onSelect={setBirthDate}
                      captionLayout="dropdown"
                      fromYear={1940}
                      toYear={new Date().getFullYear() - 10}
                      locale={it}
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              
                <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min. 6 caratteri) *"
                type="password"
                className="rounded-2xl h-11 text-center text-sm bg-card" />
              
                <Input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Conferma password *"
                type="password"
                className="rounded-2xl h-11 text-center text-sm bg-card" />
              
                {password.length > 0 && password.length < 6 &&
              <p className="text-xs text-destructive">Minimo 6 caratteri</p>
              }
                {confirmPassword.length > 0 && password !== confirmPassword &&
              <p className="text-xs text-destructive">Le password non coincidono</p>
              }
                {signupError &&
              <p className="text-xs text-destructive">{signupError}</p>
              }
              </div>

              <Button
              onClick={handleSignupAndNext}
              disabled={!isStep0Valid || loading}
              className="mt-5 rounded-full px-8 h-11 gap-2 text-sm">
              
                {loading ? "Registrazione..." : "Continua"} {!loading && <ArrowRight size={16} />}
              </Button>

              <button
                onClick={() => navigate("/login")}
                className="mt-3 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Hai già un account? <span className="font-medium text-primary">Accedi</span>
              </button>
            </motion.div>
          }

          {step === 1 &&
          <motion.div
            key="step1"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex flex-col items-center text-center">
            
              <h1 className="text-xl font-bold mb-1">Quali sono i tuoi obiettivi?</h1>
              <p className="text-muted-foreground text-xs mb-6">Seleziona tutti quelli che ti interessano</p>
                <div className="grid grid-cols-2 gap-2.5 w-full">
                {goals.map((g) =>
              <motion.button
                key={g.label}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleGoal(g.label)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-colors ${
                selectedGoals.includes(g.label) ?
                "border-primary bg-primary/10" :
                "border-border bg-card hover:border-primary/30"}`
                }>
                
                    <span className="text-xl">{g.emoji}</span>
                    <span className="text-[11px] font-medium leading-tight">{g.label}</span>
                  </motion.button>
              )}
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                onClick={next}
                disabled={selectedGoals.length === 0}
                className="rounded-full px-7 h-11 gap-2 text-sm">
                
                  Continua <ArrowRight size={16} />
                </Button>
              </div>
            </motion.div>
          }

          {step === 2 &&
          <motion.div
            key="step2"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex flex-col items-center text-center">
            
              <h1 className="text-xl font-bold mb-1">A che punto sei?</h1>
              <p className="text-muted-foreground text-xs mb-6">Così personalizzerò tutto per te</p>
              <div className="flex flex-col gap-2.5 w-full">
                {levels.map((l) =>
              <motion.button
                key={l.value}
                whileTap={{ scale: 0.97 }}
                onClick={() => setLevel(l.value)}
                className={`flex items-center gap-3 p-3 rounded-2xl border-2 text-left transition-colors ${
                level === l.value ?
                "border-primary bg-primary/10" :
                "border-border bg-card hover:border-primary/30"}`
                }>
                
                    <span className="text-xl flex-shrink-0">{l.emoji}</span>
                    <div>
                      <p className="font-semibold text-sm">{l.label}</p>
                      <p className="text-[11px] text-muted-foreground">{l.description}</p>
                    </div>
                  </motion.button>
              )}
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={back} className="rounded-full px-5 h-11 gap-2 text-sm">
                  <ArrowLeft size={16} /> Indietro
                </Button>
                <Button
                onClick={finish}
                disabled={!level || loading}
                className="rounded-full px-7 h-11 gap-2 text-sm">
                
                  {loading ? "..." : "Iniziamo! 🚀"}
                </Button>
              </div>
            </motion.div>
          }
        </AnimatePresence>
      </div>
    </div>);

};

export default Onboarding;
