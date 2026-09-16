# Task 03 — Brand mark, accent, real profile, visual depth, auth screens

Repository: `roipadan1-design/Cue-Radar`, base branch `main` (after Task 02 is merged). Read `AGENTS.md`, `docs/ROADMAP.md`, `docs/tasks/TASK_02_structure_and_typography.md` first. Task 02 rules (type scale, tokens, dividers-not-boxes, no yellow, one accent per screen, motion rules) still apply unless this file changes them.

Open exactly one PR titled `Task 03: brand, profile and depth`. End the PR description with the raw verification output from section 9 and attach the screenshots listed there.

## 0. Why this task exists

Task 02 built the skeleton correctly, and the owner's verdict after seeing it on a phone is: **too basic**. Everything is the same weight, there is no mark, no color, no imagery, no big number, no face. This task adds depth in four places without turning the app into a dashboard:

1. A mark and a wordmark (the brand has a character: `間`).
2. One accent color, chosen by the owner from three candidates rendered in the preview.
3. A real artist profile — the owner's own — so the profile page can be designed against real content.
4. Scale contrast: one big number on the Hub, one big name on the profile, one big character on the landing.

Plus the sign-in / sign-up screens, UI only, so Task 04 has something to wire.

No stock images, no illustrations, no icons-per-line, no gradients, no glow. If you can remove an element and the screen still works, remove it.

## 1. Brand

### 1.1 `lib/brand.ts`
```ts
export const BRAND = {
  name: 'Cue Radar',        // may change in a later task — every visible use reads from here
  wordmark: 'CUE RADAR',
  mark: '間',               // U+9593. The "space between". Do not replace with an icon.
  tagline: 'Open calls, residencies and grants for independent artists.',
} as const
```
No other file contains the string `Cue Radar` or `CUE RADAR` after this task (grep in section 9).

### 1.2 Mark font
`間` is not in Archivo. In `app/layout.tsx` load `Noto_Sans_JP` from `next/font/google` with `weight: '700'`, `text: '間'` (character subset — this keeps the font tiny), CSS var `--font-mark`. Add `--font-mark` to `@theme inline`. Nothing else uses this font.

### 1.3 `components/brand/Mark.tsx`
Props `size?: 'sm' | 'md' | 'lg'` → 20px / 40px / 96px. Renders `<span aria-hidden>{BRAND.mark}</span>` in `--font-mark`, weight 700, color `currentColor`, `line-height: 1`. No background, no border, no circle.

### 1.4 `components/brand/Wordmark.tsx`
The lockup the owner had in the v0 prototype: `[間 CUE RADAR]`.
- `[` and `]` in `--muted`, weight 400.
- `間` via `<Mark size="sm" />` in `--fg`.
- `CUE RADAR` in `.t-meta` at 12px, `--fg`, letter-spaced, sentence-case never.
- One `<Link href="/">`, `aria-label={BRAND.name}`.
Use it in `TopBar` (replaces the placeholder text) and `Footer`.

### 1.5 Icons
- `app/icon.svg`: 32×32, `--bg`-colored square (`#0A0A0A`, allowed here — this is an SVG file, not TSX), radius 2, `間` centered in `#F2F2F2`. Since SVG cannot load Google fonts, convert the glyph to a path (use `opentype.js`? no — no new deps. Instead render `<text>` with `font-family="Noto Sans JP, sans-serif"`; acceptable for now, record in DECISIONS).
- `app/apple-icon.png`: not in this task.
- `metadata` in `app/layout.tsx`: `title: { default: BRAND.name, template: \`%s · ${BRAND.name}\` }`, `description: BRAND.tagline`, `themeColor: '#0A0A0A'` is not allowed in TSX — use the `viewport` export with `themeColor` read from a constant in `lib/brand.ts` instead. No OG images yet.

### 1.6 Landing mark
Fill `<div id="mark-slot" />` on `/` with `<Mark size="lg" />` in `--fg`, `--space-8` above the headline. Entrance: opacity 0 → 1, 400ms ease-out, once, via a CSS keyframe on a class; under `prefers-reduced-motion` no animation (globals already disables transitions — extend that rule to `animation: none !important`). This is the only animation in the app.

## 2. Accent — owner chooses from three

Add to `globals.css` under `:root` three candidate tokens (they exist only for the preview switcher and are deleted in the follow-up commit):
```
--accent-a: #5EC8FF;   /* sky */
--accent-b: #3DDC97;   /* mint — hue ~154°, outside the forbidden 45–110° band */
--accent-c: #B39DFF;   /* lavender */
```
All three pass 4.5:1 as text on `--bg` and as a button fill with `--bg` text (verify and print the ratios in DECISIONS).

