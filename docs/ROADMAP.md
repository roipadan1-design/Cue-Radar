# Cue Radar — Roadmap and task ledger

Reconstructed 2026-09-15 from `docs/HANDOFF_V3.md`, `docs/CUE_RADAR_Product_Plan_v2.md`, `docs/tasks/TASK_01_*.md`, the Task 02 spec, and PR #3 / PR #6. Sections marked **(recorded)** are taken from documents in the repo or from the Task 02 spec. Sections marked **(reconstructed)** are best-effort drafts of material that was planned but never committed; the owner should review them before they become task files.

This file is the single index of where the project is going. If a task file and this file disagree, the task file wins for that task; update this file in the same PR.

---

## 0. Where the truth lives

| Question | File |
|---|---|
| What is the product, the architecture, the data model, the "never" list | `docs/HANDOFF_V3.md` |
| Product vision, feature specs beyond v1, phases P1–P7, open questions | `docs/CUE_RADAR_Product_Plan_v2.md` (Hebrew) |
| Rules every coding agent must follow | `AGENTS.md` |
| The exact scope of each task | `docs/tasks/TASK_NN_*.md` |
| Judgment calls made by agents | `docs/DECISIONS.md` |
| Things only the owner can do | `docs/OWNER_TASKS.md` |
| Market research | `docs/RESEARCH_market_scan.md` |
| Sequence and status of everything | this file |

**Rule going forward:** no task is sent to an agent before its task file is committed to `docs/tasks/`. The chat is not a source of truth.

---

## 1. Working method (recorded)

- One task file → one branch → one PR titled `Task NN: <name>`, against `main`.
- The task file says exactly what is in scope and ends with an **Out of scope** list and a **Verification** block. The PR description must end with the raw output of the verification block; prose is not proof.
- Screenshots at 390px are attached when the task changes anything visual.
- Any judgment call goes to `docs/DECISIONS.md` under `## Task NN`. Anything requiring the owner goes to `docs/OWNER_TASKS.md`.
- PRs are merged in order. Each task's base is `main` after the previous task is merged.
- Hard rules (AGENTS.md): no fabricated data, no silent fallbacks, no client-side persistence, no hard-coded lists that live in the DB, app never writes to curated tables, migrations only add, all colors/fonts from CSS variables, no new dependencies without the task saying so, no secrets, no deferred features.
- **AGENTS.md needs one addition** (referenced by Task 02 as "rule 10" but not yet in the file): *No yellow-family color anywhere — no yellow, amber, lime, chartreuse. `#D7FF3F` must not appear in any file.*

---

## 2. Phases → tasks

The product plan defines seven phases. Tasks are the unit of work; each belongs to a phase.

| Phase | Goal | Success metric | Tasks |
|---|---|---|---|
| **P1 · Foundation** | Schema, sync, seed, clean repo, design system | Sync runs green; Hub shows ≥60 live rows | 01, 02, 03, 05 |
| **P2 · Hub v1** | List, filters, detail, save, ICS, auth, Fit, No-fee/Funded toggles, trust stamps | A new artist finds and saves a call within 60 seconds on mobile | 04, 06, 07, 08 |
| **P3 · Profile v2** | Full profile brief (plan §4) + say-hi via email handoff | 20 real public profiles | 09, 10 |
| **P4 · Trip Radar pilot** | trips + 6 cities × ~15 manual event sources + Trip screen + trip brief | An artist travelling to Berlin finds ≥10 relevant workshops/shows for their dates | 11, 12 |
| **P5 · Agent** | `scan_events` daily + `scan_opportunities` every 3 days → staging → approval | ≥70% of agent-proposed rows approved without edits | 13, 14 |
| **P6 · Connect** | In-app intros, peer calls, follows, digest | 30% of active users sent or received an intro in a month | 15–18 |
| **P7 · Scale** | 23 cities, Pro tier, institutions, Circles | — | later |

---

## 3. Task ledger

### Task 01 — Cleanup and foundation (recorded · merged as PR #3)

**Scope:** remove everything that is not the product, fix build config, establish design token *names*, neutral shell, repository guardrails. No visual design, no Supabase.

