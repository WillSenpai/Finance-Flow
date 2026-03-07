import { ArrowLeft, Sun, Moon, Monitor } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const temi = [
  { value: "light", label: "Chiaro", icon: Sun, emoji: "☀️" },
  { value: "dark", label: "Scuro", icon: Moon, emoji: "🌙" },
  { value: "system", label: "Sistema", icon: Monitor, emoji: "💻" },
];

const Tema = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("light");

  return (
    <motion.div className="px-5 pt-14 pb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <ArrowLeft size={18} /> Indietro
      </button>
      <h1 className="text-2xl font-semibold mb-6">Tema 🎨</h1>

      <div className="space-y-3">
        {temi.map((t) => (
          <motion.button
            key={t.value}
            whileTap={{ scale: 0.97 }}
            onClick={() => setSelected(t.value)}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-colors ${
              selected === t.value ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/30"
            }`}
          >
            <span className="text-2xl">{t.emoji}</span>
            <div>
              <p className="font-semibold text-sm">{t.label}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default Tema;
