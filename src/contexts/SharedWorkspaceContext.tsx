/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";

export interface SharedCategoriaPatrimonio {
  id: string;
  nome: string;
  valore: number;
  colore: string;
  emoji: string;
}

export interface SharedInvestimento {
  id: string;
  nome: string;
  valore: number;
  emoji: string;
  colore: string;
}

export interface SharedSalvadanaio {
  id: string;
  nome: string;
  obiettivo: number;
  attuale: number;
}

export interface SharedCategoriaSpesa {
  id: string;
  nome: string;
  emoji: string;
  colore: string;
}

export interface SharedSpesa {
  id: string;
  importo: number;
  categoriaId: string;
  badge: string[];
  data: string;
  nota?: string;
  ricorrenza: "once" | "daily" | "weekly" | "monthly" | "yearly";
  createdByUserId: string;
  createdByName?: string;
}

export interface SharedWorkspaceMember {
  userId: string;
  name: string;
  role: "owner" | "member";
  status: "active" | "left" | "removed";
  joinedAt: string;
}

export interface PendingWorkspaceInvite {
  id: string;
  workspaceId: string;
  workspaceName: string;
  inviterName: string;
  expiresAt: string;
}

interface SharedWorkspaceContextValue {
  loading: boolean;
  workspaceId: string | null;
  workspaceName: string | null;
  myRole: "owner" | "member" | null;
  hasActiveWorkspace: boolean;
  members: SharedWorkspaceMember[];
  pendingInvites: PendingWorkspaceInvite[];
  categorie: SharedCategoriaPatrimonio[];
  investimenti: SharedInvestimento[];
  salvadanai: SharedSalvadanaio[];
  categorieSpese: SharedCategoriaSpesa[];
  spese: SharedSpesa[];
  refreshAll: () => Promise<void>;
  createWorkspace: (name: string) => Promise<{ ok: boolean; error?: string }>;
  inviteMember: (email: string) => Promise<{ ok: boolean; error?: string; emailSent?: boolean }>;
  respondToInvite: (inviteId: string, decision: "accept" | "decline") => Promise<{ ok: boolean; error?: string }>;
  removeMember: (targetUserId: string) => Promise<{ ok: boolean; error?: string }>;
  leaveWorkspace: () => Promise<{ ok: boolean; error?: string }>;
  setCategorie: (items: SharedCategoriaPatrimonio[]) => Promise<void>;
  setInvestimenti: (items: SharedInvestimento[]) => Promise<void>;
  setSalvadanai: (items: SharedSalvadanaio[]) => Promise<void>;
  setSpese: (items: SharedSpesa[]) => Promise<void>;
}

const SharedWorkspaceContext = createContext<SharedWorkspaceContextValue | undefined>(undefined);

const asDb = () => supabase as any;

const getFunctionsErrorMessage = async (error: unknown, fallback: string) => {
  if (!error || typeof error !== "object") return fallback;
  const err = error as { message?: string; context?: Response };

  if (err.context) {
    if (err.context.status === 401) {
      return "Sessione non valida. Effettua di nuovo il login.";
    }
    const payload = await err.context.clone().json().catch(() => null);
    if (payload && typeof payload === "object" && "error" in payload && typeof payload.error === "string") {
      return payload.error;
    }
  }

  if (err.message?.includes("non-2xx")) {
    return "Operazione non riuscita. Riprova tra pochi secondi.";
  }

  return err.message ?? fallback;
};

