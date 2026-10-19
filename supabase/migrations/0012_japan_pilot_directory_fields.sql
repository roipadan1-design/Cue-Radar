-- 0012_japan_pilot_directory_fields.sql
-- Task 22: fields the Kyoto/Tokyo pilot needs for organisation pages, curator pages and
-- the Explore filters. Column names follow docs/research/japan_pilot/FABLE_PROMPT.md and
-- FABLE_CURATORS_PROMPT.md, so the research CSVs load without renaming.
--
-- Additive only (rule 6): ADD COLUMN IF NOT EXISTS, one new table, vocab INSERTs.
-- All new tables are curated (rule 5): public read, no app write policy; only
-- scripts/sync_sheet_to_supabase.py or an owner-run SQL file writes them.

-- 1) sources: what an organisation page shows (About, where, how to get in the door).
ALTER TABLE public.sources ADD COLUMN IF NOT EXISTS name_ja TEXT;
ALTER TABLE public.sources ADD COLUMN IF NOT EXISTS about TEXT CHECK (about IS NULL OR char_length(about) <= 1200);
ALTER TABLE public.sources ADD COLUMN IF NOT EXISTS neighborhood TEXT;
ALTER TABLE public.sources ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.sources ADD COLUMN IF NOT EXISTS calendar_url TEXT;
ALTER TABLE public.sources ADD COLUMN IF NOT EXISTS scene_tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE public.sources ADD COLUMN IF NOT EXISTS underground_score INT CHECK (underground_score IS NULL OR underground_score BETWEEN 1 AND 5);
ALTER TABLE public.sources ADD COLUMN IF NOT EXISTS newcomer_friendly TEXT CHECK (newcomer_friendly IS NULL OR newcomer_friendly IN ('yes', 'no', 'unknown'));
ALTER TABLE public.sources ADD COLUMN IF NOT EXISTS foreigner_notes TEXT;
ALTER TABLE public.sources ADD COLUMN IF NOT EXISTS evidence_url TEXT;
ALTER TABLE public.sources ADD COLUMN IF NOT EXISTS verified_at DATE;

-- 2) events: link to the organising venue, multi-day runs, and what the card says.
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS source_id TEXT REFERENCES public.sources(source_id) ON DELETE SET NULL;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS title_ja TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS end_date DATE;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS end_time TIME;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS recurrence TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS price_max NUMERIC;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS currency TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS lineup TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS description TEXT CHECK (description IS NULL OR char_length(description) <= 200);
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS language_barrier TEXT CHECK (language_barrier IS NULL OR language_barrier IN ('none', 'some', 'high'));
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS booking_required TEXT CHECK (booking_required IS NULL OR booking_required IN ('yes', 'no', 'recommended'));
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS evidence_url TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS verified_at DATE;
CREATE INDEX IF NOT EXISTS idx_events_source_id ON public.events (source_id);
CREATE INDEX IF NOT EXISTS idx_events_market_date ON public.events (market, date);

-- 3) curators: public professional profiles of curators/programmers/organisers.
--    Researched, not user accounts (profiles stays the only user table). No photos:
--    the UI shows initials, so no one's image is republished.
CREATE TABLE IF NOT EXISTS public.curators (
  curator_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_ja TEXT,
  role_label TEXT NOT NULL DEFAULT 'Curator',
  market TEXT REFERENCES public.markets(slug) ON DELETE SET NULL,
  about TEXT CHECK (about IS NULL OR char_length(about) <= 1200),
  disciplines TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  affiliations TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  website_url TEXT,
  instagram_url TEXT,
  evidence_url TEXT,
  verified_at DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);
ALTER TABLE public.curators ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY "Public read curators" ON public.curators FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS idx_curators_market ON public.curators (market);

-- 4) Labels for organisation types (FABLE_PROMPT.md §5.1) so the Type filter and the
--    "Type · City" line read from vocab, not from code. Older free-text values in
--    existing rows (venue, institution, festival, funder...) get labels too.
INSERT INTO public.vocab (category, value, label, sort_order) VALUES
  ('source_type', 'venue_music',       'Music venue',       1),
  ('source_type', 'live_house',        'Live house',        2),
  ('source_type', 'club',              'Club',              3),
  ('source_type', 'dance_studio',      'Dance studio',      4),
  ('source_type', 'theatre_small',     'Theatre',           5),
  ('source_type', 'gallery',           'Gallery',           6),
  ('source_type', 'artist_run_space',  'Artist-run space',  7),
  ('source_type', 'art_centre',        'Art centre',        8),
  ('source_type', 'museum',            'Museum',            9),
  ('source_type', 'festival',          'Festival',          10),
  ('source_type', 'collective',        'Collective',        11),
  ('source_type', 'label',             'Label',             12),
  ('source_type', 'school_workshop',   'School',            13),
  ('source_type', 'residency',         'Residency',         14),
  ('source_type', 'shop_venue',        'Shop & venue',      15),
  ('source_type', 'community_space',   'Community space',   16),
  ('source_type', 'aggregator',        'Listings',          17),
  ('source_type', 'media',             'Media',             18),
  ('source_type', 'venue',             'Venue',             19),
  ('source_type', 'institution',       'Institution',       20),
  ('source_type', 'funder',            'Funder',            21),
  ('source_type', 'platform',          'Platform',          22)
ON CONFLICT (category, value) DO NOTHING;

-- Disciplines the Japan research uses beyond the current set (0004).
INSERT INTO public.vocab (category, value, label, sort_order) VALUES
  ('discipline', 'visual_art',  'Visual art',  7),
  ('discipline', 'photography', 'Photography', 8),
  ('discipline', 'film',        'Film',        9),
  ('discipline', 'theatre',     'Theatre',     10)
ON CONFLICT (category, value) DO NOTHING;
