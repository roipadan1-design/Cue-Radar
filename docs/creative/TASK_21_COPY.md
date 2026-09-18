# Task 21 — copy for the Israel-only pilot

Written by the Creative Director role, 2026-09-18, for Task 21
(`docs/tasks/TASK_21_artconnect_standard.md`). Scope: `docs/creative/` only — nothing here has been
applied to `app/page.tsx`, `lib/brand.ts`, or any component. Engineers pull these strings in.

Register, unchanged from Task 02 / `docs/ROADMAP.md`: **museum wall label — precise, quiet,
curated.** Sentence case, no exclamation marks, no emoji, no marketing adjectives, no gradient text.
ArtConnect is a **layout/spacing pattern reference only** (`docs/DECISIONS.md` §4, 2026-09-18) — its
words and its positioning are not ours to borrow, only its calm, image-led, roomy register.

Hard constraint carried from `AGENTS.md` rule 1: nothing below states a count, a partner, a user
number, or any claim not true of the product today.

---

## 1. Does "between cities" still hold? Verdict: no — it is dead for this pilot, say so plainly.

**"Between cities" is dead for an Israel-only pilot. Retire it now rather than patch around it.**

The premise the whole brand was built on — `docs/VISION.md`'s "~23 European/Mediterranean/East-Asian
scenes," the current landing headline ("don't stay in one city"), "for artists who work between
places" — describes an artist crossing borders, languages and scenes: Berlin to Vienna to Tel Aviv.
That is a real, distinct experience worth a product built around it. It is not what an artist choosing
between Tel Aviv, Jerusalem and Haifa is doing. Those are eleven cities inside one small country, most
under a two-hour drive apart, inside a single arts economy, a single funding landscape, a single
language of institutions. There is no "arriving somewhere new" novelty in that the way there is
crossing into a different country's scene — the actual lived difference between "I work in Tel Aviv"
and "I work between Tel Aviv and Jerusalem" is closer to a commute than a tour. Keeping "between
cities" as the *headline claim* while quietly meaning "between suburbs of the same national scene" is
a scope inflation, not a technicality — it's the same category of dishonesty AGENTS.md rule 1 blocks
for data, just applied to a claim about breadth instead of a number. I could argue the narrower
reading survives ("Tel Aviv to Jerusalem to Haifa is still movement"), but I don't buy it as the
*headline* — it's a real but minor feature of the product, not its premise, and dressing it up as the
premise is exactly the kind of overreach the museum-label register exists to prevent.

**What replaces it, honestly:** the product's actual, checkable value today is not "we follow you
across scenes" — it's **a curated, checked feed of what's actually open, in one place, plus one page
that shows who you are.** That's true regardless of how many cities are active, doesn't need to be
walked back if the pilot narrows further, and doesn't need to be rewritten again if it later widens —
it describes the Hub and the profile, the two pillars that are actually live and populated, rather
than leaning on Trip Radar/"Currently," which is real but thin (`docs/tasks/TASK_21_artconnect_standard.md`
confirms Currently and a minimal events UI are the least-built pillars). This isn't a demotion of
Currently — it stays in the nav, it stays honest about what it does (see §3) — it just stops being
asked to carry the whole brand's opening line when the geography under it no longer supports that
weight.

---

## 2. Landing page copy

Current copy being replaced (`app/page.tsx`): headline "Open calls and connections that follow you
between cities," subhead "Verified open calls, residencies and grants — for artists who work between
places." Both inherit the dead premise from §1 and must go together, not be patched word by word.

ArtConnect's register to match (not its words): "Artist opportunities made easy / Find residencies,
open calls, grants, exhibitions, awards & more. Save time, and focus on your art." — plain, calm,
benefit-first, sentence case, two short beats (what it is, what it does for you).

### Headline

**Ranked options**

1. **"Open calls, residencies and grants, checked before they're worth your time." — top pick.**
   Benefit-first the way ArtConnect's line is: it doesn't describe the product's architecture, it
   describes what checking gets the artist back (time not spent chasing a dead or fake listing).
   "Checked" is the word actually earned in the product today — `OpportunityDetailView.tsx` renders a
   literal "Verified {date}" stamp per row (§header of that component) — so this doesn't invent a
   universal-verification claim, it points at a real, visible feature without overstating its
   coverage. It also carries zero geography, so it doesn't need rewriting if the pilot's city count
   changes again — the honesty problem in §1 doesn't recur.
