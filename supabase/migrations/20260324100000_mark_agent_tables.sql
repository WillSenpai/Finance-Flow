-- Mark Agent System: workflows, financial plans, and memory tables

-- Stato workflow multi-step per onboarding, piani finanziari, review settimanali
CREATE TABLE public.mark_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workflow_type TEXT NOT NULL CHECK (workflow_type IN ('onboarding', 'financial_plan', 'weekly_review')),
  current_step INT NOT NULL DEFAULT 0,
  total_steps INT NOT NULL,
  state JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Un solo workflow attivo per tipo per utente
CREATE UNIQUE INDEX mark_workflows_active_per_type_idx
  ON public.mark_workflows (user_id, workflow_type)
  WHERE status = 'active';

-- Indice per query frequenti
CREATE INDEX mark_workflows_user_status_idx ON public.mark_workflows(user_id, status);

-- Piani finanziari personalizzati (Pro feature)
CREATE TABLE public.user_financial_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  salvadanaio_id UUID REFERENCES public.salvadanai(id) ON DELETE SET NULL,
  goal_amount NUMERIC NOT NULL CHECK (goal_amount > 0),
  monthly_target NUMERIC NOT NULL CHECK (monthly_target > 0),
  timeline_months INT NOT NULL CHECK (timeline_months > 0),
  checkpoints JSONB NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
  last_checkin_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX user_financial_plans_user_idx ON public.user_financial_plans(user_id);
CREATE INDEX user_financial_plans_salvadanaio_idx ON public.user_financial_plans(salvadanaio_id);

-- Memoria contestuale Mark (per ricordare preferenze, contesto utente)
CREATE TABLE public.mark_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value JSONB NOT NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, key)
);

CREATE INDEX mark_memory_user_key_idx ON public.mark_memory(user_id, key);
CREATE INDEX mark_memory_expires_idx ON public.mark_memory(expires_at) WHERE expires_at IS NOT NULL;

-- Notifiche Mark (push + in-app)
CREATE TABLE public.mark_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('urgent', 'important', 'informative')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  action_url TEXT,
  metadata JSONB NOT NULL DEFAULT '{}',
  read_at TIMESTAMPTZ,
  pushed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX mark_notifications_user_unread_idx
  ON public.mark_notifications(user_id, created_at DESC)
  WHERE read_at IS NULL;

-- Funzione per aggiornare updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_mark_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER mark_workflows_updated_at_trg
  BEFORE UPDATE ON public.mark_workflows
  FOR EACH ROW
  EXECUTE FUNCTION public.update_mark_updated_at();

CREATE TRIGGER user_financial_plans_updated_at_trg
  BEFORE UPDATE ON public.user_financial_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_mark_updated_at();

CREATE TRIGGER mark_memory_updated_at_trg
  BEFORE UPDATE ON public.mark_memory
  FOR EACH ROW
  EXECUTE FUNCTION public.update_mark_updated_at();

-- Enable RLS
ALTER TABLE public.mark_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_financial_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mark_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mark_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies: mark_workflows
CREATE POLICY "Users can view own workflows"
  ON public.mark_workflows
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own workflows"
  ON public.mark_workflows
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own workflows"
  ON public.mark_workflows
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own workflows"
  ON public.mark_workflows
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies: user_financial_plans
CREATE POLICY "Users can view own financial plans"
  ON public.user_financial_plans
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own financial plans"
  ON public.user_financial_plans
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own financial plans"
  ON public.user_financial_plans
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own financial plans"
  ON public.user_financial_plans
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies: mark_memory
CREATE POLICY "Users can view own memory"
  ON public.mark_memory
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own memory"
  ON public.mark_memory
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own memory"
  ON public.mark_memory
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own memory"
  ON public.mark_memory
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies: mark_notifications
CREATE POLICY "Users can view own notifications"
  ON public.mark_notifications
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON public.mark_notifications
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- Service role can insert notifications (from edge functions)
CREATE POLICY "Service role can insert notifications"
  ON public.mark_notifications
  FOR INSERT TO service_role
  WITH CHECK (true);
