import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  HelpCircle,
  AlertTriangle,
  ShieldAlert,
  TrendingDown,
  ChartCandlestick,
  Landmark,
} from "lucide-react";

interface Stage {
  icon: React.ElementType;
  phrase: string;
  subtext: string;
  label: string;
  iconColor: string;
  isFinal?: boolean;
}

const stages: Stage[] = [
  { icon: BookOpen, phrase: "Il 73% non sa dove investe", subtext: "La maggior parte delle persone affida i propri risparmi senza capire dove finiscono. Senza conoscenza, non c'è controllo.", label: "Ignoranza", iconColor: "hsl(var(--muted-foreground))" },
  { icon: HelpCircle, phrase: "I dubbi paralizzano le decisioni", subtext: "Troppa incertezza porta a non agire mai. Il tempo passa e i tuoi soldi perdono valore ogni giorno.", label: "Indecisione", iconColor: "hsl(var(--muted-foreground))" },
  { icon: AlertTriangle, phrase: "Senza controllo perdi tutto", subtext: "Chi non monitora entrate e uscite si ritrova a fine mese senza sapere dove sono finiti i soldi.", label: "Rischio", iconColor: "hsl(var(--destructive))" },
  { icon: ShieldAlert, phrase: "Le emozioni bruciano capitali", subtext: "Paura e avidità guidano le scelte peggiori. Vendere nel panico o comprare nell'euforia costa caro.", label: "Panico", iconColor: "hsl(var(--destructive))" },
  { icon: TrendingDown, phrase: "I crolli spazzano chi improvvisa", subtext: "Senza una strategia chiara, un calo di mercato diventa una perdita reale. La preparazione fa la differenza.", label: "Crolli", iconColor: "hsl(var(--destructive))" },
  { icon: ChartCandlestick, phrase: "La volatilità è quotidiana", subtext: "I mercati salgono e scendono ogni giorno. Solo chi ha un piano sa restare calmo e sfruttare le opportunità.", label: "Volatilità", iconColor: "hsl(var(--secondary))" },
  { icon: Landmark, phrase: "Finance Flow ti dà il controllo", subtext: "Un unico strumento per capire, gestire e far crescere i tuoi soldi. Semplice, chiaro, pensato per te.", label: "Soluzione", iconColor: "hsl(var(--primary-foreground))", isFinal: true },
];

const CHAR_SPEED = 0.018;

const TypingText = ({ text, delay }: { text: string; delay: number }) => {
  const [visible, setVisible] = useState(0);
  useEffect(() => {
    setVisible(0);
    const start = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setVisible(i);
        if (i >= text.length) clearInterval(interval);
      }, CHAR_SPEED * 1000);
      return () => clearInterval(interval);
    }, delay * 1000);
    return () => clearTimeout(start);
  }, [text, delay]);

  return (
    <span>
      {text.slice(0, visible)}
      {visible < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.4, repeat: Infinity }}
          className="inline-block w-[2px] h-[1.2em] bg-current ml-[1px] align-middle"
        />
      )}
    </span>
  );
};

const pageVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0, filter: "blur(6px)" }),
  center: { x: 0, opacity: 1, filter: "blur(0px)" },
  exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0, filter: "blur(6px)" }),
};

const StagePage = ({ stage, index, total }: { stage: Stage; index: number; total: number }) => {
  const Icon = stage.icon;

  return (
    <motion.div
      className={`absolute inset-0 flex flex-col items-center justify-center px-10 ${
        stage.isFinal ? "bg-primary" : "bg-background"
      }`}
      variants={pageVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Step counter */}
      <motion.span
        className={`absolute top-14 text-[11px] uppercase tracking-[0.3em] font-medium ${
          stage.isFinal ? "text-primary-foreground/50" : "text-muted-foreground"
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {index + 1} / {total}
      </motion.span>

      {/* Icon */}
      <motion.div
        className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-10 shadow-lg ${
          stage.isFinal ? "bg-primary-foreground/15" : "bg-card"
        }`}
        style={{ border: stage.isFinal ? "none" : "1px solid hsl(var(--border))" }}
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
      >
        <Icon size={44} color={stage.iconColor} strokeWidth={1.8} />
      </motion.div>

      {/* Phrase */}
      <div
        className={`text-center text-2xl font-bold leading-snug tracking-tight ${
          stage.isFinal ? "text-primary-foreground" : "text-foreground"
        }`}
      >
        <TypingText text={stage.phrase} delay={0.3} />
      </div>

      {/* Subtext */}
      <motion.p
        className={`mt-4 text-center text-sm leading-relaxed max-w-[280px] ${
          stage.isFinal ? "text-primary-foreground/70" : "text-muted-foreground"
        }`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        {stage.subtext}
      </motion.p>

      {/* Label */}
      <motion.span
        className={`mt-5 text-xs uppercase tracking-[0.25em] font-bold ${
          stage.isFinal ? "text-primary-foreground/60" : "text-muted-foreground"
        }`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        {stage.label}
      </motion.span>

    </motion.div>
  );
};

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const isLast = current === stages.length - 1;

  const goNext = useCallback(() => {
    if (isLast) {
      setCompleted(true);
      setTimeout(onFinish, 500);
      return;
    }
    setDirection(1);
    setCurrent((p) => Math.min(p + 1, stages.length - 1));
  }, [isLast, onFinish]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrent((p) => Math.max(p - 1, 0));
  }, []);


  // Swipe handling
  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientY);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientY;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goNext() : goPrev();
    }
    setTouchStart(null);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] overflow-hidden bg-background"
      style={{ touchAction: "none" }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Expand circle */}
      <AnimatePresence>
        {completed && (
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary z-50"
            style={{ width: 56, height: 56 }}
            initial={{ scale: 1 }}
            animate={{ scale: 60 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          />
        )}
      </AnimatePresence>

      {/* Skip */}
      <motion.button
        onClick={onFinish}
        className="absolute top-14 right-6 text-xs uppercase tracking-widest text-muted-foreground z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Salta
      </motion.button>

      {/* Pages */}
      <AnimatePresence custom={direction} mode="wait">
        <StagePage
          key={current}
          stage={stages[current]}
          index={current}
          total={stages.length}
        />
      </AnimatePresence>

      {/* Bottom CTA */}
      <motion.button
        onClick={goNext}
        className={`absolute bottom-10 left-1/2 -translate-x-1/2 z-20 px-8 py-3 rounded-full font-semibold text-sm tracking-wide shadow-lg ${
          isLast
            ? "bg-primary-foreground text-primary"
            : "bg-primary text-primary-foreground"
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        key={`btn-${current}`}
      >
        {isLast ? "Inizia ora →" : "Continua"}
      </motion.button>
    </motion.div>
  );
};

const SPLASH_KEY = "investo_splash_seen";

export const useSplash = () => {
  const alreadySeen = localStorage.getItem(SPLASH_KEY) === "true";
  const [showSplash, setShowSplash] = useState(!alreadySeen);
  const handleFinish = () => {
    localStorage.setItem(SPLASH_KEY, "true");
    setShowSplash(false);
  };
  const SplashComponent = () => (
    <AnimatePresence>
      {showSplash && <SplashScreen onFinish={handleFinish} />}
    </AnimatePresence>
  );
  return { showSplash, SplashComponent };
};

export default SplashScreen;
