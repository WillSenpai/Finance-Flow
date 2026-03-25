-- Workspace Communication: activity feed, comments, approval requests

-- Activity feed per workspace (timeline azioni)
CREATE TABLE public.workspace_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.shared_workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL CHECK (action_type IN (
    'expense_added', 'expense_updated', 'expense_deleted',
    'salvadanaio_created', 'salvadanaio_updated', 'salvadanaio_deleted',
    'salvadanaio_deposit', 'salvadanaio_withdraw',
    'investment_added', 'investment_updated', 'investment_deleted',
    'patrimonio_updated',
    'comment_added',
    'approval_requested', 'approval_approved', 'approval_rejected',
    'member_joined', 'member_left', 'member_removed'
  )),
  target_type TEXT CHECK (target_type IN ('expense', 'salvadanaio', 'investment', 'patrimonio', 'member')),
  target_id UUID,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX workspace_activities_workspace_idx
  ON public.workspace_activities(workspace_id, created_at DESC);
CREATE INDEX workspace_activities_user_idx
  ON public.workspace_activities(user_id);

-- Commenti su spese condivise
CREATE TABLE public.expense_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id UUID NOT NULL REFERENCES public.shared_spese(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES public.shared_workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (length(content) > 0 AND length(content) <= 500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX expense_comments_expense_idx ON public.expense_comments(expense_id, created_at ASC);
CREATE INDEX expense_comments_workspace_idx ON public.expense_comments(workspace_id);

-- Richieste approvazione per spese sopra soglia
CREATE TABLE public.approval_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.shared_workspaces(id) ON DELETE CASCADE,
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  approver_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  expense_id UUID NOT NULL REFERENCES public.shared_spese(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  threshold_amount NUMERIC NOT NULL,
  expense_amount NUMERIC NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

CREATE INDEX approval_requests_workspace_pending_idx
  ON public.approval_requests(workspace_id)
  WHERE status = 'pending';
CREATE INDEX approval_requests_requester_idx ON public.approval_requests(requester_id);

-- Configurazione soglie approvazione per workspace
CREATE TABLE public.workspace_approval_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.shared_workspaces(id) ON DELETE CASCADE UNIQUE,
  enabled BOOLEAN NOT NULL DEFAULT false,
  threshold_amount NUMERIC NOT NULL DEFAULT 100 CHECK (threshold_amount > 0),
  require_all_members BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Preferenze notifiche per membro workspace
CREATE TABLE public.workspace_notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.shared_workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  expense_added BOOLEAN NOT NULL DEFAULT true,
  expense_updated BOOLEAN NOT NULL DEFAULT false,
  salvadanaio_updated BOOLEAN NOT NULL DEFAULT true,
  comment_added BOOLEAN NOT NULL DEFAULT true,
  approval_requested BOOLEAN NOT NULL DEFAULT true,
  approval_resolved BOOLEAN NOT NULL DEFAULT true,
  push_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(workspace_id, user_id)
);

-- Trigger per updated_at
CREATE TRIGGER expense_comments_updated_at_trg
  BEFORE UPDATE ON public.expense_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_mark_updated_at();

CREATE TRIGGER workspace_approval_settings_updated_at_trg
  BEFORE UPDATE ON public.workspace_approval_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_mark_updated_at();

CREATE TRIGGER workspace_notification_preferences_updated_at_trg
  BEFORE UPDATE ON public.workspace_notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_mark_updated_at();

-- Auto-create activity for new expenses
CREATE OR REPLACE FUNCTION public.log_shared_expense_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.workspace_activities (
      workspace_id, user_id, action_type, target_type, target_id, metadata
    ) VALUES (
      NEW.workspace_id,
      NEW.created_by_user_id,
      'expense_added',
      'expense',
      NEW.id,
      jsonb_build_object('importo', NEW.importo, 'nota', NEW.nota)
    );
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.workspace_activities (
      workspace_id, user_id, action_type, target_type, target_id, metadata
    ) VALUES (
      NEW.workspace_id,
      auth.uid(),
      'expense_updated',
      'expense',
      NEW.id,
      jsonb_build_object('importo', NEW.importo, 'nota', NEW.nota)
    );
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.workspace_activities (
      workspace_id, user_id, action_type, target_type, target_id, metadata
    ) VALUES (
      OLD.workspace_id,
      auth.uid(),
      'expense_deleted',
      'expense',
      OLD.id,
      jsonb_build_object('importo', OLD.importo, 'nota', OLD.nota)
    );
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER log_shared_expense_activity_trg
  AFTER INSERT OR UPDATE OR DELETE ON public.shared_spese
  FOR EACH ROW
  EXECUTE FUNCTION public.log_shared_expense_activity();

-- Auto-create activity for salvadanai changes
CREATE OR REPLACE FUNCTION public.log_shared_salvadanaio_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  action TEXT;
  prev_attuale NUMERIC;
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.workspace_activities (
      workspace_id, user_id, action_type, target_type, target_id, metadata
    ) VALUES (
      NEW.workspace_id,
      auth.uid(),
      'salvadanaio_created',
      'salvadanaio',
      NEW.id,
      jsonb_build_object('nome', NEW.nome, 'obiettivo', NEW.obiettivo)
    );
  ELSIF TG_OP = 'UPDATE' THEN
    -- Check if this is a deposit/withdraw
    IF OLD.attuale <> NEW.attuale THEN
      IF NEW.attuale > OLD.attuale THEN
        action := 'salvadanaio_deposit';
      ELSE
        action := 'salvadanaio_withdraw';
      END IF;
      INSERT INTO public.workspace_activities (
        workspace_id, user_id, action_type, target_type, target_id, metadata
      ) VALUES (
        NEW.workspace_id,
        auth.uid(),
        action,
        'salvadanaio',
        NEW.id,
        jsonb_build_object(
          'nome', NEW.nome,
          'importo', abs(NEW.attuale - OLD.attuale),
          'nuovo_totale', NEW.attuale
        )
      );
    ELSE
      INSERT INTO public.workspace_activities (
        workspace_id, user_id, action_type, target_type, target_id, metadata
      ) VALUES (
        NEW.workspace_id,
        auth.uid(),
        'salvadanaio_updated',
        'salvadanaio',
        NEW.id,
        jsonb_build_object('nome', NEW.nome, 'obiettivo', NEW.obiettivo)
      );
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.workspace_activities (
      workspace_id, user_id, action_type, target_type, target_id, metadata
    ) VALUES (
      OLD.workspace_id,
      auth.uid(),
      'salvadanaio_deleted',
      'salvadanaio',
      OLD.id,
      jsonb_build_object('nome', OLD.nome)
    );
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER log_shared_salvadanaio_activity_trg
  AFTER INSERT OR UPDATE OR DELETE ON public.shared_salvadanai
  FOR EACH ROW
  EXECUTE FUNCTION public.log_shared_salvadanaio_activity();

-- Enable RLS
ALTER TABLE public.workspace_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_approval_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_notification_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies: workspace_activities
CREATE POLICY "Members can view workspace activities"
  ON public.workspace_activities
  FOR SELECT TO authenticated
  USING (public.is_workspace_member(workspace_id, auth.uid()));

-- Insert via trigger only
CREATE POLICY "Service role can insert activities"
  ON public.workspace_activities
  FOR INSERT TO service_role
  WITH CHECK (true);

-- Members can also insert (for manual activities)
CREATE POLICY "Members can insert workspace activities"
  ON public.workspace_activities
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_workspace_member(workspace_id, auth.uid())
    AND user_id = auth.uid()
  );

-- RLS Policies: expense_comments
CREATE POLICY "Members can view expense comments"
  ON public.expense_comments
  FOR SELECT TO authenticated
  USING (public.is_workspace_member(workspace_id, auth.uid()));

CREATE POLICY "Members can insert expense comments"
  ON public.expense_comments
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_workspace_member(workspace_id, auth.uid())
    AND user_id = auth.uid()
  );

