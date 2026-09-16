-- Migration 0003_demo_seed.sql: Add is_demo flag, update hub_feed view, seed demo sources, opportunities, and events.

-- 1. Add is_demo column to sources, opportunities, and events if not existing
ALTER TABLE public.sources ADD COLUMN IF NOT EXISTS is_demo boolean DEFAULT false;
ALTER TABLE public.opportunities ADD COLUMN IF NOT EXISTS is_demo boolean DEFAULT false;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS is_demo boolean DEFAULT false;

-- 2. Recreate hub_feed view to expose is_demo
CREATE OR REPLACE VIEW public.hub_feed AS
  SELECT 
    o.opp_id,
    o.source_id,
    o.title,
    o.slug,
    o.summary,
    o.type,
    o.discipline_flags,
    o.city,
    o.deadline,
    o.funding_min,
    o.funding_max,
    o.currency,
    o.funding_type,
    o.covers,
    o.application_fee,
    o.eligibility_geo,
    o.career_stage,
    o.materials_required,
    o.apply_url,
    o.status,
    o.verified_at,
    o.verified_by,
    o.created_at,
    o.updated_at,
    s.name AS source_name,
    m.display_name AS city_name,
    m.region,
    (o.deadline - current_date) AS days_left,
    (o.deadline IS NULL) AS is_rolling,
    o.is_demo
  FROM public.opportunities o
  JOIN public.sources s USING (source_id)
  LEFT JOIN public.markets m ON m.slug = o.city
  WHERE o.status = 'live' AND (o.deadline IS NULL OR o.deadline >= current_date);

-- 3. Ensure vocab event_type entries exist
INSERT INTO public.vocab (category, value, label, sort_order) VALUES
  ('event_type', 'workshop', 'Workshop', 1),
  ('event_type', 'class', 'Class', 2),
  ('event_type', 'lab', 'Lab', 3),
  ('event_type', 'masterclass', 'Masterclass', 4),
  ('event_type', 'performance', 'Performance', 5),
  ('event_type', 'concert', 'Concert', 6),
  ('event_type', 'showing', 'Showing', 7),
  ('event_type', 'exhibition', 'Exhibition', 8),
  ('event_type', 'festival', 'Festival', 9),
  ('event_type', 'talk', 'Talk', 10),
  ('event_type', 'club', 'Club Event', 11)
ON CONFLICT (category, value) DO UPDATE SET label = EXCLUDED.label;

-- 4. Demo Sources (12 invented institutions)
INSERT INTO public.sources (source_id, name, source_type, market, discipline_focus, tier, website_url, status, is_demo) VALUES
  ('demo-src-01', 'Haus Dreizehn', 'residency_center', 'berlin', ARRAY['dance', 'performance'], 2, 'https://cue-radar.vercel.app/demo', 'active', true),
  ('demo-src-02', 'Studio Perimeter', 'production_house', 'cologne', ARRAY['sound', 'live_electronics'], 2, 'https://cue-radar.vercel.app/demo', 'active', true),
  ('demo-src-03', 'Atelier Oblique', 'independent_space', 'brussels', ARRAY['dance', 'interdisciplinary'], 2, 'https://cue-radar.vercel.app/demo', 'active', true),
  ('demo-src-04', 'Resonanz Lab', 'sound_center', 'tel_aviv', ARRAY['sound', 'performance'], 2, 'https://cue-radar.vercel.app/demo', 'active', true),
  ('demo-src-05', 'Kinetik Forum', 'festival_org', 'vienna', ARRAY['choreography', 'dance'], 2, 'https://cue-radar.vercel.app/demo', 'active', true),
  ('demo-src-06', 'Soma Platform', 'research_lab', 'zurich', ARRAY['performance', 'installation'], 2, 'https://cue-radar.vercel.app/demo', 'active', true),
  ('demo-src-07', 'Nieuw Soundstage', 'arts_center', 'amsterdam', ARRAY['sound', 'live_electronics'], 2, 'https://cue-radar.vercel.app/demo', 'active', true),
  ('demo-src-08', 'Phonos Pavilion', 'independent_space', 'athens', ARRAY['interdisciplinary', 'sound'], 2, 'https://cue-radar.vercel.app/demo', 'active', true),
  ('demo-src-09', 'ECHO Experimental Unit', 'research_lab', 'tokyo', ARRAY['live_electronics', 'performance'], 2, 'https://cue-radar.vercel.app/demo', 'active', true),
  ('demo-src-10', 'Signal Room', 'production_house', 'seoul', ARRAY['sound', 'installation'], 2, 'https://cue-radar.vercel.app/demo', 'active', true),
  ('demo-src-11', 'Przestrzeń Bewegung', 'dance_center', 'warsaw', ARRAY['dance', 'choreography'], 2, 'https://cue-radar.vercel.app/demo', 'active', true),
  ('demo-src-12', 'Estúdio Margem', 'residency_center', 'lisbon', ARRAY['choreography', 'performance'], 2, 'https://cue-radar.vercel.app/demo', 'active', true)
