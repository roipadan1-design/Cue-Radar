# Task 19 — Visual identity refresh spec

Status: spec only. No application code changed by this document. Written for Frontend Engineer
implementation once reviewed. Canonical path per `docs/tasks/TASK_19_visual_identity_refresh.md`
§1 and its own verification block (`ls docs/design/VISUAL_IDENTITY_REFRESH_SPEC.md`). Identical
content also kept at `docs/design/TASK_19_VISUAL_REFRESH_SPEC.md` per this session's own naming
instruction — same file, two paths, so neither check fails.

Read before writing this: `AGENTS.md`, `docs/HANDOFF_V3.md`, `docs/design/DESIGN_BRIEF.md`,
`docs/tasks/TASK_19_visual_identity_refresh.md`, `app/globals.css`, and the 2026-09-18
`docs/DECISIONS.md` entries — "Task 07 — accent rule, final," "Task 12 — Israel-only pilot
pivot" §4 ("structure not skin"), "ux-ui-designer pass — ArtConnect structural mapping," and
"Task planning pass — Tasks 19–20 created, owner feedback."

Method: browsed [artconnect.com](https://www.artconnect.com) directly in a real browser
(mobile 375px emulation first, desktop second) on 2026-09-18 — landing, the opportunities
search/listing page, the Discover directory (Artists tab), an artist profile, and the signup
paywall modal (triggered when an anonymous visitor opens a card's "See more" or the filter
panel — ArtConnect gates those behind account creation, so its opportunity detail page and
full filter panel could not be directly inspected as an anonymous visitor; the listing card,
the Discover directory, and the paywall modal itself all rendered fully and were inspected
directly). Compared side-by-side against Fellow.'s own local dev server (`localhost:3000`) at
the same 375px width — landing, Hub, sign-in, and the source detail page were captured live in
this session; the remaining screens (opportunity detail, Sources directory, Discover, a public
profile) are specified from the already-current, previously-screenshotted code and the token
values in `app/globals.css`, not re-invented.

**One disclosed tooling gap, stated plainly rather than guessed around**: the coordinator asked
me to confirm ArtConnect's exact `font-family`/`weight`/`size` via `getComputedStyle`. This
session's browser tools have no JavaScript-execution action (no `eval`, no console access, no
DevTools panel) — only navigate/click/type/screenshot/read-accessibility-tree. `javascript:` and
`view-source:` URIs are both rejected by the navigate tool's own URL validator before they ever
reach the browser. I also tried three indirect routes: (1) `WebFetch` on the live page with an
explicit prompt to quote any `@font-face`, `Fallback`, or font-related class name in the raw
source — `WebFetch` converts HTML to markdown before its model ever sees it, which strips
`<head>`/`<style>` entirely, so this returned nothing both times I tried; (2) BuiltWith's
technology lookup for artconnect.com — it detects Next.js/React and a long list of analytics/
commerce tools but **no font service** (consistent with a self-hosted `next/font` setup that
never calls `fonts.googleapis.com`, which is exactly why nothing showed up — not evidence of no
font); (3) targeted web search for a design case study or brand-guideline document naming
ArtConnect's typeface — none exists publicly, matching the Research department's own finding
that ArtConnect has no public brand guidelines or credited designer. **I could not verify the
literal font-family string, and I'm not guessing a commercial name to fill the gap** — the
values below are grounded only in what I directly observed on screen (weight, case, size,
tracking, terminal shape), which is what actually matters for this spec anyway, since Fellow.
is not adopting a new font family regardless (see §3.3).

---

## 0. Non-goals (stated up front, per the task's own §1 item 7)

ArtConnect's copy, logo, brand mark, actual content, scale claims, or product positioning are
not part of this spec, and were not looked at for that purpose. This is a visual-language
reference only — palette character, type treatment, density, card/imagery style — per
`docs/DECISIONS.md`'s Task 12 §4 boundary, which this task explicitly extends from "structure"
to "structure and now also look," not further. No ArtConnect color value, font name, icon, or
copy string appears anywhere below as something to copy verbatim.

---

## 1. What ArtConnect actually looks like — grounded findings

### 1.1 Palette

ArtConnect is a **light theme**: white/near-white page background throughout, black body text,
black bold headlines. This is the single biggest structural difference from Fellow.'s dark
editorial register — and, per §4 below, one I'm recommending Fellow. does **not** copy.