What it did:
- Deleted `new-design/`, `next.config.ts`, `public/data/`, `app/[handle]/page.tsx`, `lib/savedOpportunities.ts`.
- Moved `HANDOFF_V3.md` → `docs/HANDOFF_V3.md`, research file → `docs/RESEARCH_market_scan.md`.
- `next.config.mjs` with only `images.remotePatterns` for `**.supabase.co`; no `ignoreBuildErrors`. Flat `eslint.config.mjs`. Scripts `dev/build/start/lint`. `.env.example` with three keys. `.gitignore`.
- `app/globals.css` with tokens `--bg --surface --line --fg --muted --accent --urgent --radius` exposed through `@theme inline`. Token names are final; values were placeholders.
- Fonts at that point: Inter Tight (display) + JetBrains Mono (body). Both replaced in Task 02.
- Shell: `TopBar`, `MobileNav`, `Footer`, `hub/EmptyState`, `ui/Chip`. Pages `/` (Opportunities + empty state), `/saved` (Pipeline + empty state), `not-found`.
- `.github/workflows/ci.yml`, `docs/tasks/`, `docs/DECISIONS.md` entry.

**Verification:** `npm ci && npm run lint && npm run build`, Python unit tests, greps for deleted paths / `localStorage` / `FALLBACK_` / hex in tsx / second `package.json`.

---

### Task 02 — Structure, typography and UX of every page (recorded · PR #6, in review)

**Scope:** typographic system, spacing, layout shell, structure of all seven pages, mobile-first, components with real typed props. Pages needing data render their designed empty state. Dev-only preview route with staging rows. Not in scope: brand identity (03), Supabase/auth (04), seed/sync (05).

**Product decisions made in this task that supersede HANDOFF_V3 Part E** — this is the part most likely to be lost, so it is spelled out:

| Topic | HANDOFF_V3 said | Task 02 decided |
|---|---|---|
| Register | Dark editorial, RA / Are.na / Ableton, mono metadata | Museum wall label: precise · quiet · curated. Not cluttered, generic, robotic, or "AI-generated" |
| Fonts | Inter Tight 600 + JetBrains Mono 400 | **Archivo 800** (display, uppercase) + **Manrope 400/500/600** (body). No monospace anywhere. Numbers use `tabular-nums` |
| Type scale | — | `.t-display` 36/64 · `.t-title` 22/28 · `.t-row` 17/18 · `.t-body` 15/16 · `.t-meta` 11/12 uppercase muted · `.t-num` |
| Tokens | `#0B0B0C / #141416 / #26262A / #EDEDED / #8A8A93 / #D7FF3F / #FF5A3C`, radius 4 | `#0A0A0A / #111111 / line #1F1F1F + line-strong #2E2E2E / #F2F2F2 / #8C8C8C /` **accent placeholder = fg** `/ urgent #E5484D true red`, radius **2px**, spacing scale `--space-1..8` (4→64) |
| Accent | Lime `#D7FF3F` for 7–30d chips | **No yellow family ever.** Accent chosen in Task 03. Until then primary button is white on black. Accent in at most one place per screen: primary action *or* urgent deadline, never both, never decorative |
| Surfaces | 1px borders, chips | **Dividers, not boxes.** `--surface` only for top bar, bottom nav, sheets, empty-state block. Row hover = surface background only |
| Routes | `/` = Hub | **`/` = landing (guest)**, **`/hub` = feed**, `/saved` = Pipeline, `/signin`, `/profile/edit`, `/a/[handle]`, `/opportunities/[slug]`, `/dev/preview` |
| Nav | Hub · Saved | **Hub · Pipeline · Profile**; wordmark `CUE RADAR` placeholder in `.t-meta` until Task 03 |
| Card anatomy | 5 rows: type·funding / title / source·city / deadline chip / eligibility chip + save icon | **Title first** (`.t-row`, 2-line clamp) → source · city → funding (`.t-num`) → deadline as **text**, muted; `< 7 days` in `--urgent` ("3 days left"). No eligibility chip on the row, no icon. Locked (guest) row = title only, muted, not a link |
| Hub groups | Sorted list | Grouped: **Closing this week (≤7) · This month (≤30) · Later · Rolling**; sticky `<h2>` group headers with counts; empty groups not rendered |
| Guest mode | — | All rows locked; after 8 rows an inline block "Sign in to see deadlines, funding and how to apply." with the rest still listed below |
| Filters | Client `useMemo`, URL-mirrored | Same; mobile = one `Filter · n` button → bottom sheet (`<dialog>`, no library); desktop = inline selects; options only from `markets`/`vocab` props; Reset link only when active |
| Landing copy | — | Headline: *Open calls, residencies / and grants for independent / dance, performance and sound.* Body: *A curated feed across European and Mediterranean scenes. Verified by people, not scraped. Built for artists who work between cities.* Buttons: **Enter** (primary) · *Browse open calls* (ghost). Then `CITIES` + market names read from `data/seed/markets.csv` at build time via `lib/seed.ts` |
| Detail page | detail + save + apply + add to calendar | Back link · meta line `{type label} · {source} · {city}` · sentence-case title · fact block (Deadline, Funding, Covers chips, Eligibility, Career stage, Application fee, Verified) · summary · materials list with rules · mobile sticky bar `Apply on {hostname}` + `Save`, `Add to calendar` ghost. `notFound()` for every slug until Task 04 |
| Pipeline | Board | Status tabs `Saved · Drafting · Submitted · Accepted · Rejected` in `?status=`, counts only when computed; rows + 1-line notes excerpt + `Expired` chip |
| Profile page | avatar 96, name display, rest mono, badges | avatar **72** (`--radius`), initials fallback on `--surface`; name `.t-title`; `{role} · {locations}` in `.t-meta`; status lines as plain text (no chips); bio 60ch; showreel privacy-enhanced 16:9; links as ghost row; `Share` copies URL; owner sees `Edit`. `notFound()` until Task 04 |
| Profile edit | — | Single column of `Field`s in fixed order; zod schema in `lib/schemas/profile.ts`; sticky bar Save (disabled until Task 04) + View profile |
| Sign in | — | `/signin`: title, one line of copy, `Continue with Google` (disabled until 04), Back |
| Motion | — | **None** except row-hover background 120ms and sheet open/close 200ms, both off under reduced motion. Mark animation is Task 03; landing has `<div id="mark-slot" />` |
| Accessibility | contrast ≥4.5:1, focus rings | + tap targets ≥44px, focus ring `2px solid var(--fg)` offset 2px, sheet traps focus, group headers `<h2>`, row titles `<h3>` |
| Types | — | `lib/types.ts` derived from `0001_core.sql`: `HubFeedRow, OpportunityDetail, Profile, SavedRow, Market, VocabEntry, PipelineStatus`. No `any` |
| Preview | — | `/dev/preview` (404 in production) renders every component with real staging rows, labelled `DRAFT`, no invented values |

