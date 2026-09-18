# Task 19 — Visual identity refresh (ArtConnect-inspired look and feel)

Repository: `roipadan1-design/Cue-Radar`, base branch `main`. Owner department: **Frontend Engineer**, gated on a prerequisite deliverable from **ux-ui-designer** (see §1 — do not start §2 until that deliverable exists and is committed). Read `AGENTS.md`, `docs/HANDOFF_V3.md`, `docs/ROADMAP.md`, `docs/PILOT_PLAN.md`, and `docs/DECISIONS.md` — especially the "Task 07 — accent rule, final," "Task 12 — Israel-only pilot pivot," and "ux-ui-designer pass — ArtConnect structural mapping" entries — before touching anything. Work on branch `task/visual-identity-refresh`, open **one PR** titled `Task 19: Visual identity refresh` against `main`.

---

## 0. Why this task exists

The owner reviewed the shipped Task 07/09/11/14 work and was disappointed: "I expected to see a different, new look and I'm disappointed because everything looks the same." That prior round (Task 12 §4) deliberately borrowed only ArtConnect's UI **structure** (tabs, search-then-detail flow, filter panel shape) while leaving Fellow.'s colors, fonts, and copy voice untouched — which is exactly why nothing looks different at a glance, even though the underlying screen structure changed. The owner has now explicitly asked for a genuine visual refresh: colors, typography treatment, spacing/density, and card/imagery style, actually inspired by how ArtConnect **looks**, not just how it's organized. This task is that refresh — and it comes with more research depth than the earlier pass, at the owner's request.