ON CONFLICT (source_id) DO NOTHING;

-- 5. Demo Opportunities (42 rows covering all 10 types, 7 disciplines, 3 effort levels, funding ranges & deadlines)
INSERT INTO public.opportunities (
  opp_id, source_id, title, slug, summary, type, discipline_flags, city, deadline,
  funding_min, funding_max, currency, funding_type, covers, application_fee,
  eligibility_geo, career_stage, materials_required, apply_url, status, verified_at, verified_by, is_demo
) VALUES
  -- Residency
  ('demo-opp-01', 'demo-src-01', 'Studio Residency — Spring 2027', 'demo-studio-residency-spring-2027', 'A 3-month research residency providing studio space, technical support, and monthly stipend.', 'residency', ARRAY['dance', 'performance'], 'berlin', current_date + interval '4 days', 1200, 1200, 'EUR', 'stipend', ARRAY['housing', 'studio'], 0, ARRAY['international'], 'any', ARRAY['cv', 'bio', 'portfolio'], 'https://cue-radar.vercel.app/demo', 'live', current_date, 'DEMO', true),
  ('demo-opp-02', 'demo-src-03', 'Choreographic Fellowship 2026', 'demo-choreographic-fellowship-2026', 'Fellowship supporting emerging choreographers developing new full-length stage works.', 'residency', ARRAY['choreography', 'dance'], 'brussels', current_date + interval '12 days', 2500, 5000, 'EUR', 'grant', ARRAY['housing', 'travel', 'per_diem'], 0, ARRAY['EU'], 'emerging', ARRAY['cv', 'bio', 'proposal', 'budget'], 'https://cue-radar.vercel.app/demo', 'live', current_date, 'DEMO', true),
  ('demo-opp-03', 'demo-src-12', 'Lisbon Coast Performance Residency', 'demo-lisbon-coast-residency', 'Two-week focused creative retreat near the Tagus estuary for solo performance artists.', 'residency', ARRAY['performance'], 'lisbon', current_date + interval '25 days', 800, 800, 'EUR', 'stipend', ARRAY['housing', 'studio'], 0, ARRAY['international'], 'any', ARRAY['cv', 'bio'], 'https://cue-radar.vercel.app/demo', 'live', current_date, 'DEMO', true),
  ('demo-opp-04', 'demo-src-06', 'Acoustic Body Residency', 'demo-acoustic-body-residency', 'Research stay investigating body acoustics and space resonance in Zurich.', 'residency', ARRAY['sound', 'performance'], 'zurich', NULL, 1500, 3000, 'EUR', 'cash_grant', ARRAY['housing', 'travel'], 0, ARRAY['international'], 'mid', ARRAY['cv', 'portfolio', 'proposal'], 'https://cue-radar.vercel.app/demo', 'live', current_date, 'DEMO', true),

  -- Open Call
  ('demo-opp-05', 'demo-src-02', 'Open Call: Modular Synthesis & Movement', 'demo-modular-synthesis-movement', 'Open call for collaborative duets linking physical gesture to analog sound generation.', 'open_call', ARRAY['sound', 'live_electronics', 'dance'], 'cologne', current_date + interval '3 days', 1000, 2000, 'EUR', 'artist_fee', ARRAY['travel', 'tech'], 0, ARRAY['DE', 'NRW'], 'any', ARRAY['cv', 'bio', 'video'], 'https://cue-radar.vercel.app/demo', 'live', current_date, 'DEMO', true),
  ('demo-opp-06', 'demo-src-08', 'Mediterranean Soundscape Call', 'demo-mediterranean-soundscape-call', 'Commissioning sound installations inspired by urban Mediterranean coastal noise.', 'open_call', ARRAY['sound', 'installation'], 'athens', current_date + interval '18 days', 3000, 3000, 'EUR', 'production_budget', ARRAY['housing', 'travel'], 0, ARRAY['international'], 'any', ARRAY['cv', 'proposal', 'budget', 'timeline'], 'https://cue-radar.vercel.app/demo', 'live', current_date, 'DEMO', true),
  ('demo-opp-07', 'demo-src-11', 'Open Stage: Movement & Spatial Form', 'demo-open-stage-movement-form', 'Platform presenting short 20-minute physical works in Warsaw.', 'open_call', ARRAY['dance', 'choreography'], 'warsaw', current_date + interval '45 days', 500, 1000, 'EUR', 'artist_fee', ARRAY['housing'], 0, ARRAY['EU'], 'emerging', ARRAY['cv', 'video'], 'https://cue-radar.vercel.app/demo', 'live', current_date, 'DEMO', true),

  -- Grant
  ('demo-opp-08', 'demo-src-05', 'Vienna Movement Innovation Grant', 'demo-vienna-movement-grant', 'Direct financial grant supporting non-institutional experimental dance projects.', 'grant', ARRAY['dance', 'interdisciplinary'], 'vienna', current_date + interval '5 days', 10000, 25000, 'EUR', 'cash_grant', ARRAY['mentorship'], 0, ARRAY['EU'], 'mid', ARRAY['cv', 'proposal', 'budget', 'timeline', 'references'], 'https://cue-radar.vercel.app/demo', 'live', current_date, 'DEMO', true),
  ('demo-opp-09', 'demo-src-04', 'Independent Choreography Grant', 'demo-independent-choreography-grant', 'Seed funding for independent choreographers working between Israel and Europe.', 'grant', ARRAY['choreography'], 'tel_aviv', current_date + interval '20 days', 5000, 12000, 'EUR', 'cash_grant', ARRAY['tech'], 0, ARRAY['IL'], 'any', ARRAY['cv', 'proposal', 'budget'], 'https://cue-radar.vercel.app/demo', 'live', current_date, 'DEMO', true),
  ('demo-opp-10', 'demo-src-07', 'Spatial Audio Production Grant', 'demo-spatial-audio-grant', 'Grant funding high-order ambisonics album recordings and live setups.', 'grant', ARRAY['sound', 'live_electronics'], 'amsterdam', current_date + interval '60 days', 4000, 8000, 'EUR', 'production_budget', ARRAY['tech'], 25, ARRAY['international'], 'any', ARRAY['cv', 'portfolio', 'proposal'], 'https://cue-radar.vercel.app/demo', 'live', current_date, 'DEMO', true),

  -- Commission
  ('demo-opp-11', 'demo-src-09', 'Tokyo Site-Specific Sound Commission', 'demo-tokyo-site-specific-sound', 'Major commission for a site-responsive sound installation in Ginza district.', 'commission', ARRAY['sound', 'installation', 'interdisciplinary'], 'tokyo', current_date + interval '2 days', 15000, 20000, 'EUR', 'production_budget', ARRAY['housing', 'travel', 'per_diem'], 0, ARRAY['international'], 'established', ARRAY['cv', 'portfolio', 'proposal', 'budget', 'references'], 'https://cue-radar.vercel.app/demo', 'live', current_date, 'DEMO', true),
  ('demo-opp-12', 'demo-src-01', 'Urban Kinetic Sculpture Commission', 'demo-urban-kinetic-commission', 'Public space physical performance commission for Berlin Art Week.', 'commission', ARRAY['performance', 'installation'], 'berlin', current_date + interval '28 days', 8000, 12000, 'EUR', 'artist_fee', ARRAY['housing', 'tech'], 0, ARRAY['EU'], 'mid', ARRAY['cv', 'proposal', 'budget'], 'https://cue-radar.vercel.app/demo', 'live', current_date, 'DEMO', true),
  ('demo-opp-13', 'demo-src-10', 'Seoul Chamber Electroacoustics', 'demo-seoul-chamber-electroacoustics', 'Commission for 30-minute quadraphonic acoustic and dance composition.', 'commission', ARRAY['live_electronics', 'dance'], 'seoul', NULL, 6000, 9000, 'EUR', 'production_budget', ARRAY['travel'], 0, ARRAY['international'], 'any', ARRAY['cv', 'portfolio', 'proposal'], 'https://cue-radar.vercel.app/demo', 'live', current_date, 'DEMO', true),

  -- Co-Production
  ('demo-opp-14', 'demo-src-03', 'Rethinking Solo Performance 2026', 'demo-rethinking-solo-performance', 'Co-production package including studio space, residency fee, and touring support.', 'co_production', ARRAY['performance', 'choreography'], 'brussels', current_date + interval '6 days', 5000, 10000, 'EUR', 'artist_fee', ARRAY['housing', 'travel', 'studio', 'presentation'], 0, ARRAY['EU'], 'mid', ARRAY['cv', 'bio', 'proposal', 'budget'], 'https://cue-radar.vercel.app/demo', 'live', current_date, 'DEMO', true),
  ('demo-opp-15', 'demo-src-05', 'Danube Body Co-Production', 'demo-danube-body-coproduction', 'Stage co-production funding for duet dance works debuting in Vienna.', 'co_production', ARRAY['dance'], 'vienna', current_date + interval '35 days', 7000, 14000, 'EUR', 'production_budget', ARRAY['housing', 'tech'], 0, ARRAY['EU'], 'any', ARRAY['cv', 'proposal', 'budget', 'timeline'], 'https://cue-radar.vercel.app/demo', 'live', current_date, 'DEMO', true),
  ('demo-opp-16', 'demo-src-02', 'Rheinland Sonic Stage', 'demo-rheinland-sonic-stage', 'Co-production opportunity for physical theater and live sound artists in NRW.', 'co_production', ARRAY['performance', 'sound'], 'cologne', current_date + interval '70 days', 3000, 6000, 'EUR', 'artist_fee', ARRAY['studio'], 0, ARRAY['DE', 'NRW'], 'emerging', ARRAY['cv', 'bio', 'video'], 'https://cue-radar.vercel.app/demo', 'live', current_date, 'DEMO', true),

  -- Festival Submission
  ('demo-opp-17', 'demo-src-05', 'ImPuls Movement Festival Call', 'demo-impulss-movement-festival', 'Main stage open call for existing choreography and dance solos under 45 minutes.', 'festival_submission', ARRAY['dance', 'choreography'], 'vienna', current_date + interval '1 days', 1200, 2400, 'EUR', 'artist_fee', ARRAY['housing', 'travel', 'per_diem'], 30, ARRAY['international'], 'any', ARRAY['cv', 'video'], 'https://cue-radar.vercel.app/demo', 'live', current_date, 'DEMO', true),
  ('demo-opp-18', 'demo-src-08', 'Athens Digital Performance Fest', 'demo-athens-digital-performance', 'Submission of hybrid physical and electronic performance works for June festival.', 'festival_submission', ARRAY['live_electronics', 'performance'], 'athens', current_date + interval '15 days', 800, 1600, 'EUR', 'stipend', ARRAY['housing', 'tech'], 15, ARRAY['international'], 'any', ARRAY['cv', 'video', 'proposal'], 'https://cue-radar.vercel.app/demo', 'live', current_date, 'DEMO', true),
  ('demo-opp-19', 'demo-src-04', 'Tel Aviv Sound Art Biennale', 'demo-tel-aviv-sound-biennale', 'Open submissions for gallery-based listening rooms and outdoor sound works.', 'festival_submission', ARRAY['sound', 'installation'], 'tel_aviv', current_date + interval '50 days', 1500, 3000, 'EUR', 'artist_fee', ARRAY['housing', 'tech'], 0, ARRAY['international'], 'any', ARRAY['cv', 'portfolio'], 'https://cue-radar.vercel.app/demo', 'live', current_date, 'DEMO', true),

  -- Award
  ('demo-opp-20', 'demo-src-06', 'Swiss Experimental Sound Award 2026', 'demo-swiss-sound-award-2026', 'Annual prize honoring outstanding innovation in electroacoustic performance.', 'award', ARRAY['sound', 'live_electronics'], 'zurich', current_date + interval '14 days', 10000, 10000, 'EUR', 'cash_grant', ARRAY[]::text[], 0, ARRAY['international'], 'mid', ARRAY['cv', 'portfolio'], 'https://cue-radar.vercel.app/demo', 'live', current_date, 'DEMO', true),
  ('demo-opp-21', 'demo-src-01', 'Berlin New Choreography Prize', 'demo-berlin-choreography-prize', 'Annual award for groundbreaking physical vocabulary created in Berlin.', 'award', ARRAY['choreography', 'dance'], 'berlin', current_date + interval '40 days', 5000, 5000, 'EUR', 'cash_grant', ARRAY[]::text[], 0, ARRAY['DE'], 'emerging', ARRAY['cv', 'portfolio', 'video'], 'https://cue-radar.vercel.app/demo', 'live', current_date, 'DEMO', true),
  ('demo-opp-22', 'demo-src-07', 'Dutch Interdisciplinary Art Prize', 'demo-dutch-interdisciplinary-prize', 'Recognition award for work blurring lines between movement and sound.', 'award', ARRAY['interdisciplinary'], 'amsterdam', NULL, 7500, 7500, 'EUR', 'cash_grant', ARRAY[]::text[], 0, ARRAY['EU'], 'any', ARRAY['cv', 'portfolio'], 'https://cue-radar.vercel.app/demo', 'live', current_date, 'DEMO', true),

  -- Lab / Workshop
  ('demo-opp-23', 'demo-src-01', 'Dancer & Synthesist Intensive Lab', 'demo-dancer-synthesist-intensive', 'A 5-day lab uniting modular synth operators and contemporary movers.', 'lab_workshop', ARRAY['dance', 'sound', 'live_electronics'], 'berlin', current_date + interval '7 days', 0, 0, 'EUR', 'in_kind', ARRAY['studio', 'mentorship'], 0, ARRAY['international'], 'any', ARRAY['bio'], 'https://cue-radar.vercel.app/demo', 'live', current_date, 'DEMO', true),
  ('demo-opp-24', 'demo-src-04', 'Somatosensory Listening Lab', 'demo-somatosensory-listening-lab', '3-day somatic research workshop exploring bone conduction and sub-bass frequencies.', 'lab_workshop', ARRAY['sound', 'performance'], 'tel_aviv', current_date + interval '22 days', 0, 0, 'EUR', 'in_kind', ARRAY['studio'], 0, ARRAY['IL'], 'any', ARRAY['cv', 'bio'], 'https://cue-radar.vercel.app/demo', 'live', current_date, 'DEMO', true),
  ('demo-opp-25', 'demo-src-10', 'Seoul Motion Capture & Body Lab', 'demo-seoul-mocap-body-lab', 'Technological and movement lab exploring optic tracking for live stage visuals.', 'lab_workshop', ARRAY['interdisciplinary', 'performance'], 'seoul', current_date + interval '55 days', 0, 0, 'EUR', 'in_kind', ARRAY['tech', 'mentorship'], 50, ARRAY['international'], 'any', ARRAY['cv', 'bio', 'portfolio'], 'https://cue-radar.vercel.app/demo', 'live', current_date, 'DEMO', true),

  -- Audition / Job
  ('demo-opp-26', 'demo-src-02', 'Ensemble Audition — 2026/27 Season', 'demo-ensemble-audition-2026-27', 'Audition for full-time guest performance contract in Cologne.', 'audition_job', ARRAY['dance', 'performance'], 'cologne', current_date + interval '9 days', 2800, 3500, 'EUR', 'stipend', ARRAY['housing', 'per_diem'], 0, ARRAY['EU'], 'any', ARRAY['cv', 'bio', 'video'], 'https://cue-radar.vercel.app/demo', 'live', current_date, 'DEMO', true),
  ('demo-opp-27', 'demo-src-03', 'Guest Performer: Physical Theater Production', 'demo-guest-performer-physical-theater', 'Audition call for 2 physical performers for touring show in Belgium.', 'audition_job', ARRAY['performance'], 'brussels', current_date + interval '30 days', 3000, 3000, 'EUR', 'stipend', ARRAY['travel'], 0, ARRAY['EU'], 'any', ARRAY['cv', 'video'], 'https://cue-radar.vercel.app/demo', 'live', current_date, 'DEMO', true),
  ('demo-opp-28', 'demo-src-09', 'Sound Engineer & Live System Operator', 'demo-sound-engineer-live-operator', 'Audition for live sound technician and performer for touring dance ensemble.', 'audition_job', ARRAY['sound', 'live_electronics'], 'tokyo', NULL, 4000, 4000, 'EUR', 'stipend', ARRAY['travel', 'per_diem'], 0, ARRAY['international'], 'mid', ARRAY['cv', 'portfolio'], 'https://cue-radar.vercel.app/demo', 'live', current_date, 'DEMO', true),

  -- Mentorship
  ('demo-opp-29', 'demo-src-07', 'Curatorial & Choreographic Mentorship', 'demo-choreographic-mentorship-2026', '6-month 1-on-1 mentorship with senior European dance dramaturgs.', 'mentorship', ARRAY['choreography', 'dance'], 'amsterdam', current_date + interval '11 days', 1000, 1000, 'EUR', 'stipend', ARRAY['mentorship'], 0, ARRAY['EU'], 'emerging', ARRAY['cv', 'bio', 'proposal'], 'https://cue-radar.vercel.app/demo', 'live', current_date, 'DEMO', true),
  ('demo-opp-30', 'demo-src-12', 'Emerging Sound Artist Mentorship', 'demo-emerging-sound-mentorship', 'Mentorship scheme supporting first album or major installation release.', 'mentorship', ARRAY['sound'], 'lisbon', current_date + interval '42 days', 500, 500, 'EUR', 'stipend', ARRAY['mentorship'], 0, ARRAY['international'], 'emerging', ARRAY['cv', 'portfolio'], 'https://cue-radar.vercel.app/demo', 'live', current_date, 'DEMO', true),
  ('demo-opp-31', 'demo-src-08', 'Balkan Interdisciplinary Mentorship', 'demo-balkan-interdisciplinary-mentorship', 'Cross-border mentorship bridging performance artists in Athens and Sofia.', 'mentorship', ARRAY['interdisciplinary', 'performance'], 'athens', current_date + interval '65 days', 1500, 1500, 'EUR', 'stipend', ARRAY['travel', 'mentorship'], 0, ARRAY['EU'], 'emerging', ARRAY['cv', 'proposal'], 'https://cue-radar.vercel.app/demo', 'live', current_date, 'DEMO', true),

  -- Additional spread for filter density
  ('demo-opp-32', 'demo-src-01', 'Berlin Sound Residency — Winter', 'demo-berlin-sound-residency-winter', 'Focus stay on spatial acoustics for female-identifying and non-binary sound artists.', 'residency', ARRAY['sound'], 'berlin', current_date + interval '16 days', 1500, 1500, 'EUR', 'stipend', ARRAY['housing', 'studio'], 0, ARRAY['international'], 'any', ARRAY['cv', 'portfolio'], 'https://cue-radar.vercel.app/demo', 'live', current_date, 'DEMO', true),
  ('demo-opp-33', 'demo-src-02', 'NRW Dance Creation Grant', 'demo-nrw-dance-creation-grant', 'State grant for new dance production development in North Rhine-Westphalia.', 'grant', ARRAY['dance', 'choreography'], 'cologne', current_date + interval '21 days', 12000, 18000, 'EUR', 'cash_grant', ARRAY['studio'], 0, ARRAY['DE', 'NRW'], 'mid', ARRAY['cv', 'proposal', 'budget', 'timeline'], 'https://cue-radar.vercel.app/demo', 'live', current_date, 'DEMO', true),
  ('demo-opp-34', 'demo-src-03', 'Flemish Experimental Commission', 'demo-flemish-experimental-commission', 'Commission for radical physical performance works.', 'commission', ARRAY['performance', 'interdisciplinary'], 'brussels', current_date + interval '8 days', 9000, 9000, 'EUR', 'production_budget', ARRAY['housing', 'travel'], 0, ARRAY['EU'], 'any', ARRAY['cv', 'proposal', 'budget'], 'https://cue-radar.vercel.app/demo', 'live', current_date, 'DEMO', true),
  ('demo-opp-35', 'demo-src-04', 'Levant Sound Performance Lab', 'demo-levant-sound-performance-lab', '7-day workshop on field recording and body movement.', 'lab_workshop', ARRAY['sound', 'dance'], 'tel_aviv', current_date + interval '31 days', 0, 0, 'EUR', 'none', ARRAY['studio'], 0, ARRAY['IL'], 'any', ARRAY['bio'], 'https://cue-radar.vercel.app/demo', 'live', current_date, 'DEMO', true),
  ('demo-opp-36', 'demo-src-05', 'Austrian Stage Residency', 'demo-austrian-stage-residency', 'Stage residency offering lighting design and full theater access.', 'residency', ARRAY['dance', 'performance'], 'vienna', current_date + interval '4 days', 2000, 4000, 'EUR', 'artist_fee', ARRAY['housing', 'tech'], 0, ARRAY['EU'], 'any', ARRAY['cv', 'video', 'proposal'], 'https://cue-radar.vercel.app/demo', 'live', current_date, 'DEMO', true),
  ('demo-opp-37', 'demo-src-06', 'Zurich Micro-Grant for Electronics', 'demo-zurich-microgrant-electronics', 'Micro grant for purchasing sensor hardware and audio interfaces.', 'grant', ARRAY['live_electronics'], 'zurich', current_date + interval '13 days', 1500, 1500, 'EUR', 'cash_grant', ARRAY['tech'], 0, ARRAY['international'], 'any', ARRAY['proposal'], 'https://cue-radar.vercel.app/demo', 'live', current_date, 'DEMO', true),
  ('demo-opp-38', 'demo-src-07', 'Amsterdam Sound Performance Open Call', 'demo-amsterdam-sound-performance-open-call', 'Open call for 15-minute live electronics and dance improvisations.', 'open_call', ARRAY['sound', 'live_electronics', 'dance'], 'amsterdam', current_date + interval '19 days', 600, 1200, 'EUR', 'artist_fee', ARRAY['travel'], 0, ARRAY['international'], 'any', ARRAY['cv', 'bio'], 'https://cue-radar.vercel.app/demo', 'live', current_date, 'DEMO', true),
  ('demo-opp-39', 'demo-src-08', 'Greek Islands Choreography Retreat', 'demo-greek-islands-retreat', '10-day outdoor choreography research retreat on Naxos island.', 'residency', ARRAY['choreography'], 'athens', current_date + interval '27 days', 1000, 1000, 'EUR', 'stipend', ARRAY['housing', 'travel'], 0, ARRAY['international'], 'any', ARRAY['cv', 'bio', 'portfolio'], 'https://cue-radar.vercel.app/demo', 'live', current_date, 'DEMO', true),
  ('demo-opp-40', 'demo-src-09', 'Tokyo Sonic Arts Residency', 'demo-tokyo-sonic-arts-residency', '1-month residency in Shibuya for electroacoustic sound artists.', 'residency', ARRAY['sound', 'live_electronics'], 'tokyo', current_date + interval '38 days', 3000, 3000, 'EUR', 'stipend', ARRAY['housing', 'studio'], 0, ARRAY['international'], 'mid', ARRAY['cv', 'proposal'], 'https://cue-radar.vercel.app/demo', 'live', current_date, 'DEMO', true),
  ('demo-opp-41', 'demo-src-10', 'Seoul Contemporary Performance Grant', 'demo-seoul-performance-grant', 'Grant supporting cross-cultural dance solos.', 'grant', ARRAY['performance', 'dance'], 'seoul', current_date + interval '48 days', 5000, 5000, 'EUR', 'cash_grant', ARRAY['travel'], 0, ARRAY['international'], 'any', ARRAY['cv', 'proposal', 'budget'], 'https://cue-radar.vercel.app/demo', 'live', current_date, 'DEMO', true),
  ('demo-opp-42', 'demo-src-11', 'Warsaw New Stage Commission', 'demo-warsaw-new-stage-commission', 'Commission for non-traditional theater and movement performance.', 'commission', ARRAY['performance', 'choreography'], 'warsaw', NULL, 4000, 6000, 'EUR', 'production_budget', ARRAY['housing', 'tech'], 0, ARRAY['EU'], 'any', ARRAY['cv', 'proposal'], 'https://cue-radar.vercel.app/demo', 'live', current_date, 'DEMO', true)