**Verification:** lint/build/tests + greps: no `JetBrains|Inter_Tight|font-mono`, no hex in tsx, no `localStorage|FALLBACK_|: any`, no `yellow|amber|lime|D7FF3F`; `ls` of the nine new files; four screenshots at 390px.

**Status:** PR #6 open. Review found blocking issues (staging data rendered on `/hub`, literal counts on Pipeline, invented notes in preview, silent fallback in `lib/seed.ts`, missing screenshots) plus ~15 spec deviations. Fix list was sent to the agent. The Task 02 spec itself must be committed as `docs/tasks/TASK_02_structure_and_typography.md`.

---

### Task 03 — Brand identity (reconstructed)

Deferred explicitly by Task 02: name confirmation, mark, final accent color, opening animation, wordmark.

Draft scope:
- **Wordmark and mark.** Replace the `.t-meta` placeholder `CUE RADAR` in TopBar and Footer with the final wordmark (SVG, currentColor, no raster). Mark as an SVG component `components/brand/Mark.tsx`. Favicon + `app/icon.svg` + `apple-icon`.
- **Accent color.** Change only the value of `--accent` in `globals.css`. Constraint: not yellow/amber/lime; must pass 4.5:1 as text on `--bg` *and* `--bg` text on it as a button fill; must read as distinct from `--urgent` red. Record the chosen value and its contrast numbers in DECISIONS. Verify every screen still has at most one accent element.
- **Landing motion.** Fill `<div id="mark-slot" />` on `/` with the mark's entrance: one animation, ≤600ms, CSS only, fully disabled under `prefers-reduced-motion`. No marquee, no video, no gradient text. Nothing else on the site animates.
- **Metadata.** `app/layout.tsx` title template `%s · Cue Radar`, description, `theme-color` = `--bg`. No OG images yet (that is a later task).
- **Verification:** build/lint; greps for `D7FF3F|yellow|amber|lime`, hex in tsx; screenshot of `/` at 390px twice (before and after the animation).
- **Out of scope:** any layout or copy change, Supabase, OG images, new dependencies.

---

### Task 04 — Supabase wiring and auth (reconstructed)

The task the whole design has been waiting for. Everything that currently renders `notFound()` or a disabled button becomes real.

