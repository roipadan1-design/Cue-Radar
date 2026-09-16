# CUE RADAR — TASK: PILOT READINESS (mobile-first)

You are working in the repository `roipadan1-design/Cue-Radar` (Next.js 15 App Router · React 19 · TypeScript strict · Tailwind v4 · `@supabase/ssr` · Zod). Production is `https://cue-radar.vercel.app`. Supabase is already connected and the Google-Sheet → Supabase sync (`scripts/sync_sheet_to_supabase.py`, `.github/workflows/sync.yml`) is already delivering live rows to `hub_feed` (the Hub currently shows 4 live deadlines from the sheet).

**Goal of this task:** turn the current skeleton into a site that a real artist can open on a phone, understand in five seconds, browse a full-looking feed, open an opportunity, sign up, save it, and come back. This is the release we will use for a closed pilot with real users. Everything below was reviewed on mobile (390px) and is written in priority order.

Before touching code, read in this order: `AGENTS.md` → `docs/HANDOFF_V3.md` → `docs/ROADMAP.md` (Task 02 decisions table) → `docs/DECISIONS.md` → `docs/OWNER_TASKS.md` → this file. Then commit this file as `docs/tasks/TASK_06_pilot_readiness.md` (if 06 is already taken, use the next free number and update `docs/ROADMAP.md`). Work on branch `task/pilot-readiness`, open **one PR** titled `Task NN: Pilot readiness` against `main`.

---

## 0. Rule changes for this task (explicit, owner-approved)

Two `AGENTS.md` rules are amended by this task. Update `AGENTS.md` in the PR so the rules match what is written here.

**Rule 1 (no fabricated data) — amended.** The owner has decided the pilot needs a full-looking feed before ≥60 verified real calls exist. Fictional demo content is therefore allowed **only** under all of these conditions:
- Demo rows live in a dedicated migration `supabase/migrations/0003_demo_seed.sql`, never in `data/seed/*.csv`, never in the Google Sheet.
- Every demo row has `is_demo = true` (new nullable boolean column, default `false`, added by the migration to `sources`, `opportunities` and `events`). `hub_feed` is recreated (`CREATE OR REPLACE VIEW`) to expose `is_demo`.
- Demo sources are **invented institutions with invented names** (e.g. "Haus Dreizehn", "Studio Perimeter", "Atelier Oblique"). Never attach a fictional call to a real institution — that would mislead a real artist.
- Demo rows render with a small muted `Demo` tag on the row and on the detail page. A signed-in user can never "apply" to a demo row: `apply_url` points to `/demo` — a one-paragraph page explaining that this is sample content while the feed is being curated.
- A single env var `NEXT_PUBLIC_SHOW_DEMO=true|false` (default `true` for the pilot) controls whether `is_demo` rows are returned at all. When the owner has enough real rows, they flip it to `false` and nothing else changes.

**Rule 10 (deferred features) — amended.** Trip Radar v1 (`/radar`) and a minimal events UI are **unblocked** by this task, in the reduced scope defined in §7 below. Everything else in rule 10 stays blocked.

All other `AGENTS.md` rules stay in force: no silent fallbacks, no client-side persistence, no hard-coded lists that exist in the DB, app never writes curated tables, migrations only add, colors/fonts only from CSS variables in `app/globals.css`, no new dependencies, no secrets, no yellow-family colors.

---

## 1. Landing page (`app/page.tsx`) — brand lockup

**Problem:** the mark `間` renders at 96px above a 36px headline. It is out of proportion and reads as a broken image.

**Do:**
- Remove `<Mark size="lg" />` from the landing. Replace it with **one lockup**: the same `[ 間 CUE RADAR ]` wordmark used in the TopBar, but at title height — mark ≈ 28px on mobile / 36px on desktop, wordmark in `.t-title` weight, letter-spacing as in `Wordmark.tsx`. Add a `size` prop to `Wordmark` (`'bar' | 'hero'`) instead of duplicating markup.
- The lockup is **centered** on mobile and left-aligned to the headline on desktop (`md:`). Vertical rhythm: lockup → `--space-7` → headline.
- Keep the existing 400ms fade-in on the lockup (`.animate-mark-fade`), off under `prefers-reduced-motion`. Nothing else animates.
- The mark must never be larger than the `.t-title` cap height on any viewport.

