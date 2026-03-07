import { ArrowLeft, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const InfoApp = () => {
  const navigate = useNavigate();

  return (
    <motion.div className="px-5 pt-14 pb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <ArrowLeft size={18} /> Indietro
      </button>
      <h1 className="text-2xl font-semibold mb-6">Info sull'app ℹ️</h1>

      <div className="bg-card border border-border/50 rounded-2xl p-6 text-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">💰</span>
        </div>
        <h2 className="text-lg font-bold">Finance Flow</h2>
        <p className="text-sm text-muted-foreground mt-1">Versione 1.0.0</p>
      </div>

      <div className="bg-card border border-border/50 rounded-2xl p-5 mb-4">
        <h3 className="text-sm font-semibold mb-2">La nostra missione</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Rendere l'educazione finanziaria accessibile a tutti, con strumenti semplici e un approccio gamificato che rende il risparmio e gli investimenti alla portata di chiunque.
        </p>
      </div>

      <div className="text-center mt-8">
        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
          Fatto con <Heart size={12} className="text-destructive" /> in Italia
        </p>
      </div>
    </motion.div>
  );
};

export default InfoApp;