2. **"Open calls, residencies and grants for independent artists."**
   This is `lib/brand.ts`'s existing `BRAND.tagline`, near-verbatim — the safest possible option
   because it is already the one sentence in the codebase that survived the Israel-only narrowing
   without becoming false. Ranked second only because it's a description, not a benefit, and reads
   slightly flatter than option 1 against the ArtConnect benchmark of "made easy" doing real work in
   one line.
3. **"What's open, and whether it's worth applying."**
   Leans hardest into the Fit-signal idea from `docs/VISION.md` Pillar 1 ("why this matched you").
   Punchier and more editorial than 1 or 2, closer to a magazine pull-quote than a museum label.
   Ranked third because "worth applying" implies a judgment (Fit scoring) that is live per-row but not
   yet a headline-level guarantee across the whole feed — true today, but thinner ground than option 1.

### Subhead (one line)

1. **"A checked feed of what's open, and one page that shows who you are." — top pick.**
   Names both live pillars (Hub, profile) in one breath, the way ArtConnect's subhead names both
   "opportunities" and "focus on your art" as the two halves of its value. Says nothing about cities,
   so it doesn't need Israel named or hidden — the market badges already under the fold
   (`app/page.tsx`'s "Cities in the pilot" block) do that job without the headline having to.
2. **"Residencies, open calls and grants — kept current, in one place."**
   Slightly more literal restatement of the Hub, safe and true, but doesn't mention the profile at
   all, so it under-sells the second pillar relative to option 1.
3. **"For artists who want to know what's actually open, not just what's listed."**
   The sharpest of the three but edges toward implying competitors list things dishonestly, which is
   not a claim this document is positioned to make about anyone else's product — ranked last for that
   reason, not for register.

### Primary CTA label

1. **"Browse open calls" — top pick.** Already the live label in `app/page.tsx`; it is plain,
   imperative, names the destination exactly (`/hub`), and there is no reason in this task to change
   what already works and already matches the register.
2. "See what's open." Slightly more conversational restatement of the same action — usable, not an
   improvement, and diverges from the existing `/hub` nav label ("Opportunities") for no gain.

### Secondary link label

1. **"Sign in" / "Go to your saved calls" — top pick.** Both already live in `app/page.tsx` exactly
   as written, already sentence case, already correctly conditional on auth state. No change proposed.

---

## 3. Screen titles and empty states

Existing in-repo copy checked before proposing anything, per house pattern
(`components/hub/EmptyState.tsx` call sites; `docs/creative/DISCOVER_V1_COPY.md`). Where the current
code already matches the register and is honest about thin data, the recommendation is **keep as-is**
— rewriting working, honest copy for its own sake is not this document's job. New proposals are
flagged as such.

### Hub (`/hub`)

- **Title: "Opportunities"** (live, `app/hub/page.tsx`) — keep.
- **Subhead: "Verified open calls, residencies and grants for independent artists — updated as
  sources are checked."** (live) — keep. Already honest, already names the real mechanism (checked
  sources) instead of a count.