---

## 2. Landing page — headline and copy

**Problem:** the current headline is a description, not a hook.

**Do:** replace the `<h1>` with the line below (default), keep the body copy as a supporting line, and keep the `CITIES` block.

Default headline (use this unless the owner says otherwise):

> **KNOW WHAT'S OPEN.**
> **BEFORE IT CLOSES.**

Two alternates, put them in `docs/DECISIONS.md` for the owner to pick later — do not implement them:
- *Every open call worth your time. Twenty-three cities. One feed.*
- *Your next residency is already open. You just haven't seen it yet.*

Supporting line (replaces the current paragraph):

> Verified open calls, residencies and grants for independent dance, performance and sound artists — across Europe, the Mediterranean and East Asia. Curated by people, not scraped.

Rules: `.t-display`, max two lines on 390px, uppercase as the type system already does, no exclamation marks, no emoji, no gradient text.

---

## 3. Landing page — one call to action, not two

**Problem:** `Enter` and `Browse open calls` both link to `/hub`.

**Do:**
- Keep **one** primary button: `Browse open calls` → `/hub`.
- Remove `Enter`.
- Under the button, one ghost text link: `Sign in` → `/signin` for guests; for a signed-in user replace it with `Go to your saved calls` → `/saved`. Read the session server-side (same pattern as `TopBar.tsx`).
- `CITIES` block: read markets from the `markets` table (server component), not from `data/seed/markets.csv`. Delete the CSV read from the landing; if `lib/seed.ts` is then only used by `/dev/preview` and `groupHubRows`, move `groupHubRows` to `lib/hub.ts` and leave `lib/seed.ts` for the preview route only.

---

## 4. The Hub (`/hub`) — make it look like the product

**Problem:** the Hub is a 4-row list under a giant `4 OPEN DEADLINES` headline. It does not show the vision. We need a feed that feels full, filterable and professional on a phone, with real filtering by money and by professional requirements, expressed as **tags**.

### 4.1 Header (replaces `{n} open deadlines`)
- Row 1 `.t-meta`: `{Weekday D Month}` (keep).
- Row 2 `.t-title` (not `.t-display`): `Opportunities`.
- Row 3 `.t-body text-muted`: `{n} open · {m} closing this week · {k} cities` — all three computed from the result set, never constants. If `m === 0` omit that segment.
- The big number is gone. The page must not scroll a full screen before the first row on 390px.

### 4.2 Filter row = tag chips (mobile-first)
- Directly under the header: a **horizontally scrolling chip row** (`overflow-x: auto`, no scrollbar, `scroll-snap-type: x proximity`) with the quick filters in this order: `No fee` · `Funded` · `Housing` · `Travel` · `Light application` · then the 10 `type` values from `vocab` · then the 7 `discipline` values from `vocab`. City stays in the existing `Filter` sheet (too many values for chips).
- Chip = existing `components/ui/Chip.tsx` extended with `active` and `href` props. Active chip: `bg-fg text-bg`. Inactive: `border-line-strong text-muted`. Tap target ≥ 44px tall including padding.
- Every chip is a `<Link>` that toggles its URL param (`?type=residency`, `?no_fee=true`, `?discipline=sound`, `?effort=light`). Multiple chips can be active at once. Active filters also show a `Reset` link at the end of the chip row. The existing `Filter · n` sheet stays for city and for the same options in select form; both must read the same URL state.
- Filter options come **only** from `markets`/`vocab` props. Zero hard-coded lists.

### 4.3 Effort level (new, computed — no migration)
Add `lib/effort.ts`: `effortLevel(materials_required: string[]) → 'light' | 'medium' | 'heavy'` following the plan (`docs/CUE_RADAR_Product_Plan_v2.md` §2.2):
- `light` — at most `cv`, `bio`, `portfolio`, `video`/showreel link.
- `medium` — + `concept`/motivation letter/short proposal.
- `heavy` — proposal + `budget` and/or `timeline` and/or `references`/`recommendation`.
Map using the `materials` vocab values present in the DB; unknown values count as `medium`. `?effort=light` filters server-side by fetching the rows and filtering in the server component (it is derived, not a column).

