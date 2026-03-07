
CREATE TABLE public.news_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titolo text NOT NULL,
  fonte text NOT NULL,
  link text NOT NULL DEFAULT '',
  tempo text NOT NULL DEFAULT '',
  summary text,
  image text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(titolo)
);

ALTER TABLE public.news_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read news_cache" ON public.news_cache
  FOR SELECT TO anon, authenticated
  USING (true);
