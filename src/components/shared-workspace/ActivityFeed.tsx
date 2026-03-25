import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Receipt,
  PiggyBank,
  TrendingUp,
  MessageCircle,
  CheckCircle2,
  XCircle,
  UserPlus,
  UserMinus,
  Wallet,
  RefreshCw,
  Loader2,
  Bell,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useSharedWorkspace } from "@/hooks/useSharedWorkspace";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { it } from "date-fns/locale";

interface Activity {
  id: string;
  workspace_id: string;
  user_id: string;
  action_type: string;
  target_type: string | null;
  target_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  userName?: string;
}

interface ActivityFeedProps {
  limit?: number;
  compact?: boolean;
  showHeader?: boolean;
}

const ACTION_ICONS: Record<string, React.ReactNode> = {
  expense_added: <Receipt className="w-4 h-4 text-red-500" />,
  expense_updated: <Receipt className="w-4 h-4 text-orange-500" />,
  expense_deleted: <Receipt className="w-4 h-4 text-gray-500" />,
  salvadanaio_created: <PiggyBank className="w-4 h-4 text-green-500" />,
  salvadanaio_updated: <PiggyBank className="w-4 h-4 text-blue-500" />,
  salvadanaio_deleted: <PiggyBank className="w-4 h-4 text-gray-500" />,
  salvadanaio_deposit: <PiggyBank className="w-4 h-4 text-green-600" />,
  salvadanaio_withdraw: <PiggyBank className="w-4 h-4 text-red-500" />,
  investment_added: <TrendingUp className="w-4 h-4 text-purple-500" />,
  investment_updated: <TrendingUp className="w-4 h-4 text-blue-500" />,
  investment_deleted: <TrendingUp className="w-4 h-4 text-gray-500" />,
  patrimonio_updated: <Wallet className="w-4 h-4 text-blue-500" />,
  comment_added: <MessageCircle className="w-4 h-4 text-blue-500" />,
  approval_requested: <Bell className="w-4 h-4 text-yellow-500" />,
  approval_approved: <CheckCircle2 className="w-4 h-4 text-green-500" />,
  approval_rejected: <XCircle className="w-4 h-4 text-red-500" />,
  member_joined: <UserPlus className="w-4 h-4 text-green-500" />,
  member_left: <UserMinus className="w-4 h-4 text-gray-500" />,
  member_removed: <UserMinus className="w-4 h-4 text-red-500" />,
};

const getActionText = (activity: Activity, isOwnAction: boolean): string => {
  const actor = isOwnAction ? "Hai" : activity.userName || "Qualcuno";
  const meta = activity.metadata || {};

  switch (activity.action_type) {
    case "expense_added":
      return `${actor} ${isOwnAction ? "aggiunto" : "ha aggiunto"} una spesa di €${(meta.importo as number)?.toLocaleString("it-IT") || "?"}`;
    case "expense_updated":
      return `${actor} ${isOwnAction ? "modificato" : "ha modificato"} una spesa`;
    case "expense_deleted":
      return `${actor} ${isOwnAction ? "eliminato" : "ha eliminato"} una spesa`;
    case "salvadanaio_created":
      return `${actor} ${isOwnAction ? "creato" : "ha creato"} "${meta.nome || "un salvadanaio"}"`;
    case "salvadanaio_updated":
      return `${actor} ${isOwnAction ? "modificato" : "ha modificato"} "${meta.nome || "un salvadanaio"}"`;
    case "salvadanaio_deleted":
      return `${actor} ${isOwnAction ? "eliminato" : "ha eliminato"} "${meta.nome || "un salvadanaio"}"`;
    case "salvadanaio_deposit":
      return `${actor} ${isOwnAction ? "aggiunto" : "ha aggiunto"} €${(meta.importo as number)?.toLocaleString("it-IT") || "?"} a "${meta.nome || "un salvadanaio"}"`;
    case "salvadanaio_withdraw":
      return `${actor} ${isOwnAction ? "prelevato" : "ha prelevato"} €${(meta.importo as number)?.toLocaleString("it-IT") || "?"} da "${meta.nome || "un salvadanaio"}"`;
    case "investment_added":
      return `${actor} ${isOwnAction ? "aggiunto" : "ha aggiunto"} un investimento`;
    case "investment_updated":
      return `${actor} ${isOwnAction ? "aggiornato" : "ha aggiornato"} un investimento`;
    case "investment_deleted":
      return `${actor} ${isOwnAction ? "eliminato" : "ha eliminato"} un investimento`;
    case "patrimonio_updated":
      return `${actor} ${isOwnAction ? "aggiornato" : "ha aggiornato"} il patrimonio`;
    case "comment_added":
      return `${actor} ${isOwnAction ? "commentato" : "ha commentato"} una spesa`;
    case "approval_requested":
      return `${actor} ${isOwnAction ? "richiesto" : "ha richiesto"} approvazione per una spesa`;
    case "approval_approved":
      return `${actor} ${isOwnAction ? "approvato" : "ha approvato"} una richiesta`;
    case "approval_rejected":
      return `${actor} ${isOwnAction ? "rifiutato" : "ha rifiutato"} una richiesta`;
    case "member_joined":
      return `${activity.userName || "Un nuovo membro"} si è unito allo spazio`;
    case "member_left":
      return `${activity.userName || "Un membro"} ha lasciato lo spazio`;
    case "member_removed":
      return `${activity.userName || "Un membro"} è stato rimosso`;
    default:
      return `${actor} ha eseguito un'azione`;
  }
};

