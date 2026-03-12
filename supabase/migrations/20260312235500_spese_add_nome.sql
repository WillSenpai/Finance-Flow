ALTER TABLE public.spese
ADD COLUMN IF NOT EXISTS nome TEXT;

UPDATE public.spese
SET nome = COALESCE(NULLIF(BTRIM(nota), ''), 'Spesa')
WHERE nome IS NULL;

ALTER TABLE public.spese
ALTER COLUMN nome SET NOT NULL;

