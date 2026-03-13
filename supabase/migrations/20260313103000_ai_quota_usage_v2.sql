CREATE TABLE IF NOT EXISTS public.user_ai_usage_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature text NOT NULL,
  model_used text NOT NULL,
  prompt_tokens integer NOT NULL DEFAULT 0 CHECK (prompt_tokens >= 0),
  completion_tokens integer NOT NULL DEFAULT 0 CHECK (completion_tokens >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_ai_plans
  ADD COLUMN IF NOT EXISTS plan_type text,
  ADD COLUMN IF NOT EXISTS tokens_used_this_month bigint NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS reset_date timestamptz,
  ADD COLUMN IF NOT EXISTS monthly_token_limit integer;

UPDATE public.user_ai_plans
SET plan_type = COALESCE(plan_type, plan, 'free')
WHERE plan_type IS NULL;

UPDATE public.user_ai_plans
SET plan_type = CASE WHEN plan_type = 'pro' THEN 'pro' ELSE 'free' END;

UPDATE public.user_ai_plans
SET monthly_token_limit = CASE
  WHEN COALESCE(plan_type, plan, 'free') = 'pro' THEN 5000000
  ELSE 500000
END
WHERE monthly_token_limit IS NULL OR monthly_token_limit <= 0;

UPDATE public.user_ai_plans
SET reset_date = COALESCE(
  reset_date,
  date_trunc('month', now()) + interval '1 month'
)
WHERE reset_date IS NULL;

ALTER TABLE public.user_ai_plans
  ALTER COLUMN plan_type SET DEFAULT 'free',
  ALTER COLUMN plan_type SET NOT NULL,
  ALTER COLUMN reset_date SET DEFAULT (date_trunc('month', now()) + interval '1 month'),
  ALTER COLUMN reset_date SET NOT NULL;

ALTER TABLE public.user_ai_plans
  DROP CONSTRAINT IF EXISTS user_ai_plans_plan_type_check;

ALTER TABLE public.user_ai_plans
  ADD CONSTRAINT user_ai_plans_plan_type_check CHECK (plan_type IN ('free', 'pro'));

CREATE INDEX IF NOT EXISTS idx_user_ai_usage_logs_user_created_at
  ON public.user_ai_usage_logs (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_ai_usage_logs_feature_created_at
  ON public.user_ai_usage_logs (feature, created_at DESC);

ALTER TABLE public.user_ai_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_ai_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own ai usage logs" ON public.user_ai_usage_logs;
CREATE POLICY "Users can view own ai usage logs"
  ON public.user_ai_usage_logs
  FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can view own ai plan" ON public.user_ai_plans;
CREATE POLICY "Users can view own ai plan"
  ON public.user_ai_plans
  FOR SELECT
  USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.sync_user_ai_plan_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.plan_type := CASE WHEN COALESCE(NEW.plan_type, NEW.plan, 'free') = 'pro' THEN 'pro' ELSE 'free' END;
  NEW.plan := NEW.plan_type;

  IF NEW.monthly_token_limit IS NULL OR NEW.monthly_token_limit <= 0 THEN
    NEW.monthly_token_limit := CASE WHEN NEW.plan_type = 'pro' THEN 5000000 ELSE 500000 END;
  END IF;

  IF NEW.tokens_used_this_month IS NULL OR NEW.tokens_used_this_month < 0 THEN
    NEW.tokens_used_this_month := 0;
  END IF;

  IF NEW.reset_date IS NULL THEN
    NEW.reset_date := date_trunc('month', now()) + interval '1 month';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_user_ai_plan_fields ON public.user_ai_plans;
CREATE TRIGGER trg_sync_user_ai_plan_fields
  BEFORE INSERT OR UPDATE ON public.user_ai_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_user_ai_plan_fields();

CREATE OR REPLACE FUNCTION public.check_and_update_ai_quota(
  p_user_id uuid,
  p_estimated_tokens integer
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_plan public.user_ai_plans%ROWTYPE;
  v_estimated integer := GREATEST(COALESCE(p_estimated_tokens, 0), 0);
BEGIN
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'INVALID_USER';
  END IF;

  INSERT INTO public.user_ai_plans (user_id, plan_type, plan, monthly_token_limit, tokens_used_this_month, reset_date)
  VALUES (
    p_user_id,
    'free',
    'free',
    500000,
    0,
    date_trunc('month', now()) + interval '1 month'
  )
  ON CONFLICT (user_id) DO NOTHING;

  SELECT * INTO v_plan
  FROM public.user_ai_plans
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF v_plan.reset_date <= now() THEN
    UPDATE public.user_ai_plans
    SET
      tokens_used_this_month = 0,
      reset_date = date_trunc('month', now()) + interval '1 month',
      updated_at = now()
    WHERE user_id = p_user_id
    RETURNING * INTO v_plan;
  END IF;

  IF COALESCE(v_plan.tokens_used_this_month, 0) + v_estimated > COALESCE(v_plan.monthly_token_limit, 0) THEN
    RAISE EXCEPTION 'QUOTA_EXCEEDED';
  END IF;

  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.apply_ai_usage(
  p_user_id uuid,
  p_feature text,
  p_model_used text,
  p_prompt_tokens integer,
  p_completion_tokens integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_prompt integer := GREATEST(COALESCE(p_prompt_tokens, 0), 0);
  v_completion integer := GREATEST(COALESCE(p_completion_tokens, 0), 0);
  v_total integer := GREATEST(COALESCE(p_prompt_tokens, 0), 0) + GREATEST(COALESCE(p_completion_tokens, 0), 0);
BEGIN
  IF p_user_id IS NULL THEN
    RETURN;
  END IF;

  INSERT INTO public.user_ai_plans (user_id, plan_type, plan, monthly_token_limit, tokens_used_this_month, reset_date)
  VALUES (
    p_user_id,
    'free',
    'free',
    500000,
    0,
    date_trunc('month', now()) + interval '1 month'
  )
  ON CONFLICT (user_id) DO NOTHING;

  UPDATE public.user_ai_plans
  SET
    tokens_used_this_month = CASE
      WHEN reset_date <= now() THEN v_total
      ELSE COALESCE(tokens_used_this_month, 0) + v_total
    END,
    reset_date = CASE
      WHEN reset_date <= now() THEN date_trunc('month', now()) + interval '1 month'
      ELSE reset_date
    END,
    updated_at = now()
  WHERE user_id = p_user_id;

  INSERT INTO public.user_ai_usage_logs (user_id, feature, model_used, prompt_tokens, completion_tokens)
  VALUES (
    p_user_id,
    COALESCE(NULLIF(p_feature, ''), 'unknown'),
    COALESCE(NULLIF(p_model_used, ''), 'unknown'),
    v_prompt,
    v_completion
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.check_and_update_ai_quota(uuid, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.apply_ai_usage(uuid, text, text, integer, integer) TO service_role;
