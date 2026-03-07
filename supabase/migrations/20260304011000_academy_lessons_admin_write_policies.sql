-- Restrict academy lesson modifications to admin users only.
-- Read access remains public.

DROP POLICY IF EXISTS "Admin can insert academy lessons" ON public.academy_lessons_cache;
DROP POLICY IF EXISTS "Admin can update academy lessons" ON public.academy_lessons_cache;
DROP POLICY IF EXISTS "Admin can delete academy lessons" ON public.academy_lessons_cache;

CREATE POLICY "Admin can insert academy lessons"
  ON public.academy_lessons_cache
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can update academy lessons"
  ON public.academy_lessons_cache
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can delete academy lessons"
  ON public.academy_lessons_cache
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
