CREATE TABLE IF NOT EXISTS public.user_lesson_intro_views (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id text NOT NULL,
  seen_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS user_lesson_intro_views_user_seen_idx
  ON public.user_lesson_intro_views(user_id, seen_at DESC);

ALTER TABLE public.user_lesson_intro_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own lesson intro views" ON public.user_lesson_intro_views;
CREATE POLICY "Users can manage own lesson intro views"
  ON public.user_lesson_intro_views
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP TRIGGER IF EXISTS trg_touch_updated_at_user_lesson_intro_views ON public.user_lesson_intro_views;
CREATE TRIGGER trg_touch_updated_at_user_lesson_intro_views
  BEFORE UPDATE ON public.user_lesson_intro_views
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_updated_at_academy_entities();
