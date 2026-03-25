-- ============================================================================
-- ACADEMY CURRICULUM: Piramide della Conoscenza Finanziaria (40 Lessons)
-- ============================================================================
-- Updates sections and lessons for the new 6-level curriculum

-- ============================================================================
-- STEP 1: Update sections (upsert new sections)
-- ============================================================================

INSERT INTO public.academy_sections (slug, title, description, sort_order)
VALUES
  ('fondamenta', 'Fondamenta', 'Le basi della gestione finanziaria personale', 10),
  ('investire', 'Concetti d''Investimento', 'I principi fondamentali per iniziare a investire', 20),
  ('strumenti', 'Strumenti Tradizionali', 'Azioni, obbligazioni, fondi ed ETF spiegati', 30),
  ('alternativi', 'Asset Alternativi', 'Crypto, commodities e real estate', 40),
  ('macro', 'Macroeconomia', 'Inflazione, tassi e cicli economici', 50),
  ('strategie', 'Strategie', 'Asset allocation, value investing e gestione del rischio', 60)
ON CONFLICT (slug)
DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();

-- ============================================================================
-- STEP 2: Insert/Update all 40 lessons
-- ============================================================================

-- LIVELLO 1: FONDAMENTA (lessons 1-7)
WITH fondamenta_section AS (
  SELECT id FROM public.academy_sections WHERE slug = 'fondamenta' LIMIT 1
),
fondamenta_lessons(lesson_id, titolo) AS (
  VALUES
    ('1', 'Cos''è la finanza personale'),
    ('2', 'Budget e controllo del cash flow'),
    ('3', 'Risparmio automatico e abitudini'),
    ('4', 'Debiti buoni vs cattivi'),
    ('5', 'Obiettivi finanziari SMART'),
    ('6', 'Fondo emergenza'),
    ('7', 'Assicurazioni essenziali')
)
INSERT INTO public.academy_lessons_cache (lesson_id, titolo, content, section_id)
SELECT
  l.lesson_id,
  l.titolo,
  'Contenuto gestito da src/components/academy/lesson-structures/generatedLessons.ts',
  s.id
FROM fondamenta_lessons l
CROSS JOIN fondamenta_section s
ON CONFLICT (lesson_id)
DO UPDATE SET
  titolo = EXCLUDED.titolo,
  section_id = EXCLUDED.section_id,
  updated_at = now();

-- LIVELLO 2: CONCETTI D'INVESTIMENTO (lessons 8-13)
WITH investire_section AS (
  SELECT id FROM public.academy_sections WHERE slug = 'investire' LIMIT 1
),
investire_lessons(lesson_id, titolo) AS (
  VALUES
    ('8', 'Cos''è un investimento (vs speculazione)'),
    ('9', 'Rischio e rendimento'),
    ('10', 'L''interesse composto'),
    ('11', 'La diversificazione'),
    ('12', 'Orizzonte temporale e obiettivi'),
    ('13', 'Profilo investitore: difensivo vs intraprendente')
)
INSERT INTO public.academy_lessons_cache (lesson_id, titolo, content, section_id)
SELECT
  l.lesson_id,
  l.titolo,
  'Contenuto gestito da src/components/academy/lesson-structures/',
  s.id
FROM investire_lessons l
CROSS JOIN investire_section s
ON CONFLICT (lesson_id)
DO UPDATE SET
  titolo = EXCLUDED.titolo,
  section_id = EXCLUDED.section_id,
  updated_at = now();

-- LIVELLO 3: STRUMENTI TRADIZIONALI (lessons 14-22)
WITH strumenti_section AS (
  SELECT id FROM public.academy_sections WHERE slug = 'strumenti' LIMIT 1
),
strumenti_lessons(lesson_id, titolo) AS (
  VALUES
    ('14', 'Azioni: cosa sono e come funzionano'),
    ('15', 'Analisi fondamentale base'),
    ('16', 'Obbligazioni e reddito fisso'),
    ('17', 'Fondi comuni d''investimento'),
    ('18', 'ETF: cosa sono'),
    ('19', 'ETF: come sceglierli'),
    ('20', 'Indici di mercato (S&P 500, MSCI, etc)'),
    ('21', 'Broker, costi e commissioni'),
    ('22', 'Fiscalità degli investimenti (Italia)')
)
INSERT INTO public.academy_lessons_cache (lesson_id, titolo, content, section_id)
SELECT
  l.lesson_id,
  l.titolo,
  'Contenuto gestito da src/components/academy/lesson-structures/generatedLessons.ts',
  s.id
