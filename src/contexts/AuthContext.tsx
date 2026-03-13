import { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const manualSignOutRef = useRef(false);
  const recoveryRunningRef = useRef(false);
  const userRef = useRef<User | null>(null);
  const sessionRef = useRef<Session | null>(null);

  const applySignedInState = (nextSession: Session) => {
    setSession(nextSession);
    setUser(nextSession.user);
    userRef.current = nextSession.user;
    sessionRef.current = nextSession;
    setLoading(false);
  };

  const applySignedOutState = () => {
    setSession(null);
    setUser(null);
    userRef.current = null;
    sessionRef.current = null;
    setLoading(false);
  };

  const recoverSessionOrKeepState = async (): Promise<boolean> => {
    if (recoveryRunningRef.current) return false;
    recoveryRunningRef.current = true;
    try {
      const { data: persisted } = await supabase.auth.getSession();
      if (persisted.session?.user) {
        applySignedInState(persisted.session);
        return true;
      }

      const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();
      if (!refreshError && refreshed.session?.user) {
        applySignedInState(refreshed.session);
        return true;
      }

      // Keep current state on transient auth/network issues to avoid false logout during native purchase flows.
      return false;
    } catch {
      return false;
    } finally {
      recoveryRunningRef.current = false;
    }
  };

  useEffect(() => {
    const authWatchdog = window.setTimeout(() => {
      // Avoid bootstrap deadlock if auth client never resolves (network/plugin edge cases).
      setLoading(false);
    }, 10_000);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, nextSession) => {
        if (nextSession?.user) {
          manualSignOutRef.current = false;
          applySignedInState(nextSession);
          return;
        }

        if (event === "SIGNED_OUT" && manualSignOutRef.current) {
          manualSignOutRef.current = false;
          applySignedOutState();
          return;
        }

        // Guard against transient null sessions (e.g. app background/foreground around native purchase UI).
        void (async () => {
          const recovered = await recoverSessionOrKeepState();
          if (!recovered) {
            // If we never had a valid session yet, allow signed-out bootstrap state.
            if (!userRef.current && !sessionRef.current) applySignedOutState();
            else setLoading(false);
          }
        })();
      }
    );

    // Validate persisted session on startup to avoid stale "logged-in" states.
    void (async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        const recovered = await recoverSessionOrKeepState();
        if (!recovered) applySignedOutState();
        return;
      }

      const { data: userData, error: userError } = await supabase.auth.getUser(session.access_token);
      if (!userError && userData.user) {
        applySignedInState(session);
        return;
      }

      const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();
      if (!refreshError && refreshed.session?.access_token && refreshed.session.user) {
        applySignedInState(refreshed.session);
      } else {
        // Fail-safe: avoid stale "logged-in" state that causes repeated 401 calls.
        applySignedOutState();
      }
    })();

    return () => {
      window.clearTimeout(authWatchdog);
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    manualSignOutRef.current = true;
    await supabase.auth.signOut();
    applySignedOutState();
  };

  useEffect(() => {
    supabase.functions.setAuth(session?.access_token ?? "");
  }, [session?.access_token]);

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
