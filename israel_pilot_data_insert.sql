-- Israel pilot data — one-time direct insert (owner-authorized bypass of the Sheet sync flow)
-- Safe to run: uses ON CONFLICT DO NOTHING, so re-running this never duplicates rows.
-- After running, the Google Sheet itself is intentionally NOT updated by this script.
-- Corrected paste-ready Sheet files still exist in Drive for whenever someone wants to bring the Sheet in sync.

-- 1) MARKETS (10 new Israeli cities -- jerusalem and haifa were discovered missing entirely;
-- every existing institution there had been mis-tagged under market='tel_aviv')
INSERT INTO public.markets (slug, display_name, country, region, timezone, currency, lat, lng) VALUES
('jerusalem', 'Jerusalem', 'IL', 'Med', 'Asia/Jerusalem', 'ILS', 31.7683, 35.2137),
('haifa', 'Haifa', 'IL', 'Med', 'Asia/Jerusalem', 'ILS', 32.7940, 34.9896),
('beer_sheva', 'Be''er Sheva', 'IL', 'Med', 'Asia/Jerusalem', 'ILS', 31.2530, 34.7915),
('herzliya', 'Herzliya', 'IL', 'Med', 'Asia/Jerusalem', 'ILS', 32.1624, 34.8447),
('holon', 'Holon', 'IL', 'Med', 'Asia/Jerusalem', 'ILS', 32.0158, 34.7874),
('akko', 'Akko (Acre)', 'IL', 'Med', 'Asia/Jerusalem', 'ILS', 32.9281, 35.0819),
('eilat', 'Eilat', 'IL', 'Med', 'Asia/Jerusalem', 'ILS', 29.5581, 34.9482),
('ramat_gan', 'Ramat Gan', 'IL', 'Med', 'Asia/Jerusalem', 'ILS', 32.0684, 34.8248),
('rishon_lezion', 'Rishon LeZion', 'IL', 'Med', 'Asia/Jerusalem', 'ILS', 31.9730, 34.7925),
('nazareth', 'Nazareth', 'IL', 'Med', 'Asia/Jerusalem', 'ILS', 32.7021, 35.2978)
ON CONFLICT (slug) DO NOTHING;

