-- Add dedicated quiz node between challenge and feedback for all lessons.

UPDATE public.academy_lesson_nodes
SET sort_order = sort_order + 1,
    updated_at = now()
WHERE sort_order >= 4
  AND is_active = true
  AND lesson_id IN (
    SELECT lesson_id
    FROM public.academy_lesson_nodes
    GROUP BY lesson_id
    HAVING COUNT(*) FILTER (WHERE node_key = 'quiz') = 0
  );

INSERT INTO public.academy_lesson_nodes (lesson_id, node_key, title, description, sort_order, is_required, is_active)
SELECT l.lesson_id, 'quiz', 'Quiz finale', 'Verifica didattica finale legata al tema della lezione.', 4, true, true
FROM (
  SELECT DISTINCT lesson_id FROM public.academy_lesson_nodes
) AS l
WHERE NOT EXISTS (
  SELECT 1
  FROM public.academy_lesson_nodes n
  WHERE n.lesson_id = l.lesson_id
    AND n.node_key = 'quiz'
);

UPDATE public.academy_lesson_nodes
SET title = 'Quiz finale',
    description = 'Verifica didattica finale legata al tema della lezione.',
    sort_order = 4,
    is_required = true,
    is_active = true,
    updated_at = now()
WHERE node_key = 'quiz';

WITH users_lessons AS (
  SELECT DISTINCT user_id, lesson_id
  FROM public.user_lesson_node_progress
), quiz_nodes AS (
  SELECT id, lesson_id
  FROM public.academy_lesson_nodes
  WHERE node_key = 'quiz'
), challenge_nodes AS (
  SELECT id, lesson_id
  FROM public.academy_lesson_nodes
  WHERE node_key = 'challenge'
)
INSERT INTO public.user_lesson_node_progress (
  user_id,
  lesson_node_id,
  lesson_id,
  node_key,
  status,
  created_at,
  updated_at
)
SELECT
  ul.user_id,
  qn.id,
  ul.lesson_id,
  'quiz',
  CASE
    WHEN chp.status IN ('completed', 'skipped') THEN 'available'::text
    ELSE 'locked'::text
  END,
  now(),
  now()
FROM users_lessons ul
JOIN quiz_nodes qn
  ON qn.lesson_id = ul.lesson_id
LEFT JOIN challenge_nodes cn
  ON cn.lesson_id = ul.lesson_id
LEFT JOIN public.user_lesson_node_progress chp
  ON chp.user_id = ul.user_id
 AND chp.lesson_node_id = cn.id
ON CONFLICT (user_id, lesson_node_id) DO NOTHING;