### 4.4 Row anatomy (`components/hub/OpportunityRow.tsx`)
Keep the Task 02 anatomy (title first, dividers not boxes) and add **one line of tags** under the meta line:
1. `.t-row` title, 2-line clamp.
2. `.t-body text-muted`: `{source_name} · {city_name}`.
3. **Tag line** (`.t-meta`, muted, dot-separated, wraps to max 2 lines): `{type label}` · `{first 2 discipline labels}` · `{funding text}` · `No fee` (only when `application_fee = 0`) · `Housing` / `Travel` (only when in `covers`) · `{effort label}` · `Demo` (only when `is_demo`).
4. Right side / last line: deadline text (`Closes 28 Sep` / `3 days left` in `--urgent` / `Rolling`), plus `Eligible ✓` for signed-in users when `checkEligibility` says so (keep).
Labels are resolved from `vocab` — pass `vocab` down from the page; never inline strings like `"Residency"`.

### 4.5 Grouping and guest mode
- Keep groups `Closing this week · This month · Later · Rolling` with sticky `<h2>` headers and counts; empty groups not rendered.
- Guest mode: **unlock the rows.** Guests must be able to open every opportunity page (this is how a pilot user decides to sign up). What stays locked for guests is only `Save` (redirects to `/signin?next=`) and the `Eligible` tag. Remove the 8-row lock/banner logic; replace it with a single quiet inline block **after the first group**: `Sign in to save calls and see which ones you're eligible for.` → `/signin`.
- Sort inside groups: deadline asc, rolling last, expired never rendered (view already guarantees this — do not re-filter client-side).

### 4.6 Search (small, real)
- Add a text input above the chip row: placeholder `Search title, institution, city`. Submits to `?q=` and filters server-side with Supabase `.or('title.ilike.%q%,source_name.ilike.%q%,city_name.ilike.%q%')` on `hub_feed`. No client-side fuzzy library. Clear button resets `q` only.

### 4.7 Demo content for the feed (see §0 for the rules)
Write `supabase/migrations/0003_demo_seed.sql` with:
- ~12 demo **sources** across at least 12 markets (Berlin, Cologne, Tel Aviv, Brussels, Vienna, Zurich, Amsterdam, Athens, Tokyo, Seoul, Warsaw, Lisbon, Remote). Invented names, `is_demo = true`, `tier = 2`, `status = 'active'`, `website_url` = `https://cue-radar.vercel.app/demo`.
- **≥ 40 demo opportunities**, `status = 'live'`, `is_demo = true`, `verified_by = 'DEMO'`, `verified_at = current_date`, `apply_url = 'https://cue-radar.vercel.app/demo'`, slugs prefixed `demo-`. Coverage requirements (so every filter has results):
  - all 10 `type` values, each ≥ 3 rows;
  - all 7 `discipline` values, each ≥ 4 rows (rows may carry 1–3 disciplines);
  - deadlines spread: ≥ 6 rows within 7 days of `current_date`, ≥ 10 within 30 days, ≥ 15 later, ≥ 5 rolling (`deadline NULL`). Use `current_date + interval` expressions so the seed stays fresh whenever it is applied;
  - money: ≥ 15 rows with `funding_min/max` in EUR (ranges like 800–1,500 / 2,000–5,000 / 10,000–25,000), ≥ 6 `in_kind`, ≥ 6 `none`; ≥ 30 rows `application_fee = 0`, ≥ 6 with a fee (15–60); `covers` combinations including `housing`, `travel`, `studio`, `per_diem`;
  - `eligibility_geo` mixed: `international`, `EU`, `DE`, `IL`, `NRW`; `career_stage` mixed; `materials_required` spread so all three effort levels appear;
  - `summary` ≤ 200 chars, written like a museum wall label (precise, no marketing adjectives, no exclamation marks). Titles must sound like real calls ("Studio Residency — Spring 2027", "Sound Commission for Public Space", "Choreographic Lab: Duets"), never like placeholder text.