-- 2) SOURCES (18 new institutions — 5 duplicates already in the DB were excluded: SRC163 Suzanne Dellal, SRC164 Machol Shalem, SRC165 Barbur Gallery, SRC168 CCA Tel Aviv-Yafo, SRC180 Beit HaGefen)
INSERT INTO public.sources (source_id, name, source_type, market, discipline_focus, tier, website_url, opencalls_url, status, needs_verification, notes) VALUES
('SRC315', 'Artis (Israeli Contemporary Art Fund)', 'funder', 'tel_aviv', ARRAY['painting','sculpture'], 2, 'https://artis.art', 'https://artis.art/grants_and_open_calls', 'active', false, 'Real nonprofit funding Israeli visual artists/curators. Runs rolling Residency Grants + Studio Partnership Program.'),
('SRC316', 'Negev Museum of Art', 'institution', 'beer_sheva', ARRAY['painting','sculpture'], 2, 'https://negev-museum.org.il/?lang=en', NULL, 'active', false, 'Only major art museum in southern Israel. Current exhibitions through 2026-12-26, plus Sukkot workshops.'),
('SRC317', 'Herzliya Museum of Contemporary Art', 'institution', 'herzliya', ARRAY['painting','sculpture','interdisciplinary'], 2, 'https://www.herzliyamuseum.co.il/en/', NULL, 'active', true, 'Main exhibition space closed for renovation. Its education arm ''Muza'' continues running courses/workshops.'),
('SRC318', 'Design Museum Holon', 'institution', 'holon', ARRAY['interdisciplinary'], 2, 'https://www.dmh.org.il/en/', 'https://www.dmh.org.il/en/exhibition_cat/current/', 'active', false, 'Actively operating design museum. Current exhibition runs through May 2027.'),
('SRC319', 'Acco Festival of Alternative Israeli Theatre', 'festival', 'akko', ARRAY['performance','dance','interdisciplinary'], 2, 'https://www.accofestival.co.il/index.php?language=eng', NULL, 'active', true, 'Long-running (est. 1980) city-produced 4-day festival during Sukkot in the Old City citadel.'),
('SRC320', 'Red Sea Jazz Festival', 'festival', 'eilat', ARRAY['music'], 2, 'https://redseajazz.co.il/', NULL, 'active', false, 'Long-running (est. 1987) outdoor jazz festival; 2026 edition (40th) confirmed 2026-11-11 to 2026-11-14.'),
('SRC321', 'Ramat Gan Museum of Israeli Art', 'institution', 'ramat_gan', ARRAY['painting','sculpture'], 2, 'https://www.rgma.org.il/', NULL, 'active', false, 'Only museum dedicated specifically to contemporary Israeli art. Ongoing lectures, classes, workshops, tours.'),
('SRC322', 'Heichal HaTarbut Rishon LeZion', 'institution', 'rishon_lezion', ARRAY['performance','dance','music'], 2, 'https://rishonfoundation.org/en/culture-and-sports/', NULL, 'active', true, 'City''s largest cultural venue/auditorium; theatre, music and dance performances.'),
('SRC323', 'Municipal Art Gallery Rishon LeZion', 'institution', 'rishon_lezion', ARRAY['painting','sculpture'], 2, 'https://aicf.org/artist/municipal-art-gallery-rishon-lezion/', NULL, 'active', true, 'Several exhibitions opening simultaneously every 3 months.'),
('SRC324', 'Mahmoud Darwish Cultural Center (Nazareth)', 'institution', 'nazareth', ARRAY['performance','dance','interdisciplinary'], 2, 'https://www.nazareth360.com/enjoy/mahmoud-darwish-cultural-center', NULL, 'active', true, '280-seat theatre hall. Hosts the Nazareth Festival of Contemporary Dance plus plays/concerts/films. Weakest-evidenced city -- owner approved inclusion 2026-09-18.'),
('SRC325', 'Musrara -- The Naggar School of Photography Media New Music and Design', 'institution', 'jerusalem', ARRAY['interdisciplinary'], 2, 'https://musrara.co.il/en/', NULL, 'active', false, 'Active art school (est. 1987) with public-facing workshops (calligraphy, bookbinding, printmaking).'),
('SRC326', 'Yellow Submarine', 'institution', 'jerusalem', ARRAY['music'], 2, 'https://yellowsubmarine.org.il/en/', NULL, 'active', false, 'Jerusalem''s main music-education venue/concert space since 1991; summer masterclass programme.'),
('SRC327', 'Jerusalem Music Centre (JMC)', 'institution', 'jerusalem', ARRAY['music'], 2, 'https://www.jmc.org.il/en/masterclasses/', NULL, 'active', true, 'Real, recurring public masterclass programme.'),
('SRC328', 'Nissan Nativ Acting Studio', 'institution', 'tel_aviv', ARRAY['performance'], 2, 'https://www.nissan-nativ.co.il/', NULL, 'active', true, 'Long-running (est. 1963) Tel Aviv acting school; part-time adult/high-school acting courses.'),
('SRC329', 'Tel Aviv Museum of Art', 'institution', 'tel_aviv', ARRAY['painting','sculpture'], 2, 'https://www.tamuseum.org.il/en/', NULL, 'active', false, 'Active 2025-2026 public lecture series plus standing programme of courses and workshops.'),
('SRC330', 'Bezalel Academy -- Continuing Education Unit', 'institution', 'jerusalem', ARRAY['interdisciplinary'], 2, 'https://www.bezalel.ac.il/en/academics/Continuing_Education', NULL, 'active', true, 'Public-facing Continuing Education Unit offering courses to graduates and the general public.'),
('SRC331', 'Beit Lessin Theatre', 'institution', 'tel_aviv', ARRAY['performance'], 2, 'https://www.beit-lessin.co.il/', NULL, 'active', true, 'Active Tel Aviv repertory theatre (est. 1978) focused on contemporary Israeli drama.'),
('SRC332', 'Haifa Theatre (Haifa Municipal Theatre)', 'institution', 'haifa', ARRAY['performance'], 2, 'https://www.haifathe.co.il/', NULL, 'active', true, 'Israel''s first municipal theatre; produces 8-10 plays annually.')
ON CONFLICT (source_id) DO NOTHING;

