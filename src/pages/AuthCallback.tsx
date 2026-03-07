import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    let cancelled = false;

    const safeNext = (() => {
      const next = searchParams.get("next") ?? "/";
      return next.startsWith("/") ? next : "/";
    })();

    const completeAuthFlow = async () => {
      const code = searchParams.get("code");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          if (!cancelled) {
            toast({
              title: "Link non valido o scaduto",
              description: "Richiedi una nuova email e riprova.",
              variant: "destructive",
            });
            navigate("/login", { replace: true });
          }
          return;
        }
      } else {
        // For hash-based links, Supabase parses tokens on startup.
        await supabase.auth.getSession();
      }

      if (!cancelled) {
        navigate(safeNext, { replace: true });
      }
    };

    completeAuthFlow();

    return () => {
      cancelled = true;
    };
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-[380px] rounded-2xl border border-border/50 bg-card p-6 text-center">
        <div className="mx-auto mb-3 h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <h1 className="text-base font-semibold">Verifica in corso</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Ti stiamo reindirizzando in modo sicuro.
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;
