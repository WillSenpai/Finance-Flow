/**
 * Hook that tracks page views on every react-router location change.
 * Mount once inside the BrowserRouter (e.g. inside AppRoutes).
 */
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/lib/posthog";

export function usePostHogPageView(): void {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);
}
