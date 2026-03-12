import { ArrowLeft, Check, Monitor, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const temi = [
  { value: "light", label: "Chiaro", icon: Sun, emoji: "☀️" },
  { value: "dark", label: "Scuro", icon: Moon, emoji: "🌙" },
  { value: "system", label: "Sistema", icon: Monitor, emoji: "💻" },
];

const Tema = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme, systemTheme, forcedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const selected = mounted ? theme ?? "system" : "system";
  const appliedTheme = mounted ? resolvedTheme ?? theme ?? "light" : "light";
  const systemPreference = mounted ? systemTheme ?? "light" : "light";
  const isLocked = Boolean(forcedTheme);

  return (
    <motion.div className="px-5 pt-14 pb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <ArrowLeft size={18} /> Indietro
      </button>
      <h1 className="text-2xl font-semibold mb-6">Tema 🎨</h1>

      <div className="mb-4 rounded-[1.75rem] border border-border/60 bg-card px-4 py-3.5 shadow-[0_14px_32px_-28px_hsl(var(--foreground)/0.32)]">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Tema attivo</p>
        <div className="mt-2 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold capitalize">{appliedTheme}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {selected === "system" ? `Segue il dispositivo: ${systemPreference}` : "Scelta salvata nell'app"}
            </p>
          </div>
          <div className="rounded-full border border-border/70 bg-background px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {selected === "system" ? "Sistema" : "Personalizzato"}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {temi.map((t) => (
          <motion.button
            key={t.value}
            whileTap={{ scale: 0.97 }}
            onClick={() => setTheme(t.value)}
            disabled={isLocked}
            className={cn(
              "w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-colors disabled:opacity-60",
              selected === t.value
                ? "border-primary bg-primary/10 shadow-[0_16px_32px_-26px_hsl(var(--primary)/0.42)]"
                : "border-border bg-card hover:border-primary/30",
            )}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-[1.2rem] bg-muted text-foreground">
              <t.icon size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm">
                {t.label} <span className="ml-1">{t.emoji}</span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t.value === "system"
                  ? "Usa automaticamente il tema di iPhone e sistema."
                  : `Forza il tema ${t.label.toLowerCase()} in tutta l'app.`}
              </p>
            </div>
            {selected === t.value ? (
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check size={16} />
              </span>
            ) : null}
          </motion.button>
        ))}
      </div>

      {isLocked ? (
        <p className="mt-4 text-xs leading-5 text-muted-foreground">
          Il tema e bloccato da configurazione applicativa, quindi qui non puo essere cambiato.
        </p>
      ) : null}
    </motion.div>
  );
};

export default Tema;
