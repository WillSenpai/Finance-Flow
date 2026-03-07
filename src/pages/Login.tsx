import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, KeyRound, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) {
      toast({ title: "Errore", description: error.message === "Invalid login credentials" ? "Email o password non corretti" : error.message, variant: "destructive" });
    }
    // Auth state change in AuthContext will handle navigation
  };

  const handleReset = async () => {
    if (!email.trim()) {
      toast({ title: "Inserisci la tua email", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Errore", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Email inviata!", description: "Controlla la tua casella email per reimpostare la password" });
      setResetMode(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[380px] flex flex-col items-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4"
        >
          <span className="text-3xl">👋</span>
        </motion.div>

        <h1 className="text-xl font-bold mb-1">
          {resetMode ? "Recupera password" : "Bentornato!"}
        </h1>
        <p className="text-muted-foreground text-xs mb-6">
          {resetMode ? "Ti invieremo un link per reimpostarla" : "Accedi al tuo account"}
        </p>

        <div className="w-full space-y-2.5">
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            className="rounded-2xl h-11 text-center text-sm bg-card"
            autoFocus
          />
          {!resetMode && (
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              className="rounded-2xl h-11 text-center text-sm bg-card"
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          )}
        </div>

        <Button
          onClick={resetMode ? handleReset : handleLogin}
          disabled={loading || !email.trim() || (!resetMode && !password.trim())}
          className="mt-5 rounded-full px-8 h-11 gap-2 text-sm w-full"
        >
          {loading ? "..." : resetMode ? "Invia link" : "Accedi"}
          {!loading && <ArrowRight size={16} />}
        </Button>

        <button
          onClick={() => setResetMode(!resetMode)}
          className="mt-3 text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          {resetMode ? "Torna al login" : "Password dimenticata?"}
        </button>

        <button
          onClick={() => navigate("/onboarding")}
          className="mt-2 text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          Non hai un account? <span className="font-medium text-primary">Registrati</span>
        </button>
      </motion.div>
    </div>
  );
};

export default Login;
