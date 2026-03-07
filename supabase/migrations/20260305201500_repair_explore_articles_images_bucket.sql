-- Ensure dedicated storage bucket for Explore article images exists and is publicly readable
INSERT INTO storage.buckets (id, name, public)
VALUES ('explore-articles-images', 'explore-articles-images', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

-- Recreate policies idempotently in case a previous migration was partially applied
DROP POLICY IF EXISTS "Anyone can view explore article images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload explore article images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete explore article images" ON storage.objects;

CREATE POLICY "Anyone can view explore article images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'explore-articles-images');

CREATE POLICY "Admin can upload explore article images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'explore-articles-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can delete explore article images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'explore-articles-images' AND public.has_role(auth.uid(), 'admin'));
