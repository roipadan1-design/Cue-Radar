# Task 21 — ArtConnect standard: make the product look and behave like a real platform

**Status:** in progress · **Opened:** 2026-09-18 · **Raised by:** repo owner, directly and unhappily.

## 0. Read this first — the owner is not satisfied

The owner reviewed the deployed app at https://cue-radar.vercel.app and said, in his words:

> "I'm really not happy with the work so far. We agreed we'd take design inspiration from
> ARTCONNECT and in practice I see none of it. I want our app to look more professional."

He attached nine reference screenshots of https://www.artconnect.com and said: analyse them,
analyse ArtConnect's design, and **each role sharpens its own job definition from the references.**
He also said: "I don't care if there isn't content yet, we'll fill it in slowly. I don't care if
some things are floating and not fully wired. I want a site that WORKS."

Three concrete demands on top of the redesign:

1. **The Save button on the profile is broken.** He cannot save his profile. (Root cause found and
   fixed — see §2. It was a missing `profiles.gallery` column in the live database: every profile
   UPDATE failed, and the error banner rendered at the *top* of a long form while he was looking at
   the sticky Save bar at the bottom. So "Save does nothing" was literally true from where he sat.)
2. **Remove every city outside Israel.** The pilot is Israel-only for now.
3. **Search rows for people, organisations etc.** — the ArtConnect Discover pattern.

This is not a request for opinions. Do the work.

## 1. The gap, measured

Measured live from artconnect.com (computed styles, not guesses) against our deployed app:

| | ArtConnect | Fellow. (ours) | Verdict |
|---|---|---|---|
| Container | ~1200px, generous | `max-w-[720px]` everywhere | ours reads like a phone page stretched |
| Card radius | `7px`, hairline `0.8px` border | `--radius: 0px`, 1–2px borders | ours reads as brutalist/unfinished |
| Headings | weight 500, `letter-spacing: normal`, sentence case | weight 800, `-0.03em`, **UPPERCASE** | ours shouts; ArtConnect is calm |
| Nav | Dashboard · Opportunities · Discover · Artworks · Magazine + CTA + avatar | Hub · Currently · Saved · Profile — **Discover is not linked at all** | our people-directory is unreachable |
| Opportunity card | title, coloured type badge, location link, reward icon row, FREE fee badge, deadline, org logo + name, Save + "See more →" | title, source name, 4 grey chips, funding, deadline | ours has no visual hierarchy and no imagery |
| Detail page | 2 column, sticky right rail: deadline + calendar, Save/Apply box, Cost / Required Documents / Contact / Selection Date accordions | single narrow column | ours buries the decision |
| Discover | Artists \| Curators \| Organizations tabs, **two search inputs** (by name, by city/country), row = avatar + name + "Artist · City, Country" + "View Profile →" + recent-work strip | one combined filter bar, small cards, no tabs, no work strip | ours is a stub |
| Urgency | quiet grey "In 13 days" | full red 2px border around the whole card | ours screams on every row |

**One-line summary of the gap:** ArtConnect is a calm, roomy, image-led directory that treats every
listing as an object with an owner. Ours is a dense mono-spaced list with no images, no owners and
no room. Closing the gap is mostly *restraint plus space plus imagery*, not more features.

## 2. Already done by the orchestrator before agents started

- `supabase/migrations/0008_profiles_gallery.sql` — **applied to the live database.** It existed in
  the repo but had never been run, which is why profile Save was dead. Verified: `profiles.gallery`
  now returns `[]` instead of `column profiles.gallery does not exist`.
- `supabase/migrations/0009_market_scope.sql` — **applied.** Adds `markets.is_active` and sets it to
  `country = 'IL'`. 11 Israeli markets active, 22 others parked (rows kept — rule 6).
- Design tokens in `app/globals.css` rewritten to the ArtConnect measurements above. **This file is
  the contract. Do not re-fight it; build against it.**

## 3. Scope per role — stay inside your files

Every agent: read `AGENTS.md` first. All ten hard rules still apply. In particular no fabricated
content (rule 1), no hard-coded city/vocab lists (rule 4), no new dependencies (rule 8), and all
colour/radius/type via the CSS variables in `app/globals.css` (rule 7).

| Role | Owns (write only here) | Deliverable |
|---|---|---|
| ux-ui-designer | `docs/design/**` | `ARTCONNECT_GAP_ANALYSIS.md`: per-screen spec the engineers implement against |
| frontend-engineer A | `components/layout/**`, `components/ui/**`, `app/layout.tsx`, `app/page.tsx` | Shell: wide container, real top nav incl. Discover, card/badge/avatar primitives, calm landing |
| frontend-engineer B | `app/discover/**`, `components/discover/**`, `components/profile/**` | Discover in the ArtConnect pattern + profile-save UX repair |
| frontend-engineer C | `app/hub/**`, `components/hub/**`, `app/opportunities/**` | Opportunity card + two-column detail page with sticky decision rail |
| backend-data-engineer | `supabase/**`, `scripts/**`, `docs/OWNER_TASKS.md` | Israel-only scope plumbed through the sync script; `is_active` owned by sync |
| qa-release | `docs/qa/**` | Pass/fail punch list against this file |

## 4. Israel-only rule (applies to every screen)

Read markets with `.eq('is_active', true)`. Never hard-code `'IL'`, a country list or a city list in
`.tsx` — the flag is in the database precisely so rule 4 holds. Any feed, filter, city strip or city
search must be scoped to active markets.

## 5. Verification (paste raw output in the PR)

```
npm run build
npm run lint
python -m unittest discover -s scripts
```
