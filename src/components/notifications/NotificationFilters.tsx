import { Bot, Wallet, Bell, Users, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import type { NotificationCategory } from "@/hooks/useNotifiche";
import type { LucideIcon } from "lucide-react";

interface FilterItem {
  key: NotificationCategory | "all";
  label: string;
  icon?: LucideIcon;
}

const FILTERS: FilterItem[] = [
  { key: "all", label: "Tutto" },
  { key: "ai", label: "AI Coach", icon: Bot },
  { key: "finance", label: "Finanza", icon: Wallet },
  { key: "system", label: "Sistema", icon: Bell },
  { key: "social", label: "Social", icon: Users },
  { key: "achievement", label: "Traguardi", icon: Trophy },
];

interface NotificationFiltersProps {
  active: NotificationCategory | "all";
  onChange: (category: NotificationCategory | "all") => void;
}

export function NotificationFilters({
  active,
  onChange,
}: NotificationFiltersProps) {
  return (
    <div className="relative flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-none">
      {FILTERS.map((f) => {
        const isActive = active === f.key;
        const Icon = f.icon;
        return (
          <motion.button
            key={f.key}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(f.key)}
            className={`relative flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              isActive
                ? "text-primary-foreground"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeFilter"
                className="absolute inset-0 rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative flex items-center gap-1.5">
              {Icon && <Icon className="h-3.5 w-3.5" />}
              {f.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
