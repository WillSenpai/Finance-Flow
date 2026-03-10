-- Shared workspace feature for patrimonio/spese collaboration.

CREATE TABLE public.shared_workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Spazio Condiviso',
  max_members INT NOT NULL DEFAULT 5 CHECK (max_members BETWEEN 2 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (owner_user_id)
);

CREATE TABLE public.shared_workspace_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.shared_workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'member')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'left', 'removed')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  left_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (workspace_id, user_id)
);

CREATE UNIQUE INDEX shared_workspace_members_single_active_per_user_idx
  ON public.shared_workspace_members (user_id)
  WHERE status = 'active';

CREATE TABLE public.shared_workspace_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.shared_workspaces(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  invited_by_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'revoked', 'expired')),
  expires_at TIMESTAMPTZ NOT NULL,
  accepted_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  responded_at TIMESTAMPTZ,
  UNIQUE (workspace_id, email, status) DEFERRABLE INITIALLY IMMEDIATE
);

CREATE TABLE public.shared_patrimonio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.shared_workspaces(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  valore NUMERIC NOT NULL DEFAULT 0,
  colore TEXT NOT NULL,
  emoji TEXT NOT NULL,
  ordine INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.shared_investimenti (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.shared_workspaces(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  valore NUMERIC NOT NULL DEFAULT 0,
  emoji TEXT NOT NULL,
  colore TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.shared_salvadanai (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.shared_workspaces(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  obiettivo NUMERIC NOT NULL DEFAULT 0,
  attuale NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.shared_categorie_spese (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.shared_workspaces(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  nome TEXT NOT NULL,
  emoji TEXT NOT NULL,
  colore TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (workspace_id, slug)
);

CREATE TABLE public.shared_spese (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.shared_workspaces(id) ON DELETE CASCADE,
  importo NUMERIC NOT NULL,
  categoria_id UUID REFERENCES public.shared_categorie_spese(id) ON DELETE SET NULL,
  badge TEXT[] NOT NULL DEFAULT '{}',
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  nota TEXT,
  ricorrenza TEXT NOT NULL DEFAULT 'once' CHECK (ricorrenza IN ('once', 'daily', 'weekly', 'monthly', 'yearly')),
  created_by_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX shared_workspace_members_workspace_idx ON public.shared_workspace_members(workspace_id);
CREATE INDEX shared_workspace_invites_workspace_idx ON public.shared_workspace_invites(workspace_id);
CREATE INDEX shared_workspace_invites_email_pending_idx
  ON public.shared_workspace_invites((lower(email)))
  WHERE status = 'pending';
CREATE INDEX shared_spese_workspace_data_idx ON public.shared_spese(workspace_id, data DESC);

CREATE OR REPLACE FUNCTION public.is_workspace_member(workspace_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.shared_workspace_members swm
    WHERE swm.workspace_id = workspace_uuid
      AND swm.user_id = user_uuid
      AND swm.status = 'active'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_workspace_owner(workspace_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.shared_workspace_members swm
    WHERE swm.workspace_id = workspace_uuid
      AND swm.user_id = user_uuid
      AND swm.status = 'active'
      AND swm.role = 'owner'
  );
$$;

CREATE OR REPLACE FUNCTION public.enforce_shared_workspace_member_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  active_count INT;
  max_allowed INT;
BEGIN
  IF NEW.status <> 'active' THEN
    RETURN NEW;
  END IF;

  SELECT count(*)
    INTO active_count
  FROM public.shared_workspace_members
  WHERE workspace_id = NEW.workspace_id
    AND status = 'active'
    AND (TG_OP <> 'UPDATE' OR id <> NEW.id);

  SELECT max_members
    INTO max_allowed
  FROM public.shared_workspaces
  WHERE id = NEW.workspace_id;

  IF active_count >= COALESCE(max_allowed, 5) THEN
    RAISE EXCEPTION 'Workspace member limit reached';
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.seed_shared_workspace_defaults()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.shared_workspace_members (workspace_id, user_id, role, status)
  VALUES (NEW.id, NEW.owner_user_id, 'owner', 'active')
  ON CONFLICT (workspace_id, user_id) DO UPDATE
    SET role = 'owner',
        status = 'active',
        joined_at = now(),
        left_at = NULL;

  INSERT INTO public.shared_patrimonio (workspace_id, nome, valore, colore, emoji, ordine)
  VALUES
    (NEW.id, 'Liquidità', 0, 'hsl(36, 27%, 43%)', '🏦', 0),
    (NEW.id, 'Soldi al Lavoro', 0, 'hsl(101, 10%, 54%)', '📈', 1),
    (NEW.id, 'Cose di Valore', 0, 'hsl(39, 39%, 75%)', '🏠', 2);

  INSERT INTO public.shared_investimenti (workspace_id, nome, valore, emoji, colore)
  VALUES
    (NEW.id, 'ETF / Fondi', 0, '📊', 'hsl(270, 50%, 55%)'),
    (NEW.id, 'Azioni', 0, '📉', 'hsl(140, 50%, 45%)'),
    (NEW.id, 'Crypto', 0, '🪙', 'hsl(30, 80%, 55%)'),
    (NEW.id, 'Obbligazioni', 0, '🏛️', 'hsl(220, 50%, 35%)');

  INSERT INTO public.shared_categorie_spese (workspace_id, slug, nome, emoji, colore)
  VALUES
    (NEW.id, 'cibo', 'Cibo', '🍕', 'hsl(10, 70%, 50%)'),
    (NEW.id, 'trasporti', 'Trasporti', '🚗', 'hsl(210, 60%, 50%)'),
    (NEW.id, 'shopping', 'Shopping', '🛍️', 'hsl(280, 60%, 55%)'),
    (NEW.id, 'salute', 'Salute', '💊', 'hsl(150, 50%, 45%)'),
    (NEW.id, 'casa', 'Casa', '🏠', 'hsl(35, 60%, 50%)'),
    (NEW.id, 'svago', 'Svago', '🎬', 'hsl(330, 60%, 55%)'),
    (NEW.id, 'abbonamenti', 'Abbonamenti', '📱', 'hsl(190, 60%, 45%)'),
    (NEW.id, 'altro', 'Altro', '📦', 'hsl(0, 0%, 50%)');

  RETURN NEW;
END;
$$;

CREATE TRIGGER enforce_shared_workspace_member_limit_trg
  BEFORE INSERT OR UPDATE OF status
  ON public.shared_workspace_members
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_shared_workspace_member_limit();

CREATE TRIGGER seed_shared_workspace_defaults_trg
  AFTER INSERT
  ON public.shared_workspaces
  FOR EACH ROW
  EXECUTE FUNCTION public.seed_shared_workspace_defaults();

ALTER TABLE public.shared_workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_workspace_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_patrimonio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_investimenti ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_salvadanai ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_categorie_spese ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_spese ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Shared workspace members can view workspaces"
  ON public.shared_workspaces
  FOR SELECT TO authenticated
  USING (public.is_workspace_member(id, auth.uid()));

CREATE POLICY "Users can create owned workspace"
  ON public.shared_workspaces
  FOR INSERT TO authenticated
  WITH CHECK (owner_user_id = auth.uid());

CREATE POLICY "Owners can update workspace"
  ON public.shared_workspaces
  FOR UPDATE TO authenticated
  USING (public.is_workspace_owner(id, auth.uid()));

CREATE POLICY "Owners can delete workspace"
  ON public.shared_workspaces
  FOR DELETE TO authenticated
  USING (public.is_workspace_owner(id, auth.uid()));

CREATE POLICY "Members can view workspace members"
  ON public.shared_workspace_members
  FOR SELECT TO authenticated
  USING (public.is_workspace_member(workspace_id, auth.uid()));

CREATE POLICY "Owners can manage workspace members"
  ON public.shared_workspace_members
  FOR ALL TO authenticated
  USING (public.is_workspace_owner(workspace_id, auth.uid()))
  WITH CHECK (public.is_workspace_owner(workspace_id, auth.uid()));

CREATE POLICY "Members can leave workspace"
  ON public.shared_workspace_members
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid() AND status = 'active')
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Owners can view invites"
  ON public.shared_workspace_invites
  FOR SELECT TO authenticated
  USING (public.is_workspace_owner(workspace_id, auth.uid()));

CREATE POLICY "Invitee can view own pending invites"
  ON public.shared_workspace_invites
  FOR SELECT TO authenticated
  USING (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));

CREATE POLICY "Owners can insert invites"
  ON public.shared_workspace_invites
  FOR INSERT TO authenticated
  WITH CHECK (public.is_workspace_owner(workspace_id, auth.uid()));

CREATE POLICY "Owners can update invites"
  ON public.shared_workspace_invites
  FOR UPDATE TO authenticated
  USING (public.is_workspace_owner(workspace_id, auth.uid()));

CREATE POLICY "Members can read shared patrimonio"
  ON public.shared_patrimonio
  FOR SELECT TO authenticated
  USING (public.is_workspace_member(workspace_id, auth.uid()));

CREATE POLICY "Members can insert shared patrimonio"
  ON public.shared_patrimonio
  FOR INSERT TO authenticated
  WITH CHECK (public.is_workspace_member(workspace_id, auth.uid()));

CREATE POLICY "Members can update shared patrimonio"
  ON public.shared_patrimonio
  FOR UPDATE TO authenticated
  USING (public.is_workspace_member(workspace_id, auth.uid()));

CREATE POLICY "Members can delete shared patrimonio"
  ON public.shared_patrimonio
  FOR DELETE TO authenticated
  USING (public.is_workspace_member(workspace_id, auth.uid()));

CREATE POLICY "Members can read shared investimenti"
  ON public.shared_investimenti
  FOR SELECT TO authenticated
  USING (public.is_workspace_member(workspace_id, auth.uid()));

CREATE POLICY "Members can insert shared investimenti"
  ON public.shared_investimenti
  FOR INSERT TO authenticated
  WITH CHECK (public.is_workspace_member(workspace_id, auth.uid()));

CREATE POLICY "Members can update shared investimenti"
  ON public.shared_investimenti
  FOR UPDATE TO authenticated
  USING (public.is_workspace_member(workspace_id, auth.uid()));

CREATE POLICY "Members can delete shared investimenti"
  ON public.shared_investimenti
  FOR DELETE TO authenticated
  USING (public.is_workspace_member(workspace_id, auth.uid()));

CREATE POLICY "Members can read shared salvadanai"
  ON public.shared_salvadanai
  FOR SELECT TO authenticated
  USING (public.is_workspace_member(workspace_id, auth.uid()));

CREATE POLICY "Members can insert shared salvadanai"
  ON public.shared_salvadanai
  FOR INSERT TO authenticated
  WITH CHECK (public.is_workspace_member(workspace_id, auth.uid()));

CREATE POLICY "Members can update shared salvadanai"
  ON public.shared_salvadanai
  FOR UPDATE TO authenticated
  USING (public.is_workspace_member(workspace_id, auth.uid()));

CREATE POLICY "Members can delete shared salvadanai"
  ON public.shared_salvadanai
  FOR DELETE TO authenticated
  USING (public.is_workspace_member(workspace_id, auth.uid()));

CREATE POLICY "Members can read shared categorie spese"
  ON public.shared_categorie_spese
  FOR SELECT TO authenticated
  USING (public.is_workspace_member(workspace_id, auth.uid()));

CREATE POLICY "Members can insert shared categorie spese"
  ON public.shared_categorie_spese
  FOR INSERT TO authenticated
  WITH CHECK (public.is_workspace_member(workspace_id, auth.uid()));

CREATE POLICY "Members can update shared categorie spese"
  ON public.shared_categorie_spese
  FOR UPDATE TO authenticated
  USING (public.is_workspace_member(workspace_id, auth.uid()));

CREATE POLICY "Members can delete shared categorie spese"
  ON public.shared_categorie_spese
  FOR DELETE TO authenticated
  USING (public.is_workspace_member(workspace_id, auth.uid()));

CREATE POLICY "Members can read shared spese"
  ON public.shared_spese
  FOR SELECT TO authenticated
  USING (public.is_workspace_member(workspace_id, auth.uid()));

CREATE POLICY "Members can insert shared spese"
  ON public.shared_spese
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_workspace_member(workspace_id, auth.uid())
    AND created_by_user_id = auth.uid()
  );

CREATE POLICY "Members can update shared spese"
  ON public.shared_spese
  FOR UPDATE TO authenticated
  USING (public.is_workspace_member(workspace_id, auth.uid()));

CREATE POLICY "Members can delete shared spese"
  ON public.shared_spese
  FOR DELETE TO authenticated
  USING (public.is_workspace_member(workspace_id, auth.uid()));