export function ActivityFeed({
  limit = 20,
  compact = false,
  showHeader = true,
}: ActivityFeedProps) {
  const { workspaceId, members } = useSharedWorkspace();
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async () => {
    if (!workspaceId) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("workspace_activities")
        .select("*")
        .eq("workspace_id", workspaceId)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (fetchError) throw fetchError;

      // Add user names from members
      const activitiesWithNames = (data || []).map((activity) => {
        const member = members.find((m) => m.userId === activity.user_id);
        return {
          ...activity,
          userName: member?.name || "Utente",
        };
      });

      setActivities(activitiesWithNames);
    } catch (err) {
      console.error("Error fetching activities:", err);
      setError("Errore nel caricamento delle attività");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();

    // Subscribe to realtime updates
    if (workspaceId) {
      const channel = supabase
        .channel(`workspace-activities-${workspaceId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "workspace_activities",
            filter: `workspace_id=eq.${workspaceId}`,
          },
          (payload) => {
            const newActivity = payload.new as Activity;
            const member = members.find((m) => m.userId === newActivity.user_id);
            setActivities((prev) => [
              { ...newActivity, userName: member?.name || "Utente" },
              ...prev.slice(0, limit - 1),
            ]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [workspaceId, members, limit]);

  if (!workspaceId) {
    return null;
  }

  if (compact) {
    return (
      <div className="space-y-2">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : activities.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nessuna attività recente
          </p>
        ) : (
          activities.slice(0, 5).map((activity) => {
            const isOwnAction = activity.user_id === user?.id;
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50"
              >
                <div className="mt-0.5">
                  {ACTION_ICONS[activity.action_type] || (
                    <Bell className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">
                    {getActionText(activity, isOwnAction)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.created_at), {
                      addSuffix: true,
                      locale: it,
                    })}
                  </p>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    );
  }

  return (
    <Card className="w-full">
      {showHeader && (
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Attività Recenti
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchActivities}
              disabled={isLoading}
            >
              <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
            </Button>
          </div>
        </CardHeader>
      )}

      <CardContent>
        {isLoading && activities.length === 0 ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="text-center py-6">
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchActivities} className="mt-2">
              Riprova
            </Button>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              Nessuna attività ancora. Le azioni saranno mostrate qui.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            <AnimatePresence mode="popLayout">
              {activities.map((activity) => {
                const isOwnAction = activity.user_id === user?.id;
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    layout
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg transition-colors",
                      isOwnAction ? "bg-primary/5" : "hover:bg-muted/50"
                    )}
                  >
                    <div className="mt-0.5">
                      {ACTION_ICONS[activity.action_type] || (
                        <Bell className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        {getActionText(activity, isOwnAction)}
                      </p>
                      {activity.metadata?.nota && (
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          "{activity.metadata.nota as string}"
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(activity.created_at), {
                          addSuffix: true,
                          locale: it,
                        })}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
