
-- Profiles table (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  birth_date DATE,
  goals TEXT[] NOT NULL DEFAULT '{}',
  level TEXT NOT NULL DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'pro')),
  has_completed_onboarding BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (id = auth.uid());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (id = auth.uid());

-- Patrimonio categories
CREATE TABLE public.patrimonio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  valore NUMERIC NOT NULL DEFAULT 0,
  colore TEXT NOT NULL,
  emoji TEXT NOT NULL,
  ordine INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.patrimonio ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own patrimonio" ON public.patrimonio FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own patrimonio" ON public.patrimonio FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own patrimonio" ON public.patrimonio FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own patrimonio" ON public.patrimonio FOR DELETE USING (user_id = auth.uid());

-- Salvadanai (savings goals)
CREATE TABLE public.salvadanai (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  obiettivo NUMERIC NOT NULL DEFAULT 0,
  attuale NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.salvadanai ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own salvadanai" ON public.salvadanai FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own salvadanai" ON public.salvadanai FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own salvadanai" ON public.salvadanai FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own salvadanai" ON public.salvadanai FOR DELETE USING (user_id = auth.uid());

-- Investimenti
CREATE TABLE public.investimenti (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  valore NUMERIC NOT NULL DEFAULT 0,
  emoji TEXT NOT NULL,
  colore TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.investimenti ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own investimenti" ON public.investimenti FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own investimenti" ON public.investimenti FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own investimenti" ON public.investimenti FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own investimenti" ON public.investimenti FOR DELETE USING (user_id = auth.uid());

-- Categorie spese
CREATE TABLE public.categorie_spese (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  nome TEXT NOT NULL,
  emoji TEXT NOT NULL,
  colore TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, slug)
);

ALTER TABLE public.categorie_spese ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own categorie_spese" ON public.categorie_spese FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own categorie_spese" ON public.categorie_spese FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own categorie_spese" ON public.categorie_spese FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own categorie_spese" ON public.categorie_spese FOR DELETE USING (user_id = auth.uid());

-- Spese
CREATE TABLE public.spese (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  importo NUMERIC NOT NULL,
  categoria_id UUID REFERENCES public.categorie_spese(id) ON DELETE SET NULL,
  badge TEXT[] NOT NULL DEFAULT '{}',
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  nota TEXT,
  ricorrenza TEXT NOT NULL DEFAULT 'once' CHECK (ricorrenza IN ('once', 'daily', 'weekly', 'monthly', 'yearly')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.spese ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own spese" ON public.spese FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own spese" ON public.spese FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own spese" ON public.spese FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own spese" ON public.spese FOR DELETE USING (user_id = auth.uid());

-- Auto-update updated_at on profiles
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', 'Utente'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