-- 3) OPPORTUNITIES (5 rows, status='draft' — intentionally not shown as live/verified yet)
INSERT INTO public.opportunities (opp_id, source_id, title, slug, summary, type, discipline_flags, city, deadline, funding_min, funding_max, currency, funding_type, covers, apply_url, status, created_at, recurrence, expected_next_open) VALUES
('opp-il-2026-001', 'SRC315', 'Artis -- International Residency Grant', 'artis-international-residency-grant', 'Grant support (travel + partial stipend) for Israeli artists already accepted to an international residency program. Reviewed on a rolling quarterly basis.', 'grant', ARRAY['painting','sculpture'], 'tel_aviv', NULL, NULL, NULL, 'USD', 'cash_grant', ARRAY['travel'], 'https://artis.art/grants_and_open_calls/program/residency/faq', 'draft', '2026-09-18', 'rolling', NULL),
('opp-il-2026-002', 'SRC315', 'Artis -- Studio Partnership Program', 'artis-studio-partnership-program', 'Fully-funded partner-residency placements (New York, LA, Berlin, Lagos) for artists from Israel; covers travel and a stipend.', 'residency', ARRAY['painting','sculpture'], 'tel_aviv', NULL, NULL, NULL, 'USD', 'in_kind', ARRAY['travel','stipend'], 'https://artis.art/grants_and_open_calls/program/residency_partnership_initiative5', 'draft', '2026-09-18', 'rolling', NULL),
('opp-il-2026-003', 'SRC163', 'Suzanne Dellal Centre -- off-cycle (no live call)', 'suzanne-dellal-off-cycle-2026-09', 'No currently open call as of 2026-09-17. Most recent call, ''1|2|3 Platform for Emerging Choreographers'', closed 2025-11-02 for the 2026 cohort.', 'open_call', ARRAY['dance'], 'tel_aviv', NULL, NULL, NULL, 'ILS', 'in_kind', ARRAY['studio','mentorship'], 'https://suzannedellal.org.il/en/open-calls/', 'draft', '2026-09-18', 'annual', '2026-10-15'),
('opp-il-2026-004', 'SRC168', 'CCA Tel Aviv -- off-cycle (no live call)', 'cca-tel-aviv-off-cycle-2026-09', 'No current open call found on cca.org.il as of 2026-09-17. An archived ''Open Screening'' page exists but is historic/dated.', 'open_call', ARRAY['painting','sculpture'], 'tel_aviv', NULL, NULL, NULL, 'ILS', 'none', ARRAY[]::TEXT[], 'https://www.cca.org.il', 'draft', '2026-09-18', NULL, NULL),
('opp-il-2026-005', 'SRC164', 'Jerusalem International Choreography Competition 2026 (11th edition)', 'jerusalem-international-choreography-competition-2026', 'Annual choreography competition for original works (9-15 min, up to 4 performers) during Jerusalem International Dance Week. Cash prizes plus a participation fee for entrants.', 'festival_submission', ARRAY['dance'], 'jerusalem', '2026-06-15', 1000, 4000, 'EUR', 'cash_grant', ARRAY[]::TEXT[], 'https://www.macholshalem.co.il/jlm-int-choreography-competition-2026', 'draft', '2026-09-18', 'annual', '2027-06-01')
ON CONFLICT (opp_id) DO NOTHING;

-- 4) EVENTS (5 real dated events)
INSERT INTO public.events (event_id, market, venue_name, title, event_type, disciplines, date, time, price_min, ticket_url, lat, lng) VALUES
('evt-il-2026-001', 'eilat', 'Eilat Port', 'Red Sea Jazz Festival 2026 (40th edition)', 'festival', ARRAY['music'], '2026-11-11', NULL, NULL, 'https://redseajazz.co.il/', 29.5551, 34.9493),
('evt-il-2026-002', 'jerusalem', 'Various venues (Machol Shalem / citywide)', 'Jerusalem International Dance Week 2026 -- Opening Night', 'festival', ARRAY['dance'], '2026-12-03', NULL, NULL, 'https://www.danceweek.org.il/', 31.7767, 35.2345),
('evt-il-2026-003', 'jerusalem', 'Machol Shalem Dance House (MASH)', 'Jerusalem International Choreography Competition 2026 -- performances', 'performance', ARRAY['dance'], '2026-12-09', NULL, NULL, 'https://www.macholshalem.co.il/en/open-call/jerusalem-international-choreography-competition-2026', 31.7767, 35.2345),
('evt-il-2026-004', 'beer_sheva', 'Negev Museum of Art', 'Sukkot Creative Workshops and Guided Tours', 'workshop', ARRAY[]::TEXT[], '2026-09-28', '10:00', 0, 'https://negev-museum.org.il/?lang=en', 31.2418, 34.7913),
('evt-il-2026-005', 'akko', 'Old City of Akko (citadel and historic sites)', 'Acco Festival of Alternative Israeli Theatre 2026', 'festival', ARRAY['performance','dance'], '2026-09-27', NULL, NULL, 'https://www.accofestival.co.il/index.php?language=eng', 32.9234, 35.0687)
ON CONFLICT (event_id) DO NOTHING;

-- Verify counts after running:
-- select count(*) from markets where country='IL';
-- select count(*) from sources where source_id like 'SRC3%';
-- select count(*) from opportunities where opp_id like 'opp-il-2026%';
-- select count(*) from events where event_id like 'evt-il-2026%';
