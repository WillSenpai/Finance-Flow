import { CheckCircle2, BellOff, Search } from "lucide-react";
import { motion } from "framer-motion";

type EmptyContext = "all-read" | "no-notifications" | "filtered-empty";

interface NotificationEmptyStateProps {
  context: EmptyContext;
}

const STATES: Record<
  EmptyContext,
  { icon: typeof CheckCircle2; title: string; subtitle: string; color: string }
> = {
  "all-read": {
    icon: CheckCircle2,
    title: "Tutto sotto controllo!",
    subtitle: "Nessuna notifica da leggere",
    color: "text-emerald-500",
  },
  "no-notifications": {
    icon: BellOff,
    title: "Nessuna notifica",
    subtitle: "Le notifiche appariranno qui quando ci saranno aggiornamenti",
    color: "text-muted-foreground",
  },
  "filtered-empty": {
    icon: Search,
    title: "Nessun risultato",
    subtitle: "Nessuna notifica in questa categoria",
    color: "text-muted-foreground",
  },
};

export function NotificationEmptyState({
  context,
}: NotificationEmptyStateProps) {
  const state = STATES[context];
  const Icon = state.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="flex flex-col items-center justify-center gap-3 px-8 py-16 text-center"
    >
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 ${state.color}`}
      >
        <Icon className="h-7 w-7" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">{state.title}</p>
        <p className="text-xs text-muted-foreground">{state.subtitle}</p>
      </div>
    </motion.div>
  );
}
