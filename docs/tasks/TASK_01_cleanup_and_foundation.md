# Task 01 — Cleanup and foundation

Repository: `roipadan1-design/Cue-Radar`, base branch `main`.
Read `AGENTS.md` and `docs/HANDOFF_V3.md` (currently at repo root as `HANDOFF_V3.md`) before starting.

**Scope of this task:** remove everything that is not part of the product, fix the build configuration, establish design tokens and a neutral page shell, and add repository guardrails. **This task contains no visual design work and no Supabase wiring.** Those are Task 02 and Task 03. If you find yourself building a feature, stop.

Open exactly one pull request titled `Task 01: cleanup and foundation`. The PR description must end with the verification output listed in section 8.

---

## 1. Delete

Remove these from the repository entirely. Nothing may import from them afterwards.

| Path | Reason |
|---|---|
| `new-design/` | Second Next.js app with its own lockfile and mock data. Product is one app. |
| `next.config.ts` | Duplicate config. `next.config.mjs` is the only config. |
| `public/data/` | Legacy JSON, nothing reads it. |
| `app/[handle]/page.tsx` | Mock profile with fabricated person, catches every root route. |
| `lib/savedOpportunities.ts` | localStorage persistence, forbidden by AGENTS.md rule 3. |

Then `grep -rn "savedOpportunities\|new-design\|/next.svg\|/vercel.svg" .` (excluding `node_modules` and `.git`) must return nothing.

## 2. Move and rename

| From | To |
|---|---|
| `HANDOFF_V3.md` | `docs/HANDOFF_V3.md` |
| `docs/compass_artifact_wf-0a2d57b4-0178-557c-bac9-5d2f8f019f50_text_markdown.md` | `docs/RESEARCH_market_scan.md` |

Update the link in `README.md` to point at `docs/HANDOFF_V3.md`.

## 3. Build configuration

**`next.config.mjs`** — replace the whole file with:
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { remotePatterns: [{ protocol: 'https', hostname: '**.supabase.co' }] },
}
export default nextConfig
```
`ignoreBuildErrors` and `ignoreDuringBuilds` must not appear anywhere. If the build fails after this, fix the code, not the config.

**`eslint.config.mjs`** — create it (it was deleted in a previous commit). Use the flat config with `eslint-config-next` (`core-web-vitals` + `typescript`). Add `eslint` and `eslint-config-next` to devDependencies if missing.

**`package.json`** — ensure these scripts exist exactly:
```json
"dev": "next dev",
"build": "next build",
"start": "next start",
"lint": "next lint"
```
Do not add or remove any other dependency. Keep npm. Delete any `bun.lock`, `pnpm-lock.yaml`, or `yarn.lock` if present.

**`.env.example`** — must contain exactly these keys with placeholder values:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**`.gitignore`** — must include `.env.local`, `.next/`, `node_modules/`, `__pycache__/`, `*.pyc`.

## 4. Design tokens

Replace `app/globals.css` entirely with:
```css
@import "tailwindcss";

:root {
  --bg: #0B0B0C;
  --surface: #141416;
  --line: #26262A;
  --fg: #EDEDED;
  --muted: #8A8A93;
  --accent: #D7FF3F;
  --urgent: #FF5A3C;
  --radius: 4px;
}

@theme inline {
  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-line: var(--line);
  --color-fg: var(--fg);
  --color-muted: var(--muted);
  --color-accent: var(--accent);
  --color-urgent: var(--urgent);
  --font-display: var(--font-display);
  --font-mono: var(--font-mono);
  --radius-sm: var(--radius);
}