In `/dev/preview` add, at the top, a `.t-meta` row `ACCENT · A · B · C · NONE` (client component). Clicking sets `style="--accent: var(--accent-x)"` on the preview root only. Default = NONE (current: accent = fg). Nothing outside the preview changes in this PR.

**Then stop and ask.** After pushing, comment on the PR: "Accent: A, B or C?" and wait. When the owner answers, set `--accent` to that value in `:root`, delete the three candidate tokens and the switcher, and push a second commit. If the owner says none of them, leave `--accent` as is.

Where the accent now appears (one per screen, unchanged rule): primary button; urgent deadline stays `--urgent` red; the landing mark stays `--fg`. Nowhere else.

## 3. Real profile (the owner's)

### 3.1 Data
Create `data/seed/profile_demo.json`. This is the owner's own profile, authored by him in the v0 prototype (git commit `80791f6`, file `new design_ux_ui/app/page.tsx`, function `Profile()`). Copy these values exactly; do not add, embellish or "improve" any field:

```json
{
  "handle": "roipadan",
  "full_name": "Roi Padan",
  "role_label": "Choreographer · Sound artist",
  "locations": ["Cologne", "Tel Aviv"],
  "current_city": "Cologne",
  "current_city_until": "2026-11-20",
  "available_from": "2026-11-21",
  "open_for_collab": true,
  "bio": "Roi Padan is a choreographer and sound artist working between Cologne and Tel Aviv. His practice examines the body as an acoustic instrument, using movement, modular synthesis, and field recording to create live environments where listening becomes physical.\n\nHis work is grounded in duration, resonance, and the unstable space between a gesture and its echo.",
  "disciplines": ["Dance", "Sound"],
  "active_since": 2016,
  "languages": ["Hebrew", "English", "German"],
  "showreel_url": null,
  "avatar_url": null,
  "instagram": null,
  "website": null,
  "is_public": true,
  "works": [
    { "title": "Somatic Echoes", "kind": "Choreography", "year": 2025 },
    { "title": "Kinetic Drift", "kind": "Live performance", "year": 2024 },
    { "title": "Bodily Feedback", "kind": "Installation", "year": 2023 }
  ]
}
```
Fields that are `null` render their empty fallback. The owner will edit this one file himself later; keep it human-readable.

### 3.2 Types
In `lib/types.ts` add `ProfileWork { title; kind; year }` and `ProfileView = Profile & { disciplines: string[]; active_since: number | null; languages: string[]; works: ProfileWork[] }`. These extra fields get a migration in a later task (ROADMAP Task 09); do not touch `supabase/`.

### 3.3 Route
`app/dev/preview/profile/page.tsx` — `notFound()` in production; otherwise reads the JSON (server-side, `lib/seed.ts` → `getDemoProfile()`), renders `PublicProfileView` full-page inside the normal shell, 720px container. Also embed it in `/dev/preview` in place of the empty-profile section (keep one empty-profile render below it for fallbacks).

### 3.4 Profile layout v2 — `components/profile/PublicProfileView.tsx`
Mobile-first, top to bottom. Every block separated by `--space-7`; 1px rules only where noted.

1. **Header.** Avatar 88px, `--radius`, left. If no image: initials in `.t-title` on `--surface`. Right of it on desktop, below it on mobile: name in `.t-display` at **36px on mobile / 48px desktop** (the one big thing on the page), then `.t-meta`: `{role_label}`. Then `.t-meta` `--muted`: `{locations joined by ' · '}`.
2. **Status.** Only lines that have data, `.t-body`, each on its own line: `Currently in {current_city} until {d MMM}` · `Open for collaboration` · `Available from {d MMM yyyy}`. No chips.
3. **Actions.** Ghost `Share` (existing `ShareLink`). Nothing else until Task 04.
4. **Bio.** `.t-body`, max 60ch, paragraphs split on blank line, no "read more".
5. **Facts.** Two-column definition grid on all widths (it is short labels): Location · Disciplines · Active since · Languages · Available from · Verified (omit rows with no data). Label `.t-meta`, value `.t-body`. 1px rule above and below the grid.
6. **Selected works.** `.t-meta` heading `SELECTED WORKS`, then each work as a row with a 1px rule: title `.t-row`, right-aligned `.t-num` year, second line `.t-meta` kind. Omit the block if `works` is empty.
7. **Showreel.** Only if `showreel_url`.
8. **Gallery.** `.t-meta` heading `GALLERY`, a 2×2 grid of 1:1 `--surface` blocks with a 1px `--line` border and a centered `.t-meta --muted` label `IMAGE`. These are slots, not images; no placeholders from the web. Omit the block if the profile has no images **and** it is not the demo (the demo shows the four slots so the owner can judge the layout).
9. **Links.** Wrapped row of ghost links, only those present.

