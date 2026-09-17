# Task 07 — Brand and visual polish, and end-to-end signup verification

Repository: `roipadan1-design/Cue-Radar`, base branch `main`. Owner department: **Frontend Engineer**. Read `AGENTS.md`, `docs/HANDOFF_V3.md`, `docs/ROADMAP.md`, `docs/PILOT_PLAN.md`, `docs/DECISIONS.md` (especially the "Task planning pass — Tasks 07–11" entry, which explains which of the items below are already partly done in the current code) before starting. Work on branch `task/brand-and-visual-polish`, open **one PR** titled `Task 07: Brand and visual polish` against `main`.

This task is a punch-list of small, real bugs and cleanups the owner found while using the deployed site, plus a verification pass on the signup flow since the owner is about to register as the first real user. It does not touch Supabase schema, auth wiring logic, or design tokens beyond the one accent value already in place.

---

## 1. Fix the main-nav Profile link and re-guard the dev preview profile

**Confirmed bug** (in `components/layout/MobileNav.tsx` and `components/layout/TopBarNav.tsx`): a signed-out user tapping "Profile" is routed to `/dev/preview/profile` (the fictional demo profile used for design review), not to sign-in.

Do:
- Change the `Profile` nav item's `href` in both files: signed-out → `/signin?next=/profile/edit`; signed-in → `/profile/edit` (already correct — leave it).
- Remove the comment in both files referencing "guests land on the demo profile... re-gate before the pilot opens" — it no longer applies once this fix lands.
- In `app/dev/preview/profile/page.tsx`, re-add the guard a prior session deliberately left off for the owner's own design review (see `docs/DECISIONS.md`, "Dev preview visibility on deployed builds"): `if (process.env.VERCEL_ENV === 'production') notFound()` at the top of the component, matching the existing pattern already used in `app/dev/preview/page.tsx`. Import `notFound` from `next/navigation`.

## 2. Footer links (Task 06 §8 was never finished — this is overdue)

**Call this out explicitly in the PR description as overdue**: Task 06 §8 already specified this footer change and it did not happen.

Do, in `components/layout/Footer.tsx`:
- Remove the `https://github.com/.../docs/HANDOFF_V3.md` link entirely.
- Replace it with three links in this order: `About` (anchor/link to the landing page's supporting-line section — reuse whatever the landing page already uses as its "what is this" copy; do not write new marketing copy), `Report a problem` (`mailto:` using `NEXT_PUBLIC_FEEDBACK_EMAIL`, same pattern already used on the opportunity detail page's "Report a problem with this call" link — throw at build if the env var is missing, per rule 2), `Privacy` (link to the existing `/privacy` page).
- If `/privacy` or an "About" anchor doesn't exist yet, confirm with a quick read of `app/privacy/page.tsx` and the landing page before wiring the link — do not create new pages beyond what Task 06 already specified.

## 3. "Demo" tag is missing from Hub rows

**Confirmed bug**: `components/hub/OpportunityRow.tsx` never reads `row.is_demo`. Per the existing spec (Task 06 §4.4), a `Demo` tag must render on the tag line only when `is_demo` is true.

Do:
- Add a `Demo` chip to the tag row in `OpportunityRow.tsx`, shown only when `row.is_demo`. Use the plain (non-accent) `Chip` styling — the differentiator chip (`Funded`/`No fee`) already uses `tone="accent"`; `Demo` must not compete with it for the one-accent-per-row rule, so give it the same neutral styling as the discipline/city chips.
- Also check `app/opportunities/[slug]/page.tsx` (the detail page) for the same `is_demo` tag per Task 06 §5 and add it if missing.
- Verify against a live demo row (`is_demo = true`) on the deployed `/hub` once `0003_demo_seed.sql` is applied (see `docs/OWNER_TASKS.md` Step 4b) — if the migration still isn't applied in Supabase when this PR is tested, say so in the PR description rather than silently skipping verification.

## 4. Rename "Circuit" to "Currently" in UI copy only

