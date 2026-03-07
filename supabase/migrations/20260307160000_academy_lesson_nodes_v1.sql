-- Lesson-first Academy V1: sequential lesson nodes with Pro skip.

CREATE TABLE IF NOT EXISTS public.academy_lesson_nodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id text NOT NULL,
  node_key text NOT NULL CHECK (node_key IN ('concept', 'widget', 'challenge', 'feedback')),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  sort_order integer NOT NULL CHECK (sort_order >= 0),
  is_required boolean NOT NULL DEFAULT true,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (lesson_id, node_key),
  UNIQUE (lesson_id, sort_order)
);

CREATE TABLE IF NOT EXISTS public.user_lesson_node_progress (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_node_id uuid NOT NULL REFERENCES public.academy_lesson_nodes(id) ON DELETE CASCADE,
  lesson_id text NOT NULL,
  node_key text NOT NULL CHECK (node_key IN ('concept', 'widget', 'challenge', 'feedback')),
  status text NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'available', 'completed', 'skipped')),
  completed_at timestamptz,
  skipped_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, lesson_node_id)
);

CREATE TABLE IF NOT EXISTS public.user_lesson_node_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id text NOT NULL,
  node_key text NOT NULL CHECK (node_key IN ('concept', 'widget', 'challenge', 'feedback')),
  event_id text NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('advance', 'skip', 'optional_quiz')),
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, event_id)
);

CREATE TABLE IF NOT EXISTS public.user_lesson_optional_quiz_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id text NOT NULL,
  score integer NOT NULL CHECK (score BETWEEN 0 AND 100),
  passed boolean NOT NULL DEFAULT false,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS academy_lesson_nodes_lesson_sort_idx
  ON public.academy_lesson_nodes(lesson_id, sort_order)
  WHERE is_active = true;

CREATE INDEX IF NOT EXISTS user_lesson_node_progress_user_lesson_idx
  ON public.user_lesson_node_progress(user_id, lesson_id, status, updated_at DESC);

CREATE INDEX IF NOT EXISTS user_lesson_node_events_user_lesson_idx
  ON public.user_lesson_node_events(user_id, lesson_id, created_at DESC);

CREATE INDEX IF NOT EXISTS user_lesson_optional_quiz_runs_user_lesson_idx
  ON public.user_lesson_optional_quiz_runs(user_id, lesson_id, created_at DESC);

ALTER TABLE public.academy_lesson_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lesson_node_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lesson_node_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lesson_optional_quiz_runs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated can read academy lesson nodes" ON public.academy_lesson_nodes;
CREATE POLICY "Authenticated can read academy lesson nodes"
  ON public.academy_lesson_nodes
  FOR SELECT
  TO authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "Admin can write academy lesson nodes" ON public.academy_lesson_nodes;
CREATE POLICY "Admin can write academy lesson nodes"
  ON public.academy_lesson_nodes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Users can manage own lesson node progress" ON public.user_lesson_node_progress;
CREATE POLICY "Users can manage own lesson node progress"
  ON public.user_lesson_node_progress
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can read own lesson node events" ON public.user_lesson_node_events;
CREATE POLICY "Users can read own lesson node events"
  ON public.user_lesson_node_events
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert own lesson node events" ON public.user_lesson_node_events;
CREATE POLICY "Users can insert own lesson node events"
  ON public.user_lesson_node_events
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can read own lesson optional quiz runs" ON public.user_lesson_optional_quiz_runs;
CREATE POLICY "Users can read own lesson optional quiz runs"
  ON public.user_lesson_optional_quiz_runs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert own lesson optional quiz runs" ON public.user_lesson_optional_quiz_runs;
CREATE POLICY "Users can insert own lesson optional quiz runs"
  ON public.user_lesson_optional_quiz_runs
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP TRIGGER IF EXISTS trg_touch_updated_at_academy_lesson_nodes ON public.academy_lesson_nodes;
CREATE TRIGGER trg_touch_updated_at_academy_lesson_nodes
  BEFORE UPDATE ON public.academy_lesson_nodes
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_updated_at_academy_entities();

DROP TRIGGER IF EXISTS trg_touch_updated_at_user_lesson_node_progress ON public.user_lesson_node_progress;
CREATE TRIGGER trg_touch_updated_at_user_lesson_node_progress
  BEFORE UPDATE ON public.user_lesson_node_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_updated_at_academy_entities();

-- Seed fixed node template for every known lesson.
INSERT INTO public.academy_lesson_nodes (lesson_id, node_key, title, description, sort_order)
SELECT l.lesson_id, n.node_key, n.title, n.description, n.sort_order
FROM (
  SELECT DISTINCT lesson_id FROM public.academy_lessons_cache
  UNION
  SELECT unnest(ARRAY['1','2','3','4','5','6','7','8']) AS lesson_id
) l
CROSS JOIN (
  VALUES
    ('concept'::text, 'Concept', 'Capisci il principio chiave.', 1),
    ('widget'::text, 'Widget', 'Applica subito con un esercizio guidato.', 2),
    ('challenge'::text, 'Challenge', 'Metti alla prova la comprensione.', 3),
    ('feedback'::text, 'Feedback', 'Consolida con tutor e riflessione.', 4)
) AS n(node_key, title, description, sort_order)
ON CONFLICT (lesson_id, node_key) DO UPDATE
SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order,
  is_active = true,
  updated_at = now();

-- Legacy backfill: completed lesson => all nodes completed.
INSERT INTO public.user_lesson_node_progress (user_id, lesson_node_id, lesson_id, node_key, status, completed_at)
SELECT
  lp.user_id,
  aln.id,
  aln.lesson_id,
  aln.node_key,
  'completed'::text,
  now()
FROM public.lesson_progress lp
JOIN public.academy_lesson_nodes aln ON aln.lesson_id = lp.lesson_id
ON CONFLICT (user_id, lesson_node_id) DO UPDATE
SET
  status = 'completed',
  completed_at = COALESCE(public.user_lesson_node_progress.completed_at, now()),
  skipped_at = NULL,
  updated_at = now();
