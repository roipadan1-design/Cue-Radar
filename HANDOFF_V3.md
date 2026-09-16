# Cue Radar — HANDOFF v3 (supersedes v1 and v2)
Written 2026-09-10 after reading every file in `github.com/roipadan1-design/Cue-Radar` (28 files, ~10,400 lines, 14 commits). Commit this file to the repo as `docs/HANDOFF_V3.md` so the agent can read it.

---

## PART A — WHAT THE REPO ACTUALLY IS (state report)

The previous handoffs described a Next.js + Supabase + Sheet-sync app. **That app does not exist.** What exists:

| Layer | Reality |
|---|---|
| Framework | **Vite 6 SPA**: `index.html` (617 lines) + `src/main.js` (1,577 lines vanilla DOM) + one React island (`UserProfileRadar.tsx`, 980 lines) + `style.css` (2,761 lines). No router, no SSR, no routes. Tailwind v4 installed, barely used. |
| Data | **Hard-coded in `src/data.js`**: 57 sources (not 268) and 16 opportunities. Duplicated in `public/data/*.json` which the app never fetches. A CSV-import modal writes sources/opportunities into `localStorage` — per-browser only. |
| The 16 opportunities | Every `application_url` is an institution homepage, not a call page. Descriptions read as generated. **Treat all 16 as unverified drafts, not live data.** |
| "Crawler" | `scripts/crawl-opportunities.js` + Action every 3 days. It crawls nothing — it only deletes rows whose deadline passed >14 days ago and rewrites metadata. Has a `GEMINI_API_KEY` secret it never uses. |
| Sheet → Supabase sync | **Does not exist.** Nothing reads the Google Sheet. |
| Supabase | `supabase/schema.sql` creates only `profiles`, `radar_preferences`, `user_saved_opportunities` (+RLS, +signup trigger). **No `sources`, `opportunities`, `markets`, `events`, `vocab`, no `hub_feed` view.** `VITE_SUPABASE_*` env vars are empty in `.env.example` → the client is `null` at runtime → every profile call falls back to `localStorage`. |
| Auth | **Firebase Auth** (Google popup) with four Google Drive scopes. Supabase RLS keys on `auth.uid()` — a Firebase user has no Supabase session, so even with env vars set, every Supabase write would be rejected. Two auth systems that never meet. |
| Profile | Always loads `fetchUserProfile('guest-artist-uuid')` → `DEFAULT_PROFILE` ("Elena Rostova", Unsplash photos) or localStorage. Sidebar hard-codes "Roi Padan". Nothing is per-user, nothing is shareable. |
| Google Drive | `src/drive.js` (list/upload files) wired to the Firebase token. Out of product scope. |
| Hub count "bug" | Not a bug. `Showing 9` / `16 Calls` are static placeholders in `index.html` that JS overwrites on load. The earlier diagnosis (from a JS-less fetch) was wrong. |
| Secrets | `firebase-applet-config.json` commits a Firebase web API key + OAuth client ID. Normal for Firebase web apps, but it will be deleted with Firebase anyway. `.gitignore` correctly excludes `.env*`. |
| AI Studio leftovers | `metadata.json`, `firebase-applet-config.json`, `public/assets/aistudio/`, `@google/genai`, `express` — scaffolding from the AI Studio applet builder. |

**Salvageable:** the 57 sources (real institutions, real websites — seed for the sheet), the RLS/trigger patterns in `schema.sql`, the visual direction of the profile component, the product copy.
**Not salvageable:** the data layer, auth, crawler, Drive, the two 1,500–2,700-line files.

## PART B — DECISION: REBUILD ON NEXT.JS IN THE SAME REPO

Rationale: the product needs shareable server-rendered routes (`/a/[handle]`, `/opportunities/[slug]` with OG images), an `.ics` endpoint, one auth system, and a real data pipeline. None of that is a patch on a vanilla-JS SPA. The existing code is <2 weeks of generated glue; rewriting is cheaper than untangling. Vercel auto-detects Next.js, so the deployment target stays.

Branch strategy: agent works on `rebuild/nextjs`, opens one PR per phase against `main`. `main` keeps serving the old site until the owner merges.

---

## PART C — PRODUCT (unchanged)

