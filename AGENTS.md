# AGENTS.md — rules for any coding agent working in this repository

Read `docs/HANDOFF_V3.md` before starting any task. It is the product and architecture spec.
Then read the task you were assigned in `docs/tasks/`. Do only what the task says. Nothing more.

## Hard rules (a PR that breaks any of these will be closed without review)

1. **No fabricated data.** No invented opportunities, sources, artists, names, bios, images, counts, or statistics anywhere — not in code, not in seed files, not in placeholder copy. If a value is unknown, render an empty state. The only allowed fake value is a `.env.example` placeholder.
2. **No silent fallbacks.** If a required environment variable is missing, throw an error that names the variable. Never return `null`, never fall back to local data, never catch and continue.
3. **No client-side persistence.** No `localStorage`, `sessionStorage`, `IndexedDB`, or cookies written by the app. User state lives in Supabase tables behind RLS.
4. **No hard-coded lists that exist in the database.** Markets, vocab values, categories, cities, counts — all come from `markets`, `vocab`, or query results. A `FALLBACK_*` constant is a violation.
5. **The app never writes to curated tables.** `markets, vocab, sources, opportunities, events` are read-only for the app. Only `scripts/sync_sheet_to_supabase.py` writes them (service role).
6. **Migrations only add.** No `DROP`, no `DELETE`, no destructive `ALTER` in `supabase/migrations/`.
7. **All colors and fonts come from CSS variables in `app/globals.css`.** No hex values, no `rgb()`, no font names in `.tsx` files.
8. **No new dependencies without the task saying so.** No component libraries (shadcn, base-ui, MUI, etc.). No state libraries. No second `package.json` anywhere in the repo.
9. **No secrets.** `.env.local` is gitignored and stays that way.
10. **No yellow.** No yellow, yellow-green, lime, chartreuse, amber, gold, mustard, or any hue between roughly 45° and 110° on the color wheel, at any saturation, anywhere: tokens, Tailwind classes (`yellow-*`, `amber-*`, `lime-*`), inline styles, SVGs, images. This includes the legacy `#D7FF3F`. Urgency is expressed with a true red, not orange.
11. **Do not start deferred features.** Trip Radar, `/radar/*`, events UI, Fit score, Effort meter, Connect, Peer Calls, Digest, OG images, analytics — all of these are blocked until a task explicitly names them.

## When the task and your judgment disagree

Do what the task says. Write your objection in `docs/DECISIONS.md` under the task number. Do not implement your alternative.

## Every PR must

- Pass CI (`.github/workflows/ci.yml`): `npm run build`, `npm run lint`, `python -m unittest discover -s scripts`.
- Contain only the scope of one task file from `docs/tasks/`.
- Include in the PR description the raw output of the verification commands listed at the end of the task file. Prose descriptions of what you did are not proof.
- Update `docs/DECISIONS.md` if you made any judgment call, and `docs/OWNER_TASKS.md` if anything requires the repo owner (dashboard settings, secrets, manual data work).

## Stack (do not change)

Next.js 15 App Router · React 19 · TypeScript strict · Tailwind CSS v4 · `@supabase/ssr` · Zod · npm.
Python 3.11 for `scripts/`. GitHub Actions for sync and CI.
