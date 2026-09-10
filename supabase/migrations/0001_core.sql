-- 0001_core.sql: Core Schema, RLS, View, Triggers, and Storage

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABLES

-- markets
CREATE TABLE IF NOT EXISTS public.markets (
  slug TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  country TEXT NOT NULL,
  region TEXT NOT NULL,
  timezone TEXT NOT NULL,
  currency TEXT NOT NULL,
  lat NUMERIC NOT NULL,
  lng NUMERIC NOT NULL
);

-- vocab
CREATE TABLE IF NOT EXISTS public.vocab (
  category TEXT NOT NULL,
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (category, value)
);

-- sources
CREATE TABLE IF NOT EXISTS public.sources (
  source_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  source_type TEXT NOT NULL,
  market TEXT REFERENCES public.markets(slug) ON DELETE SET NULL,
  discipline_focus TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  tier INT NOT NULL DEFAULT 2 CHECK (tier BETWEEN 1 AND 3),
  website_url TEXT,
  opencalls_url TEXT,
  instagram_url TEXT,
  scrape_method TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'dormant', 'closed')),
  needs_verification BOOLEAN NOT NULL DEFAULT false,
  notes TEXT
);

-- opportunities
CREATE TABLE IF NOT EXISTS public.opportunities (
  opp_id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL REFERENCES public.sources(source_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT CHECK (summary IS NULL OR char_length(summary) <= 200),
  type TEXT NOT NULL,
  discipline_flags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  city TEXT REFERENCES public.markets(slug) ON DELETE SET NULL,
  deadline DATE,
  funding_min NUMERIC,
  funding_max NUMERIC,
  currency TEXT,
  funding_type TEXT,
  covers TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  application_fee NUMERIC NOT NULL DEFAULT 0,
  eligibility_geo TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  career_stage TEXT,
  materials_required TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  apply_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'live', 'expired', 'archived')),
  verified_at DATE,
  verified_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

-- events
CREATE TABLE IF NOT EXISTS public.events (
  event_id TEXT PRIMARY KEY,
  market TEXT REFERENCES public.markets(slug) ON DELETE SET NULL,
  venue_name TEXT NOT NULL,
  title TEXT NOT NULL,
  event_type TEXT NOT NULL,
  disciplines TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  date DATE NOT NULL,
  time TIME,
  price_min NUMERIC,
  ticket_url TEXT,
  lat NUMERIC,
  lng NUMERIC
);

-- profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  handle TEXT UNIQUE NOT NULL CONSTRAINT chk_handle_format CHECK (handle ~ '^[a-z0-9][a-z0-9_-]{2,29}$'),
  full_name TEXT NOT NULL DEFAULT 'Independent Artist',
  role_label TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  locations TEXT[] DEFAULT ARRAY[]::TEXT[],
  current_city TEXT REFERENCES public.markets(slug) ON DELETE SET NULL,
  current_city_from DATE,
  current_city_until DATE,
  disciplines TEXT[] DEFAULT ARRAY[]::TEXT[],
  showreel_url TEXT DEFAULT '',
  social_links JSONB DEFAULT '{"instagram": "", "spotify": "", "website": "", "vimeo": ""}'::JSONB,
  open_for_collab BOOLEAN DEFAULT false,
  available_from DATE,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

-- radar_preferences
CREATE TABLE IF NOT EXISTS public.radar_preferences (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  tracked_markets TEXT[] DEFAULT ARRAY[]::TEXT[],
  tracked_types TEXT[] DEFAULT ARRAY[]::TEXT[],
  tracked_disciplines TEXT[] DEFAULT ARRAY[]::TEXT[],
  eligibility_geo TEXT[] DEFAULT ARRAY[]::TEXT[],
  alert_frequency TEXT NOT NULL DEFAULT 'weekly' CHECK (alert_frequency IN ('instant', 'weekly', 'high_priority_only'))
);

-- user_saved_opportunities
CREATE TABLE IF NOT EXISTS public.user_saved_opportunities (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  opp_id TEXT REFERENCES public.opportunities(opp_id) ON DELETE CASCADE,
  pipeline_status TEXT NOT NULL DEFAULT 'saved' CHECK (pipeline_status IN ('saved', 'drafting', 'submitted', 'accepted', 'rejected')),
  notes TEXT DEFAULT '',
  saved_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  PRIMARY KEY (user_id, opp_id)
);

-- 2. VIEW

CREATE OR REPLACE VIEW public.hub_feed AS
  SELECT o.*,
         s.name AS source_name,
         m.display_name AS city_name,
         m.region,
         (o.deadline - CURRENT_DATE) AS days_left,
         (o.deadline IS NULL) AS is_rolling
  FROM public.opportunities o
  JOIN public.sources s ON s.source_id = o.source_id
  LEFT JOIN public.markets m ON m.slug = o.city
  WHERE o.status = 'live'
    AND (o.deadline IS NULL OR o.deadline >= CURRENT_DATE);

-- 3. TRIGGERS & FUNCTIONS

CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_opportunities_updated_at ON public.opportunities;
CREATE TRIGGER trg_opportunities_updated_at
  BEFORE UPDATE ON public.opportunities
  FOR EACH ROW
  EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- Signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user_provisioning()
RETURNS TRIGGER AS $$
DECLARE
  base_handle TEXT;
BEGIN
  base_handle := 'u_' || LOWER(SUBSTRING(NEW.id::text FROM 1 FOR 8));

  INSERT INTO public.profiles (id, handle, full_name, is_public)
  VALUES (
    NEW.id,
    base_handle,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Independent Artist'),
    false
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.radar_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_on_auth_user_created ON auth.users;
CREATE TRIGGER trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_provisioning();

-- 4. ROW LEVEL SECURITY (RLS) POLICIES

ALTER TABLE public.markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocab ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.radar_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_saved_opportunities ENABLE ROW LEVEL SECURITY;

-- Read-only tables for anon and authenticated
CREATE POLICY "Public read markets" ON public.markets FOR SELECT USING (true);
CREATE POLICY "Public read vocab" ON public.vocab FOR SELECT USING (true);
CREATE POLICY "Public read sources" ON public.sources FOR SELECT USING (true);
CREATE POLICY "Public read opportunities" ON public.opportunities FOR SELECT USING (true);
CREATE POLICY "Public read events" ON public.events FOR SELECT USING (true);

-- User-owned profiles
CREATE POLICY "Select profiles" ON public.profiles FOR SELECT
  USING (is_public OR auth.uid() = id);

CREATE POLICY "Insert own profile" ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Update own profile" ON public.profiles FOR UPDATE
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Radar preferences
CREATE POLICY "Manage own radar_preferences" ON public.radar_preferences FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- User saved opportunities
CREATE POLICY "Manage own user_saved_opportunities" ON public.user_saved_opportunities FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 5. STORAGE BUCKET: avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: public read, authenticated insert/update to own folder
CREATE POLICY "Public avatar read" ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "User avatar insert" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "User avatar update" ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "User avatar delete" ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- TEST COMMENT FOR STORAGE POLICY (Part Phase 4 DoD test):
-- An upload path like 'avatars/other-user-uuid/avatar.webp' will fail the WITH CHECK clause:
-- (storage.foldername('other-user-uuid/avatar.webp'))[1] != auth.uid()::text.
