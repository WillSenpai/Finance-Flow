-- Storage bucket for explore article images
INSERT INTO storage.buckets (id, name, public)
VALUES ('explore-articles-images', 'explore-articles-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for explore article images
CREATE POLICY "Anyone can view explore article images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'explore-articles-images');

CREATE POLICY "Admin can upload explore article images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'explore-articles-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can delete explore article images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'explore-articles-images' AND public.has_role(auth.uid(), 'admin'));