## 4. Hub hero

In `components/hub/HubFeedView.tsx` (so the preview shows it), replace the `Opportunities 16` title with:

- `.t-meta` `--muted`: today's date `EEEE, d MMMM` (server-rendered, `Intl.DateTimeFormat('en-GB')`).
- `.t-display` at 36px mobile: `{n} open deadlines` where `n` = rows with a deadline or rolling (computed).
- `.t-meta` `--muted`: `{k} closing this week` (computed; omit when 0).

The `<h1>` is the display line. `/hub` with zero rows keeps the Task 02 behavior (title + empty state) — the hero exists only when there is at least one row.

## 5. Detail page trust line

Under the meta line, add `.t-meta --muted`: `Verified {d MMM yyyy} · Source: {source_name}`. Omit `Verified …` when `verified_at` is null. No other change to the detail page.

## 6. Sign in / sign up — UI only

Owner decision (record in DECISIONS, and add the Apple item to `docs/OWNER_TASKS.md`): the product will offer **Google, Apple, and email + password**. HANDOFF_V3 said Google only; this supersedes it. Wiring is Task 04; here only screens.

### 6.1 `app/signin/page.tsx`
720px container, vertically centered on mobile. `.t-title` `Sign in`. Then:
- Secondary `Button` `Continue with Google` (full width on mobile).
- Secondary `Button` `Continue with Apple`.
- A rule with centered `.t-meta` `OR`.
- `Field` Email (type email) · `Field` Password (type password).
- Primary `Button` `Sign in`.
- Ghost link `Forgot password?` (href `#`, disabled state).
- `.t-body --muted`: `New here?` + ghost link `Create an account` → `/signup`.
All buttons `disabled` with one `.t-meta` note under the form: `Sign-in is enabled in a later release.`

### 6.2 `app/signup/page.tsx`
Same skeleton. `.t-title` `Create an account`. Google · Apple · OR · Full name · Email · Password (help text `At least 8 characters`) · primary `Create account` · `.t-body --muted` `Already have an account?` + ghost `Sign in` → `/signin`. Disabled the same way. Zod schema `lib/schemas/auth.ts` (`signInSchema`, `signUpSchema`) with client-side validation on blur, same pattern as `profile.ts`.

TopBar `Sign in` stays; MobileNav unchanged.

## 7. Motion and accessibility
Task 02 rules hold. New: the landing mark fade (1.6) and nothing else. Accent switcher in preview has no transition.

## 8. What "done" looks like on a phone
Landing: big `間`, three-line headline, one white button. Hub (preview): date, big number, groups. Profile (`/dev/preview/profile`): big name, facts grid, three works, four image slots. Sign in: two provider buttons, OR, two fields, one primary. Nothing yellow, nothing glowing, nothing rounded beyond 2px.

## 9. Verification (paste raw output in the PR)
```
npm ci && npm run lint && npm run build
python -m unittest discover -s scripts -p 'test_*.py'
grep -rn "JetBrains\|Inter_Tight\|font-mono" app components lib             # empty
grep -rnE "#[0-9A-Fa-f]{6}\b" app components --include=*.tsx               # empty
grep -rn "localStorage\|FALLBACK_\|: any" app components lib                # empty
grep -rniE "yellow|amber|lime|chartreuse|D7FF3F" app components lib          # empty
grep -rn "CUE RADAR\|Cue Radar" app components --include=*.tsx              # empty (only lib/brand.ts)
grep -rn "lorem\|placeholder-\|unsplash\|picsum" app components lib data     # empty
ls lib/brand.ts components/brand/Mark.tsx components/brand/Wordmark.tsx app/icon.svg data/seed/profile_demo.json app/dev/preview/profile/page.tsx app/signup/page.tsx lib/schemas/auth.ts
```
Screenshots at 390px: `/`, `/dev/preview` (hub hero), `/dev/preview/profile` (top), `/dev/preview/profile` (works + gallery), `/signin`, `/signup`. Plus one desktop screenshot of `/dev/preview/profile` at 1280px.

## Out of scope — do not do
Supabase, auth wiring, server actions, any data fetching from the DB, migrations, `supabase/`, `scripts/`, `.github/`, ICS, OG images, `/radar/*`, events, Fit score, any new npm dependency, images from the web, changing the product name (the name reads from `lib/brand.ts` and stays `Cue Radar` in this task).