- ≥ 30 demo **events** (see §7) across Berlin, Brussels, Tel Aviv, Vienna, Tokyo, Athens: workshops, classes, performances, exhibitions, festival dates, spread over the next 90 days.
- The migration is idempotent (`ON CONFLICT (pk) DO NOTHING`).
- Add to `docs/OWNER_TASKS.md`: how to apply the migration (SQL editor, in order), how to hide demo rows (`NEXT_PUBLIC_SHOW_DEMO=false` in Vercel), and that the sync script must **skip** rows whose `is_demo = true` on upsert — add that guard to `scripts/sync_sheet_to_supabase.py` (it must never overwrite a demo row and never mark demo rows expired) with a unit test.

---

## 5. Opportunity page (`/opportunities/[slug]`) — tags that filter

**Do:**
- Keep the structure (back link · meta line · trust line · title · fact block · actions · summary · materials).
- Add a **tag block** directly under the title: every tag is a `Chip` with `href` back to the Hub with that filter applied: type → `/hub?type=…`, each discipline → `/hub?discipline=…`, city → `/hub?city=…`, `No fee` → `/hub?no_fee=true`, `Funded` → `/hub?funded=true`, each `covers` value → `/hub?covers_housing=true` etc., effort level → `/hub?effort=…`, career stage as a plain (non-link) chip. Labels from `vocab`.
- Fact block gets two new rows: `Application effort` (`Light · CV + showreel` / `Medium · + motivation letter` / `Heavy · full proposal + budget`) and `Format` (from `format_flags` when present).
- `Demo` rows: `Apply` button label becomes `Sample call — see how it works` and links to `/demo`. `Add to calendar` stays functional.
- `Save` for guests → `/signin?next=/opportunities/{slug}`; after sign-in the user lands back on the same page (verify the `next` param survives the OAuth round-trip).
- Add a `Report a problem with this call` ghost link → `mailto:` address stored in `NEXT_PUBLIC_FEEDBACK_EMAIL` (throw at build if missing, per rule 2). Subject prefilled with the slug.

---

## 6. Sign-up and sign-in that actually work

**Problem:** the owner cannot sign up or sign in on production. The code paths exist (`/signin`, `/signup`, `app/auth/callback/route.ts`, Google / Apple / email+password / magic link) but the flow does not complete.

**Do — diagnose first, then fix, then prove:**
1. Verify `lib/supabase/client.ts` and `lib/supabase/server.ts` throw a named error when `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` are missing (rule 2) and that they are set in Vercel for **Production and Preview**. Add a `/api/health` route that returns `{ supabase: 'ok' | 'missing_env' | 'unreachable', session: boolean }` with no secrets, so the owner can check production in one tap.
2. Add `middleware.ts` (root) using `@supabase/ssr` `createServerClient` to refresh the session cookie on every request and to protect `/saved` and `/profile/edit` (redirect to `/signin?next=`). Without this, sessions from the OAuth callback are not persisted reliably in the App Router.
3. **Providers for the pilot:** Google + email/password + magic link. **Hide the Apple button** unless `NEXT_PUBLIC_AUTH_APPLE=true` — Apple Sign-In requires a paid developer account and a Services ID; it is not configured and a dead button costs trust.
4. `/signup`: email + password + full name (`raw_user_meta_data.full_name`, used by the signup trigger). After submit: if Supabase "Confirm email" is on, show `Check your inbox to confirm` and explain; if off, redirect to `/profile/edit?welcome=1`.
5. Sign-in errors must be human: map Supabase messages (`Invalid login credentials`, `Email not confirmed`, `User already registered`) to plain sentences under the form.
6. After first sign-in, if the profile has no `role_label`/`disciplines`, redirect once to `/profile/edit?welcome=1` with a one-line banner `Add your disciplines so we can show what you're eligible for.`
7. TopBar: signed-in state shows initials (or avatar) linking to `/profile/edit`, and `Sign out`. Mobile nav highlights the active tab.
8. Write the **exact** owner checklist into `docs/OWNER_TASKS.md` (dashboard paths, not prose): Authentication → Providers → Google (Client ID/Secret from Google Cloud, authorised redirect URI `https://<project-ref>.supabase.co/auth/v1/callback`), Authentication → URL Configuration (Site URL `https://cue-radar.vercel.app`, Redirect URLs: `https://cue-radar.vercel.app/auth/callback`, `https://*-roipadan1-design.vercel.app/auth/callback`, `http://localhost:3000/auth/callback`), Authentication → Email → "Confirm email" (recommend **off** for the pilot, on later), and the Vercel env vars list.
9. **Proof in the PR:** a recorded manual run on a Vercel preview URL at 390px: sign up with email → land on profile edit → go to Hub → open a call → Save → see it in Saved → change status → sign out → sign in with Google → Saved still there. Screenshots of each step. If a step cannot be completed because of a dashboard setting, say exactly which one and stop — do not stub it.

