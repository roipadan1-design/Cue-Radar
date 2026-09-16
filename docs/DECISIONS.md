# Autonomous Engineering Decisions

This log records conservative choices made autonomously when requirements allowed ambiguity.

---

## Phase 1
- **Scaffolding Strategy**: Replaced the Vite 6 SPA with Next.js 15 App Router using TypeScript, Tailwind v4, ESLint, App Router without `src/` directory, and `@/*` import alias.
- **Controlled Vocabularies & Markets**: Seeded 23 markets with real geographic and timezone metadata derived from standard geographic datasets.
- **Seed CSV Generation**: Derived `sources.csv` (57 sources) and `opportunities_staging.csv` (16 legacy opportunities marked `draft`) directly from `public/data/sources.json` and `public/data/opportunities.json`.
- **Validation Script**: Implemented unit tests for the Python sync validator running completely offline using local seed CSVs.

## Task 01
- No deviations.

## Task 02
- **Color Contrast Verification**: Verified contrast ratio for `--muted` (`#8C8C8C`) on `--bg` (`#0A0A0A`). The contrast ratio passes accessible standards at ~5.9:1 (exceeding the required 4.5:1).
- **Guest Feed Logic**: Kept staging CSV data restricted exclusively to the `/dev/preview` route. The production `/hub` route renders live DB rows only (0 until Task 04).
- **Public Profile Fallback**: Rendered an empty `--surface` box block when a profile has no `avatar_url` and no name initials.

## Task 03
- **Brand Icon SVG Glyph Rendering**: Rendered `<text>` element with `font-family="Noto Sans JP, sans-serif"` inside `app/icon.svg` without adding third-party font parsing dependencies.
- **Accent Contrast Verification**: Calculated contrast ratios against `--bg` (`#0A0A0A`, luminance ~0.00304):
  - Accent A (`#5EC8FF`, sky): ~10.9:1 contrast ratio.
  - Accent B (`#3DDC97`, mint): ~11.9:1 contrast ratio.
  - Accent C (`#B39DFF`, lavender): ~8.2:1 contrast ratio (Selected by owner).
  All candidate colors pass WCAG 2.1 AAA (>= 7:1) for text and button fills.
- **Auth Strategy Alignment**: Expanded authentication providers to support Google, Apple, and Email/Password per task instructions, superseding the Google-only spec from HANDOFF_V3.

## Deliverables A–D (Financial Filters, Fit Score, Trust Stamps, OG Images)

- **OG-Image-Hex-Exception**: `app/opportunities/[slug]/opengraph-image.tsx` and `app/a/[handle]/opengraph-image.tsx` use raw hex color literals (`#0A0A0A`, `#F2F2F2`, `#B39DFF`, `#8C8C8C`, `#1F1F1F`) inside `ImageResponse` JSX style objects. This is an architectural necessity: `ImageResponse` renders to a PNG canvas via Satori — CSS custom properties (`var(--accent)` etc.) are not resolved in this context. The hex values are exact copies of the tokens defined in `app/globals.css`. The repo guardrail audit `grep` must exclude `opengraph-image.tsx` files when checking for raw hex values in TSX. This is not a violation of Rule 7's intent (which targets component-level DOM rendering).
- **Eligibility Check is Informational**: `lib/fit.ts` → `checkEligibility()` is non-blocking and informational. The `Profile` type has no `career_stage` field, so the check uses `disciplines` and `eligibility_geo` only for the isEligible boolean; career stage produces a reason string as guidance. This matches the spec intent ("subtle eligibility status badge").
- **`funded` Filter Uses Supabase `.or()`**: The funded filter string `'funding_min.gt.0,funding_type.in.(grant,stipend,artist_fee,salaried)'` uses the Supabase PostgREST `.or()` syntax exactly as specified in the deliverable. The word `salaried` is included in the `in()` list per spec, even though it is not in the controlled vocab table.
- **FilterBar active-pill colour**: Boolean toggle pills use `bg-accent text-bg` when active. `bg-accent` maps to `var(--accent)` via Tailwind v4 `@theme inline` — no raw hex in TSX.
- **`isVerificationStale` computed at render time**: The 30-day staleness check uses `Date.now()` at server render. No DB field is added. This is consistent with the "migrations only add" and "no new columns without a task" rules.
