ALTER TABLE public.news_cache
ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE OR REPLACE FUNCTION public.touch_updated_at_news_cache()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_touch_updated_at_news_cache ON public.news_cache;
CREATE TRIGGER trg_touch_updated_at_news_cache
  BEFORE UPDATE ON public.news_cache
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_updated_at_news_cache();
