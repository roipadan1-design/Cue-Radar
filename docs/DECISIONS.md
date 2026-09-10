# Autonomous Engineering Decisions

This log records conservative choices made autonomously when requirements allowed ambiguity.

---

## Phase 1
- **Scaffolding Strategy**: Replaced the Vite 6 SPA with Next.js 15 App Router using TypeScript, Tailwind v4, ESLint, App Router without `src/` directory, and `@/*` import alias.
- **Controlled Vocabularies & Markets**: Seeded 23 markets with real geographic and timezone metadata derived from standard geographic datasets.
- **Seed CSV Generation**: Derived `sources.csv` (57 sources) and `opportunities_staging.csv` (16 legacy opportunities marked `draft`) directly from `public/data/sources.json` and `public/data/opportunities.json`.
- **Validation Script**: Implemented unit tests for the Python sync validator running completely offline using local seed CSVs.