CREATE POLICY "Users can update own comments"
  ON public.expense_comments
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own comments"
  ON public.expense_comments
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies: approval_requests
CREATE POLICY "Members can view approval requests"
  ON public.approval_requests
  FOR SELECT TO authenticated
  USING (public.is_workspace_member(workspace_id, auth.uid()));

CREATE POLICY "Members can insert approval requests"
  ON public.approval_requests
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_workspace_member(workspace_id, auth.uid())
    AND requester_id = auth.uid()
  );

CREATE POLICY "Members can update approval requests"
  ON public.approval_requests
  FOR UPDATE TO authenticated
  USING (public.is_workspace_member(workspace_id, auth.uid()));

-- RLS Policies: workspace_approval_settings
CREATE POLICY "Members can view approval settings"
  ON public.workspace_approval_settings
  FOR SELECT TO authenticated
  USING (public.is_workspace_member(workspace_id, auth.uid()));

CREATE POLICY "Owners can manage approval settings"
  ON public.workspace_approval_settings
  FOR ALL TO authenticated
  USING (public.is_workspace_owner(workspace_id, auth.uid()))
  WITH CHECK (public.is_workspace_owner(workspace_id, auth.uid()));

-- RLS Policies: workspace_notification_preferences
CREATE POLICY "Users can view own notification preferences"
  ON public.workspace_notification_preferences
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own notification preferences"
  ON public.workspace_notification_preferences
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_workspace_member(workspace_id, auth.uid())
    AND user_id = auth.uid()
  );

CREATE POLICY "Users can update own notification preferences"
  ON public.workspace_notification_preferences
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own notification preferences"
  ON public.workspace_notification_preferences
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());