Career OS for independent contemporary dance, performance and experimental sound artists across ~23 European / Mediterranean / East-Asian alternative scenes. Three pillars: (1) verified opportunities feed with deadlines — **the Hub**; (2) **Trip Radar** — what's on / closing in a city while the artist is there; (3) shareable editorial **artist profile**.

Design register: dark editorial — Resident Advisor / Are.na / Ableton. Mono for metadata, one display face for titles, no descriptions on cards, dense lists not boxes.

---

## PART D — TARGET ARCHITECTURE

```
Google Sheet (source of truth, human-curated)
   └─ GitHub Action, Python, every 6h + manual  ──►  Supabase Postgres (mirror)
                                                       ├─ markets, vocab, sources, opportunities, events   (read-only to app)
                                                       ├─ view hub_feed                                     (app reads ONLY this)
                                                       ├─ profiles, radar_preferences, user_saved_opportunities (user-owned, RLS)
                                                       └─ Supabase Auth (Google) + Storage bucket avatars
Next.js 15 App Router + Tailwind v4 on Vercel  ◄──  anon key, @supabase/ssr
```

### Data model (`supabase/migrations/0001_core.sql` — the agent writes this; the old `schema.sql` is folded in)
```
markets(slug PK, display_name, country, region, timezone, currency, lat, lng)
vocab(category, value, label, sort_order, PK(category,value))
sources(source_id PK, name, source_type, market→markets, discipline_focus text[], tier int 1-3,
        website_url, opencalls_url, instagram_url, scrape_method, status active|dormant|closed,
        needs_verification bool, notes)
opportunities(opp_id PK, source_id→sources, title, slug UNIQUE, summary text (≤200), type, discipline_flags text[],
        city→markets, deadline date NULL=rolling, funding_min numeric, funding_max numeric, currency,
        funding_type, covers text[], application_fee numeric NOT NULL DEFAULT 0, eligibility_geo text[],
        career_stage, materials_required text[], apply_url, status draft|approved|live|expired|archived,
        verified_at date, verified_by, created_at, updated_at)
events(event_id PK, market→markets, venue_name, title, event_type, disciplines text[], date, time,
        price_min numeric, ticket_url, lat, lng)
profiles(id PK = auth.users.id, handle UNIQUE, full_name, role_label, bio, avatar_url, locations text[],
        current_city→markets, current_city_from date, current_city_until date, disciplines text[],
        showreel_url, social_links jsonb, open_for_collab bool, available_from date, is_public bool DEFAULT false,
        created_at, updated_at)
radar_preferences(user_id PK→profiles, tracked_markets text[], tracked_types text[], tracked_disciplines text[],
        eligibility_geo text[], alert_frequency instant|weekly|high_priority_only)
user_saved_opportunities(user_id→profiles, opp_id→opportunities, pipeline_status saved|drafting|submitted|accepted|rejected,
        notes, saved_at, PK(user_id, opp_id))

view hub_feed AS
  select o.*, s.name as source_name, m.display_name as city_name, m.region,
         (o.deadline - current_date) as days_left, (o.deadline is null) as is_rolling
  from opportunities o join sources s using (source_id) left join markets m on m.slug = o.city
  where o.status = 'live' and (o.deadline is null or o.deadline >= current_date);
```
RLS: `markets/vocab/sources/opportunities/events/hub_feed` → `select` for anon+authenticated, no write policies (service role bypasses). `profiles` → select if `is_public or auth.uid()=id`; update/insert own. `radar_preferences`, `user_saved_opportunities` → all ops where `auth.uid()=user_id`. Storage bucket `avatars`: public read; insert/update where first folder = `auth.uid()`.

Signup trigger: on `auth.users` insert → `profiles(id, handle='u_'||left(id::text,8), full_name from metadata, is_public=false)` + default `radar_preferences`. Handle constraint: `^[a-z0-9][a-z0-9_-]{2,29}$`.

