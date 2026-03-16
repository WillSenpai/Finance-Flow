-- Seed Intelligent Investor lessons (9-20) and related section/nodes.

INSERT INTO public.academy_sections (slug, title, description, sort_order)
VALUES
  (
    'intelligent-investor',
    'The Intelligent Investor',
    'Lezioni pratiche dai principi di Benjamin Graham',
    40
  )
ON CONFLICT (slug)
DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();

WITH section_target AS (
  SELECT id
  FROM public.academy_sections
  WHERE slug = 'intelligent-investor'
  LIMIT 1
),
lesson_seed(lesson_id, titolo, content) AS (
  VALUES
    ('9',  'Investimento vs Speculazione', 'Contenuto lezione gestito da file locale: src/components/academy/lesson-structures/intelligentInvestorLessons.ts'),
    ('10', 'Risultati attesi e obiettivi realistici', 'Contenuto lezione gestito da file locale: src/components/academy/lesson-structures/intelligentInvestorLessons.ts'),
    ('11', 'Inflazione e potere d''acquisto', 'Contenuto lezione gestito da file locale: src/components/academy/lesson-structures/intelligentInvestorLessons.ts'),
    ('12', 'Asset allocation e ribilanciamento', 'Contenuto lezione gestito da file locale: src/components/academy/lesson-structures/intelligentInvestorLessons.ts'),
    ('13', 'Profilo Defensive Investor', 'Contenuto lezione gestito da file locale: src/components/academy/lesson-structures/intelligentInvestorLessons.ts'),
    ('14', 'Profilo Enterprising Investor', 'Contenuto lezione gestito da file locale: src/components/academy/lesson-structures/intelligentInvestorLessons.ts'),
    ('15', 'Mr. Market e volatilita', 'Contenuto lezione gestito da file locale: src/components/academy/lesson-structures/intelligentInvestorLessons.ts'),
    ('16', 'Fondi e index investing', 'Contenuto lezione gestito da file locale: src/components/academy/lesson-structures/intelligentInvestorLessons.ts'),
    ('17', 'Analisi di bilancio per investitori', 'Contenuto lezione gestito da file locale: src/components/academy/lesson-structures/intelligentInvestorLessons.ts'),
    ('18', 'Selezione titoli: difensivo vs intraprendente', 'Contenuto lezione gestito da file locale: src/components/academy/lesson-structures/intelligentInvestorLessons.ts'),
    ('19', 'Errori tipici dell''investitore', 'Contenuto lezione gestito da file locale: src/components/academy/lesson-structures/intelligentInvestorLessons.ts'),
    ('20', 'Margin of safety', 'Contenuto lezione gestito da file locale: src/components/academy/lesson-structures/intelligentInvestorLessons.ts')
)
INSERT INTO public.academy_lessons_cache (lesson_id, titolo, content, section_id)
SELECT
  ls.lesson_id,
  ls.titolo,
  ls.content,
  st.id
FROM lesson_seed ls
CROSS JOIN section_target st
ON CONFLICT (lesson_id)
DO UPDATE SET
  titolo = EXCLUDED.titolo,
  content = EXCLUDED.content,
  section_id = EXCLUDED.section_id,
  updated_at = now();

WITH lesson_ids AS (
  SELECT unnest(ARRAY['9','10','11','12','13','14','15','16','17','18','19','20']) AS lesson_id
),
node_template(node_key, title, description, sort_order) AS (
  VALUES
    ('concept'::text, 'Concept', 'Capisci il principio chiave.', 1),
    ('widget'::text, 'Widget', 'Applica subito con un esercizio guidato.', 2),
    ('challenge'::text, 'Challenge', 'Metti alla prova la comprensione.', 3),
    ('quiz'::text, 'Quiz finale', 'Verifica didattica finale legata al tema della lezione.', 4),
    ('feedback'::text, 'Feedback', 'Consolida con tutor e riflessione.', 5)
)
INSERT INTO public.academy_lesson_nodes (lesson_id, node_key, title, description, sort_order, is_required, is_active)
SELECT
  l.lesson_id,
  n.node_key,
  n.title,
  n.description,
  n.sort_order,
  true,
  true
FROM lesson_ids l
CROSS JOIN node_template n
ON CONFLICT (lesson_id, node_key)
DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order,
  is_required = EXCLUDED.is_required,
  is_active = EXCLUDED.is_active,
  updated_at = now();
