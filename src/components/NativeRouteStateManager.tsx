import { useEffect, useRef, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { persistLastRoute, readLastRouteSync } from "@/lib/nativeResume";

const RESTORE_FALLBACK_PATHS = new Set(["/", "/onboarding"]);
const NON_RESTORABLE_PREFIXES = ["/login", "/auth/callback", "/reset-password"];

function canRestoreRoute(path: string): boolean {
  return !NON_RESTORABLE_PREFIXES.some((prefix) => path.startsWith(prefix));
}

export default function NativeRouteStateManager({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const [ready, setReady] = useState(() => !Capacitor.isNativePlatform());
  const hasRestoredRef = useRef(false);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    if (loading || hasRestoredRef.current) return;

    const currentPath = `${location.pathname}${location.search}${location.hash}`;
    const lastRoute = readLastRouteSync(user?.id);

    hasRestoredRef.current = true;

    if (!lastRoute || lastRoute === currentPath || !canRestoreRoute(lastRoute) || !RESTORE_FALLBACK_PATHS.has(location.pathname)) {
      setReady(true);
      return;
    }

    navigate(lastRoute, { replace: true });
    setReady(true);
  }, [loading, location.hash, location.pathname, location.search, navigate, user?.id]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    if (loading) return;

    const currentPath = `${location.pathname}${location.search}${location.hash}`;
    if (!canRestoreRoute(currentPath)) return;

    void persistLastRoute(currentPath, user?.id);
  }, [loading, location.hash, location.pathname, location.search, user?.id]);

  if (!ready) {
    return <div className="min-h-screen bg-background" />;
  }

  return <>{children}</>;
}
