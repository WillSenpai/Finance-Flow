ALTER TABLE public.academy_lesson_nodes
  ADD COLUMN IF NOT EXISTS semantic_type text,
  ADD COLUMN IF NOT EXISTS goal text,
  ADD COLUMN IF NOT EXISTS estimated_minutes integer,
  ADD COLUMN IF NOT EXISTS checkpoint_prompt text;

WITH target_lessons AS (
  SELECT unnest(ARRAY['9','10','11','12','13','14','15','16','17','18','19','20']) AS lesson_id
)
UPDATE public.academy_lesson_nodes n
SET
  semantic_type = n.node_key,
  estimated_minutes = COALESCE(n.estimated_minutes, 2)
FROM target_lessons t
WHERE n.lesson_id = t.lesson_id;

DELETE FROM public.academy_lesson_nodes
WHERE lesson_id IN ('9','10','11','12','13','14','15','16','17','18','19','20');

WITH lesson_ids AS (
  SELECT unnest(ARRAY['9','10','11','12','13','14','15','16','17','18','19','20']) AS lesson_id
),
node_template(node_key, title, description, semantic_type, sort_order, goal, estimated_minutes, checkpoint_prompt) AS (
  VALUES
    ('map'::text, 'Mappa della lezione', 'Orientamento iniziale sul percorso.', 'map'::text, 1, 'Orientarti nella lezione e capire il percorso', 1, 'Sai spiegare cosa imparerai e perche ti serve?'),
    ('concept_core', 'Principio chiave', 'Concetto base spiegato con linguaggio semplice.', 'concept', 2, 'Capire il principio chiave senza ambiguita', 2, 'Riesci a spiegare il concetto con parole tue?'),
    ('deep_dive', 'Approfondimento', 'Meccanismo e logica decisionale in dettaglio.', 'deep_dive', 3, 'Entrare nel meccanismo con maggiore profondita', 2, 'Sai collegarlo a una tua decisione reale?'),
    ('historical_case', 'Caso realistico', 'Applicazione su scenario storico o concreto.', 'worked_example', 4, 'Imparare da un caso realistico', 2, 'Hai identificato il passaggio critico del caso?'),
    ('profile_lens', 'Lente difensivo/intraprendente', 'Lettura del tema per profili diversi.', 'profile_lens', 5, 'Distinguere applicazione difensiva e intraprendente', 2, 'Sai quale lente usare nel tuo caso?'),
    ('operational_checklist', 'Checklist operativa', 'Procedura pratica prima di agire.', 'checklist', 6, 'Passare dalla teoria a una procedura concreta', 2, 'Hai una checklist riusabile?'),
    ('decision_lab', 'Decision Lab', 'Scenario decisionale con scelta guidata.', 'decision_lab', 7, 'Allenare scelta e motivazione su scenario reale', 2, 'Sai motivare la scelta senza emozioni impulsive?'),
    ('quiz', 'Quiz finale', 'Verifica didattica finale della lezione.', 'quiz', 8, 'Verificare comprensione prima di chiudere', 2, 'Hai consolidato il principio chiave?'),
    ('action_plan', 'Piano 7 giorni', 'Piano operativo concreto da applicare subito.', 'action_plan', 9, 'Trasformare la lezione in azione', 1, 'Hai definito la prima azione con data e ora?')
)
INSERT INTO public.academy_lesson_nodes (
  lesson_id,
  node_key,
  title,
  description,
  sort_order,
  semantic_type,
  goal,
  estimated_minutes,
  checkpoint_prompt,
  is_required,
  is_active
)
SELECT
  l.lesson_id,
  n.node_key,
  n.title,
  n.description,
  n.sort_order,
  n.semantic_type,
  n.goal,
  n.estimated_minutes,
  n.checkpoint_prompt,
  true,
  true
FROM lesson_ids l
CROSS JOIN node_template n
ON CONFLICT (lesson_id, node_key)
DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order,
  semantic_type = EXCLUDED.semantic_type,
  goal = EXCLUDED.goal,
  estimated_minutes = EXCLUDED.estimated_minutes,
  checkpoint_prompt = EXCLUDED.checkpoint_prompt,
  is_required = EXCLUDED.is_required,
  is_active = EXCLUDED.is_active,
  updated_at = now();
