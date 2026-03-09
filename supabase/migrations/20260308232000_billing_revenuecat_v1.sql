CREATE TABLE IF NOT EXISTS public.billing_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  provider_event_id text NOT NULL,
  event_type text NOT NULL,
  app_user_id uuid,
  environment text,
  payload jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider, provider_event_id)
);

CREATE TABLE IF NOT EXISTS public.billing_subscriptions (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  provider text NOT NULL DEFAULT 'revenuecat',
  store text,
  status text NOT NULL DEFAULT 'free' CHECK (status IN ('free', 'active', 'grace', 'canceled', 'expired')),
  entitlement_id text,
  product_id text,
  current_period_ends_at timestamptz,
  grace_until timestamptz,
  auto_renews boolean,
  last_event_type text,
  last_provider_event_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_billing_events_user_created_at
  ON public.billing_events (app_user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_billing_subscriptions_status
  ON public.billing_subscriptions (status);

ALTER TABLE public.billing_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own billing events" ON public.billing_events;
CREATE POLICY "Users can view own billing events"
  ON public.billing_events
  FOR SELECT
  USING (app_user_id = auth.uid());

DROP POLICY IF EXISTS "Users can view own billing subscription" ON public.billing_subscriptions;
CREATE POLICY "Users can view own billing subscription"
  ON public.billing_subscriptions
  FOR SELECT
  USING (user_id = auth.uid());

ALTER TABLE public.user_ai_plans
  ADD COLUMN IF NOT EXISTS grace_until timestamptz,
  ADD COLUMN IF NOT EXISTS billing_provider text,
  ADD COLUMN IF NOT EXISTS last_billing_event_at timestamptz;

CREATE OR REPLACE FUNCTION public.touch_updated_at_billing_subscriptions()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_touch_updated_at_billing_subscriptions ON public.billing_subscriptions;
CREATE TRIGGER trg_touch_updated_at_billing_subscriptions
  BEFORE UPDATE ON public.billing_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_updated_at_billing_subscriptions();
