import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";

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
  importo: number;
  categoriaId: string;
  badge: string[];
  data: string;
  nota?: string;
  ricorrenza: "once" | "daily" | "weekly" | "monthly" | "yearly";
}

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
  loadingData: boolean;
  isAdmin: boolean;
}

const defaultUserData: UserData = {
  name: "Viaggiatore",
  goals: ["Risparmiare per un obiettivo"],
  level: "beginner",
};

const defaultCategorie: CategoriaPatrimonio[] = [
  { nome: "Liquidità", valore: 0, colore: "hsl(36, 27%, 43%)", emoji: "🏦" },
  { nome: "Soldi al Lavoro", valore: 0, colore: "hsl(101, 10%, 54%)", emoji: "📈" },
  { nome: "Cose di Valore", valore: 0, colore: "hsl(39, 39%, 75%)", emoji: "🏠" },
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

const UserContext = createContext<UserContextType | undefined>(undefined);

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
      try {
        // Load profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

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

        // Check admin role
        const { data: roles } = await supabase
          .from("user_roles" as any)
          .select("role")
          .eq("user_id", user.id);

        const adminRole = roles?.some((r: any) => r.role === "admin");
        setIsAdmin(!!adminRole);
        if (adminRole) {
          setHasCompletedOnboarding(true);
        }

        // Load patrimonio
        const { data: patrimonio } = await supabase
          .from("patrimonio")
          .select("*")
          .eq("user_id", user.id)
          .order("ordine");

        if (patrimonio && patrimonio.length > 0) {
          setCategorieState(patrimonio.map(p => ({
            nome: p.nome,
            valore: Number(p.valore),
            colore: p.colore,
            emoji: p.emoji,
          })));
          setLastPatrimonioUpdate(patrimonio[0].created_at);
        }

        // Load investimenti
        const { data: inv } = await supabase
          .from("investimenti")
          .select("*")
          .eq("user_id", user.id);

        if (inv && inv.length > 0) {
          setInvestimentiState(inv.map(i => ({
            nome: i.nome,
            valore: Number(i.valore),
            emoji: i.emoji,
            colore: i.colore,
          })));
        }

        // Load salvadanai
        const { data: salv } = await supabase
          .from("salvadanai")
          .select("*")
          .eq("user_id", user.id);

        if (salv && salv.length > 0) {
          setSalvadanaiState(salv.map(s => ({
            nome: s.nome,
            obiettivo: Number(s.obiettivo),
            attuale: Number(s.attuale),
          })));
        }

        // Load categorie spese
        const { data: catSpese } = await supabase
          .from("categorie_spese")
          .select("*")
          .eq("user_id", user.id);

        if (catSpese && catSpese.length > 0) {
          setCategorieSpeseState(catSpese.map(c => ({
            id: c.id,
            nome: c.nome,
            emoji: c.emoji,
            colore: c.colore,
          })));
        }

        // Load spese
        const { data: speseData } = await supabase
          .from("spese")
          .select("*")
          .eq("user_id", user.id);

        if (speseData && speseData.length > 0) {
          setSpeseState(speseData.map(s => ({
            id: s.id,
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
      }
      setLoadingData(false);
    };

    loadProfile();
  }, [user]);

  const setUserData = async (data: UserData) => {
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
  };

  const setCategorie = async (c: CategoriaPatrimonio[]) => {
    setCategorieState(c);
    if (!user) return;
    const now = new Date().toISOString();
    setLastPatrimonioUpdate(now);
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
  };

  const setSalvadanai = async (s: Salvadanaio[]) => {
    setSalvadanaiState(s);
    if (!user) return;
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
  };

  const setInvestimenti = async (i: Investimento[]) => {
    setInvestimentiState(i);
    if (!user) return;
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
  };

  const setCategorieSpese = async (c: CategoriaSpesa[]) => {
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
  };

  const setSpese = async (s: Spesa[]) => {
    setSpeseState(s);
    if (!user) return;
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
          importo: sp.importo,
          categoria_id: slugMap.get(sp.categoriaId) || null,
          badge: sp.badge,
          data: sp.data,
          nota: sp.nota || null,
          ricorrenza: sp.ricorrenza,
        }))
      );
    }
  };

  const completeOnboarding = async (data: UserData) => {
    setUserDataState(data);
    setHasCompletedOnboarding(true);
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
  };

  const resetOnboarding = async () => {
    setUserDataState(defaultUserData);
    setHasCompletedOnboarding(false);
    if (user) {
      await supabase.from("profiles").update({
        has_completed_onboarding: false,
      }).eq("id", user.id);
    }
  };

  return (
    <UserContext.Provider value={{
      userData, setUserData, hasCompletedOnboarding, completeOnboarding, resetOnboarding,
      categorie, setCategorie, salvadanai, setSalvadanai, investimenti, setInvestimenti, lastPatrimonioUpdate,
      categorieSpese, setCategorieSpese, spese, setSpese, loadingData, isAdmin,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
};
