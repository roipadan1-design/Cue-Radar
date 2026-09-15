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