* { border-color: var(--line); }
html { background: var(--bg); }
body { background: var(--bg); color: var(--fg); font-family: var(--font-mono), ui-monospace, monospace; }
a { color: inherit; text-decoration: none; }
button { font: inherit; cursor: pointer; }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
```
The token *values* will be revisited in Task 02 (design). The token *names* are final — every component references these names, so a later palette change is a one-file edit.

**`app/layout.tsx`** — load `Inter_Tight` (weight `600`, variable `--font-display`) and `JetBrains_Mono` (weight `400`, variable `--font-mono`) from `next/font/google`. Remove `Inter`, `Geist`, and any other font. `<body className="min-h-screen flex flex-col bg-bg text-fg font-mono">`. Layout renders `<TopBar />`, `{children}` inside `<main className="flex-1 w-full max-w-[1200px] mx-auto px-5 py-6">`, `<Footer />`, `<MobileNav />`. Pages render only their content, never the shell.

## 5. Neutral shell components

Create these. They are structural placeholders using tokens only — no visual polish, no icons library, no animation. Task 02 will restyle them.

- `components/layout/TopBar.tsx` — brand text `CUE RADAR` linking to `/`; nav links `Hub` (`/`) and `Saved` (`/saved`); a placeholder `<button>Sign in</button>` that does nothing yet (no form, no route). Sticky, `bg-surface border-b border-line`, height 52px.
- `components/layout/MobileNav.tsx` — fixed bottom bar on `< md`, same two links. Hidden on `md+`.
- `components/layout/Footer.tsx` — `text-muted text-xs`, contains only the text `Cue Radar` and a link to `docs/HANDOFF_V3.md` on GitHub. No year, no tagline.
- `components/hub/EmptyState.tsx` — props `title: string`, `body?: string`, `action?: { label: string; href: string }`. Bordered box, centered, `bg-surface`.
- `components/ui/Chip.tsx` — props `tone?: 'neutral' | 'accent' | 'urgent'`, children. Mono 11px, 1px border, `rounded-sm`.

## 6. Pages

- `app/page.tsx` — Server Component. Renders an `<h1 className="font-display text-3xl">Opportunities</h1>` and `<EmptyState title="The feed is being curated — check back soon." />`. **No data fetching in this task.** No counts, no filters, no numbers in copy.
- `app/saved/page.tsx` — Server Component. `<h1 className="font-display text-3xl">Pipeline</h1>` and `<EmptyState title="No saved opportunities yet" action={{ label: 'Explore feed', href: '/' }} />`. No client code.
- `app/not-found.tsx` — `[404]` in mono accent, `Not found` in display font, a link `Return to Hub`.
- Delete `app/favicon.ico` only if it is the default Next.js icon; otherwise keep it.

## 7. Repository guardrails

- Add `.github/workflows/ci.yml` — the owner will supply this file; if it already exists on `main`, do not modify it.
- Create `docs/tasks/` and move this task file there as `docs/tasks/TASK_01_cleanup_and_foundation.md`.
- Append to `docs/DECISIONS.md` under a heading `## Task 01`: any judgment call you made. If none, write `No deviations.`
- Do not touch `scripts/`, `supabase/`, `data/`, or `.github/workflows/sync.yml`. They are correct and out of scope.

## 8. Verification (paste raw output in the PR description)

```bash
npm ci
npm run lint
npm run build
python -m unittest discover -s scripts -p 'test_*.py'

# each of the following must print nothing:
ls new-design 2>&1 | grep -v "No such file"
ls next.config.ts 2>&1 | grep -v "No such file"
ls public/data 2>&1 | grep -v "No such file"
ls "app/[handle]" 2>&1 | grep -v "No such file"
ls lib/savedOpportunities.ts 2>&1 | grep -v "No such file"
grep -rn "localStorage\|FALLBACK_\|ignoreBuildErrors\|ignoreDuringBuilds" app components lib next.config.mjs
grep -rnE "#[0-9A-Fa-f]{6}\b" app components --include=*.tsx
find . -name package.json -not -path "./node_modules/*" | grep -v "^./package.json$"

# must show the moved files:
ls docs/HANDOFF_V3.md docs/RESEARCH_market_scan.md docs/tasks/TASK_01_cleanup_and_foundation.md
```

## Out of scope — do not do

Supabase clients, auth, data fetching, filters, opportunity rows, profile pages, detail pages, ICS routes, Trip Radar, seed data changes, sync script changes, migrations, visual design beyond the tokens above, any new npm dependency other than `eslint` / `eslint-config-next`.
