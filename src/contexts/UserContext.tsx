import { createContext, useState, useEffect, ReactNode, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { trackEvent, AnalyticsEvents } from "@/lib/posthog";
import { type Passivita, loadPassivita, savePassivita } from "@/lib/passivita";

export interface CategoriaPatrimonio {
  nome: string;
  valore: number;
  colore: string;
  emoji: string;
}

export interface Salvadanaio {
  nome: string;
  obiettivo: number;
  attuale: number;
}

export interface Investimento {
  nome: string;
  valore: number;
  emoji: string;
  colore: string;
}

export interface CategoriaSpesa {
  id: string;
  nome: string;
  emoji: string;
  colore: string;
}

export interface Spesa {
  id: string;
  nome: string;
  importo: number;
  categoriaId: string;
  badge: string[];
  data: string;
  nota?: string;
  ricorrenza: "once" | "daily" | "weekly" | "monthly" | "yearly";
}

export type { Passivita };

export interface UserData {
  name: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  goals: string[];
  level: "beginner" | "intermediate" | "pro";
  avatarId?: string;
}

interface UserContextType {
  userData: UserData;
  setUserData: (data: UserData) => void;
  hasCompletedOnboarding: boolean;
  completeOnboarding: (data: UserData) => void;
  resetOnboarding: () => void;
  categorie: CategoriaPatrimonio[];
  setCategorie: (c: CategoriaPatrimonio[]) => void;
  salvadanai: Salvadanaio[];
  setSalvadanai: (s: Salvadanaio[]) => void;
  investimenti: Investimento[];
  setInvestimenti: (i: Investimento[]) => void;
  lastPatrimonioUpdate: string | null;
  categorieSpese: CategoriaSpesa[];
  setCategorieSpese: (c: CategoriaSpesa[]) => void;
  spese: Spesa[];
  setSpese: (s: Spesa[]) => void;
  passivita: Passivita[];
  setPassivita: (p: Passivita[]) => void;
  loadingData: boolean;
  isAdmin: boolean;
}

const defaultUserData: UserData = {
  name: "Viaggiatore",
  goals: ["Risparmiare per un obiettivo"],
  level: "beginner",
};

const defaultCategorie: CategoriaPatrimonio[] = [
  { nome: "Liquidità", valore: 0, colore: "hsl(36, 27%, 43%)", emoji: "💰" },
  { nome: "Investimenti", valore: 0, colore: "hsl(101, 10%, 54%)", emoji: "📈" },
  { nome: "Immobili", valore: 0, colore: "hsl(39, 39%, 75%)", emoji: "🏠" },
  { nome: "Crypto", valore: 0, colore: "hsl(270, 50%, 55%)", emoji: "₿" },
  { nome: "Pensione / TFR", valore: 0, colore: "hsl(210, 50%, 45%)", emoji: "🏦" },
  { nome: "Beni", valore: 0, colore: "hsl(330, 40%, 55%)", emoji: "💎" },
];

const defaultInvestimenti: Investimento[] = [
  { nome: "ETF / Fondi", valore: 0, emoji: "📊", colore: "hsl(270, 50%, 55%)" },
  { nome: "Azioni", valore: 0, emoji: "📉", colore: "hsl(140, 50%, 45%)" },
  { nome: "Crypto", valore: 0, emoji: "🪙", colore: "hsl(30, 80%, 55%)" },
  { nome: "Obbligazioni", valore: 0, emoji: "🏛️", colore: "hsl(220, 50%, 35%)" },
];

const defaultCategorieSpese: CategoriaSpesa[] = [
  { id: "cibo", nome: "Cibo", emoji: "🍕", colore: "hsl(10, 70%, 50%)" },
  { id: "trasporti", nome: "Trasporti", emoji: "🚗", colore: "hsl(210, 60%, 50%)" },
  { id: "shopping", nome: "Shopping", emoji: "🛍️", colore: "hsl(280, 60%, 55%)" },
  { id: "salute", nome: "Salute", emoji: "💊", colore: "hsl(150, 50%, 45%)" },
  { id: "casa", nome: "Casa", emoji: "🏠", colore: "hsl(35, 60%, 50%)" },
  { id: "svago", nome: "Svago", emoji: "🎬", colore: "hsl(330, 60%, 55%)" },
  { id: "abbonamenti", nome: "Abbonamenti", emoji: "📱", colore: "hsl(190, 60%, 45%)" },
  { id: "altro", nome: "Altro", emoji: "📦", colore: "hsl(0, 0%, 50%)" },
];

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [userData, setUserDataState] = useState<UserData>(defaultUserData);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [categorie, setCategorieState] = useState<CategoriaPatrimonio[]>(defaultCategorie);
  const [salvadanai, setSalvadanaiState] = useState<Salvadanaio[]>([]);
  const [investimenti, setInvestimentiState] = useState<Investimento[]>(defaultInvestimenti);
  const [lastPatrimonioUpdate, setLastPatrimonioUpdate] = useState<string | null>(null);
  const [categorieSpese, setCategorieSpeseState] = useState<CategoriaSpesa[]>(defaultCategorieSpese);
  const [spese, setSpeseState] = useState<Spesa[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [passivita, setPassivitaState] = useState<Passivita[]>(() => loadPassivita());

  // Load data from Supabase when user is authenticated
  useEffect(() => {
    if (!user) {
      setLoadingData(false);
      setHasCompletedOnboarding(false);
      setUserDataState(defaultUserData);
      setIsAdmin(false);
      return;
    }

    const loadProfile = async () => {
      setLoadingData(true);
      const loadingWatchdog = window.setTimeout(() => {
        // Prevent app bootstrap deadlock if any network call hangs indefinitely.
        setLoadingData(false);
      }, 10_000);

      try {
        // Fire all queries in parallel to minimize bootstrap latency.
        const [
          { data: profile },
          { data: roles },
          { data: patrimonio },
          { data: inv },
          { data: salv },
          { data: catSpese },
          { data: speseData },
        ] = await Promise.all([
          supabase.from("profiles").select("*").eq("id", user.id).single(),
          supabase.from("user_roles" as any).select("role").eq("user_id", user.id),
          supabase.from("patrimonio").select("*").eq("user_id", user.id).order("ordine"),
          supabase.from("investimenti").select("*").eq("user_id", user.id),
          supabase.from("salvadanai").select("*").eq("user_id", user.id),
          supabase.from("categorie_spese").select("*").eq("user_id", user.id),
          supabase.from("spese").select("*").eq("user_id", user.id),
        ]);

        // Apply profile data
        if (profile) {
          setUserDataState({
            name: profile.name,
            email: profile.email || undefined,
            phone: profile.phone || undefined,
            birthDate: profile.birth_date || undefined,
            goals: profile.goals || ["Risparmiare per un obiettivo"],
            level: (profile.level as UserData["level"]) || "beginner",
            avatarId: (profile as any).avatar_id || "user",
          });
          setHasCompletedOnboarding(profile.has_completed_onboarding);
        }

        // Apply admin role
        const adminRole = roles?.some((r: any) => r.role === "admin");
        setIsAdmin(!!adminRole);
        if (adminRole) {
          setHasCompletedOnboarding(true);
        }

        // Apply patrimonio
        if (patrimonio && patrimonio.length > 0) {
          setCategorieState(patrimonio.map(p => ({
            nome: p.nome,
            valore: Number(p.valore),
            colore: p.colore,
            emoji: p.emoji,
          })));
          setLastPatrimonioUpdate(patrimonio[0].created_at);
        }

        // Apply investimenti
        if (inv && inv.length > 0) {
          setInvestimentiState(inv.map(i => ({
            nome: i.nome,
            valore: Number(i.valore),
            emoji: i.emoji,
            colore: i.colore,
          })));
        }

        // Apply salvadanai
        if (salv && salv.length > 0) {
          setSalvadanaiState(salv.map(s => ({
            nome: s.nome,
            obiettivo: Number(s.obiettivo),
            attuale: Number(s.attuale),
          })));
        }

        // Apply categorie spese
        if (catSpese && catSpese.length > 0) {
          setCategorieSpeseState(catSpese.map(c => ({
            id: c.id,
            nome: c.nome,
            emoji: c.emoji,
            colore: c.colore,
          })));
        }

        // Apply spese
        if (speseData && speseData.length > 0) {
          setSpeseState(speseData.map(s => ({
            id: s.id,
            nome: s.nome || s.nota?.trim() || "Spesa",
            importo: Number(s.importo),
            categoriaId: s.categoria_id || "",
            badge: s.badge || [],
            data: s.data,
            nota: s.nota || undefined,
            ricorrenza: s.ricorrenza as Spesa["ricorrenza"],
          })));
        }
      } catch (err) {
        console.error("Error loading user data:", err);
      } finally {
        window.clearTimeout(loadingWatchdog);
        setLoadingData(false);
      }
    };

    loadProfile();
  }, [user]);

  const setUserData = useCallback(async (data: UserData) => {
    setUserDataState(data);
    if (user) {
      await supabase.from("profiles").update({
        name: data.name,
        email: data.email,
        phone: data.phone,
        birth_date: data.birthDate,
        goals: data.goals,
        level: data.level,
        avatar_id: data.avatarId || "user",
      } as any).eq("id", user.id);
    }
  }, [user]);

  const setCategorie = useCallback(async (c: CategoriaPatrimonio[]) => {
    setCategorieState(c);
    if (!user) return;
    const now = new Date().toISOString();
    setLastPatrimonioUpdate(now);

    const totalValue = c.reduce((sum, cat) => sum + cat.valore, 0);
    trackEvent(AnalyticsEvents.PATRIMONIO_UPDATED, {
      total_value: totalValue,
      categories_count: c.length,
    });

    // Delete and re-insert
    await supabase.from("patrimonio").delete().eq("user_id", user.id);
    if (c.length > 0) {
      await supabase.from("patrimonio").insert(
        c.map((cat, i) => ({
          user_id: user.id,
          nome: cat.nome,
          valore: cat.valore,
          colore: cat.colore,
          emoji: cat.emoji,
          ordine: i,
        }))
      );
    }
  }, [user]);

  const setSalvadanai = useCallback(async (s: Salvadanaio[]) => {
    setSalvadanaiState(s);
    if (!user) return;

    trackEvent(AnalyticsEvents.SALVADANAIO_UPDATED, {
      count: s.length,
      total_goal: s.reduce((sum, sal) => sum + sal.obiettivo, 0),
      total_saved: s.reduce((sum, sal) => sum + sal.attuale, 0),
    });

    await supabase.from("salvadanai").delete().eq("user_id", user.id);
    if (s.length > 0) {
      await supabase.from("salvadanai").insert(
        s.map(sal => ({
          user_id: user.id,
          nome: sal.nome,
          obiettivo: sal.obiettivo,
          attuale: sal.attuale,
        }))
      );
    }
  }, [user]);

  const setInvestimenti = useCallback(async (i: Investimento[]) => {
    setInvestimentiState(i);
    if (!user) return;

    trackEvent(AnalyticsEvents.INVESTIMENTO_UPDATED, {
      count: i.length,
      total_value: i.reduce((sum, inv) => sum + inv.valore, 0),
    });

    await supabase.from("investimenti").delete().eq("user_id", user.id);
    if (i.length > 0) {
      await supabase.from("investimenti").insert(
        i.map(inv => ({
          user_id: user.id,
          nome: inv.nome,
          valore: inv.valore,
          colore: inv.colore,
          emoji: inv.emoji,
        }))
      );
    }
  }, [user]);

  const setCategorieSpese = useCallback(async (c: CategoriaSpesa[]) => {
    setCategorieSpeseState(c);
    if (!user) return;
    await supabase.from("categorie_spese").delete().eq("user_id", user.id);
    if (c.length > 0) {
      await supabase.from("categorie_spese").insert(
        c.map(cat => ({
          user_id: user.id,
          nome: cat.nome,
          emoji: cat.emoji,
          colore: cat.colore,
          slug: cat.id,
        }))
      );
    }
  }, [user]);

  const setSpese = useCallback(async (s: Spesa[]) => {
    setSpeseState(s);
    if (!user) return;

    trackEvent(AnalyticsEvents.SPESA_UPDATED, {
      count: s.length,
      total_amount: s.reduce((sum, sp) => sum + sp.importo, 0),
    });

    await supabase.from("spese").delete().eq("user_id", user.id);
    if (s.length > 0) {
      // Need to map categoriaId to actual DB category ids
      const { data: dbCats } = await supabase
        .from("categorie_spese")
        .select("id, slug")
        .eq("user_id", user.id);
      const slugMap = new Map(dbCats?.map(c => [c.slug, c.id]) || []);

      await supabase.from("spese").insert(
        s.map(sp => ({
          user_id: user.id,
          nome: sp.nome,
          importo: sp.importo,
          categoria_id: slugMap.get(sp.categoriaId) || null,
          badge: sp.badge,
          data: sp.data,
          nota: sp.nota || null,
          ricorrenza: sp.ricorrenza,
        }))
      );
    }
  }, [user]);

  const setPassivita = useCallback((p: Passivita[]) => {
    setPassivitaState(p);
    savePassivita(p);
  }, []);

  const completeOnboarding = useCallback(async (data: UserData) => {
    setUserDataState(data);
    setHasCompletedOnboarding(true);

    trackEvent(AnalyticsEvents.ONBOARDING_COMPLETED, {
      level: data.level,
      goals: data.goals,
    });

    if (user) {
      await supabase.from("profiles").update({
        name: data.name,
        email: data.email,
        phone: data.phone,
        birth_date: data.birthDate,
        goals: data.goals,
        level: data.level,
        has_completed_onboarding: true,
      }).eq("id", user.id);
    }
  }, [user]);

  const resetOnboarding = useCallback(async () => {
    setUserDataState(defaultUserData);
    setHasCompletedOnboarding(false);
    if (user) {
      await supabase.from("profiles").update({
        has_completed_onboarding: false,
      }).eq("id", user.id);
    }
  }, [user]);

  const value = useMemo(() => ({
    userData, setUserData, hasCompletedOnboarding, completeOnboarding, resetOnboarding,
    categorie, setCategorie, salvadanai, setSalvadanai, investimenti, setInvestimenti, lastPatrimonioUpdate,
    categorieSpese, setCategorieSpese, spese, setSpese, passivita, setPassivita, loadingData, isAdmin,
  }), [
    userData, setUserData, hasCompletedOnboarding, completeOnboarding, resetOnboarding,
    categorie, setCategorie, salvadanai, setSalvadanai, investimenti, setInvestimenti, lastPatrimonioUpdate,
    categorieSpese, setCategorieSpese, spese, setSpese, passivita, setPassivita, loadingData, isAdmin,
  ]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
