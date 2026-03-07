
CREATE TABLE public.academy_lessons_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id text NOT NULL UNIQUE,
  titolo text NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.academy_lessons_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read academy lessons" ON public.academy_lessons_cache
  FOR SELECT TO anon, authenticated
  USING (true);
