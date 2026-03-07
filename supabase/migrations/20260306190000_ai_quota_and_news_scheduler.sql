CREATE EXTENSION IF NOT EXISTS pg_net;

CREATE TABLE IF NOT EXISTS public.user_ai_plans (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  plan text NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  monthly_token_limit integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ai_usage_monthly (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  period_start date NOT NULL,
  tokens_used bigint NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, period_start)
);

CREATE TABLE IF NOT EXISTS public.ai_usage_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint text NOT NULL,
  tokens integer NOT NULL,
  period_start date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_ai_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage_monthly ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own ai plan" ON public.user_ai_plans;
CREATE POLICY "Users can view own ai plan"
  ON public.user_ai_plans
  FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can view own ai usage monthly" ON public.ai_usage_monthly;
CREATE POLICY "Users can view own ai usage monthly"
  ON public.ai_usage_monthly
  FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can view own ai usage events" ON public.ai_usage_events;
CREATE POLICY "Users can view own ai usage events"
  ON public.ai_usage_events
  FOR SELECT
  USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.touch_updated_at_user_ai_plans()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_touch_updated_at_user_ai_plans ON public.user_ai_plans;
CREATE TRIGGER trg_touch_updated_at_user_ai_plans
  BEFORE UPDATE ON public.user_ai_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_updated_at_user_ai_plans();

CREATE OR REPLACE FUNCTION public.consume_ai_tokens(
  p_user_id uuid,
  p_tokens integer,
  p_endpoint text DEFAULT 'unknown'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_period_start date := date_trunc('month', now())::date;
  v_plan text := 'free';
  v_limit integer := 500000;
  v_used bigint := 0;
  v_allowed boolean := false;
BEGIN
  IF p_user_id IS NULL THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'plan', v_plan,
      'limit', v_limit,
      'used', 0,
      'remaining', v_limit
    );
  END IF;

  SELECT
    COALESCE(plan, 'free'),
    COALESCE(monthly_token_limit,
      CASE WHEN COALESCE(plan, 'free') = 'pro' THEN 5000000 ELSE 500000 END
    )
  INTO v_plan, v_limit
  FROM public.user_ai_plans
  WHERE user_id = p_user_id;

  IF NOT FOUND THEN
    v_plan := 'free';
    v_limit := 500000;
  END IF;

  INSERT INTO public.ai_usage_monthly (user_id, period_start, tokens_used)
  VALUES (p_user_id, v_period_start, 0)
  ON CONFLICT (user_id, period_start) DO NOTHING;

  IF p_tokens <= 0 THEN
    SELECT tokens_used INTO v_used
    FROM public.ai_usage_monthly
    WHERE user_id = p_user_id AND period_start = v_period_start;

    RETURN jsonb_build_object(
      'allowed', true,
      'plan', v_plan,
      'limit', v_limit,
      'used', v_used,
      'remaining', GREATEST(v_limit - v_used, 0)
    );
  END IF;

  UPDATE public.ai_usage_monthly
  SET
    tokens_used = tokens_used + p_tokens,
    updated_at = now()
  WHERE user_id = p_user_id
    AND period_start = v_period_start
    AND tokens_used + p_tokens <= v_limit
  RETURNING tokens_used INTO v_used;

  IF FOUND THEN
    v_allowed := true;
    INSERT INTO public.ai_usage_events(user_id, endpoint, tokens, period_start)
    VALUES (p_user_id, COALESCE(NULLIF(p_endpoint, ''), 'unknown'), p_tokens, v_period_start);
  ELSE
    SELECT tokens_used INTO v_used
    FROM public.ai_usage_monthly
    WHERE user_id = p_user_id AND period_start = v_period_start;
  END IF;

  RETURN jsonb_build_object(
    'allowed', v_allowed,
    'plan', v_plan,
    'limit', v_limit,
    'used', COALESCE(v_used, 0),
    'remaining', GREATEST(v_limit - COALESCE(v_used, 0), 0)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.consume_ai_tokens(uuid, integer, text) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.refresh_news_cache_job()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_supabase_url text;
  v_news_cron_secret text;
BEGIN
  SELECT decrypted_secret INTO v_supabase_url
  FROM vault.decrypted_secrets
  WHERE name IN ('SUPABASE_URL', 'supabase_url')
  ORDER BY CASE WHEN name = 'SUPABASE_URL' THEN 0 ELSE 1 END
  LIMIT 1;

  SELECT decrypted_secret INTO v_news_cron_secret
  FROM vault.decrypted_secrets
  WHERE name IN ('NEWS_CRON_SECRET', 'news_cron_secret')
  ORDER BY CASE WHEN name = 'NEWS_CRON_SECRET' THEN 0 ELSE 1 END
  LIMIT 1;

  IF v_supabase_url IS NULL OR v_news_cron_secret IS NULL THEN
    RAISE NOTICE 'refresh_news_cache_job skipped: missing SUPABASE_URL or NEWS_CRON_SECRET in vault';
    RETURN;
  END IF;

  PERFORM net.http_post(
    url := v_supabase_url || '/functions/v1/news-generate-cache',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', v_news_cron_secret
    ),
    body := '{}'::jsonb
  );
END;
$$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM cron.job WHERE jobname = 'refresh_news_cache_4h'
  ) THEN
    PERFORM cron.unschedule((
      SELECT jobid FROM cron.job WHERE jobname = 'refresh_news_cache_4h' LIMIT 1
    ));
  END IF;

  PERFORM cron.schedule(
    'refresh_news_cache_4h',
    '0 */4 * * *',
    'SELECT public.refresh_news_cache_job();'
  );
END;
$$;