Draft scope:
- `lib/supabase/{client,server,middleware}.ts` with `@supabase/ssr`. Missing env vars throw with the variable name (rule 2).
- **Auth:** Google via Supabase Auth. `app/auth/callback/route.ts`. `/signin` button enabled. TopBar shows avatar/handle when signed in, `Sign out` action. Middleware protects `/saved` and `/profile/edit` (redirect to `/signin?next=`).
- **Hub:** Server Component reads `hub_feed` ordered `deadline asc nulls last`, expired never returned. Guest still sees locked rows + sign-in block; signed-in sees full rows. Counts computed. Filters read `markets` and `vocab` from the DB (delete the CSV read from `/hub`; `lib/seed.ts` stays for `/` landing until markets can be read at build time from the DB, then it goes too).
- **Detail:** reads `hub_feed` by slug; `notFound()` only when the slug does not exist. `Save` = server action inserting into `user_saved_opportunities` (upsert `status='saved'`). Signed-out `Save` redirects to `/signin`.
- **Pipeline:** reads `user_saved_opportunities` joined to `hub_feed` for the current user; tab counts computed; status change via server action; notes editable inline (textarea, save on blur).
- **Profile:** `/a/[handle]` reads `profiles` where `is_public` or owner; `/profile/edit` loads the current row, `Save` server action with zod validation server-side; avatar upload to `avatars/{uid}/avatar.webp`, client-resized to 800px, ≤2MB (`next/image` remote pattern already set).
- **Owner tasks:** Supabase project, Google provider, redirect URLs, env vars in Vercel and `.env.local` — already listed in `docs/OWNER_TASKS.md`.
- **Verification:** build/lint/tests; greps for `localStorage|FALLBACK_|: any`; `grep -rn "notFound()" app` shows only real not-found paths; manual checklist in PR: sign in → save → see it in Pipeline → change status → edit profile → view public profile.
- **Out of scope:** ICS, OG images, Fit score, `/radar/*`, events, seed/sync changes.

---

### Task 05 — Seed and sync alignment (reconstructed)

Completes P1 from the product plan: "align the sheet tabs with the script (or the reverse), run the sync, verify 60 opportunities."

Draft scope:
- Confirm `scripts/sync_sheet_to_supabase.py` reads tabs `vocab, markets, sources, opportunities, events` exactly as the owner's sheet names them; fix header mismatches on the script side, never by renaming DB columns.
- Sync only `status in (approved, live)` and `sync_ready == YES`; log skips; upsert in order `vocab → markets → sources → opportunities → events`; never delete; then expire past-deadline `live` rows; `--dry-run`.
- Unit tests for every validation rule (`scripts/test_*.py`), offline, using `data/seed/*.csv`.
- `data/seed/opportunities_staging.csv` stays draft. The owner verifies each `apply_url`, fills `deadline` and `verified_at`, sets `status=live`, moves to `opportunities`. Target ≥60 across Cologne, Berlin, Brussels, Tel Aviv, Vienna, Amsterdam. This is owner work; the task only makes the pipeline ready and documents the checklist in `OWNER_TASKS.md`.
- `.github/workflows/sync.yml`: cron every 6h + manual, summary artifact. Delete any remaining crawler workflow.
- **Verification:** `python -m unittest`, `python scripts/sync_sheet_to_supabase.py --dry-run` output pasted, workflow run link.
- **Out of scope:** any change under `app/` or `components/`.

---

### P2 remainder (reconstructed — split as needed)

- **Task 06 — Calendar and ICS.** `app/opportunities/[slug]/ics/route.ts` (`text/calendar`, one VEVENT on the deadline, alarm 48h). `Add to calendar` ghost link becomes real. Consider the plan's `/saved/calendar.ics?token=` subscription feed instead of per-opportunity files (plan §2.4) — decide in DECISIONS.
- **Task 07 — Fit and financial toggles.** `fit_score(profile, opportunity) → eligible | check | ineligible + reasons` (rules only, no ML; SQL function or `lib/fit.ts`). Quiet tag on rows for signed-in users; filter "Show only what I'm eligible for" default on; detail page explains the reasons. Toggles `No fee`, `Funded`, `Covers housing/travel` as URL booleans. Requires profile fields for passport/residency country and career stage (migration adds columns).
- **Task 08 — Trust stamps and OG images.** Detail page line `Verified {date} · Last checked {date} · Source: {name}`; migration adds `last_checked` to `opportunities`; internal `Re-verify` flag when >30 days. `opengraph-image.tsx` for `/opportunities/[slug]` and `/a/[handle]` using the brand from Task 03.