---

## 7. Navigation: rename Pipeline, bring back Trip Radar

**Problem:** `Pipeline` means nothing to an artist. And the product has a third pillar — Trip Radar: "I'm in a city for a few days, what's on that would interest me professionally or just for inspiration?" — that is currently invisible.

### 7.1 Nav
- Bottom nav (mobile) and TopBar (desktop) become **four** items in this order: `Hub` · `Radar` · `Saved` · `Profile`.
- `/saved` page title becomes `Saved calls`. Status tabs stay (`Saved · Drafting · Submitted · Accepted · Rejected`) — keep the word "pipeline" only in code/DB, never in UI.
- `Profile` for a guest → `/signin?next=/profile/edit`.

### 7.2 Trip Radar v1 (`app/radar/page.tsx`, `app/radar/[city]/page.tsx`)
Reduced scope for the pilot — no trips table, no visibility settings, no "artists in town":
- `/radar`: title `Radar`, one line `What's on where you'll be.`, a city selector (markets from DB, grouped by `region`) and a date range (`from`/`to`, defaults today → +14 days). Submitting goes to `/radar/{city}?from=&to=`.
- `/radar/[city]`: header `{city_name} · {from} – {to}` and three sections, each a dense list with dividers, empty groups not rendered:
  1. **Closing while you're there** — rows from `hub_feed` where `city = slug` and `deadline` between `from` and `to` (same `OpportunityRow` component).
  2. **Workshops & classes** — rows from `events` where `market = slug`, `date` between `from`/`to`, `event_type in ('workshop','class','lab','masterclass')`. Row: title · venue · date/time · price (`Free` when `price_min = 0`) · ticket link.
  3. **On stage & exhibitions** — remaining `event_type` values (`performance`, `concert`, `showing`, `exhibition`, `festival`, `talk`, `club`). Same row.
- Event `event_type` values come from `vocab` (`event_type` category) — if the category is missing in the DB, add it in `0003_demo_seed.sql` to `vocab` with the values already listed in the sheet's `vocab` tab (`performance, concert, club, showing, talk, …`) and log it in DECISIONS.
- `Demo` tag on demo events. `Add to calendar` per event via a new `app/events/[id]/ics/route.ts` reusing the ICS builder from the opportunity route.
- Signed-in extra (small): if `profiles.current_city` and `current_city_from/until` are set, `/radar` pre-fills city and dates from the profile.

---

## 8. Small things that block a pilot

- `app/not-found.tsx`: keep, but add a link back to `/hub`.
- `app/demo/page.tsx`: one paragraph — what demo rows are, that real calls are being verified city by city, and a link to `/hub`.
- `app/layout.tsx` metadata: `title` template `%s · Cue Radar`, real `description`, `openGraph` defaults, `theme-color` from `--bg`. Confirm `/opportunities/[slug]/opengraph-image.tsx` renders for a demo slug.
- Footer: remove the `docs/HANDOFF_V3.md` GitHub link from production UI (it is an internal doc); replace with `About` (anchor to the landing supporting line for now) · `Report a problem` (mailto) · `Privacy` (a one-paragraph `/privacy` page stating what is stored: email, profile fields, saved calls; nothing sold; delete-on-request via the feedback email).
- Two sync workflows exist (`.github/workflows/sync.yml` and `data_sync.yml`) with the same cron. Keep `sync.yml`, delete `data_sync.yml`, record in DECISIONS.
- `lucide-react` is a dependency: use it for the four nav icons (`Radar`, `Bookmark`, `User`, `LayoutList`) at 20px, muted/active states from tokens. No other icons.
- Every page renders correctly at 375px and 390px with the bottom nav (`pb` for `env(safe-area-inset-bottom)`), and every interactive element has a ≥ 44px tap target.
- Accessibility stays: focus ring `2px solid var(--fg)`, group headers `<h2>`, row titles `<h3>`, contrast ≥ 4.5:1 (recompute for any new muted-on-surface combination and log the numbers in DECISIONS).

