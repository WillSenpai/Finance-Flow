import { useCallback, useEffect, useMemo, useState } from "react";

interface UseOpeningBootstrapInput {
  authLoading: boolean;
  hasUser: boolean;
  loadingData: boolean;
  minDurationMs?: number;
  slowThresholdMs?: number;
}

interface UseOpeningBootstrapOutput {
  showOpening: boolean;
  showSlowState: boolean;
  isDataReady: boolean;
  canExit: boolean;
  markExited: () => void;
}

export const useOpeningBootstrap = ({
  authLoading,
  hasUser,
  loadingData,
  minDurationMs,
  slowThresholdMs,
}: UseOpeningBootstrapInput): UseOpeningBootstrapOutput => {
  const [minElapsed, setMinElapsed] = useState(false);
  const [slowElapsed, setSlowElapsed] = useState(false);
  const [hasExited, setHasExited] = useState(false);

  useEffect(() => {
    const minTimer = window.setTimeout(() => setMinElapsed(true), minDurationMs ?? 0);
    const slowTimer = window.setTimeout(() => setSlowElapsed(true), slowThresholdMs ?? 0);

    return () => {
      window.clearTimeout(minTimer);
      window.clearTimeout(slowTimer);
    };
  }, [minDurationMs, slowThresholdMs]);

  const isDataReady = useMemo(
    () => !authLoading && (!hasUser || !loadingData),
    [authLoading, hasUser, loadingData],
  );

  const canExit = isDataReady && minElapsed;

  const markExited = useCallback(() => {
    setHasExited(true);
  }, []);

  return {
    showOpening: !hasExited,
    showSlowState: !hasExited && slowElapsed,
    isDataReady,
    canExit,
    markExited,
  };
};
