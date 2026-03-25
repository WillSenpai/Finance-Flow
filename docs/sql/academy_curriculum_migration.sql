-- ============================================================================
-- ACADEMY CURRICULUM MIGRATION: Piramide della Conoscenza Finanziaria
-- ============================================================================
-- This migration reorganizes the academy from 21 lessons in 4 sections
-- to 40 lessons in 6 progressive levels.
--
-- IMPORTANT: Run this in a transaction and verify results before committing.
-- ============================================================================

BEGIN;

-- Create a savepoint for potential rollback
SAVEPOINT curriculum_migration_start;

-- ============================================================================
-- STEP 1: Insert new sections
-- ============================================================================
-- Delete old sections and insert new ones

DELETE FROM academy_sections WHERE slug IN ('basics', 'investing', 'protection', 'intelligent-investor');

INSERT INTO academy_sections (slug, title, description, sort_order) VALUES
  ('fondamenta', 'Fondamenta', 'Le basi della gestione finanziaria personale', 10),
  ('investire', 'Concetti d''Investimento', 'I principi fondamentali per iniziare a investire', 20),
  ('strumenti', 'Strumenti Tradizionali', 'Azioni, obbligazioni, fondi ed ETF spiegati', 30),
  ('alternativi', 'Asset Alternativi', 'Crypto, commodities e real estate', 40),
  ('macro', 'Macroeconomia', 'Inflazione, tassi e cicli economici', 50),
  ('strategie', 'Strategie', 'Asset allocation, value investing e gestione del rischio', 60)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order;

-- ============================================================================
-- STEP 2: Create lesson ID mapping table
-- ============================================================================
-- Maps old lesson IDs to new lesson IDs for user progress migration

CREATE TEMPORARY TABLE IF NOT EXISTS lesson_id_mapping (
  old_id TEXT PRIMARY KEY,
  new_id TEXT NOT NULL,
  notes TEXT
);

-- Mapping based on curriculum plan (old ID -> new ID)
INSERT INTO lesson_id_mapping (old_id, new_id, notes) VALUES
  ('1', '2', 'Budget e controllo del cash flow'),      -- Old: Cos''e un budget?
  ('2', '3', 'Risparmio automatico e abitudini'),      -- Old: Risparmiare senza fatica
  ('3', '4', 'Debiti buoni vs cattivi'),               -- Old: Debiti buoni e cattivi
  ('4', '14', 'Azioni: cosa sono e come funzionano'),  -- Old: Che cos''e un investimento? -> repurposed
  ('5', '17', 'Fondi comuni d''investimento'),         -- Old: I fondi spiegati semplice
  ('6', '9', 'Rischio e rendimento'),                  -- Old: Rischio: non e una parolaccia
  ('7', '6', 'Fondo emergenza'),                       -- Old: Fondo emergenza: perche serve
  ('8', '7', 'Assicurazioni essenziali'),              -- Old: Assicurazioni in parole povere
  ('9', '8', 'Cos''è un investimento (vs speculazione)'), -- Old: Investimento vs Speculazione
  ('10', '12', 'Orizzonte temporale e obiettivi'),     -- Old: Risultati attesi e obiettivi realistici
  ('11', '29', 'Inflazione e potere d''acquisto'),     -- Old: Inflazione e potere d''acquisto
  ('12', '35', 'Asset allocation e ribilanciamento'),  -- Old: Asset allocation e ribilanciamento
  ('13', '13', 'Profilo investitore (merged)'),        -- Old: Profilo Defensive Investor -> merged
  ('14', '13', 'Profilo investitore (merged)'),        -- Old: Profilo Enterprising Investor -> merged
  ('15', '39', 'Mr. Market e psicologia'),             -- Old: Mr. Market e volatilita
  ('16', '19', 'ETF: come sceglierli'),                -- Old: Fondi e index investing
  ('17', '15', 'Analisi fondamentale base'),           -- Old: Analisi di bilancio per investitori
  ('18', NULL, 'Dropped - merged into other lessons'), -- Old: Selezione titoli: difensivo vs intraprendente
  ('19', '40', 'Errori comuni dell''investitore'),     -- Old: Errori tipici dell''investitore
  ('20', '38', 'Margin of safety'),                    -- Old: Margin of safety
  ('21', '38', 'Margin of safety');                    -- Old: Margin of safety (duplicate handling)

-- ============================================================================
-- STEP 3: Migrate user lesson progress
-- ============================================================================
-- Update academy_user_lesson_progress with new lesson IDs

-- First, handle cases where old progress maps to new IDs
UPDATE academy_user_lesson_progress AS p
SET lesson_id = m.new_id
FROM lesson_id_mapping AS m
WHERE p.lesson_id = m.old_id
  AND m.new_id IS NOT NULL;

-- Delete progress for lessons that were dropped
DELETE FROM academy_user_lesson_progress
WHERE lesson_id IN (
  SELECT old_id FROM lesson_id_mapping WHERE new_id IS NULL
);

-- ============================================================================
-- STEP 4: Migrate user node progress
-- ============================================================================
-- Update academy_user_node_progress with new lesson IDs

UPDATE academy_user_node_progress AS p
SET lesson_id = m.new_id
FROM lesson_id_mapping AS m
WHERE p.lesson_id = m.old_id
  AND m.new_id IS NOT NULL;