Same UI-label-vs-code-identifier split already used for Saved/pipeline (Task 06 §7.1: the word "pipeline" stays in code/DB, never in UI text).

Do — change only the visible strings, in exactly these places:
- `components/layout/MobileNav.tsx` and `components/layout/TopBarNav.tsx`: nav item `label: 'Circuit'` → `label: 'Currently'`.
- `app/circuit/page.tsx`: `<h1 className="t-display text-fg">Circuit</h1>` → `Currently`. Update the one line of supporting copy under it only if it names "Circuit" directly.
- `app/circuit/[city]/page.tsx`: the `← Circuit` breadcrumb text → `← Currently`.

Do **not** rename: the route path `/circuit`, the file/directory names (`app/circuit/*`, `CircuitForm.tsx`, `CircuitPage`, `CircuitCityPage`, `CircuitFormProps`), the `lucide-react` `Route` icon import, or any code comment. Grep for any other bare "Circuit" string in `app/circuit/**` and `components/layout/*Nav.tsx` before finishing — if one is found outside the files above, fix it in place using the same UI-only rule.

## 5. Accent color — verify already-final state, remove residue if any

**Already done in code**: `app/globals.css` has `--accent: #B39DFF` under `:root`, and no `--accent-a/b/c` tokens or a switcher component exist anywhere (grep confirms only historical references in `docs/tasks/TASK_03_brand_profile_and_depth.md`, which is a closed task file and stays as-is).

Do: grep the codebase (command in §9 below) to confirm this is still true at the time this task is executed, and if any `--accent-a`, `--accent-b`, `--accent-c`, or preview-switcher code has reappeared, delete it. Otherwise make no change here and note "already satisfied" in the PR description — do not invent a switcher to then remove it.

## 6. Additional `--accent` placements — blocked on the ux-ui-designer's spec

The owner wants more places in the UI to use `--accent`, beyond the current single-per-screen uses (primary buttons, the `Funded`/`No fee` differentiator chip, the `Eligible ✓` label). **Do not invent new placements.** This section of the task is a placeholder until `docs/design/` (or wherever the ux-ui-designer publishes it) contains a specific spec naming exact elements. When that spec lands:
- Follow it literally — no more, no less.
- Keep the existing rule from Task 02/03: at most one accent element per screen (primary action *or* urgent deadline, never both, never decorative), unless the new spec explicitly says otherwise, in which case flag the conflict in `docs/DECISIONS.md` rather than resolving it silently (per "when the task and your judgment disagree").
- If no spec has landed by the time this PR is opened, skip this section entirely and say so in the PR description — do not guess at placements.

## 7. Filter bar density — mostly already done, apply the forthcoming spec

**Already close to the ask**: `components/hub/FilterBar.tsx` was redesigned on 2026-09-17 (see `docs/DECISIONS.md`, "Hub filter bar UX cleanup") from a ~20-chip horizontal-scroll row down to 5 always-visible quick-toggle chips (`No fee`, `Funded`, `Housing`, `Travel`, `Light application`) plus one "Filters" panel for City/Type/Discipline. This is not the old ~17-chip row the owner described — it's already the "few highest-value chips + one entry point for the rest" shape he's asking for.

Do: same as §6 — this is blocked on the ux-ui-designer's forthcoming density spec. If/when it lands and calls for something different from the current 5-chip row (e.g. trimming to exactly 3–4 chips, or adding a horizontal-scroll/"more" affordance instead of the current panel), implement exactly that. Until then, make no change to `FilterBar.tsx` and say so in the PR description.

## 8. New brand mark — blocked on the creative-director's output

The `間` mark (`components/brand/Mark.tsx`) is a placeholder for the "Fellow." rebrand — see `docs/DECISIONS.md`, "Rebrand" entry, which already flags that its conceptual tie to the old name doesn't carry over. Do not redesign or replace it in this task. When the creative-director publishes a new mark (expected in `docs/design/` or `docs/creative/`), a separate task will wire it in. If no such output exists when this PR is opened, make no change here.