**Critical constraint, stated once and binding for the whole task:** this still goes through the existing CSS-variable token system in `app/globals.css` (`AGENTS.md` hard rule 7 — no hex values, no `rgb()`, no font names in `.tsx` files, ever, with the sole pre-existing exception already logged in `docs/DECISIONS.md` for `opengraph-image.tsx`'s Satori canvas rendering). **A "new look" means proposing new VALUES for the existing token names** (`--bg`, `--surface`, `--line`, `--line-strong`, `--fg`, `--muted`, `--accent`, `--urgent`, `--radius`, the spacing scale, the two font families) **— not new token names, not a second styling system, not inline styles, not bypassing the tokens in any component.** If the ux-ui-designer's spec (§1) proposes anything that can't be expressed as new values for the existing token set (e.g., a second accent color, a third font), that is out of scope for this task and must be flagged back rather than implemented.

**The owner has explicitly reopened `--accent` (currently `#B39DFF`) and the "closed list of named accent signals" rule logged in `docs/DECISIONS.md` under "Task 07 — accent rule, final."** That entry described `--accent` and the five-item closed list as the *final* rule, not touchable without a new task. This task is that new task. The ux-ui-designer is explicitly authorized — not just permitted, but asked — to reconsider both the accent value itself and whether the closed-list rule still holds, given the owner's fresh feedback. Do not treat either as untouchable.

---

## 1. Step one — ux-ui-designer deep visual-research pass (prerequisite, blocks §2)

**This task-planning file does not spec the visual direction — that is the ux-ui-designer's job, not task-planning's.** Before any code changes, the ux-ui-designer must produce a committed spec document, `docs/design/VISUAL_IDENTITY_REFRESH_SPEC.md`, containing at minimum:

1. **Grounded research**, not memory: browse [artconnect.com](https://www.artconnect.com) directly (mobile 375–390px primary, desktop secondary) and document what specifically makes it look and feel different from Fellow. today — palette (hue/saturation/value character, not just "purple" vs "their color"), type pairing and weight/size rhythm, card density and imagery treatment (does it use photos, how much whitespace, corner radius, border weight), and any other concrete visual variable. Cite what was actually seen, not a generic "modern SaaS look."
2. **Proposed new values for every token in `app/globals.css`** the spec wants changed — `--bg`, `--surface`, `--line`, `--line-strong`, `--fg`, `--muted`, `--accent`, `--urgent`, `--radius`, the spacing scale, and/or the two font-family assignments (display/body). Every proposed color value must ship with its computed contrast ratio against every surface it will sit on (same rigor as the Task 03 accent-selection precedent in `docs/DECISIONS.md` — text-on-bg and bg-as-fill-with-text-on-it, ≥4.5:1 minimum, note where it clears AAA). No proposed value may be a yellow/amber/lime/chartreuse hue (this AGENTS.md-adjacent guardrail from Task 02/06 is not reopened by this task).
3. **An explicit ruling on `--accent`**: keep `#B39DFF`, or propose a new value — either way, say why, and re-derive (or explicitly re-confirm) the "closed list of named accent signals" rule from the Task 07 DECISIONS entry. The ruling may keep the same five-item list, prune it, extend it, or replace it with a different rule entirely — but it must be a stated, reasoned ruling, not silence.
4. **Density/spacing direction**: does the refresh want denser cards (more information per screen, ArtConnect's actual grid-of-cards-with-images pattern) or does it keep Fellow.'s current dividers-not-boxes museum-wall-label sparseness with only new colors/type? This is the single highest-leverage decision in the spec — say it plainly, with a one-paragraph rationale tied to what was actually observed on ArtConnect, not just asserted.
5. **Card/imagery style**: Fellow. currently has no images on Hub/Sources/Discover cards (`AGENTS.md`-adjacent product rule, Task 02's "no descriptions on cards" plus the general no-fabricated-imagery posture). State explicitly whether the spec proposes introducing real imagery anywhere (and from where — this cannot be stock/fabricated photos per `AGENTS.md` rule 1) or whether the "new feel" is achieved entirely through color/type/spacing/radius without adding images. Do not silently assume images are in scope — say so if they are not.
6. **A short before/after description per screen** (landing, Hub, opportunity detail, Sources directory, Source detail, Discover, profile) — not full mockups, but enough for a Frontend Engineer to know which token changes touch which screen and whether any component-level layout change (not just token values) is implied. If a screen needs a structural layout change beyond token values, say so explicitly and flag it as a follow-up task rather than silently folding it into this one (per the "one task = one coherent unit of work" convention already used throughout this repo).
7. **Explicit non-goals**: state plainly that ArtConnect's copy, logo, brand mark, content, or positioning are not part of this spec (per `docs/DECISIONS.md` Task 12 §4 — that boundary is not reopened by this task, only the "structure only" half of it is being extended to "structure and now also look").

The spec must be committed to `docs/design/VISUAL_IDENTITY_REFRESH_SPEC.md` before any Frontend Engineer work in §2 begins. If the ux-ui-designer's research surfaces something outside this task's scope (e.g., a genuinely new component pattern, a new font family), it must flag that explicitly rather than quietly expanding scope.

---

## 2. Step two — Frontend Engineer implementation (blocked until §1 lands)

Once `docs/design/VISUAL_IDENTITY_REFRESH_SPEC.md` exists and is committed:

- Update **only** the token *values* in `app/globals.css` per the spec — no new token names, no new CSS files, no inline styles, no new dependency (no icon/font/component package).
- If the spec changes a font family, confirm the font is already available in this project's existing font-loading setup (`next/font` or equivalent already in `app/layout.tsx`) or use a Google Font added the same way the current two fonts are loaded — do not introduce a font-loading mechanism (`<link>` tags, CDN imports, `@font-face` with a hosted file) that differs from the existing pattern.
- If the spec changes `--radius` or spacing-scale values, verify no component has a hard-coded pixel value duplicating what a token now expresses differently (grep for stray `rounded-` / arbitrary Tailwind values that should have been token-driven already — fix only where directly caused by this refresh, not a general audit).
- If the spec's density direction calls for a layout change on a specific screen (§1 item 6), that screen's markup may be touched — but stay literal to what the spec says; do not redesign a screen beyond what it specifies.
- Re-verify contrast for **every** token pairing that changed, not just the ones the spec already computed — if a component combines two tokens in a way the spec didn't anticipate (e.g., `--muted` text on the new `--surface`), compute and log that pairing's ratio in `docs/DECISIONS.md` under this task's heading, same rigor as the Task 02 `--muted`-on-`--bg` precedent.
- Confirm the "one accent per screen family" ruling from §1 item 3 is actually reflected in the code — if the ruling changed the closed list, update every component currently gated on the old list (`SaveOpportunityButton.tsx`, `FollowButton.tsx`, the differentiator chip, the eligibility chip, the recurrence-month word) to match the new ruling.
- Screenshot every major screen at 390px before and after (landing, `/hub`, an opportunity detail page, `/sources`, a source detail page, `/discover`, a public profile) for the PR.

---

## 3. Order of work

1. ux-ui-designer: research pass against ArtConnect, write and commit `docs/design/VISUAL_IDENTITY_REFRESH_SPEC.md` (§1).
2. Frontend Engineer: implement token-value changes per the spec (§2).
3. Frontend Engineer: re-verify contrast for every affected pairing, log in `docs/DECISIONS.md`.
4. Frontend Engineer: reconcile the accent closed-list ruling across all gated components.
5. Screenshots at 390px, before/after, for every major screen.
6. Update `docs/ROADMAP.md` status row for Task 19; verification block (§4).

---

## 4. Verification (paste raw output in the PR — prose is not proof)

```bash
npm ci && npm run lint && npm run build
python -m unittest discover -s scripts
# guardrails — token system respected, no new hex/fonts smuggled into components
grep -rnE "#[0-9A-Fa-f]{6}" app components --include=*.tsx | grep -v opengraph-image || echo OK_no_hex_in_tsx
grep -rniE "yellow|amber|lime|D7FF3F" app components lib || echo OK_no_yellow
grep -n "font-family" app/globals.css   # only the two declared font-family rules should appear
ls docs/design/VISUAL_IDENTITY_REFRESH_SPEC.md
grep -n "accent" docs/DECISIONS.md | grep -i "task 19"
diff <(git show main:app/globals.css) app/globals.css   # confirm only :root token values changed, not selectors/structure, unless the spec explicitly calls for a structural change
```

Manual checklist (attach screenshots, 390px, before/after each):
1. `/` landing
2. `/hub`
3. an opportunity detail page
4. `/sources`
5. a source detail page
6. `/discover`
7. a public profile (`/a/[handle]`)

---

## 5. Do not

- Do not add a new token name, a second styling system, inline styles, or a new dependency (fonts, icons, component libraries).
- Do not import ArtConnect's copy, logo, brand mark, or actual content anywhere (`docs/DECISIONS.md` Task 12 §4 boundary stays in force for content/positioning — only the visual-look boundary is extended by this task).
- Do not start §2 before `docs/design/VISUAL_IDENTITY_REFRESH_SPEC.md` is committed.
- Do not silently decide the accent/closed-list question yourself if you are the Frontend Engineer — that ruling belongs to the ux-ui-designer's spec; implement what it says.
- Do not fold a new component pattern or a screen's structural redesign into this task if the spec flags one as a follow-up — open a new task instead.
- Do not touch Supabase, migrations, sync script, or any non-visual product logic.