-- Delete node progress for lessons that were dropped
DELETE FROM academy_user_node_progress
WHERE lesson_id IN (
  SELECT old_id FROM lesson_id_mapping WHERE new_id IS NULL
);

-- ============================================================================
-- STEP 5: Insert new lessons metadata (if academy_lessons table exists)
-- ============================================================================
-- This step populates lesson records if the table exists

DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'academy_lessons') THEN
    -- Delete old lessons
    DELETE FROM academy_lessons WHERE lesson_id::integer <= 40;

    -- Insert new lessons with section assignments
    INSERT INTO academy_lessons (lesson_id, section_slug, title, sort_order) VALUES
      -- LIVELLO 1: FONDAMENTA
      ('1', 'fondamenta', 'Cos''è la finanza personale', 1),
      ('2', 'fondamenta', 'Budget e controllo del cash flow', 2),
      ('3', 'fondamenta', 'Risparmio automatico e abitudini', 3),
      ('4', 'fondamenta', 'Debiti buoni vs cattivi', 4),
      ('5', 'fondamenta', 'Obiettivi finanziari SMART', 5),
      ('6', 'fondamenta', 'Fondo emergenza', 6),
      ('7', 'fondamenta', 'Assicurazioni essenziali', 7),
      -- LIVELLO 2: CONCETTI D'INVESTIMENTO
      ('8', 'investire', 'Cos''è un investimento (vs speculazione)', 8),
      ('9', 'investire', 'Rischio e rendimento', 9),
      ('10', 'investire', 'L''interesse composto', 10),
      ('11', 'investire', 'La diversificazione', 11),
      ('12', 'investire', 'Orizzonte temporale e obiettivi', 12),
      ('13', 'investire', 'Profilo investitore: difensivo vs intraprendente', 13),
      -- LIVELLO 3: STRUMENTI TRADIZIONALI
      ('14', 'strumenti', 'Azioni: cosa sono e come funzionano', 14),
      ('15', 'strumenti', 'Analisi fondamentale base', 15),
      ('16', 'strumenti', 'Obbligazioni e reddito fisso', 16),
      ('17', 'strumenti', 'Fondi comuni d''investimento', 17),
      ('18', 'strumenti', 'ETF: cosa sono', 18),
      ('19', 'strumenti', 'ETF: come sceglierli', 19),
      ('20', 'strumenti', 'Indici di mercato (S&P 500, MSCI, etc)', 20),
      ('21', 'strumenti', 'Broker, costi e commissioni', 21),
      ('22', 'strumenti', 'Fiscalità degli investimenti (Italia)', 22),
      -- LIVELLO 4: ASSET ALTERNATIVI
      ('23', 'alternativi', 'Crypto: blockchain e Bitcoin', 23),
      ('24', 'alternativi', 'Altcoin, token e smart contract', 24),
      ('25', 'alternativi', 'DeFi e staking (basics)', 25),
      ('26', 'alternativi', 'Commodities (oro, petrolio, etc)', 26),
      ('27', 'alternativi', 'Real Estate e REIT', 27),
      ('28', 'alternativi', 'Rischi degli asset alternativi', 28),
      -- LIVELLO 5: MACROECONOMIA
      ('29', 'macro', 'Inflazione e potere d''acquisto', 29),
      ('30', 'macro', 'Tassi d''interesse e loro impatto', 30),
      ('31', 'macro', 'Banche centrali e politica monetaria', 31),
      ('32', 'macro', 'Cicli economici', 32),
      ('33', 'macro', 'Indicatori economici chiave', 33),
      ('34', 'macro', 'Geopolitica e mercati', 34),
      -- LIVELLO 6: STRATEGIE
      ('35', 'strategie', 'Asset allocation e ribilanciamento', 35),
      ('36', 'strategie', 'Dollar Cost Averaging (PAC)', 36),
      ('37', 'strategie', 'Value investing', 37),
      ('38', 'strategie', 'Margin of safety', 38),
      ('39', 'strategie', 'Mr. Market e psicologia', 39),
      ('40', 'strategie', 'Errori comuni dell''investitore', 40)
    ON CONFLICT (lesson_id) DO UPDATE SET
      section_slug = EXCLUDED.section_slug,
      title = EXCLUDED.title,
      sort_order = EXCLUDED.sort_order;
  END IF;
END $$;

-- ============================================================================
-- STEP 6: Cleanup
-- ============================================================================

DROP TABLE IF EXISTS lesson_id_mapping;

-- ============================================================================
-- VERIFICATION QUERIES (run these to verify migration success)
-- ============================================================================

-- Count sections (should be 6)
-- SELECT COUNT(*) FROM academy_sections;

-- Count lessons per section
-- SELECT section_slug, COUNT(*)
-- FROM academy_lessons
-- GROUP BY section_slug
-- ORDER BY MIN(sort_order);

-- Check user progress was migrated
-- SELECT lesson_id, COUNT(*)
-- FROM academy_user_lesson_progress
-- GROUP BY lesson_id
-- ORDER BY lesson_id::integer;

-- ============================================================================
-- COMMIT or ROLLBACK
-- ============================================================================

-- If everything looks good:
COMMIT;

-- If there are issues, rollback to savepoint:
-- ROLLBACK TO SAVEPOINT curriculum_migration_start;
-- ROLLBACK;
