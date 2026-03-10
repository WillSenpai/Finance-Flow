import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Home, Wallet, GraduationCap, Sparkles, User } from "lucide-react";
import { Capacitor } from "@capacitor/core";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useNotifiche } from "@/hooks/useNotifiche";
import { useRef } from "react";

const tabs = [
  { path: "/", label: "Home", icon: Home },
  { path: "/patrimonio", label: "Patrimonio", icon: Wallet },
  { path: "/accademia", label: "Accademia", icon: GraduationCap },
  { path: "/coach", label: "AI Coach", icon: Sparkles },
  { path: "/profilo", label: "Profilo", icon: User },
];

const hiddenPaths = [
  "/lezione/",
  "/patrimonio/gestisci",
  "/patrimonio/salvadanai",
  "/patrimonio/investimenti",
  "/patrimonio/spese",
  "/patrimonio/condivisione",
  "/patrimonio/condiviso",
  "/patrimonio/inviti",
  "/profilo/notifiche",
  "/profilo/suggerimenti",
  "/profilo/tema",
  "/profilo/privacy",
  "/profilo/info",
  "/profilo/pro",
  "/profilo/admin-posts",
  "/profilo/admin-accademia",
  "/esplora/",
  "/profilo/admin-esplora",
];

const MobileLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { unreadCount } = useNotifiche();
  const isNative = Capacitor.isNativePlatform();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastTabTapRef = useRef<{ path: string; at: number } | null>(null);

  const showTabBar = !hiddenPaths.some((p) => location.pathname.startsWith(p));

  const handleTabClick = (path: string, isActive: boolean) => {
    const now = Date.now();
    const lastTap = lastTabTapRef.current;
    const isRepeatedTap = !!lastTap && lastTap.path === path && now - lastTap.at <= 700;

    if (isRepeatedTap && isActive) {
      scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    } else if (!isActive) {
      navigate(path);
    }

    lastTabTapRef.current = { path, at: now };
  };

  return (
    <div
      className="flex h-[var(--app-height)] min-h-[var(--app-height)] justify-center overflow-hidden bg-muted/30"
      style={{ paddingLeft: "var(--safe-left)", paddingRight: "var(--safe-right)" }}
    >
      <div
        className={cn(
          "relative flex h-full min-h-0 flex-col overflow-hidden bg-background",
          isNative ? "w-full" : "w-full max-w-[430px] shadow-2xl",
        )}
        style={{ paddingTop: "var(--safe-top)" }}
      >
        <div ref={scrollContainerRef} className="flex-1 min-h-0 overflow-y-auto">
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
          <nav
            className="relative z-50 border-t border-border bg-background/80 backdrop-blur-xl"
            style={{ paddingBottom: "var(--safe-bottom)" }}
          >
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
                    onClick={() => handleTabClick(tab.path, isActive)}
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