Within that light base, ArtConnect uses **several simultaneous saturated hues, each tied to a
specific fact**, not one accent:
- A **pink/rose filled pill** for the opportunity-type label (`OPEN CALL`, `COMMISSION`) — pale
  rose background, dark maroon text, no border.
- A **pale-blue filled pill** for a different type (`RESIDENCY`) — so type itself is
  color-coded per value, not one consistent treatment for "type" as a category.
- A **green filled pill** for `FREE` (the fee/cost fact) — the same green regardless of context,
  the one genuinely consistent color-to-meaning mapping I found.
- A **bright, saturated blue** for the "verified organization" checkmark badge (small circle,
  white check) on every institution/org name — this exact blue reappears as the primary button
  fill inside the signup/paywall modal ("Get Started," "Sign in" state), suggesting blue is
  ArtConnect's actual brand/action color, with pink/green reserved for card-level tags.
- **Solid black** for the primary marketing CTA on the homepage hero ("Get started") and for the
  per-card secondary action ("See more →") — black, not blue, is what a first-time visitor
  actually clicks most.

None of these are pastel in the way Fellow.'s current `--accent` is — they read as fully-decided,
confident colors (real saturation), not washed-out or hesitant. That confidence, not the
specific hues, is the transferable finding (§3.1).

### 1.2 Typography

