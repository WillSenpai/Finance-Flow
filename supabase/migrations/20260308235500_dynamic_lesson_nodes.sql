-- Allow dynamic academy lesson node keys beyond concept/widget/challenge/feedback.

ALTER TABLE public.academy_lesson_nodes
  DROP CONSTRAINT IF EXISTS academy_lesson_nodes_node_key_check;

ALTER TABLE public.user_lesson_node_progress
  DROP CONSTRAINT IF EXISTS user_lesson_node_progress_node_key_check;

ALTER TABLE public.user_lesson_node_events
  DROP CONSTRAINT IF EXISTS user_lesson_node_events_node_key_check;