### Controlled vocabularies (sheet tab `vocab`; seed the `vocab` table with these)
```
type:          open_call, residency, grant, co_production, commission, festival_submission, award, lab_workshop, audition_job, mentorship
discipline:    dance, choreography, performance, sound, live_electronics, installation, interdisciplinary
funding_type:  cash_grant, artist_fee, stipend, production_budget, in_kind, none
covers:        housing, travel, studio, tech, mentorship, per_diem, presentation
career_stage:  emerging, mid, established, any
region:        DACH, Benelux, France, Nordics, Med, CEE, Caucasus, East_Asia, remote
```
Market slugs (seed `markets`; derive from the 22 markets in `public/data/sources.json` metadata + `tel_aviv`): `berlin, cologne, tel_aviv, brussels, vienna, zurich, amsterdam, paris, lyon, stockholm, oslo, copenhagen, athens, tbilisi, tokyo, seoul, warsaw, krakow, prague, lisbon, barcelona, turin` (+ `remote`). Fill country/region/timezone/currency/lat/lng from general knowledge — these are facts, not fabrication.

### Legacy → new mapping (for the seed CSVs the agent generates from `public/data/sources.json`)
| legacy | new |
|---|---|
| `source_name` | `name` |
| `market` "Köln / Cologne" → `cologne`, "Tel Aviv / Israel" → `tel_aviv`, others lower-snake | `market` |
| `discipline_focus` "Dance" → `{dance}`, "Experimental Sound" → `{sound,live_electronics}`, "Multidisciplinary" → `{interdisciplinary}` | `discipline_focus[]` |
| `needs_verification` | `needs_verification`, and `status = 'active'` |
| — | `tier = 2` default |
| legacy opportunities `type` "Funding" → `grant`, "Residency" → `residency`, "Open Call" → `open_call` | `type` |
| legacy opportunities → **`opportunities_staging.csv` with `status=draft`, `verified_at` blank**. Never into `opportunities` as live. |

---

## PART E — ROUTES & SCREENS

```
app/layout.tsx                          root: fonts, tokens, nav, session provider
app/page.tsx                            Hub
app/opportunities/[slug]/page.tsx       detail + save + apply + "add to calendar"
app/opportunities/[slug]/ics/route.ts   text/calendar
app/opportunities/[slug]/opengraph-image.tsx
app/a/[handle]/page.tsx                 public profile (404 unless is_public or owner)
app/a/[handle]/opengraph-image.tsx
app/profile/edit/page.tsx               protected
app/saved/page.tsx                      protected pipeline board
app/radar/[city]/page.tsx               v1: deadlines closing in ?from=&to= + public profiles with current_city overlap
app/auth/callback/route.ts
app/not-found.tsx
lib/supabase/{client,server,middleware}.ts   (@supabase/ssr)
lib/vocab.ts                            typed helpers over the vocab table
components/hub/{FilterBar,OpportunityRow,DeadlineChip,EmptyState}.tsx
components/profile/{ProfileForm,ProfileCard,ShowreelEmbed}.tsx
scripts/sync_sheet_to_supabase.py, scripts/requirements.txt, scripts/README.md
.github/workflows/sync.yml
data/seed/{markets.csv,vocab.csv,sources.csv,opportunities_staging.csv}   generated from legacy data, for pasting into the sheet
supabase/migrations/0001_core.sql, 0002_seed_vocab_markets.sql
docs/OWNER_TASKS.md                     everything only the human can do, kept current by the agent
```

### Hub rules
- Server component fetches `hub_feed` ordered `deadline asc nulls last`. Client filters in `useMemo`; filters mirrored to URL (`?city=berlin&type=residency&discipline=sound`).
- Filter options come from `markets` and `vocab`. **Zero hard-coded option lists.**
- Counts: `Showing {filtered} of {all}`; hero number = `all.length` (live deadlines) — never a constant. Remove "268 verified sources" everywhere.
- Empty state has two variants: *no rows at all* ("the feed is being curated — check back") vs *no match* (reset button).
- Sort: deadline asc; rolling always last; expired never rendered.
- **Card anatomy (exact):** row 1 mono small: type label · funding (`€2,000–5,000` / `Fee` / `In-kind` / `—`) · row 2: **title** (only large text) · row 3 mono: source_name · city_name · row 4: deadline chip (>30d neutral, 7–30d accent, <7d urgent, `Rolling`) · row 5: eligibility chip (first `eligibility_geo` or "Any") + save icon. **No summary on the card.**

