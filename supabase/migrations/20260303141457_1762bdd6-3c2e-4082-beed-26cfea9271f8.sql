-- Storage bucket for lesson illustrations
INSERT INTO storage.buckets (id, name, public)
VALUES ('lesson-illustrations', 'lesson-illustrations', true);

-- Allow public read access
CREATE POLICY "Public read access for lesson illustrations"
ON storage.objects FOR SELECT
USING (bucket_id = 'lesson-illustrations');

-- Allow service role to insert (edge function uses service role)
CREATE POLICY "Service role can upload lesson illustrations"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'lesson-illustrations');

-- Table for lesson illustration metadata
CREATE TABLE public.lesson_illustrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id text NOT NULL,
  step_index integer NOT NULL,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  image_url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (lesson_id, step_index)
);

ALTER TABLE public.lesson_illustrations ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read
CREATE POLICY "Authenticated users can read lesson illustrations"
ON public.lesson_illustrations FOR SELECT
TO authenticated
USING (true);