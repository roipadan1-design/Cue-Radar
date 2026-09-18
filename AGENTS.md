# AGENTS.md — rules for any coding agent working in this repository

Read `docs/HANDOFF_V3.md` before starting any task. It is the product and architecture spec.
Then read the task you were assigned in `docs/tasks/`. Do only what the task says. Nothing more.

## Hard rules (a PR that breaks any of these will be closed without review)

1. **No fabricated data (amended by Task 06).** No invented opportunities, sources, artists, names, bios, images, counts, or statistics anywhere — except for demo content strictly contained in `supabase/migrations/0003_demo_seed.sql` with `is_demo = true`, invented institution names, tagged `Demo` in UI, `apply_url` pointing to `/demo`, and controlled by `NEXT_PUBLIC_SHOW_DEMO=true|false`. The only allowed fake value in code is a `.env.example` placeholder.
2. **No silent fallbacks.** If a required environment variable is missing, throw an error that names the variable. Never return `null`, never fall back to local data, never catch and continue.
3. **No client-side persistence.** No `localStorage`, `sessionStorage`, `IndexedDB`, or cookies written by the app. User state lives in Supabase tables behind RLS.
4. **No hard-coded lists that exist in the database.** Markets, vocab values, categories, cities, counts — all come from `markets`, `vocab`, or query results. A `FALLBACK_*` constant is a violation.
5. **The app never writes to curated tables.** `markets, vocab, sources, opportunities, events` are read-only for the app. Only `scripts/sync_sheet_to_supabase.py` writes them (service role).
6. **Migrations only add.** No `DROP`, no `DELETE`, no destructive `ALTER` in `supabase/migrations/`.
7. **All colors and fonts come from CSS variables in `app/globals.css`.** No hex values, no `rgb()`, no font names in `.tsx` files.
8. **No new dependencies without the task saying so.** No component libraries (shadcn, base-ui, MUI, etc.). No state libraries. No second `package.json` anywhere in the repo.
9. **No secrets.** `.env.local` is gitignored and stays that way.
10. **Do not start deferred features (amended by Task 06, Task 10).** Trip Radar v1 (`/circuit`, née `/radar`) and a minimal events UI are unblocked by Task 06 in the reduced scope defined in Task 06. A first slice of Connect is unblocked by Task 10 (`docs/tasks/TASK_10_discover_connect_backend.md`), in this exact scope only: opt-in discoverable public profiles (reusing the existing `profiles.is_public` column — no second opt-in column), a search/filter directory screen (discipline + city filters), and a one-directional follow that is private between the two parties (no public follower count anywhere). Everything else stays blocked: open messaging/DM, a public follower count, an activity feed, algorithmic match recommendations, peer calls, digest, analytics. No task may widen the Connect scope beyond what Task 10 and its companion Task 11 define without a new task explicitly naming the addition.

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
