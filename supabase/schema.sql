-- ============================================================================
-- CUE RADAR: Supabase PostgreSQL Schema & Security Architecture
-- Description: User Profiles, Radar Smart Preferences & Saved Opportunities Tracker
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. ENUM TYPES
-- ----------------------------------------------------------------------------
CREATE TYPE alert_frequency_type AS ENUM (
  'instant',
  'weekly',
  'high_priority_only'
);

CREATE TYPE opportunity_status_type AS ENUM (
  'not_started',
  'in_draft',
  'submitted',
  'shortlisted'
);

-- ----------------------------------------------------------------------------
-- 2. TABLES
-- ----------------------------------------------------------------------------

-- Table: profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT 'Anonymous Artist',
  bio TEXT DEFAULT '',
  locations TEXT[] DEFAULT ARRAY[]::TEXT[],
  disciplines TEXT[] DEFAULT ARRAY[]::TEXT[],
  showreel_url TEXT DEFAULT '',
  social_links JSONB DEFAULT '{"instagram": "", "spotify": "", "website": "", "vimeo": ""}'::JSONB,
  drive_connected BOOLEAN DEFAULT FALSE,
  portfolio_pdf_url TEXT DEFAULT '',
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Table: radar_preferences
CREATE TABLE IF NOT EXISTS public.radar_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tracked_markets TEXT[] DEFAULT ARRAY['Cologne', 'Tel Aviv', 'Berlin']::TEXT[],
  tracked_disciplines TEXT[] DEFAULT ARRAY['Contemporary Dance', 'Experimental Sound']::TEXT[],
  tracked_types TEXT[] DEFAULT ARRAY['Residency', 'Grant / Funding', 'Open Call']::TEXT[],
  alert_frequency alert_frequency_type NOT NULL DEFAULT 'weekly',
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  CONSTRAINT uq_radar_preferences_user UNIQUE (user_id)
);

-- Table: user_saved_opportunities
CREATE TABLE IF NOT EXISTS public.user_saved_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  opportunity_id TEXT NOT NULL,
  status opportunity_status_type NOT NULL DEFAULT 'not_started',
  saved_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  notes TEXT DEFAULT '',
  CONSTRAINT uq_user_saved_opportunity UNIQUE (user_id, opportunity_id)
);

-- Indices for rapid querying
CREATE INDEX IF NOT EXISTS idx_profiles_locations ON public.profiles USING GIN (locations);
CREATE INDEX IF NOT EXISTS idx_profiles_disciplines ON public.profiles USING GIN (disciplines);
CREATE INDEX IF NOT EXISTS idx_radar_preferences_user ON public.radar_preferences (user_id);
CREATE INDEX IF NOT EXISTS idx_saved_opportunities_user ON public.user_saved_opportunities (user_id);
CREATE INDEX IF NOT EXISTS idx_saved_opportunities_status ON public.user_saved_opportunities (user_id, status);

-- ----------------------------------------------------------------------------
-- 3. TRIGGERS & FUNCTIONS (Automations)
-- ----------------------------------------------------------------------------

-- Automatic updated_at column refresher
CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS trg_radar_preferences_updated_at ON public.radar_preferences;
CREATE TRIGGER trg_radar_preferences_updated_at
  BEFORE UPDATE ON public.radar_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- Auto-provision Profile and Radar Preferences upon user signup in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user_provisioning()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into public.profiles
  INSERT INTO public.profiles (id, full_name, bio, locations, disciplines)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Independent Artist'),
    '',
    ARRAY['Cologne', 'Tel Aviv'],
    ARRAY['Contemporary Dance', 'Experimental Sound']
  )
  ON CONFLICT (id) DO NOTHING;

  -- Insert default radar preferences
  INSERT INTO public.radar_preferences (user_id, tracked_markets, tracked_types, alert_frequency)
  VALUES (
    NEW.id,
    ARRAY['Cologne', 'Tel Aviv', 'Berlin'],
    ARRAY['Residency', 'Grant / Funding', 'Open Call'],
    'weekly'
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_on_auth_user_created ON auth.users;
CREATE TRIGGER trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_provisioning();

-- ----------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------

-- Enable RLS across all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.radar_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_saved_opportunities ENABLE ROW LEVEL SECURITY;

-- 4.1 public.profiles policies:
-- Users can manage (view, insert, update) their own profile
CREATE POLICY "Users can view own full profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Public can view specific basic fields if artist profile is marked public
CREATE POLICY "Public can view public artist profiles"
  ON public.profiles
  FOR SELECT
  USING (is_public = TRUE);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 4.2 public.radar_preferences policies:
CREATE POLICY "Users can select own radar preferences"
  ON public.radar_preferences
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own radar preferences"
  ON public.radar_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own radar preferences"
  ON public.radar_preferences
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own radar preferences"
  ON public.radar_preferences
  FOR DELETE
  USING (auth.uid() = user_id);

-- 4.3 public.user_saved_opportunities policies:
CREATE POLICY "Users can view own saved opportunities"
  ON public.user_saved_opportunities
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save opportunities"
  ON public.user_saved_opportunities
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own saved opportunities status"
  ON public.user_saved_opportunities
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete/unsave opportunities"
  ON public.user_saved_opportunities
  FOR DELETE
  USING (auth.uid() = user_id);