## 9. Order of work

1. §1 nav fix + preview guard (this is the one real security/trust bug in this task — do it first).
2. §2 footer links.
3. §3 Demo tag.
4. §4 Circuit → Currently copy.
5. §5 accent verification.
6. §10 end-to-end signup verification.
7. §6, §7, §8 — check whether the dependency (ux-ui-designer spec / creative-director mark) has landed; implement only if it has, otherwise skip and note in the PR.

## 10. End-to-end signup verification (item d)

The owner is registering as the first real user. Confirm, today, on a Vercel preview or production URL at 390px:

1. `/signup` with email + password + full name completes (respecting whatever the Supabase "Confirm email" setting currently is — if email confirmation is required, confirm the email and continue).
2. Lands on `/profile/edit?welcome=1` with the welcome banner.
3. Fill in `handle`, `full_name`, at least one discipline, and toggle `is_public` on. Save succeeds (no error, values persist on reload).
4. Visit `/a/{handle}` (signed out, in a different browser/incognito, or by signing out first) and confirm the public profile renders with the data just entered.
5. Tap "Profile" in the nav while signed out — confirm it now goes to `/signin?next=/profile/edit` (this is the §1 fix, being exercised end to end).

If any step fails, the PR description states exactly which step, the error seen, and whether it's a code bug (fix it, it's in scope) or a dashboard/config setting (name it in `docs/OWNER_TASKS.md`, do not stub around it).

---

## 11. Verification (paste raw output in the PR — prose is not proof)

```bash
npm ci && npm run lint && npm run build
python -m unittest discover -s scripts
# nav fix
grep -n "dev/preview/profile" components/layout/MobileNav.tsx components/layout/TopBarNav.tsx || echo OK_no_demo_profile_shortcut
grep -n "signin?next=/profile/edit" components/layout/MobileNav.tsx components/layout/TopBarNav.tsx
grep -n "VERCEL_ENV" app/dev/preview/profile/page.tsx
# footer
grep -n "HANDOFF_V3" components/layout/Footer.tsx || echo OK_no_internal_link
grep -n "About\|Report a problem\|Privacy" components/layout/Footer.tsx
# demo tag
grep -n "is_demo" components/hub/OpportunityRow.tsx
# Circuit -> Currently (UI copy only; route/file names must remain)
grep -rn "Circuit" components/layout/MobileNav.tsx components/layout/TopBarNav.tsx app/circuit/page.tsx "app/circuit/[city]/page.tsx" | grep -v "CircuitForm\|CircuitPage\|CircuitCityPage\|CircuitFormProps\|@/components/radar\|import" || echo OK_no_leftover_ui_string
ls app/circuit/page.tsx app/circuit/CircuitForm.tsx "app/circuit/[city]/page.tsx"   # unchanged file names
# accent
grep -rn "accent-a\|accent-b\|accent-c" app components lib || echo OK_no_accent_switcher
grep -n "\-\-accent:" app/globals.css
grep -rnE "#[0-9A-Fa-f]{6}" app components --include=*.tsx | grep -v opengraph-image || echo OK_no_hex_in_tsx
```

Manual checklist at 390px (attach screenshots): `/hub` footer (About / Report a problem / Privacy visible, no GitHub link), signed-out nav Profile tap → `/signin?next=/profile/edit`, a demo row on `/hub` showing the `Demo` tag, `/circuit` header reading "Currently", the full signup → profile → public-profile flow from §10.

---

## 12. Do not

- Do not touch Supabase schema, RLS, or auth wiring logic — only the nav `href` values and the one `notFound()` guard.
- Do not rename the `/circuit` route, its files, or any internal identifier.
- Do not invent accent placements or filter-density changes ahead of the ux-ui-designer's spec, or a new brand mark ahead of the creative-director's output.
- Do not change design tokens, fonts, or the accent value itself.
- Do not add dependencies.
- Do not write new marketing copy for "About" beyond reusing existing landing-page copy.
