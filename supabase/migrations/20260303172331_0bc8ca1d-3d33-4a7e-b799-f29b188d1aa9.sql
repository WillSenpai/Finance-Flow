
-- Create explore_articles table
CREATE TABLE public.explore_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titolo TEXT NOT NULL,
  contenuto TEXT NOT NULL,
  categoria TEXT NOT NULL DEFAULT 'concetto',
  emoji TEXT NOT NULL DEFAULT '📄',
  image_url TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  ordine INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT false,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.explore_articles ENABLE ROW LEVEL SECURITY;

-- Public read for published articles
CREATE POLICY "Anyone can read published explore articles"
  ON public.explore_articles FOR SELECT
  USING (published = true);

-- Admin can insert
CREATE POLICY "Admin can insert explore articles"
  ON public.explore_articles FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admin can update
CREATE POLICY "Admin can update explore articles"
  ON public.explore_articles FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admin can delete
CREATE POLICY "Admin can delete explore articles"
  ON public.explore_articles FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admin can view all (including unpublished)
CREATE POLICY "Admin can view all explore articles"
  ON public.explore_articles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_explore_articles_updated_at
  BEFORE UPDATE ON public.explore_articles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