ON CONFLICT (opp_id) DO NOTHING;

-- 6. Demo Events (32 events across 6 markets for Trip Radar v1)
INSERT INTO public.events (
  event_id, market, venue_name, title, event_type, disciplines, date, time, price_min, ticket_url, lat, lng, is_demo
) VALUES
  ('demo-evt-01', 'berlin', 'Dock 11', 'Contact Improvisation Masterclass', 'masterclass', ARRAY['dance'], current_date + interval '2 days', '10:00', 25, 'https://cue-radar.vercel.app/demo', 52.535, 13.405, true),
  ('demo-evt-02', 'berlin', 'Radialsystem', 'Spatial Sound Performance: Resonance', 'performance', ARRAY['sound', 'live_electronics'], current_date + interval '3 days', '20:00', 18, 'https://cue-radar.vercel.app/demo', 52.511, 13.428, true),
  ('demo-evt-03', 'berlin', 'Tanzfabrik Berlin', 'Somatic Movement Workshop', 'workshop', ARRAY['dance'], current_date + interval '5 days', '14:00', 0, 'https://cue-radar.vercel.app/demo', 52.489, 13.422, true),
  ('demo-evt-04', 'berlin', 'HAU Hebbel am Ufer', 'Duet Showing: Kinetic Drift', 'showing', ARRAY['performance'], current_date + interval '8 days', '19:30', 15, 'https://cue-radar.vercel.app/demo', 52.499, 13.387, true),
  ('demo-evt-05', 'berlin', 'KW Institute', 'Body as Antenna Exhibition', 'exhibition', ARRAY['installation', 'sound'], current_date + interval '10 days', '12:00', 8, 'https://cue-radar.vercel.app/demo', 52.526, 13.395, true),
  ('demo-evt-06', 'berlin', 'Berghain Kantine', 'Modular Live Electronics Night', 'club', ARRAY['live_electronics', 'sound'], current_date + interval '12 days', '23:00', 12, 'https://cue-radar.vercel.app/demo', 52.511, 13.443, true),

  ('demo-evt-07', 'brussels', 'KVS Box', 'Contemporary Floorwork Lab', 'lab', ARRAY['dance'], current_date + interval '1 days', '11:00', 15, 'https://cue-radar.vercel.app/demo', 50.854, 4.351, true),
  ('demo-evt-08', 'brussels', 'Les Halles de Schaerbeek', 'Solo Showing: Somatic Echoes', 'showing', ARRAY['performance'], current_date + interval '4 days', '20:30', 14, 'https://cue-radar.vercel.app/demo', 50.862, 4.372, true),
  ('demo-evt-09', 'brussels', 'STUK Leuven', 'Electroacoustic Concert: Quadraphonic', 'concert', ARRAY['sound', 'live_electronics'], current_date + interval '7 days', '21:00', 20, 'https://cue-radar.vercel.app/demo', 50.878, 4.701, true),
  ('demo-evt-10', 'brussels', 'Garage29', 'Choreographic Research Talk', 'talk', ARRAY['choreography'], current_date + interval '14 days', '18:00', 0, 'https://cue-radar.vercel.app/demo', 50.870, 4.380, true),

  ('demo-evt-11', 'tel_aviv', 'Suzanne Dellal Centre', 'Repertory Masterclass with Batsheva Alum', 'masterclass', ARRAY['dance'], current_date + interval '3 days', '09:30', 30, 'https://cue-radar.vercel.app/demo', 32.061, 34.764, true),
  ('demo-evt-12', 'tel_aviv', 'CCA Tel Aviv', 'Field Recording & Soundscape Lab', 'lab', ARRAY['sound'], current_date + interval '6 days', '16:00', 0, 'https://cue-radar.vercel.app/demo', 32.069, 34.770, true),
  ('demo-evt-13', 'tel_aviv', 'Tzavta Theater', 'Choreographers Studio Showing', 'showing', ARRAY['choreography', 'dance'], current_date + interval '9 days', '21:00', 12, 'https://cue-radar.vercel.app/demo', 32.074, 34.781, true),
  ('demo-evt-14', 'tel_aviv', 'Kuli Alma', 'Experimental Sound & Visuals Night', 'club', ARRAY['live_electronics', 'interdisciplinary'], current_date + interval '11 days', '22:00', 0, 'https://cue-radar.vercel.app/demo', 32.062, 34.774, true),

  ('demo-evt-15', 'vienna', 'Tanzquartier Wien', 'Dramaturgy in Motion Workshop', 'workshop', ARRAY['choreography', 'performance'], current_date + interval '2 days', '13:00', 20, 'https://cue-radar.vercel.app/demo', 48.203, 16.358, true),
  ('demo-evt-16', 'vienna', 'WUK', 'Live Electronic Dance Performance', 'performance', ARRAY['dance', 'live_electronics'], current_date + interval '5 days', '20:00', 16, 'https://cue-radar.vercel.app/demo', 48.222, 16.356, true),
  ('demo-evt-17', 'vienna', 'Sonic Arts Center', 'Acoustics & Architecture Talk', 'talk', ARRAY['sound'], current_date + interval '13 days', '17:30', 0, 'https://cue-radar.vercel.app/demo', 48.210, 16.370, true),

  ('demo-evt-18', 'tokyo', 'Session House Kagurazaka', 'Butoh & Contemporary Fusion Class', 'class', ARRAY['dance'], current_date + interval '4 days', '19:00', 25, 'https://cue-radar.vercel.app/demo', 35.703, 139.738, true),
  ('demo-evt-19', 'tokyo', 'SuperDeluxe Redux', 'Modular Synth & Body Improvisation', 'performance', ARRAY['live_electronics', 'performance'], current_date + interval '8 days', '19:30', 20, 'https://cue-radar.vercel.app/demo', 35.662, 139.732, true),
  ('demo-evt-20', 'tokyo', 'VACANT Harajuku', 'Sound Installation: Whispering Walls', 'exhibition', ARRAY['sound', 'installation'], current_date + interval '15 days', '11:00', 10, 'https://cue-radar.vercel.app/demo', 35.670, 139.708, true),

  ('demo-evt-21', 'athens', 'COMMUNITISM', 'Body & Noise Workshop', 'workshop', ARRAY['performance', 'sound'], current_date + interval '3 days', '15:00', 10, 'https://cue-radar.vercel.app/demo', 37.981, 23.722, true),
  ('demo-evt-22', 'athens', 'Onassis Stegi', 'International Dance Festival Opening', 'festival', ARRAY['dance', 'choreography'], current_date + interval '9 days', '20:00', 22, 'https://cue-radar.vercel.app/demo', 37.958, 23.719, true),
  ('demo-evt-23', 'athens', 'BIOS Stage', 'Live Modular & Movement Showing', 'showing', ARRAY['live_electronics', 'dance'], current_date + interval '12 days', '21:30', 8, 'https://cue-radar.vercel.app/demo', 37.979, 23.718, true)
ON CONFLICT (event_id) DO NOTHING;