### Profile rules
Edit form fields → `profiles` columns above. Validation with zod. Avatar → `avatars/{uid}/avatar.webp`, client-resized to 800px, ≤2 MB. Showreel: Vimeo/YouTube URL only, rendered privacy-enhanced. `is_public` default off with a warning when enabling. Public page: max-width 720, avatar 96, name in display face, everything else mono; badges "Open for collab", "Available from {date}", location line with current_city dates if set; "Share" copies URL; owner sees "Edit".

### Design tokens (`app/globals.css`)
```
--bg #0B0B0C  --surface #141416  --line #26262A  --fg #EDEDED  --muted #8A8A93
--accent #D7FF3F (7–30d)  --urgent #FF5A3C (<7d)
display: "Inter Tight" 600 (titles only)   mono: "JetBrains Mono" 400 (all metadata)
radius 4px · 1px borders · no shadows/gradients · 8px grid · mobile-first at 375px · focus rings visible · contrast ≥4.5:1
```

### Sync script spec (`scripts/sync_sheet_to_supabase.py`, Python 3.11, gspread + supabase + pydantic)
1. Auth via `GOOGLE_SERVICE_ACCOUNT_JSON`; open `GOOGLE_SHEETS_ID`; read tabs `vocab, markets, sources, opportunities, events`.
2. Validate rows against Part D + vocab. Multi-value cells split on `,`. Dates `YYYY-MM-DD`. `application_fee` numeric, blank = error.
3. `opportunities`: sync only `status in (approved, live)` and `sync_ready == YES`; log skips.
4. Upsert order `vocab → markets → sources → opportunities → events`, `on_conflict` on PK. **Never delete.**
5. Then `update opportunities set status='expired' where status='live' and deadline < current_date`.
6. Print per-tab summary + live count per market. Exit 1 on validation failure of a required tab. `--dry-run` flag.
Workflow: `cron 0 */6 * * *` + `workflow_dispatch`; secrets `SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GOOGLE_SHEETS_ID, GOOGLE_SERVICE_ACCOUNT_JSON`; upload summary as artifact. **Delete `cue-radar-crawler.yml`.**

---

## PART F — ENV VARS (names only, never values)
| Where | Names |
|---|---|
| Vercel + `.env.local` | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL` |
| GitHub Actions secrets | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `GOOGLE_SHEETS_ID`, `GOOGLE_SERVICE_ACCOUNT_JSON` |
| Optional, lets the agent apply migrations itself | `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_REF`, `SUPABASE_DB_PASSWORD` (for `supabase link` + `db push`) |

## PART G — WHAT ONLY THE OWNER CAN DO (the agent maintains `docs/OWNER_TASKS.md`)
1. Create the Supabase project (or confirm the existing one), enable Google provider in Auth, add the Vercel + local callback URLs.
2. Put the env vars above in Vercel and GitHub. Optionally give the agent `SUPABASE_ACCESS_TOKEN` so it can run migrations; otherwise paste `supabase/migrations/*.sql` into the SQL editor in order.
3. Create a Google Cloud service account, share the sheet with it (Viewer), paste its JSON into the `GOOGLE_SERVICE_ACCOUNT_JSON` secret.
4. In the sheet: delete example rows; paste `data/seed/markets.csv`, `vocab.csv`, `sources.csv` into the matching tabs; paste `opportunities_staging.csv` into `opportunities_staging`.
5. **Verify opportunities**: open each `apply_url`, fix it to the actual call page, fill `deadline`, `verified_at`, set `status=live`, move to `opportunities`. Target ≥60 across Cologne, Berlin, Brussels, Tel Aviv, Vienna, Amsterdam. This is the only way the Hub gets real content.
6. Trigger the sync Action manually once; confirm the Hub shows rows.
7. Merge PRs from `rebuild/nextjs` in order; in Vercel confirm Framework Preset = Next.js.
8. Delete the Firebase project when Phase 3 is merged.

## PART H — NEVER
Fabricate opportunities, sources, profile text or people. Write to curated tables from the app. Delete rows or drop tables with data. Hard-code filter options, market names or counts. Put descriptions on Hub cards. Commit any secret. Keep Firebase, Drive, or the crawler.
