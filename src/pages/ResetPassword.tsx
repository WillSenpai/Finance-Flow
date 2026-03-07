import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (password.length < 6) {
      toast({ title: "La password deve avere almeno 6 caratteri", variant: "destructive" });
      return;
    }
    if (password !== confirm) {
      toast({ title: "Le password non coincidono", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast({ title: "Errore", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Password aggiornata!" });
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[380px] flex flex-col items-center"
      >
        <h1 className="text-xl font-bold mb-1">Nuova password</h1>
        <p className="text-muted-foreground text-xs mb-6">Scegli una nuova password per il tuo account</p>

        <div className="w-full space-y-2.5">
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nuova password (min. 6 caratteri)"
            type="password"
            className="rounded-2xl h-11 text-center text-sm bg-card"
            autoFocus
          />
          <Input
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Conferma password"
            type="password"
            className="rounded-2xl h-11 text-center text-sm bg-card"
          />
        </div>

        <Button
          onClick={handleReset}
          disabled={loading || password.length < 6 || password !== confirm}
          className="mt-5 rounded-full px-8 h-11 gap-2 text-sm w-full"
        >
          {loading ? "..." : "Aggiorna password"}
          {!loading && <ArrowRight size={16} />}
        </Button>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