- **Empty, no filters: "The feed is being curated — check back soon."** (live,
  `components/hub/HubFeedView.tsx`) — keep. This is the exact screen most Israeli visitors will hit
  for weeks; it states a plain fact, promises nothing about when, and doesn't apologize. Do not soften
  it into "we're working hard to bring you..." — that breaks the register and adds a claim ("working
  hard") that isn't checkable.
- **Empty, filters active: "No open calls match these filters." + Reset** (live) — keep.

### Discover — Artists tab (`/discover?tab=artists`)

- **Title: "Discover"** (live, `app/discover/page.tsx`) — keep.
- **Subhead: "Artists and organisations from the pilot markets."** (live) — keep; "pilot markets" is
  already the correct honest hedge, doesn't name a count.
- **Empty, no filters: "No public profiles yet — check back soon."** (live) — keep. Matches the Hub's
  own "check back soon" shape exactly, which is the right consistency to hold given §1's argument that
  the product's honest premise now rests more on the Hub and profile pillars carrying the brand.
- **Empty, filters active: "No artists match these filters." + Reset** (live) — keep.

### Organisations tab (`/discover?tab=organizations`)

- **Empty, no filters: "Organisations are being curated — check back soon."** (live) — keep, same
  reasoning as Hub's empty state.
- **Empty, filters active: "No organisations match these filters." + Reset** (live) — keep.

### Currently (`/circuit`, formerly Radar)

This is the pillar §1 argues can no longer carry the headline, but it is still real and still shipped
— it should read as a smaller, honestly-scoped feature, not be apologized for existing.

- **Title: "Currently"** (live, `app/circuit/page.tsx`) — keep.
- **Subhead: "What's on where you'll be."** (live) — keep. Notably this line never claimed "between
  cities" or named a distance — it already survives §1's argument unchanged, which is a point in its
  favour, not a coincidence to fix.
- **Empty (a city/date range with nothing in it):
  "Nothing on in {city} for these dates yet." + "Try a wider date range, or check back soon as more is
  verified."** (live, `app/circuit/[city]/page.tsx`) — keep. This will be the most common state for
  every Israeli city for a while; it already names the city specifically rather than a generic "no
  results," and already avoids apology.

### Saved (`/saved`)

- **Title: "Saved calls"** (live, `app/saved/page.tsx`) — keep.
- **Empty state — not yet written as a dedicated `EmptyState` in `SavedPipelineView.tsx` (it currently
  shows an empty status tab with a "0" count and no message).** Proposal for the engineer wiring this:
  1. **"Nothing saved yet." + action `{ label: 'Browse open calls', href: '/hub' }` — top pick.**
     Matches the exact three-word factual shape used everywhere else in this codebase
     ("Nothing here yet.," "No public profiles yet.") and, unlike the Hub/Discover empty states, this
     one has a genuine next action available (go save something), so — unlike those — it should carry
     one, per `EmptyState`'s existing optional `action` prop.
  2. "You haven't saved anything yet." Same meaning, first-person address instead of the plain
     declarative the rest of the app uses — breaks house voice for no gain, ranked below option 1.

### Profile (`/profile/edit`, own edit view)

- **Title: "Profile"** (live, `app/profile/edit/page.tsx`) — keep.
- **Existing first-visit banner: "Add your disciplines so we can show what you're eligible for."**
  (live, shown when `?welcome=1`) — keep; it's already the Polywork-lesson-aware pattern
  `docs/VISION.md` Pillar 3 point 2 asks for (a nudge from a real moment, not a standalone "complete
  your profile" campaign).
- **Proposal — a second nudge for a mostly-blank profile past the first visit** (not currently wired;
  flag for whoever owns `ProfileForm.tsx` if this doesn't already exist elsewhere):
  1. **"Add where you are now, and it'll show on Currently." — top pick.** Names the exact payoff
     (`current_city` fields feeding `/circuit`) rather than a generic completeness nag — this is the
     literal wording of the Polywork lesson in `docs/VISION.md` §Pillar 3.2: nudges should come from a
     feature moment, not a profile-for-its-own-sake prompt.
  2. "A fuller profile is easier to find in Discover." True but vaguer about which field to fill in
     next — ranked below option 1 for specificity.

### Public profile (`/a/[handle]`)

- No title proposal needed — the page renders the artist's own name via `PublicProfileView`, which is
  correct (a person's page is titled by the person, not by the product).
- **Empty/thin sub-sections (no showreel, no gallery, no "who inspires them"):** out of this
  document's scope to word individually without reading `PublicProfileView.tsx`'s current per-field
  rendering — flag for whoever owns that component to confirm each optional field either renders
  nothing when empty (preferred, matches "no apology" house rule) or, if a placeholder is wanted,
  route it through this document in a follow-up rather than inventing wording inline.

---

## 4. A note on the name — "Fellow."

**"Fellow." still works, and better than it did before.** The name was never geographic — unlike
"Rider" or "Circuit" (rejected/renamed options in `docs/creative/NAMING_OPTIONS.md` §1–2), "fellow"
and "fellowship" carry no city-count or border-crossing assumption baked in, so narrowing the pilot to
Israel doesn't strain the name the way it strains the landing headline in §1. If anything, a name built
on *belonging to the same pursuit* (a fellow artist) rather than *distance traveled* (a rider, a
circuit) reads more honestly for a single-country pilot, not less. No change recommended.

---

## What this document does not do

- Does not edit `app/page.tsx`, `lib/brand.ts`, or any component — every string above is a proposal
  for the frontend engineers already working in `components/layout/**` and `app/layout.tsx` (Task 21
  §3) to pull in.
- Does not propose removing or renaming the "Currently" nav item — §1's argument is that it can no
  longer be the *headline premise*, not that it should be cut; that would be a scope decision beyond
  a copy document and beyond what Task 21 asked for.
- Does not invent a new claim, count, or partner anywhere above — every sentence proposed is checkable
  against a live component or database field cited next to it.