Headlines (`Artist Opportunities`, `Discover Artists`, the paywall modal's `Start free, upgrade
when you're ready`) are set in a **geometric grotesque sans, extremely heavy weight (visually
800–900), large, tight-to-slightly-negative letter-spacing, and — critically — mixed case, never
uppercase**. Rounded bowls, low stroke contrast, similar spirit to the same family Archivo
already belongs to. Body copy (card meta, the descriptive paragraph under each headline) is a
plain-weight sans, comfortable size (~16–17px equivalent), generous line-height, mid-gray for
secondary text — a fairly ordinary two-tier hierarchy (nothing more exotic than what Linear or
Are.na already do, both already in Fellow.'s own reference sheet).

The thing that actually reads as "different" here is not the typeface family — it's that
**every headline on ArtConnect is mixed-case**. Fellow. currently sets its uppercase, tight-
tracked `.t-display`/`.t-title` treatment on effectively every page header, institution name,
and section title site-wide (`grep -rl "t-title"` returns 15 app-code files: Hub, Sources,
Source detail, Discover, Saved, Sign in, Sign up, Profile edit, Circuit, 404, Privacy, Demo).
Because the same loud, shouty, all-caps move repeats on literally every screen, it stops reading
as a considered signal and starts reading as a mannerism — which is a plausible, concrete
contributor to "everything looks the same," independent of any color change. See §3.3.

### 1.3 Density and card anatomy

ArtConnect's opportunity card is **denser in facts-per-card** than Fellow.'s: title, a
sponsor/org row with avatar photo and verified badge, a "Rewards" row of 2–3 small icons
(easel/studio, cash, a generic "+more" plus-circle), a `Fees` pill, a `Deadline` value, and two
footer actions (`Save` ghost button, `See more →` solid button) — six to seven distinct facts
before you ever open the card. Fellow.'s current Hub row deliberately shows far fewer facts
(title, source, up to 3 tags, one figure, one deadline) per `docs/design/DESIGN_BRIEF.md` §2's
"precision over coverage" rule. This is a real, measurable density difference — but it is a
**card-anatomy decision** (what facts appear on the card face), not a spacing-token or
whitespace decision, and card anatomy is not what this token-values-only task is authorized to
touch (see §4 for why I'm not recommending Fellow. copy it).

The **card frame itself**, though, is actually already close to what Fellow. does: a plain
outlined rectangle (1–2px black border), page-color fill (not a separately-tinted card
background), no shadow, no gradient. ArtConnect's cards sit directly on the same white as the
page behind them, exactly the way Fellow.'s cards already sit on `--bg`, not `--surface`, per
the existing Task 02/4.1 rule. This is independent confirmation that "border-defined, not
fill-defined" cards are a sound, non-generic choice — not something to change.

Corner radius is visibly larger on ArtConnect than Fellow.'s current 2px — roughly 8px on cards,
close to fully-rounded on pill tags and buttons. See §3.5 for why I'm recommending Fellow. not
adopt this.

### 1.4 Imagery

ArtConnect uses real photography extensively and is a large part of why it reads as a lived-in,
populated product: circular avatar photos on every org/artist card, and on the Discover/artist
directory specifically, a horizontally-scrolling strip of real, uncropped artwork photography
("Recently Added Artworks") directly under each profile's identity block. Opportunity cards do
not carry a cover image (just the small round org avatar) — the photography lives on profiles,
not on the opportunities feed.

### 1.5 Motion / interaction

No hover-lift, no parallax, no card animation observed on either the listing or directory pages
— tab switches (Artists/Curators/Organizations) and the mobile filter panel both open as plain,
immediate state changes. Consistent with Fellow.'s own no-motion-except-necessary posture; no
change indicated here.

---

## 2. Fellow. today, for direct comparison (captured live, same 375px width, 2026-09-18)

- **Landing** (`app/page.tsx`): near-black `--bg`, centered uppercase `.t-display` headline in
  `--fg`, one `bg-accent` primary button (`Browse open calls`), a muted outline-chip city list
  below. Confirmed live.
- **Hub** (`app/hub/page.tsx` / `OpportunityRow.tsx`): search field, 5 wrapping quick-toggle
  outline chips, one `Filters` button, then a `.t-meta` date line, an uppercase `.t-display`
  section header ("OPPORTUNITIES"), then bordered cards — sentence-case `.t-row` title, muted
  source name, 3–4 outline tag chips (one, `FUNDED`, rendered `border-accent text-accent` per
  the Task 07 closed list), a `t-num` funding figure, and a right-aligned deadline in `--urgent`
  red when inside 7 days. Confirmed live.
- **Sign in** (`app/signin/page.tsx`): uppercase `.t-title` header, an outline "Continue with
  Google" button, plain form fields on `--bg` (no separate surface fill), one `bg-accent`
  primary `Sign in` button. Confirmed live.
- **Source detail** (`app/sources/[id]/page.tsx`): `← Sources` back-link, a two-tab
  `Overview`/`Past & open calls` row using the existing `bg-fg text-bg` "selected" convention,
  a `t-meta` institution/city line, an uppercase `.t-title` institution name, then plain body
  text. Confirmed live.
- Opportunity detail, Sources directory, Discover, and a public profile were not re-captured
  live in this pass (see §0) but are already fully specified in `docs/design/SOURCE_DETAIL_SPEC.md`,
  `docs/design/SOURCES_DIRECTORY_SPEC.md`, and `docs/design/DISCOVER_V1_SPEC.md`, and already use
  the same token set this spec proposes adjusting — §6 below states what changes on each from
  the token changes alone, with no new component work implied.

Net read: Fellow. today is already disciplined, already avoids ArtConnect's most generic moves
(filled colored pills, card-as-second-CTA, rounded-corner softness). What it is missing, based on
direct comparison, is **color confidence** and **typographic variety across screens** — both
fixable inside the existing token system, which is exactly this task's scope.

---

## 3. Proposed token changes

### 3.1 `--accent` — ruling: keep the hue family, recalibrate the value, keep the closed list

**Current**: `#B39DFF` — HSL(253°, 100%, 81%). A fully-saturated but very light (81% lightness)
violet — pastel. Contrast against `--bg` (#0A0A0A): **8.7:1** (recomputed directly; matches the
`8.2:1` already logged for this pair in `docs/DECISIONS.md` Task 03, small variance is rounding
method, not a discrepancy).

**Proposed**: `#AA80FF` — HSL(260°, 100%, 75%). Same hue family (violet-blue), same full
saturation, **lightness reduced from 81% to 75%** and hue nudged 7° bluer. In practice this
reads as a more decided, less washed-out violet — closer to the confidence I actually observed
in ArtConnect's blue/green tag colors (§1.1) — without leaving the hue family the owner already
picked in Task 03, and without becoming a second brand color.

**Contrast, computed the same way as the Task 03 precedent**:
| Pairing | Ratio | Passes |
|---|---|---|
| `#AA80FF` text on `--bg` (#0A0A0A) | **6.8:1** | AA (4.5:1) and AA-large/UI (3:1); short of AAA's 7:1 by a small margin |
| `#AA80FF` text on `--surface` (#111111) | **6.5:1** | AA and AA-large/UI |
| `--bg` text on `#AA80FF` fill (the primary-button case: `bg-accent text-bg`) | **6.8:1** (same two colors, ratio is symmetric) | AA and AA-large/UI |

All three pairings clear the 4.5:1 floor this department requires with real margin. They sit
just under AAA (7:1) where the current pastel value clears it (8.7:1) — a real, honest trade-off:
the new value is less pastel and therefore very slightly less contrasty, while still comfortably
passing the binding AA standard everywhere it's used. Flagging this trade explicitly rather than
picking a value that dodges it by accident.

**Alternative, if the owner would rather not trade any contrast margin**: keep `#B39DFF`
exactly as-is. Nothing in the ArtConnect research is strong enough evidence to force a change
here — it's a "worth doing" call, not a "must do." Either value is defensible; I'm recommending
the change because color confidence was the single most concrete, describable difference between
the two products in §1.1, and this is the cheapest, lowest-risk way to act on that finding
without opening a second hue.

**Closed list of named signals (Task 07's rule)**: **kept exactly as-is, unchanged, all 5
entries** — primary action fill, the differentiator chip, eligibility confirmation, the
Follow/Following state, the recurrence-forecast month. ArtConnect's own busier, multi-hue card
(§1.1, §1.3) was direct, live evidence for what happens when a product uses color per category
rather than per disciplined meaning — cards there mix a rose pill, a blue pill, a green pill, and
a blue badge simultaneously, and it reads exactly like the "generic SaaS/AI-template" register
`docs/design/DESIGN_BRIEF.md` §6 already told Fellow. to avoid. Nothing in this research pass
surfaced a real, missing 6th signal that needs its own accent placement. Loosening the closed
list would move Fellow. structurally closer to ArtConnect's busier card, which contradicts
Task 12's own stated differentiation strategy (curation and restraint, not feature/breadth
parity with a 100,000-artist generalist). **Ruling: same mechanism, same five meanings, only the
underlying hex value changes.**

Never yellow-family — `#AA80FF` isn't, satisfies the standing guardrail.

### 3.2 `--bg` / `--surface` relationship — ruling: no change

Current: `--bg #0A0A0A`, `--surface #111111` — a very subtle ~4% lightness step, deliberately
reserved for chrome (top bar, bottom nav, sheets, empty states) per the existing Task 02 rule,
never a general card fill. ArtConnect has no real analogue to audit this against — it's a flat
white page throughout, with cards defined purely by their own border, never by a background-tint
step. That is, in fact, independent confirmation of Fellow.'s existing "cards live on `--bg`,
not `--surface`" rule (§1.3) — it doesn't argue for changing the `--bg`/`--surface` gap itself
one way or the other. **I'm not proposing a change here because I don't have grounded evidence
for one**, not because the pairing is beyond question — if a future pass wants more visible
chrome separation, that's a defensible follow-up, but it isn't something this ArtConnect
comparison actually surfaced.

### 3.3 Typography — ruling: no new font family; change the uppercase treatment on `.t-title` only

**No new typeface.** Archivo (display) and Manrope (body) stay. Three reasons: (1) the
"hard constraint" section of this task explicitly limits a font change to the existing
`next/font` loading mechanism, which is possible but not required — and (2) I could not verify
ArtConnect's actual font-family (§0's disclosed gap), so recommending a specific replacement
would mean guessing at a commercial license/name I never confirmed, which this department's own
research-grounding standard rules out; and (3) the concrete, describable difference I *did*
verify — mixed case vs. uppercase, repeated site-wide — is fixable without touching the font
files at all.

**Proposed change**: `.t-title` (`app/globals.css` `@layer components`) drops
`text-transform: uppercase`, keeping everything else — Archivo, weight 800, `letter-spacing:
-0.02em`, `line-height: 1.0`, the existing 22px/28px responsive size step. This one style-rule
edit (not a new token, not a new class — an existing named style's value) is what actually
produces something close to ArtConnect's headline character (heavy weight, tight tracking,
mixed case) using the font Fellow. already has, and it touches every screen that currently
carries a `.t-title` (15 files, per the `grep` in §1.2) with zero component-level code change —
just re-rendering the same text, unchanged, in mixed case instead of upper case.

`.t-display` (36/64px, used only on the landing hero and the `Currently` page header) **stays
uppercase, unchanged**. Reserving the shout for the one loudest headline on the site — instead
of repeating it on every institution name and page title — is a direct application of
`docs/design/DESIGN_BRIEF.md` §2's "one thing is allowed to be loud per screen" doctrine, applied
to the typography treatment itself, not just to color. Net effect: uppercase becomes a real,
rare signal again instead of a site-wide mannerism, which is closer to what actually
differentiates ArtConnect's headlines from Fellow.'s today (§1.2) than any font swap would be.

`.t-row`, `.t-body`, `.t-meta`, `.t-num` — **no change**. These were already sentence-case/
lower-case where appropriate (confirmed in `app/globals.css`); ArtConnect's own body-copy
register (plain weight, generous line-height, muted secondary tone) is already what Fellow. does
here. Five type styles stay five type styles — no sixth is proposed.

### 3.4 Spacing scale (`--space-1..8`) — ruling: no change

No evidence from this research pass argues for changing the numeric spacing scale itself.
ArtConnect's greater apparent density (§1.3) comes from **more facts per card**, a component/
card-anatomy decision, not from tighter spacing values — its outer margins and line-heights are
comparable to Fellow.'s own. Copying the card-anatomy density would be new component-pattern
work explicitly out of this token-only task's scope (per the task file's own "flag back rather
than implement" instruction for anything that isn't a token value) — and would also contradict
the still-locked "precision over coverage, no summary on the card" rule in
`docs/design/DESIGN_BRIEF.md` §2/§4.1, which this task does not reopen. **Explicit density
ruling for item 4 of the task's brief: Fellow. keeps its current dividers-not-boxes,
few-facts-per-card sparseness. The "new feel" this task delivers comes from color and
typography treatment (§3.1, §3.3), not from a denser grid of cards with more visible facts.**

### 3.5 `--radius` — ruling: no change, kept at 2px

ArtConnect's cards, tags, and buttons all use a noticeably larger radius (roughly 8px on cards,
near-full round on pills and buttons) than Fellow.'s current 2px. This is real, visible, and
easy to copy — and I'm recommending against it. Reasoning, tied directly to what I saw: a larger,
softer radius is the single most generic-SaaS-reading move available (`docs/design/DESIGN_BRIEF.md`
§6 already names "soft/large border-radius" as one of the "default reflexes of generic card
templates" to actively avoid), and seeing it in ArtConnect's actual live product only reinforces
that read — ArtConnect's rounded corners are a large part of why it looks like a well-executed
generalist SaaS product rather than something with its own sharp, edited identity. Task 12's own
strategy is for Fellow. to differentiate from ArtConnect on curation and register, not to
converge toward its shape. Keeping 2px is a considered "no" grounded in direct comparison, not an
oversight — flagging it as a live ruling per the task's own instruction to say plainly, not
silently decide.

---

## 4. Card / imagery — ruling: no images introduced anywhere

ArtConnect's visual richness leans heavily on real photography (§1.4) — org avatars, artist
avatars, artwork galleries. Fellow.'s own hard rules make most of that unavailable regardless of
this task's scope: `AGENTS.md` rule 1 forbids fabricated/stock imagery, there is no image
pipeline for `opportunities` or `sources` today (`docs/design/DESIGN_BRIEF.md` §4.1 states this
explicitly), and building one is real backend/data work, not a token-value change. The one place
Fellow. already has a legitimate path to real imagery — `profiles.avatar_url`, user-uploaded,
already live per `docs/HANDOFF_V3.md` Part D — is untouched by this task; nothing here proposes
adding avatar display anywhere it doesn't already appear, and nothing here proposes an
artwork-gallery-style feature (that would be new product scope, not a visual-refresh token
change). **Explicit statement per the task's own item 5: this spec does not introduce imagery
anywhere. The "new feel" is achieved entirely through the color and typography changes in §3,
not through pictures.** If a future task wants to explore a real image pipeline for institutions
or opportunities, that's its own scoped piece of work, flagged here as a possible follow-up, not
folded into this one.

---

## 5. Per-screen before/after

| Screen | Token/style changes that reach it | Structural change needed? |
|---|---|---|
| `/` landing | `--accent` new value (hero CTA fill); `.t-display` unchanged (stays uppercase, this is its one reserved use) | No |
| `/hub` | `--accent` new value (differentiator chip, `Filters`/primary states); `.t-title` no longer uppercase (the "OPPORTUNITIES" section header) | No |
| an opportunity detail page | `--accent` new value (Apply button fill, Eligible ✓, Saved outline state); `.t-title` no longer uppercase if the page uses it for its header (verify against current code — if it uses `.t-row` instead, no visible change here) | No |
| `/sources` | `--accent` new value if the directory uses an accent state anywhere; `.t-title` no longer uppercase (page header "Sources") | No |
| a source detail page | `.t-title` no longer uppercase (institution name); `--accent` new value (the recurrence-month word, Task 09 §4) | No |
| `/discover` | `.t-title` no longer uppercase (page header "Discover"); `--accent` new value (Following state) | No |
| a public profile (`/a/[handle]`) | `.t-title`/`.t-display` per `PublicProfileView.tsx`'s existing choice (grep shows it uses both — Frontend Engineer should confirm which element is which before assuming); `--accent` new value (Following state) | No |

No screen in this list needs a layout or component change — every row above is a token-value
substitution (`--accent`) or a single existing-style-rule edit (`.t-title`'s `text-transform`).
That is a deliberate outcome of staying inside this task's stated boundary, not a sign the
research stopped short — the two changes above are exactly the ones the ArtConnect comparison
actually supports; anything bigger (rounded corners, denser cards, imagery) is explicitly ruled
against in §3.5, §3.4, and §4, with reasoning, rather than left unaddressed.

---

## 6. Verification data for whoever implements this

- New `--accent` value: `#AA80FF`.
- Contrast ratios computed above (§3.1) using the same relative-luminance method as the existing
  Task 03 precedent in `docs/DECISIONS.md`; log them there again under this task's heading once
  implemented, per the task file's own §2 instruction to re-verify every changed pairing.
- `.t-title` edit is a single property removal (`text-transform: uppercase;`) inside the
  existing `@layer components { .t-title { ... } }` rule in `app/globals.css` — not a new class,
  not a new token name.
- No other token in `app/globals.css` changes: `--bg`, `--surface`, `--line`, `--line-strong`,
  `--fg`, `--muted`, `--urgent`, `--radius`, `--space-1..8`, and both font-family assignments are
  all **unchanged**, each with a stated reason above (§3.2, §3.4, §3.5) rather than left silent.
- No new hex/rgb/font-name in any `.tsx` file is implied — the only literal value anywhere is the
  one new `--accent` hex, inside `app/globals.css`'s own `:root` block, exactly where the
  existing value already lives.

---

## 7. Summary for the owner

Four real changes, each traceable to something actually seen on ArtConnect, each expressed as
existing-token values:

1. **`--accent` gets more confident, not a new color** (`#B39DFF` → `#AA80FF` — same violet
   family, less pastel). Grounded in ArtConnect's use of fully-saturated, decided color for every
   coded signal, versus Fellow.'s current soft pastel.
2. **Page/section headers stop shouting in uppercase** (`.t-title` → mixed case, same weight/
   tracking/font). Grounded directly in ArtConnect's own bold-but-mixed-case headline register,
   and in the fact that Fellow.'s uppercase treatment currently repeats identically on 15 screens
   — diluting it into a mannerism rather than a signal. The landing hero keeps its uppercase
   shout, now genuinely rare instead of universal.
3. **The accent's closed list of 5 meanings stays exactly as it was ruled in Task 07** — this
   research found no case for loosening it, and a live look at ArtConnect's busier, multi-hue
   cards is direct evidence for why not to.
4. **Radius, spacing scale, background/surface relationship, and imagery all stay as they are**
   — each a considered "no," not an oversight, reasoned against what ArtConnect actually does
   differently there (softer corners, denser cards, real photography) and against Fellow.'s own
   already-stated differentiation strategy (curation and restraint, not shape-parity with a
   100,000-artist generalist directory).

Everything above routes through the existing `app/globals.css` CSS-variable system — one new hex
value for `--accent`, one existing style rule's `text-transform` removed. No new token name, no
new font, no new dependency, no inline style, no component redesign. Ready for Frontend Engineer
implementation.