---

## 9. Order of work

1. §0 rule amendments in `AGENTS.md` + commit this task file.
2. §6 auth (it unblocks proving everything else). Stop and report if a dashboard setting is missing.
3. Migration `0003_demo_seed.sql` (`is_demo` columns, view recreate, vocab `event_type`, demo sources/opportunities/events) + sync-script guard + unit test.
4. §4 Hub (header, chips, effort, row tags, search, guest unlock).
5. §5 opportunity page tags.
6. §7 nav rename + Trip Radar v1.
7. §1–§3 landing.
8. §8 small things.
9. Verification (§10), screenshots, DECISIONS, OWNER_TASKS, ROADMAP status row.

Do not reorder to "do the landing first because it is easy". Auth and data are the blockers.

---

## 10. Verification (paste raw output in the PR — prose is not proof)

```bash
npm ci && npm run lint && npm run build
python -m unittest discover -s scripts
# guardrails
grep -rn "localStorage\|sessionStorage\|FALLBACK_\|: any" app components lib || echo OK_no_client_persistence
grep -rnE "#[0-9A-Fa-f]{6}" app components --include=*.tsx | grep -v opengraph-image || echo OK_no_hex_in_tsx
grep -rniE "yellow|amber|lime|D7FF3F" app components lib || echo OK_no_yellow
grep -rn "Pipeline" app components | grep -v "pipeline_status\|PipelineStatus\|SavedPipelineView" || echo OK_no_pipeline_label
grep -rn "Enter" app/page.tsx || echo OK_single_cta
grep -rn "size=\"lg\"" app/page.tsx || echo OK_no_giant_mark
grep -rn "HANDOFF_V3" components/layout/Footer.tsx || echo OK_no_internal_link
ls middleware.ts app/api/health/route.ts app/radar/page.tsx "app/radar/[city]/page.tsx" app/demo/page.tsx app/privacy/page.tsx lib/effort.ts supabase/migrations/0003_demo_seed.sql
grep -c "INSERT INTO public.opportunities" supabase/migrations/0003_demo_seed.sql   # ≥ 1, and ≥ 40 rows inside
grep -n "is_demo" scripts/sync_sheet_to_supabase.py
```

Manual checklist at 390px on a Vercel preview URL (attach screenshots, in this order):
1. `/` — lockup proportional, one CTA, headline two lines.
2. `/hub` — header with computed counts, chip row scrolls, ≥ 40 rows across all groups, `Demo` tags visible.
3. `/hub?type=residency&no_fee=true` — chips active, rows filtered, `Reset` visible.
4. `/hub?effort=light` — only light rows.
5. `/hub?q=sound` — search works.
6. `/opportunities/{demo-slug}` as guest — tags clickable, Save → `/signin?next=…`.
7. Sign-up with email → profile edit welcome banner.
8. Save → `/saved` shows it under `Saved`; change to `Drafting`.
9. `/radar` → `/radar/berlin?from=&to=` — three sections populated.
10. Sign out → sign in with Google → `/saved` unchanged.
11. `/api/health` on production returns `supabase: ok`.

If any item cannot pass, the PR description states which one, why, and exactly what the owner must do — nothing gets stubbed, hidden behind a fake success state, or postponed silently.

---

## 11. Do not

- Do not invent real institutions' calls, real artists, or real people. Demo content is fictional and labelled.
- Do not add dependencies (no component libraries, no state libraries, no icon packs beyond `lucide-react`).
- Do not write to `markets`, `vocab`, `sources`, `opportunities`, `events` from the app.
- Do not put descriptions/summaries on Hub rows.
- Do not build trips, follows, intros, peer calls, digests, Fit score changes, or the agent pipeline.
- Do not change design tokens, fonts, or the accent colour.
- Do not touch the Google Sheet structure or the sync tab names.