### P3 — Profile v2 (reconstructed from plan §4)

- **Task 09 — Profile fields and gallery.** Migration: `inspired_by text[]`, `mediums text[]`, `pronouns`, `languages text[]`, `based_since date`, `press_url`, `cv_url`; tables `profile_works`, `profile_images`; bucket `gallery`. Public page per plan §4.2 (single column, 720px). Inline edit mode with a quiet completeness meter; `/profile/edit` stays as fallback. Preview of the public view when enabling `is_public`.
- **Task 10 — Say-hi via email handoff.** `intros` table, weekly quota (open question #4 in the plan: 5/week), mailto/Resend handoff, no in-app messaging yet.

### P4 — Trip Radar pilot (reconstructed from plan §3)

- **Task 11 — Data model and screen.** Tables `trips`, `trip_items`, `event_sources`; SQL function `trip_feed(market, from, to)`; routes `/trips`, `/trips/[id]`, `/radar/[city]?from=&to=`; trip visibility default `connections` (open question #5).
- **Task 12 — Manual event sources.** 6 cities × ~15 event sources curated by hand in the sheet; `events` tab synced; trip brief email.

### P5 — Agent (reconstructed from plan §3.4, §6.2)

- **Task 13 — Agent skeleton on one source.** `scripts/agent/{fetch,extract,dedupe,write_staging}.py`; Claude API structured output; writes only to staging; `run_log` table; no `source_url` → no row. Demonstrate one row landing in staging.
- **Task 14 — Scheduled scans and approval.** `scan_events` daily, `scan_opportunities` every 3 days; owner approval flow in the sheet; `recurrence` + `expected_next_open` on opportunities; source pages `/sources/[id]` with archive and "usually opens in {month}".

### P6 — Connect (reconstructed from plan §2.7–2.9, §5)

- **Task 15 — Pipeline v2.** Reminders 7d / 48h for `drafting` (Resend); `outcome_note`; materials vault (bucket `materials`, private) with "you have 3 of 4 required materials".
- **Task 16 — Peer calls.** `type = peer_call` posted by artists, moderation queue, dashed-border treatment in the Hub, `/calls/new`.
- **Task 17 — Follows and intros in-app.** `follows`, `connections`, `/inbox`.
- **Task 18 — Weekly digest.** Sunday email from `radar_preferences.alert_frequency`, text only.

### P7 — Scale

23 cities, Pro tier, institution accounts, Circles. No tasks drafted.

---

## 4. Open questions still unanswered (recorded, plan §8)

1. English-only UI for v1? (recommended: yes)
2. Peer calls — manual moderation or publish-then-report? (recommended: manual until 100 users)
3. "Also applying" — opt-in or opt-out? (recommended: opt-in)
4. Say-hi quota — 5/week? Does Pro remove it?
5. Trip visibility default — `connections` or `public`? (recommended: `connections`)
6. Who approves agent rows — owner only, or per-city scene editors?
7. Retreats in Trip Radar v1 or deferred?

---

## 5. What was lost and what this file restores

Lost with the incognito session (not in the repo, not in any PR):
- The full text of Task 03, 04 and 05 if they had been drafted. Sections 3.3–3.5 above are reconstructions from the pointers in Task 02, HANDOFF_V3 and the product plan; treat them as drafts.
- The reasoning behind the Task 02 design reversal (mono → Manrope, lime → no yellow, cards → dividers, `/` → landing). The decisions themselves are preserved in the Task 02 table above.
- The intended AGENTS.md rule about yellow colors (see §1).

Not lost: everything in `docs/`, both task specs (01 in repo, 02 in the owner's hands — commit it), the PR history, and the product plan's phase map.

---

## 6. Status

| Task | Phase | Status | PR |
|---|---|---|---|
| 01 Cleanup and foundation | P1 | merged | #3 |
| 02 Structure and typography | P1 | in review, fixes requested | #6 |
| 03 Brand identity | P1 | draft scope (§3.3) | — |
| 04 Supabase wiring and auth | P2 | draft scope (§3.4) | — |
| 05 Seed and sync alignment | P1 | draft scope (§3.5) | — |
| 06–08 | P2 | outlined | — |
| 09–18 | P3–P6 | outlined | — |