FROM strumenti_lessons l
CROSS JOIN strumenti_section s
ON CONFLICT (lesson_id)
DO UPDATE SET
  titolo = EXCLUDED.titolo,
  section_id = EXCLUDED.section_id,
  updated_at = now();

-- LIVELLO 4: ASSET ALTERNATIVI (lessons 23-28)
WITH alternativi_section AS (
  SELECT id FROM public.academy_sections WHERE slug = 'alternativi' LIMIT 1
),
alternativi_lessons(lesson_id, titolo) AS (
  VALUES
    ('23', 'Crypto: blockchain e Bitcoin'),
    ('24', 'Altcoin, token e smart contract'),
    ('25', 'DeFi e staking (basics)'),
    ('26', 'Commodities (oro, petrolio, etc)'),
    ('27', 'Real Estate e REIT'),
    ('28', 'Rischi degli asset alternativi')
)
INSERT INTO public.academy_lessons_cache (lesson_id, titolo, content, section_id)
SELECT
  l.lesson_id,
  l.titolo,
  'Contenuto gestito da src/components/academy/lesson-structures/generatedLessons.ts',
  s.id
FROM alternativi_lessons l
CROSS JOIN alternativi_section s
ON CONFLICT (lesson_id)
DO UPDATE SET
  titolo = EXCLUDED.titolo,
  section_id = EXCLUDED.section_id,
  updated_at = now();

-- LIVELLO 5: MACROECONOMIA (lessons 29-34)
WITH macro_section AS (
  SELECT id FROM public.academy_sections WHERE slug = 'macro' LIMIT 1
),
macro_lessons(lesson_id, titolo) AS (
  VALUES
    ('29', 'Inflazione e potere d''acquisto'),
    ('30', 'Tassi d''interesse e loro impatto'),
    ('31', 'Banche centrali e politica monetaria'),
    ('32', 'Cicli economici'),
    ('33', 'Indicatori economici chiave'),
    ('34', 'Geopolitica e mercati')
)
INSERT INTO public.academy_lessons_cache (lesson_id, titolo, content, section_id)
SELECT
  l.lesson_id,
  l.titolo,
  'Contenuto gestito da src/components/academy/lesson-structures/generatedLessons.ts',
  s.id
FROM macro_lessons l
CROSS JOIN macro_section s
ON CONFLICT (lesson_id)
DO UPDATE SET
  titolo = EXCLUDED.titolo,
  section_id = EXCLUDED.section_id,
  updated_at = now();

-- LIVELLO 6: STRATEGIE (lessons 35-40)
WITH strategie_section AS (
  SELECT id FROM public.academy_sections WHERE slug = 'strategie' LIMIT 1
),
strategie_lessons(lesson_id, titolo) AS (
  VALUES
    ('35', 'Asset allocation e ribilanciamento'),
    ('36', 'Dollar Cost Averaging (PAC)'),
    ('37', 'Value investing'),
    ('38', 'Margin of safety'),
    ('39', 'Mr. Market e psicologia'),
    ('40', 'Errori comuni dell''investitore')
)
INSERT INTO public.academy_lessons_cache (lesson_id, titolo, content, section_id)
SELECT
  l.lesson_id,
  l.titolo,
  'Contenuto gestito da src/components/academy/lesson-structures/',
  s.id
FROM strategie_lessons l
CROSS JOIN strategie_section s
ON CONFLICT (lesson_id)
DO UPDATE SET
  titolo = EXCLUDED.titolo,
  section_id = EXCLUDED.section_id,
  updated_at = now();

-- ============================================================================
-- STEP 3: Create nodes for all 40 lessons
-- ============================================================================

WITH all_lesson_ids AS (
  SELECT generate_series(1, 40)::text AS lesson_id
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
FROM all_lesson_ids l
CROSS JOIN node_template n
ON CONFLICT (lesson_id, node_key)
DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order,
  is_required = EXCLUDED.is_required,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- ============================================================================
-- STEP 4: Clean up old sections (optional - keep for backward compatibility)
-- ============================================================================

-- Remove old section assignments but keep sections for historical data
-- UPDATE public.academy_sections SET sort_order = sort_order + 100
-- WHERE slug IN ('basics', 'investing', 'protection', 'intelligent-investor');