export const SharedWorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [workspaceName, setWorkspaceName] = useState<string | null>(null);
  const [myRole, setMyRole] = useState<"owner" | "member" | null>(null);
  const [members, setMembers] = useState<SharedWorkspaceMember[]>([]);
  const [pendingInvites, setPendingInvites] = useState<PendingWorkspaceInvite[]>([]);
  const [categorie, setCategorieState] = useState<SharedCategoriaPatrimonio[]>([]);
  const [investimenti, setInvestimentiState] = useState<SharedInvestimento[]>([]);
  const [salvadanai, setSalvadanaiState] = useState<SharedSalvadanaio[]>([]);
  const [categorieSpese, setCategorieSpeseState] = useState<SharedCategoriaSpesa[]>([]);
  const [spese, setSpeseState] = useState<SharedSpesa[]>([]);

  const loadPendingInvites = useCallback(async () => {
    if (!user) {
      setPendingInvites([]);
      return;
    }
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;
    if (!accessToken) {
      setPendingInvites([]);
      return;
    }
    const { data, error } = await supabase.functions.invoke("workspace-invite-list", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (error) {
      console.error("workspace-invite-list error:", error);
      return;
    }
    setPendingInvites((data?.invites ?? []) as PendingWorkspaceInvite[]);
  }, [user]);

  const loadWorkspaceData = useCallback(
    async (currentWorkspaceId: string) => {
      const db = asDb();

      const [
        workspaceResp,
        membersResp,
        patrimonioResp,
        investimentiResp,
        salvadanaiResp,
        categorieSpeseResp,
        speseResp,
      ] = await Promise.all([
        db.from("shared_workspaces").select("id, name").eq("id", currentWorkspaceId).maybeSingle(),
        db
          .from("shared_workspace_members")
          .select("user_id, role, status, joined_at")
          .eq("workspace_id", currentWorkspaceId)
          .order("joined_at"),
        db.from("shared_patrimonio").select("*").eq("workspace_id", currentWorkspaceId).order("ordine"),
        db.from("shared_investimenti").select("*").eq("workspace_id", currentWorkspaceId),
        db.from("shared_salvadanai").select("*").eq("workspace_id", currentWorkspaceId),
        db.from("shared_categorie_spese").select("*").eq("workspace_id", currentWorkspaceId),
        db.from("shared_spese").select("*").eq("workspace_id", currentWorkspaceId).order("data", { ascending: false }),
      ]);

      setWorkspaceName(workspaceResp.data?.name ?? "Spazio condiviso");

      const memberRows = membersResp.data ?? [];
      const memberUserIds = memberRows.map((m: any) => m.user_id);
      const { data: profiles } = memberUserIds.length
        ? await db.from("profiles").select("id, name").in("id", memberUserIds)
        : { data: [] };
      const namesByUserId = new Map((profiles ?? []).map((p: any) => [p.id, p.name]));

      setMembers(
        memberRows.map((m: any) => ({
          userId: m.user_id,
          name: namesByUserId.get(m.user_id) ?? "Membro",
          role: m.role,
          status: m.status,
          joinedAt: m.joined_at,
        })),
      );

      setCategorieState(
        (patrimonioResp.data ?? []).map((p: any) => ({
          id: p.id,
          nome: p.nome,
          valore: Number(p.valore),
          colore: p.colore,
          emoji: p.emoji,
        })),
      );
      setInvestimentiState(
        (investimentiResp.data ?? []).map((i: any) => ({
          id: i.id,
          nome: i.nome,
          valore: Number(i.valore),
          emoji: i.emoji,
          colore: i.colore,
        })),
      );
      setSalvadanaiState(
        (salvadanaiResp.data ?? []).map((s: any) => ({
          id: s.id,
          nome: s.nome,
          obiettivo: Number(s.obiettivo),
          attuale: Number(s.attuale),
        })),
      );
      const catRows = (categorieSpeseResp.data ?? []).map((c: any) => ({
        id: c.id,
        nome: c.nome,
        emoji: c.emoji,
        colore: c.colore,
      }));
      setCategorieSpeseState(catRows);

      const createdByUserIds = [...new Set((speseResp.data ?? []).map((s: any) => s.created_by_user_id))];
      const { data: speseProfiles } = createdByUserIds.length
        ? await db.from("profiles").select("id, name").in("id", createdByUserIds)
        : { data: [] };
      const speseNamesByUserId = new Map((speseProfiles ?? []).map((p: any) => [p.id, p.name]));

      setSpeseState(
        (speseResp.data ?? []).map((s: any) => ({
          id: s.id,
          importo: Number(s.importo),
          categoriaId: s.categoria_id ?? "",
          badge: s.badge ?? [],
          data: s.data,
          nota: s.nota ?? undefined,
          ricorrenza: s.ricorrenza,
          createdByUserId: s.created_by_user_id,
          createdByName: speseNamesByUserId.get(s.created_by_user_id) ?? "Membro",
        })),
      );
    },
    [],
  );

  const refreshAll = useCallback(async () => {
    if (!user) {
      setWorkspaceId(null);
      setWorkspaceName(null);
      setMyRole(null);
      setMembers([]);
      setPendingInvites([]);
      setCategorieState([]);
      setInvestimentiState([]);
      setSalvadanaiState([]);
      setCategorieSpeseState([]);
      setSpeseState([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const db = asDb();

    const { data: membership } = await db
      .from("shared_workspace_members")
      .select("workspace_id, role, status")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    if (!membership?.workspace_id) {
      setWorkspaceId(null);
      setWorkspaceName(null);
      setMyRole(null);
      setMembers([]);
      setCategorieState([]);
      setInvestimentiState([]);
      setSalvadanaiState([]);
      setCategorieSpeseState([]);
      setSpeseState([]);
      await loadPendingInvites();
      setLoading(false);
      return;
    }

    setWorkspaceId(membership.workspace_id);
    setMyRole(membership.role);
    await Promise.all([loadWorkspaceData(membership.workspace_id), loadPendingInvites()]);
    setLoading(false);
  }, [loadPendingInvites, loadWorkspaceData, user]);

  useEffect(() => {
    void refreshAll();
  }, [refreshAll]);

  const createWorkspace = useCallback(
    async (name: string) => {
      if (!user) return { ok: false, error: "Utente non autenticato" };
      const db = asDb();
      const { error } = await db.from("shared_workspaces").insert({
        owner_user_id: user.id,
        name: name.trim() || "Spazio condiviso",
        max_members: 5,
      });
      if (error) return { ok: false, error: error.message };
      await refreshAll();
      return { ok: true };
    },
    [refreshAll, user],
  );

  const inviteMember = useCallback(
    async (email: string) => {
      if (!workspaceId) return { ok: false, error: "Nessun workspace attivo" };
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      if (!accessToken) return { ok: false, error: "Sessione non valida. Effettua di nuovo il login." };
      const { data, error } = await supabase.functions.invoke("workspace-invite-create", {
        body: { workspaceId, email },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (error) return { ok: false, error: await getFunctionsErrorMessage(error, "Invio invito fallito") };
      await refreshAll();
      return { ok: true, emailSent: Boolean(data?.emailSent) };
    },
    [refreshAll, workspaceId],
  );

  const respondToInvite = useCallback(
    async (inviteId: string, decision: "accept" | "decline") => {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      if (!accessToken) return { ok: false, error: "Sessione non valida. Effettua di nuovo il login." };
      const { error } = await supabase.functions.invoke("workspace-invite-accept", {
        body: { inviteId, decision },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (error) return { ok: false, error: await getFunctionsErrorMessage(error, "Risposta invito fallita") };
      await refreshAll();
      return { ok: true };
    },
    [refreshAll],
  );

  const removeMember = useCallback(
    async (targetUserId: string) => {
      if (!workspaceId) return { ok: false, error: "Nessun workspace attivo" };
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      if (!accessToken) return { ok: false, error: "Sessione non valida. Effettua di nuovo il login." };
      const { error } = await supabase.functions.invoke("workspace-member-remove", {
        body: { workspaceId, targetUserId, action: "remove" },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (error) return { ok: false, error: await getFunctionsErrorMessage(error, "Impossibile rimuovere membro") };
      await refreshAll();
      return { ok: true };
    },
    [refreshAll, workspaceId],
  );

  const leaveWorkspace = useCallback(async () => {
    if (!workspaceId) return { ok: false, error: "Nessun workspace attivo" };
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;
    if (!accessToken) return { ok: false, error: "Sessione non valida. Effettua di nuovo il login." };
    const { error } = await supabase.functions.invoke("workspace-member-remove", {
      body: { workspaceId, action: "leave" },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (error) return { ok: false, error: await getFunctionsErrorMessage(error, "Impossibile uscire dal workspace") };
    await refreshAll();
    return { ok: true };
  }, [refreshAll, workspaceId]);

  const setCategorie = useCallback(
    async (items: SharedCategoriaPatrimonio[]) => {
      if (!workspaceId) return;
      const db = asDb();
      setCategorieState(items);
      await db.from("shared_patrimonio").delete().eq("workspace_id", workspaceId);
      if (items.length > 0) {
        await db.from("shared_patrimonio").insert(
          items.map((item, index) => ({
            workspace_id: workspaceId,
            nome: item.nome,
            valore: item.valore,
            colore: item.colore,
            emoji: item.emoji,
            ordine: index,
          })),
        );
      }
      await refreshAll();
    },
    [refreshAll, workspaceId],
  );

  const setInvestimenti = useCallback(
    async (items: SharedInvestimento[]) => {
      if (!workspaceId) return;
      const db = asDb();
      setInvestimentiState(items);
      await db.from("shared_investimenti").delete().eq("workspace_id", workspaceId);
      if (items.length > 0) {
        await db.from("shared_investimenti").insert(
          items.map((item) => ({
            workspace_id: workspaceId,
            nome: item.nome,
            valore: item.valore,
            emoji: item.emoji,
            colore: item.colore,
          })),
        );
      }
      await refreshAll();
    },
    [refreshAll, workspaceId],
  );

  const setSalvadanai = useCallback(
    async (items: SharedSalvadanaio[]) => {
      if (!workspaceId) return;
      const db = asDb();
      setSalvadanaiState(items);
      await db.from("shared_salvadanai").delete().eq("workspace_id", workspaceId);
      if (items.length > 0) {
        await db.from("shared_salvadanai").insert(
          items.map((item) => ({
            workspace_id: workspaceId,
            nome: item.nome,
            obiettivo: item.obiettivo,
            attuale: item.attuale,
          })),
        );
      }
      await refreshAll();
    },
    [refreshAll, workspaceId],
  );

  const setSpese = useCallback(
    async (items: SharedSpesa[]) => {
      if (!workspaceId || !user) return;
      const db = asDb();
      setSpeseState(items);
      await db.from("shared_spese").delete().eq("workspace_id", workspaceId);
      if (items.length > 0) {
        await db.from("shared_spese").insert(
          items.map((item) => ({
            workspace_id: workspaceId,
            importo: item.importo,
            categoria_id: item.categoriaId || null,
            badge: item.badge ?? [],
            data: item.data,
            nota: item.nota ?? null,
            ricorrenza: item.ricorrenza,
            created_by_user_id: item.createdByUserId || user.id,
          })),
        );
      }
      await refreshAll();
    },
    [refreshAll, user, workspaceId],
  );

  const value = useMemo<SharedWorkspaceContextValue>(
    () => ({
      loading,
      workspaceId,
      workspaceName,
      myRole,
      hasActiveWorkspace: Boolean(workspaceId),
      members,
      pendingInvites,
      categorie,
      investimenti,
      salvadanai,
      categorieSpese,
      spese,
      refreshAll,
      createWorkspace,
      inviteMember,
      respondToInvite,
      removeMember,
      leaveWorkspace,
      setCategorie,
      setInvestimenti,
      setSalvadanai,
      setSpese,
    }),
    [
      categorie,
      categorieSpese,
      createWorkspace,
      inviteMember,
      investimenti,
      leaveWorkspace,
      loading,
      members,
      myRole,
      pendingInvites,
      refreshAll,
      removeMember,
      respondToInvite,
      salvadanai,
      setCategorie,
      setInvestimenti,
      setSalvadanai,
      setSpese,
      spese,
      workspaceId,
      workspaceName,
    ],
  );

  return <SharedWorkspaceContext.Provider value={value}>{children}</SharedWorkspaceContext.Provider>;
};

export function useSharedWorkspace() {
  const ctx = useContext(SharedWorkspaceContext);
  if (!ctx) throw new Error("useSharedWorkspace must be used within SharedWorkspaceProvider");
  return ctx;
}
