import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Home, Wallet, GraduationCap, Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useNotifiche } from "@/hooks/useNotifiche";

const tabs = [
  { path: "/", label: "Home", icon: Home },
  { path: "/patrimonio", label: "Patrimonio", icon: Wallet },
  { path: "/accademia", label: "Accademia", icon: GraduationCap },
  { path: "/coach", label: "AI Coach", icon: Sparkles },
  { path: "/profilo", label: "Profilo", icon: User },
];

const hiddenPaths = ["/lezione/", "/patrimonio/gestisci", "/patrimonio/salvadanai", "/patrimonio/investimenti", "/patrimonio/spese", "/profilo/notifiche", "/profilo/suggerimenti", "/profilo/tema", "/profilo/privacy", "/profilo/info", "/profilo/pro", "/profilo/admin-posts", "/profilo/admin-accademia", "/esplora/", "/profilo/admin-esplora"];

const MobileLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { unreadCount } = useNotifiche();

  const showTabBar = !hiddenPaths.some((p) => location.pathname.startsWith(p));

  return (
    <div className="flex justify-center min-h-screen bg-muted/30">
      <div className="w-full max-w-[430px] min-h-screen bg-background relative flex flex-col shadow-2xl overflow-hidden">
        <div className="flex-1 overflow-y-auto pb-24">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Outlet />
          </motion.div>
        </div>

        {showTabBar && (
          <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-background/80 backdrop-blur-xl border-t border-border z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
            <div className="flex items-center justify-around py-2 pb-2">
              {tabs.map((tab) => {
                const isActive =
                  tab.path === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(tab.path);
                const badgeCount = tab.path === "/profilo" ? unreadCount : 0;
                return (
                  <motion.button
                    key={tab.path}
                    onClick={() => navigate(tab.path)}
                    whileTap={{ scale: 0.85 }}
                    className={cn(
                      "flex flex-col items-center gap-0.5 px-3 py-1 transition-colors relative",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    <motion.div
                      animate={isActive ? { scale: 1.15 } : { scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      className="relative"
                    >
                      <tab.icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
                      {badgeCount > 0 && (
                        <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold px-1">
                          {badgeCount > 9 ? "9+" : badgeCount}
                        </span>
                      )}
                    </motion.div>
                    <span className="text-[10px] font-medium">{tab.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </div>
  );
};

export default MobileLayout;
