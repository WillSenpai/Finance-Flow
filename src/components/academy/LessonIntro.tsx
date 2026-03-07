import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Vignette {
  title: string;
  description: string;
  imageUrl: string;
}

interface LessonIntroProps {
  vignettes: Vignette[];
  lessonTitle: string;
  lessonEmoji: string;
  onComplete: () => void;
  onSkip: () => void;
}

function buildGuidedVignettes(vignettes: Vignette[], lessonTitle: string): Vignette[] {
  const fallbackImage = vignettes[0]?.imageUrl || "/placeholder.svg";
  const guidedDefaults: Omit<Vignette, "imageUrl">[] = [
    {
      title: "Da dove iniziare",
      description: `Capisci perche "${lessonTitle}" puo aiutarti nelle scelte di ogni giorno.`,
    },
    {
      title: "Come funziona davvero",
      description: "Vediamo il meccanismo con un esempio concreto, senza tecnicismi.",
    },
    {
      title: "Cosa fare oggi",
      description: "Ti porti a casa azioni semplici da mettere in pratica subito.",
    },
    {
      title: "Gli errori tipici",
      description: "Evita gli sbagli piu comuni e risparmia tempo fin dall'inizio.",
    },
  ];

  const base = vignettes.map((v, index) => ({
    ...v,
    imageUrl: v.imageUrl || fallbackImage,
    title: v.title?.trim() || guidedDefaults[index % guidedDefaults.length].title,
    description: v.description?.trim() || guidedDefaults[index % guidedDefaults.length].description,
  }));

  if (base.length >= 4) return base;

  const padded = [...base];
  for (let i = base.length; i < 4; i++) {
    const template = guidedDefaults[i];
    padded.push({
      title: template.title,
      description: template.description,
      imageUrl: base[i % Math.max(base.length, 1)]?.imageUrl || fallbackImage,
    });
  }

  return padded;
}

const VignetteCard = ({ vignette, index }: { vignette: Vignette; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.4 });

  return (
    <motion.div
      ref={ref}
      className="min-h-[70vh] flex items-center justify-center py-8"
    >
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.92 }}
        animate={isInView ? { y: 0, opacity: 1, scale: 1 } : { y: 60, opacity: 0, scale: 0.92 }}
        transition={{
          type: "spring",
          stiffness: 80,
          damping: 20,
          delay: 0.05,
        }}
        className="w-full max-w-sm mx-auto flex flex-col items-center gap-5 px-4"
      >
        {/* Floating image */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.3,
          }}
          className="relative w-56 h-56 rounded-3xl overflow-hidden shadow-lg"
        >
          <div
            className="absolute inset-0 rounded-3xl"
            style={{
              background: `linear-gradient(135deg, hsl(var(--primary) / 0.1), hsl(var(--accent) / 0.15))`,
            }}
          />
          <img
            src={vignette.imageUrl}
            alt={vignette.title}
            className="w-full h-full object-cover relative z-10"
            loading="lazy"
          />
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center space-y-2"
        >
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Passo {index + 1}
          </p>
          <h3 className="text-lg font-semibold text-foreground leading-snug">
            {vignette.title}
          </h3>
          {vignette.description && (
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[280px] mx-auto">
              {vignette.description}
            </p>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const LessonIntro = ({ vignettes, lessonTitle, lessonEmoji, onComplete, onSkip }: LessonIntroProps) => {
  const endRef = useRef<HTMLDivElement>(null);
  const guidedVignettes = buildGuidedVignettes(vignettes, lessonTitle);

  return (
    <div className="flex-1 overflow-y-auto relative scroll-smooth">
      {/* Skip button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={onSkip}
        className="fixed top-12 right-5 z-50 flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors bg-background/80 backdrop-blur-sm rounded-full px-3 py-1.5 border border-border/50"
      >
        Salta <SkipForward size={12} />
      </motion.button>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-12"
      >
        <motion.span
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="text-6xl mb-4 block"
        >
          {lessonEmoji}
        </motion.span>
        <h2 className="text-2xl font-bold text-foreground mb-2">{lessonTitle}</h2>
        <p className="text-sm text-muted-foreground">Cosa imparerai in questa lezione</p>
        <p className="text-xs text-muted-foreground mt-4">Scorri in basso per vedere i passaggi</p>

        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="mt-8 text-muted-foreground/50"
        >
          <ArrowRight size={20} className="rotate-90" />
        </motion.div>
      </motion.div>

      {/* Keep first image below the fold on intro open */}
      <div className="min-h-[20vh]" />

      {/* Vignettes */}
      {guidedVignettes.map((v, i) => (
        <VignetteCard key={i} vignette={v} index={i} />
      ))}

      {/* CTA */}
      <div ref={endRef} className="min-h-[50vh] flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="text-center space-y-5"
        >
          <motion.span
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-5xl block"
          >
            🚀
          </motion.span>
          <h3 className="text-xl font-bold text-foreground">Pronto per iniziare?</h3>
          <p className="text-sm text-muted-foreground max-w-[260px] mx-auto">
            Ora che sai cosa ti aspetta, tuffati nella lezione!
          </p>
          <Button
            onClick={onComplete}
            size="lg"
            className="rounded-2xl h-12 px-8 gap-2 text-base"
          >
            Inizia la lezione <ArrowRight size={18} />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default LessonIntro;
