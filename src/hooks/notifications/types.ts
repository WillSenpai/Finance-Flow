import type { LucideIcon } from "lucide-react";

export type NotificationCategory = "ai" | "finance" | "system" | "social" | "achievement";
export type NotificationPriority = "urgent" | "high" | "normal" | "low";
export type TimeGroup = "Oggi" | "Ieri" | "Questa settimana" | "Precedenti";

export interface Notifica {
  id: string;
  category: NotificationCategory;
  iconComponent: LucideIcon;
  icon: string;
  title: string;
  text: string;
  body?: string;
  timestamp: Date;
  action?: string;
  priority: NotificationPriority;
  tipo: "warning" | "info" | "success";
  isRead: boolean;
}

export interface MarkNotification {
  id: string;
  user_id: string;
  type: "urgent" | "important" | "informative";
  title: string;
  body: string;
  action_url: string | null;
  metadata: Record<string, unknown>;
  read_at: string | null;
  pushed_at: string | null;
  created_at: string;
}
