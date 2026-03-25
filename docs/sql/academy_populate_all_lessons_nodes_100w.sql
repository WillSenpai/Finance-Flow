-- Popolamento massivo lezioni + nodi (1..20)
-- Obiettivo: avere contenuti lunghi e coerenti tra DB e logica didattica.
-- Uso: eseguire interamente nel SQL Editor di Supabase.

DO $block$
DECLARE
  rec record;
  v_section_id uuid;
  v_concept text;
  v_widget text;
  v_challenge text;
  v_quiz text;
  v_feedback text;
  v_markdown text;
BEGIN
  -- Sezioni minime richieste.
  INSERT INTO public.academy_sections (slug, title, description, sort_order)
  VALUES
    ('basics', 'Le Basi del Denaro', 'Impara a gestire le tue finanze quotidiane con sicurezza', 10),
    ('investing', 'Come iniziare a investire', 'Muovi i primi passi nel mondo degli investimenti', 20),
    ('protection', 'Proteggersi dagli imprevisti', 'Costruisci una rete di sicurezza per il tuo futuro', 30),
    ('intelligent-investor', 'The Intelligent Investor', 'Lezioni pratiche dai principi di Benjamin Graham', 40)
  ON CONFLICT (slug) DO UPDATE
  SET title = EXCLUDED.title,
      description = EXCLUDED.description,
      sort_order = EXCLUDED.sort_order,
      updated_at = now();

  FOR rec IN
    SELECT *
    FROM (
      VALUES
        ('1',  'Cos''e un budget?', 'basics', 'controllo del flusso di cassa e decisioni anticipate'),
        ('2',  'Risparmiare senza fatica', 'basics', 'automazione del risparmio e abitudini sostenibili'),
        ('3',  'Debiti buoni e cattivi', 'basics', 'costo del debito, leva e priorita di rimborso'),
        ('4',  'Che cos''e un investimento?', 'investing', 'differenza tra investimento, consumo e speculazione'),
        ('5',  'I fondi spiegati semplice', 'investing', 'diversificazione, costi e criteri di scelta'),
        ('6',  'Rischio: non e una parolaccia', 'investing', 'rischio sostenibile, volatilita e disciplina'),
        ('7',  'Fondo emergenza: perche serve', 'protection', 'margine di sicurezza personale e liquidita'),
        ('8',  'Assicurazioni in parole povere', 'protection', 'trasferimento del rischio e coperture essenziali'),
        ('9',  'Investimento vs Speculazione', 'intelligent-investor', 'tesi verificabile contro scommessa di prezzo'),
        ('10', 'Risultati attesi e obiettivi realistici', 'intelligent-investor', 'aspettative prudenziali e coerenza obiettivo-rischio'),
        ('11', 'Inflazione e potere d''acquisto', 'intelligent-investor', 'rendimento reale netto e protezione nel lungo periodo'),
        ('12', 'Asset allocation e ribilanciamento', 'intelligent-investor', 'pesi target, soglie e mantenimento del profilo rischio'),
        ('13', 'Profilo Defensive Investor', 'intelligent-investor', 'semplicita, costi bassi e continuita operativa'),
        ('14', 'Profilo Enterprising Investor', 'intelligent-investor', 'processo attivo con regole verificabili'),
        ('15', 'Mr. Market e volatilita', 'intelligent-investor', 'prezzo come offerta, non come ordine di azione'),
        ('16', 'Fondi e index investing', 'intelligent-investor', 'efficienza dei costi e diversificazione ampia'),
        ('17', 'Analisi di bilancio per investitori', 'intelligent-investor', 'lettura utili, cassa e solidita aziendale'),
        ('18', 'Selezione titoli: difensivo vs intraprendente', 'intelligent-investor', 'criteri quantitativi e margine di sicurezza'),
        ('19', 'Errori tipici dell''investitore', 'intelligent-investor', 'bias comportamentali e prevenzione'),
        ('20', 'Margin of safety', 'intelligent-investor', 'protezione dal downside come principio centrale')
    ) AS t(lesson_id, titolo, section_slug, focus)
  LOOP
    SELECT id INTO v_section_id
    FROM public.academy_sections
    WHERE slug = rec.section_slug
    LIMIT 1;

    v_concept := format(
      'In questa lezione su "%s", il punto centrale e %s. Seguendo la logica di The Intelligent Investor, non partiamo dalla ricerca del guadagno veloce, ma dalla riduzione degli errori irreversibili. Un investitore disciplinato prende decisioni prima che le emozioni del momento entrino in campo, definendo criteri chiari e verificabili. Anche l''approccio divulgativo di Starting Finance conferma lo stesso principio: le buone scelte economiche nascono da processi semplici, ripetibili e comprensibili, non da intuizioni casuali. Per questo il nodo Concept ti chiede di fissare una regola pratica che puoi applicare subito nel tuo contesto, collegando teoria e realta personale. Se il principio non e trasformabile in un comportamento concreto, allora non e ancora un apprendimento utile.',
      rec.titolo,
      rec.focus
    );

    v_widget := format(
      'Il nodo Widget traduce il tema "%s" in una procedura operativa. L''obiettivo non e accumulare nozioni, ma creare un meccanismo decisionale che regga anche nei periodi complessi. Applichiamo tre passaggi: definire una metrica osservabile, impostare una soglia di allerta, scegliere un''azione correttiva standard. Questo schema evita sia il blocco da analisi sia le reazioni impulsive. Nella pratica, puoi usare una revisione settimanale o mensile per confrontare stato reale e obiettivo, poi correggere con piccoli aggiustamenti progressivi. Il vantaggio e cumulativo: quando il processo e stabile, diminuiscono gli errori costosi e aumenta la coerenza tra obiettivi finanziari, rischio sostenibile e tempo disponibile. La disciplina del metodo conta piu del risultato del singolo giorno.',
      rec.titolo
    );

    v_challenge := format(
      'Nel nodo Challenge mettiamo sotto stress il metodo della lezione "%s" con uno scenario realistico, simile alle oscillazioni che Graham descrive quando parla di mercato e comportamento. Qui non vince chi indovina, ma chi resta coerente con regole definite in anticipo. Il compito e riconoscere la differenza tra un problema temporaneo e un errore strutturale: nel primo caso correggi l''esecuzione, nel secondo aggiorni il piano. L''esercizio ti porta a quantificare impatto, priorita e trade-off, cosi da evitare scelte vaghe. Questa abilita e fondamentale: gli investitori perdono valore soprattutto quando cambiano strategia nel momento sbagliato, non quando seguono un processo robusto con pazienza. Il tuo obiettivo e uscire dal nodo con una regola anti-panico chiara.',
      rec.titolo
    );

    v_quiz := format(
      'Il nodo Quiz verifica se hai interiorizzato il principio "%s" in modo applicabile. Le domande sono progettate per misurare la qualita del ragionamento, non la memoria di definizioni isolate. La sequenza corretta resta sempre la stessa: chiarisci l''obiettivo, valuta i vincoli, confronta alternative, seleziona l''azione con miglior equilibrio rischio-rendimento nel tuo orizzonte temporale. Se una risposta sembra attraente ma richiede assunzioni non verificate, va scartata. Questo approccio riflette la filosofia del margine di sicurezza: preferire decisioni robuste anche quando promettono meno entusiasmo nel breve termine. Alla fine del quiz devi poter spiegare il perche della scelta in linguaggio semplice, con numeri essenziali e conseguenze pratiche comprensibili.',
      rec.titolo
    );

    v_feedback := format(
      'Il nodo Feedback chiude il ciclo della lezione "%s" e trasforma il contenuto in abitudine. Il risultato atteso non e una risposta perfetta oggi, ma una routine affidabile che migliori nel tempo. Per questo sintetizziamo tre elementi: cosa mantenere, cosa correggere, quando ricontrollare. Se non pianifichi il prossimo controllo, l''apprendimento resta teorico e tende a svanire. Invece, una piccola revisione programmata riduce la frizione e consolida il comportamento, proprio come un ribilanciamento periodico mantiene il portafoglio allineato alla strategia. Usa il tutor per chiarire i dubbi residui e rendere il piano personale, misurabile e sostenibile. La coerenza ripetuta vale piu di qualsiasi sprint motivazionale occasionale.',
      rec.titolo
    );

    v_markdown :=
      '### Concept' || E'\n' || v_concept || E'\n\n' ||
      '### Widget' || E'\n' || v_widget || E'\n\n' ||
      '### Challenge' || E'\n' || v_challenge || E'\n\n' ||
      '### Quiz' || E'\n' || v_quiz || E'\n\n' ||
      '### Feedback' || E'\n' || v_feedback;

    INSERT INTO public.academy_lessons_cache (lesson_id, titolo, content, section_id, updated_at)
    VALUES (rec.lesson_id, rec.titolo, v_markdown, v_section_id, now())
    ON CONFLICT (lesson_id)
    DO UPDATE SET
      titolo = EXCLUDED.titolo,
      content = EXCLUDED.content,
      section_id = EXCLUDED.section_id,
      updated_at = now();

    -- Evita collisioni con il vincolo UNIQUE (lesson_id, sort_order):
    -- 1) sposta temporaneamente i nodi target fuori dalla fascia 1..5
    -- 2) sposta eventuali nodi extra fuori dalla fascia 1..5
    -- 3) applica upsert finale con sort_order canonico
    UPDATE public.academy_lesson_nodes
    SET sort_order = CASE node_key
      WHEN 'concept' THEN 9001
      WHEN 'widget' THEN 9002
      WHEN 'challenge' THEN 9003
      WHEN 'quiz' THEN 9004
      WHEN 'feedback' THEN 9005
      ELSE sort_order
    END
    WHERE lesson_id = rec.lesson_id
      AND node_key IN ('concept', 'widget', 'challenge', 'quiz', 'feedback');

    UPDATE public.academy_lesson_nodes
    SET sort_order = sort_order + 500
    WHERE lesson_id = rec.lesson_id
      AND node_key NOT IN ('concept', 'widget', 'challenge', 'quiz', 'feedback')
      AND sort_order BETWEEN 1 AND 5;

    INSERT INTO public.academy_lesson_nodes (lesson_id, node_key, title, description, sort_order, is_required, is_active)
    VALUES
      (rec.lesson_id, 'concept', 'Concept', v_concept, 1, true, true),
      (rec.lesson_id, 'widget', 'Widget', v_widget, 2, true, true),
      (rec.lesson_id, 'challenge', 'Challenge', v_challenge, 3, true, true),
      (rec.lesson_id, 'quiz', 'Quiz finale', v_quiz, 4, true, true),
      (rec.lesson_id, 'feedback', 'Feedback', v_feedback, 5, true, true)
    ON CONFLICT (lesson_id, node_key)
    DO UPDATE SET
      title = EXCLUDED.title,
      description = EXCLUDED.description,
      sort_order = EXCLUDED.sort_order,
      is_required = EXCLUDED.is_required,
      is_active = EXCLUDED.is_active,
      updated_at = now();
  END LOOP;
END
$block$;
