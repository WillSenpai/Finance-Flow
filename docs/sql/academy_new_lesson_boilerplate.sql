-- Boilerplate: crea una nuova lezione Accademia con nodi base.
-- Compila SOLO v_content (obbligatorio). v_title e v_section_slug sono opzionali.
-- Esegui questa query nel SQL editor Supabase.

DO $block$
DECLARE
  -- OBBLIGATORIO: incolla qui il contenuto lezione (markdown/testo).
  v_content text := $lesson$
INCOLLA_QUI_IL_CONTENUTO_DELLA_LEZIONE
$lesson$;

  -- OPZIONALE: se vuoto, viene usato "Lezione <id>".
  v_title text := '';

  -- OPZIONALE: se vuoto usa 'basics'. Valori tipici: basics, investing, protection, intelligent-investor.
  v_section_slug text := 'basics';

  v_lesson_id text;
  v_section_id uuid;
BEGIN
  IF trim(v_content) = '' OR position('INCOLLA_QUI_IL_CONTENUTO_DELLA_LEZIONE' in v_content) > 0 THEN
    RAISE EXCEPTION 'Inserisci il contenuto reale in v_content prima di eseguire la query.';
  END IF;

  IF trim(v_section_slug) = '' THEN
    v_section_slug := 'basics';
  END IF;

  SELECT id
  INTO v_section_id
  FROM public.academy_sections
  WHERE slug = v_section_slug
  LIMIT 1;

  IF v_section_id IS NULL THEN
    RAISE EXCEPTION 'Sezione non trovata: %. Crea prima la section in academy_sections.', v_section_slug;
  END IF;

  -- Calcola il prossimo lesson_id numerico disponibile.
  SELECT (COALESCE(MAX(CASE WHEN lesson_id ~ '^[0-9]+$' THEN lesson_id::int END), 0) + 1)::text
  INTO v_lesson_id
  FROM public.academy_lessons_cache;

  INSERT INTO public.academy_lessons_cache (
    lesson_id,
    titolo,
    content,
    section_id,
    updated_at
  ) VALUES (
    v_lesson_id,
    COALESCE(NULLIF(trim(v_title), ''), format('Lezione %s', v_lesson_id)),
    v_content,
    v_section_id,
    now()
  )
  ON CONFLICT (lesson_id)
  DO UPDATE SET
    titolo = EXCLUDED.titolo,
    content = EXCLUDED.content,
    section_id = EXCLUDED.section_id,
    updated_at = now();

  -- Seed nodi base per il runtime lesson nodes.
  INSERT INTO public.academy_lesson_nodes (
    lesson_id,
    node_key,
    title,
    description,
    sort_order,
    is_required,
    is_active
  )
  VALUES
    (v_lesson_id, 'concept', 'Concept', 'Capisci il principio chiave.', 1, true, true),
    (v_lesson_id, 'widget', 'Widget', 'Applica subito con un esercizio guidato.', 2, true, true),
    (v_lesson_id, 'challenge', 'Challenge', 'Metti alla prova la comprensione.', 3, true, true),
    (v_lesson_id, 'quiz', 'Quiz finale', 'Verifica didattica finale legata al tema della lezione.', 4, true, true),
    (v_lesson_id, 'feedback', 'Feedback', 'Consolida con tutor e riflessione.', 5, true, true)
  ON CONFLICT (lesson_id, node_key)
  DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    sort_order = EXCLUDED.sort_order,
    is_required = EXCLUDED.is_required,
    is_active = EXCLUDED.is_active,
    updated_at = now();

  RAISE NOTICE 'Lezione creata: lesson_id=% | titolo=% | section=%',
    v_lesson_id,
    COALESCE(NULLIF(trim(v_title), ''), format('Lezione %s', v_lesson_id)),
    v_section_slug;
END
$block$;
