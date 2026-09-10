-- 0002_seed_vocab_markets.sql: Controlled Vocabularies and 23 Markets

-- 1. VOCAB SEED
INSERT INTO public.vocab (category, value, label, sort_order) VALUES
-- type
('type', 'open_call', 'Open Call', 1),
('type', 'residency', 'Residency', 2),
('type', 'grant', 'Grant / Funding', 3),
('type', 'co_production', 'Co-Production', 4),
('type', 'commission', 'Commission', 5),
('type', 'festival_submission', 'Festival Submission', 6),
('type', 'award', 'Award / Prize', 7),
('type', 'lab_workshop', 'Lab / Workshop', 8),
('type', 'audition_job', 'Audition / Job', 9),
('type', 'mentorship', 'Mentorship', 10),

-- discipline
('discipline', 'dance', 'Contemporary Dance', 1),
('discipline', 'choreography', 'Choreography', 2),
('discipline', 'performance', 'Performance Art', 3),
('discipline', 'sound', 'Experimental Sound', 4),
('discipline', 'live_electronics', 'Live Electronics', 5),
('discipline', 'installation', 'Sound & Light Installation', 6),
('discipline', 'interdisciplinary', 'Interdisciplinary / Hybrid', 7),

-- funding_type
('funding_type', 'cash_grant', 'Cash Grant', 1),
('funding_type', 'artist_fee', 'Artist Fee', 2),
('funding_type', 'stipend', 'Living Stipend', 3),
('funding_type', 'production_budget', 'Production Budget', 4),
('funding_type', 'in_kind', 'In-Kind Support', 5),
('funding_type', 'none', 'Unfunded', 6),

-- covers
('covers', 'housing', 'Housing / Accommodation', 1),
('covers', 'travel', 'Travel Expenses', 2),
('covers', 'studio', 'Studio Space', 3),
('covers', 'tech', 'Technical Equipment', 4),
('covers', 'mentorship', 'Mentorship / Dramaturgy', 5),
('covers', 'per_diem', 'Per Diem', 6),
('covers', 'presentation', 'Public Presentation', 7),

-- career_stage
('career_stage', 'emerging', 'Emerging', 1),
('career_stage', 'mid', 'Mid-Career', 2),
('career_stage', 'established', 'Established', 3),
('career_stage', 'any', 'Any Stage', 4),

-- region
('region', 'DACH', 'DACH (Germany, Austria, Switzerland)', 1),
('region', 'Benelux', 'Benelux (Belgium, Netherlands, Luxembourg)', 2),
('region', 'France', 'France', 3),
('region', 'Nordics', 'Nordics', 4),
('region', 'Med', 'Mediterranean & Southern Europe', 5),
('region', 'CEE', 'Central & Eastern Europe', 6),
('region', 'Caucasus', 'Caucasus', 7),
('region', 'East_Asia', 'East Asia', 8),
('region', 'remote', 'Remote / Global', 9)
ON CONFLICT (category, value) DO UPDATE SET
  label = EXCLUDED.label,
  sort_order = EXCLUDED.sort_order;


-- 2. MARKETS SEED (23 markets)
INSERT INTO public.markets (slug, display_name, country, region, timezone, currency, lat, lng) VALUES
('berlin', 'Berlin', 'Germany', 'DACH', 'Europe/Berlin', 'EUR', 52.5200, 13.4050),
('cologne', 'Cologne', 'Germany', 'DACH', 'Europe/Berlin', 'EUR', 50.9375, 6.9603),
('tel_aviv', 'Tel Aviv', 'Israel', 'Med', 'Asia/Tel_Aviv', 'ILS', 32.0853, 34.7818),
('brussels', 'Brussels', 'Belgium', 'Benelux', 'Europe/Brussels', 'EUR', 50.8503, 4.3517),
('vienna', 'Vienna', 'Austria', 'DACH', 'Europe/Vienna', 'EUR', 48.2082, 16.3738),
('zurich', 'Zurich', 'Switzerland', 'DACH', 'Europe/Zurich', 'CHF', 47.3769, 8.5417),
('amsterdam', 'Amsterdam', 'Netherlands', 'Benelux', 'Europe/Amsterdam', 'EUR', 52.3676, 4.9041),
('paris', 'Paris', 'France', 'France', 'Europe/Paris', 'EUR', 48.8566, 2.3522),
('lyon', 'Lyon', 'France', 'France', 'Europe/Paris', 'EUR', 45.7640, 4.8357),
('stockholm', 'Stockholm', 'Sweden', 'Nordics', 'Europe/Stockholm', 'SEK', 59.3293, 18.0686),
('oslo', 'Oslo', 'Norway', 'Nordics', 'Europe/Oslo', 'NOK', 59.9139, 10.7522),
('copenhagen', 'Copenhagen', 'Denmark', 'Nordics', 'Europe/Copenhagen', 'DKK', 55.6761, 12.5683),
('athens', 'Athens', 'Greece', 'Med', 'Europe/Athens', 'EUR', 37.9838, 23.7275),
('tbilisi', 'Tbilisi', 'Georgia', 'Caucasus', 'Asia/Tbilisi', 'GEL', 41.7151, 44.8271),
('tokyo', 'Tokyo', 'Japan', 'East_Asia', 'Asia/Tokyo', 'JPY', 35.6762, 139.6503),
('seoul', 'Seoul', 'South Korea', 'East_Asia', 'Asia/Seoul', 'KRW', 37.5665, 126.9780),
('warsaw', 'Warsaw', 'Poland', 'CEE', 'Europe/Warsaw', 'PLN', 52.2297, 21.0122),
('krakow', 'Krakow', 'Poland', 'CEE', 'Europe/Warsaw', 'PLN', 50.0647, 19.9450),
('prague', 'Prague', 'Czech Republic', 'CEE', 'Europe/Prague', 'CZK', 50.0755, 14.4378),
('lisbon', 'Lisbon', 'Portugal', 'Med', 'Europe/Lisbon', 'EUR', 38.7223, -9.1393),
('barcelona', 'Barcelona', 'Spain', 'Med', 'Europe/Madrid', 'EUR', 41.3851, 2.1734),
('turin', 'Turin', 'Italy', 'Med', 'Europe/Rome', 'EUR', 45.0703, 7.6869),
('remote', 'Remote', 'Global', 'remote', 'UTC', 'EUR', 0.0000, 0.0000)
ON CONFLICT (slug) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  country = EXCLUDED.country,
  region = EXCLUDED.region,
  timezone = EXCLUDED.timezone,
  currency = EXCLUDED.currency,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng;
