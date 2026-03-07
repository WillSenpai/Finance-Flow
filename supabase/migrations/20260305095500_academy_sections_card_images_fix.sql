-- Academy sections + lesson card images

CREATE TABLE IF NOT EXISTS public.academy_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.academy_sections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read academy sections" ON public.academy_sections;
DROP POLICY IF EXISTS "Admin can insert academy sections" ON public.academy_sections;
DROP POLICY IF EXISTS "Admin can update academy sections" ON public.academy_sections;
DROP POLICY IF EXISTS "Admin can delete academy sections" ON public.academy_sections;

CREATE POLICY "Anyone can read academy sections"
  ON public.academy_sections
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admin can insert academy sections"
  ON public.academy_sections
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can update academy sections"
  ON public.academy_sections
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can delete academy sections"
  ON public.academy_sections
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

ALTER TABLE public.academy_lessons_cache
  ADD COLUMN IF NOT EXISTS section_id uuid REFERENCES public.academy_sections(id),
  ADD COLUMN IF NOT EXISTS card_image_url text,
  ADD COLUMN IF NOT EXISTS card_image_prompt text,
  ADD COLUMN IF NOT EXISTS card_image_updated_at timestamptz;

INSERT INTO public.academy_sections (slug, title, description, sort_order)
VALUES
  ('basics', 'Le Basi del Denaro', 'Impara a gestire le tue finanze quotidiane con sicurezza', 10),
  ('investing', 'Come iniziare a investire', 'Muovi i primi passi nel mondo degli investimenti', 20),
  ('protection', 'Proteggersi dagli imprevisti', 'Costruisci una rete di sicurezza per il tuo futuro', 30)
ON CONFLICT (slug)
DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();

WITH targets AS (
  SELECT lesson_id,
    CASE
      WHEN lesson_id IN ('1', '2', '3') THEN 'basics'
      WHEN lesson_id IN ('4', '5', '6') THEN 'investing'
      WHEN lesson_id IN ('7', '8') THEN 'protection'
      ELSE 'basics'
    END AS slug
  FROM public.academy_lessons_cache
)
UPDATE public.academy_lessons_cache l
SET section_id = s.id
FROM targets t
JOIN public.academy_sections s ON s.slug = t.slug
WHERE l.lesson_id = t.lesson_id
  AND (l.section_id IS NULL OR l.section_id <> s.id);

UPDATE public.academy_lessons_cache l
SET section_id = s.id
FROM public.academy_sections s
WHERE l.section_id IS NULL
  AND s.slug = 'basics';

ALTER TABLE public.academy_lessons_cache
  ALTER COLUMN section_id SET NOT NULL;

CREATE INDEX IF NOT EXISTS academy_sections_sort_order_idx
  ON public.academy_sections(sort_order, created_at);

CREATE INDEX IF NOT EXISTS academy_lessons_cache_section_id_idx
  ON public.academy_lessons_cache(section_id, lesson_id);

DROP POLICY IF EXISTS "Admin can upload lesson card images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update lesson card images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete lesson card images" ON storage.objects;
DROP POLICY IF EXISTS "Service role can upload lesson illustrations" ON storage.objects;

CREATE POLICY "Service role can upload lesson illustrations"
ON storage.objects FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'lesson-illustrations');

CREATE POLICY "Admin can upload lesson card images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'lesson-illustrations'
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admin can update lesson card images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'lesson-illustrations'
  AND public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  bucket_id = 'lesson-illustrations'
  AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admin can delete lesson card images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'lesson-illustrations'
  AND public.has_role(auth.uid(), 'admin')
);
