import { ArrowLeft, ChevronRight, X, BellOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useNotifiche, Notifica } from "@/hooks/useNotifiche";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const tipoBadgeClass: Record<string, string> = {
  warning: "bg-orange-500/15 text-orange-600 border-orange-500/30",
  success: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
  info: "bg-blue-500/15 text-blue-600 border-blue-500/30",
};

const tipoLabel: Record<string, string> = {
  warning: "Attenzione",
  success: "Traguardo",
  info: "Info",
};

const NotificaCard = ({
  n,
  isRead,
  onDismiss,
  onNavigate,
}: {
  n: Notifica;
  isRead: boolean;
  onDismiss?: () => void;
  onNavigate?: () => void;
}) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: isRead ? 0.55 : 1, y: 0 }}
    exit={{ opacity: 0, x: -80, height: 0, marginBottom: 0 }}
    transition={{ duration: 0.25 }}
    className="bg-card border border-border/50 rounded-2xl p-4 flex items-center gap-3"
  >
    <span className="text-xl shrink-0">{n.icon}</span>
    <div className="flex-1 min-w-0">
      <p className="text-sm leading-snug">{n.text}</p>
      <Badge variant="outline" className={`mt-1.5 text-[10px] px-2 py-0 ${tipoBadgeClass[n.tipo]}`}>
        {tipoLabel[n.tipo]}
      </Badge>
    </div>
    <div className="flex items-center gap-1 shrink-0">
      {n.action && (
        <button onClick={onNavigate} className="p-1.5 rounded-full hover:bg-muted transition-colors">
          <ChevronRight size={16} className="text-muted-foreground" />
        </button>
      )}
      {!isRead && onDismiss && (
        <button onClick={onDismiss} className="p-1.5 rounded-full hover:bg-destructive/10 transition-colors">
          <X size={14} className="text-muted-foreground" />
        </button>
      )}
    </div>
  </motion.div>
);

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
    <BellOff size={40} strokeWidth={1.5} className="mb-3 opacity-40" />
    <p className="text-sm">{message}</p>
  </div>
);

const Notifiche = () => {
  const navigate = useNavigate();
  const { notifiche, allNotifiche, dismissed, dismiss, dismissAll } = useNotifiche();

  const lette = allNotifiche.filter((n) => dismissed.has(n.id));

  const renderList = (list: Notifica[], showDismiss: boolean) => (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {list.map((n) => (
          <NotificaCard
            key={n.id}
            n={n}
            isRead={dismissed.has(n.id)}
            onDismiss={showDismiss ? () => dismiss(n.id) : undefined}
            onNavigate={n.action ? () => navigate(n.action!) : undefined}
          />
        ))}
      </AnimatePresence>
    </div>
  );

  return (
    <motion.div className="px-5 pt-14 pb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <ArrowLeft size={18} /> Indietro
      </button>
      <h1 className="text-2xl font-semibold mb-5">Notifiche 🔔</h1>

      <Tabs defaultValue="unread">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="unread" className="flex-1">Non lette{notifiche.length > 0 && ` (${notifiche.length})`}</TabsTrigger>
          <TabsTrigger value="read" className="flex-1">Lette</TabsTrigger>
          <TabsTrigger value="all" className="flex-1">Tutte</TabsTrigger>
        </TabsList>

        <TabsContent value="unread">
          {notifiche.length > 0 && (
            <Button variant="ghost" size="sm" className="mb-3 text-xs" onClick={dismissAll}>
              Segna tutte come lette
            </Button>
          )}
          {notifiche.length === 0 ? <EmptyState message="Nessuna notifica da leggere" /> : renderList(notifiche, true)}
        </TabsContent>

        <TabsContent value="read">
          {lette.length === 0 ? <EmptyState message="Nessuna notifica letta" /> : renderList(lette, false)}
        </TabsContent>

        <TabsContent value="all">
          {allNotifiche.length === 0 ? <EmptyState message="Nessuna notifica" /> : renderList(allNotifiche, false)}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Notifiche;
