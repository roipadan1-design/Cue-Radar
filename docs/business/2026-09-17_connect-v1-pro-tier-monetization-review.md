# Connect v1 and the "Pro" tier — what to watch before touching pricing

Written 2026-09-17. Author: Business Development pass, reviewing `docs/CUE_RADAR_Product_Plan_v2.md` §5.7 in light of Task 10/Task 11 (`docs/tasks/TASK_10_discover_connect_backend.md`, `docs/tasks/TASK_11_discover_connect_frontend.md`) and the AGENTS.md rule-10 amendment logged in `docs/DECISIONS.md` (2026-09-17). Builds on `docs/RESEARCH_market_scan.md` and `docs/VISION.md` — no new market research was done for this memo; every external figure below is repeated from, and cited to, that existing research.

**Scope of this memo, precisely:** the owner asked what a "Pro" tier could mean now that a first slice of Connect (opt-in discoverable profiles, a Discover directory, a private one-directional follow) is actually being built, rather than purely hypothetical. This is forward-looking analysis of a feature that has not shipped yet and has zero usage data — it is not a claim that Connect already justifies a pricing decision. **This memo does not propose new pricing numbers.** Its job is to say precisely what I'd want to see from the pilot before I'd be comfortable recommending any pricing change tied to Connect, and to flag the two or three ways doing this too early would cost more in trust than it earns in revenue.

---

## 1. What §5.7 actually said, and what's changed since

`docs/CUE_RADAR_Product_Plan_v2.md` §5.7 sketches, explicitly labeled "ideas — not to be decided now" (`רעיונות – לא להחליט עכשיו`):

- **Pro for artists** (~€6/month): daily digest, advanced Fit, materials vault, trip brief, **unlimited Peer Calls**.
- **Institutions**: verified call listings published directly to the Hub (~€49/call or annual subscription).
- **Explicitly not**: ads, selling artist data, paid "featured artists."

Notice what's *not* in that Pro list: nothing about follows, nothing about the Discover directory, nothing about profile visibility. §5.7 was written before Connect had any shipped surface at all, and its Pro bundle leans entirely on features that remain blocked today — digest, Peer Calls, and (per §2.9/§2.7) advanced Fit and the materials vault are all either fully blocked (`digest`, `peer_calls` — AGENTS.md rule 10) or not yet built. Task 10/11's Connect v1 slice — opt-in `is_public`, a directory screen, a private follow — was authorized *narrower* than anything §5.7 imagined monetizing: no follower counts, no messaging, no "also applying," no algorithmic anything. There is currently **no premium lever inside Connect v1 to sell**, because every feature that would plausibly justify one (unlimited follows past a cap, priority placement in Discover, "who's following you" visibility, intros/say-hi) is either not built or explicitly still blocked by rule 10.

So the honest framing is: Connect v1 doesn't yet give Pro anything new to bundle. What it does is make the *existing* §5.7 Pro bundle plausible for the first time, for one specific reason — a Pro artist's advanced Fit, unlimited Peer Calls, and trip brief are only valuable if there's someone worth being discovered by or following in the first place. Connect v1 is infrastructure that makes other monetizable features more valuable later; it is not itself a new SKU.

## 2. Why I'm not proposing a number

Three concrete reasons, not just caution for its own sake:

1. **No usage exists yet.** Task 10/11 haven't merged. There is no follow, no public profile opted in beyond whatever the owner's own test account produces, and no directory traffic. Any price point today would be a guess dressed as a recommendation — exactly the fabrication risk `AGENTS.md` rule 1 exists to prevent, applied to a business number instead of a data row.
2. **The comparable pricing that does exist (`docs/RESEARCH_market_scan.md`) is for a different bundle.** ArtConnect's paid tiers ($4–5/mo "Opportunities Plan," $12–15/mo "Artist Plan," per the market scan) gate deadline-alert tracking and profile-surfacing-to-organizations — closer to Fellow.'s Hub-save and Fit features than to a follow/discovery layer. Contra ($29–79/mo) and Behance Pro ($9.99/mo) monetize marketplace matching and portfolio analytics respectively — neither has a "follow another artist" feature at all. There is no clean external comparable for "pay to follow/be discovered" in this specific niche; citing ArtConnect's number as a proxy for a Connect price would be borrowing a number that answers a different question.
3. **The product's own trust positioning argues against a fast monetization move here.** `docs/VISION.md` explicitly flags, for the Trip Radar venue-partnership idea, that "Trip Radar's v1 must stay curation-first and free of pay-to-rank distortion... revisit only after real usage data." The same logic applies harder to Connect: it's a smaller, more personal surface (another person's visibility, not a venue listing), and the pilot's whole differentiation thesis (`docs/RESEARCH_market_scan.md` Part 3, point 2) is that Fellow. is the one product in this space that makes trust explicit. Monetizing discoverability before it has organic value risks reading as pay-to-be-seen, which is the one thing the plan doc's "what's not on the table" line (§5.7, "no paid featured artists") already ruled out for a reason.

## 3. What I'd want to see before recommending anything

None of these require building a user-facing analytics feature (still blocked by rule 10) — they're queries the owner or a backend engineer can run directly against `profiles` and `follows` via Supabase SQL, the same way `docs/DECISIONS.md` already documents ad hoc verification queries for other tasks. That distinction matters: measuring is not the same as building an analytics product.

**Adoption of the opt-in itself**
- What share of profiles with `is_public = true` existed before Connect v1 vs. turned it on after the Discover screen shipped. If turning `is_public` on doesn't move after the directory exists to be discovered *in*, the incentive to be visible isn't there yet, and a paywall on visibility features would be selling something nobody wants for free either.

**Discovery-side usage**
- Whether `/discover` gets return visits at all, not just first-session curiosity clicks after launch. A single-session bump from the owner's own invite list is not usage; a search/filter session recurring over weeks is.
- Whether the discipline/city filters actually get used (query params populated) versus everyone just scrolling the unfiltered list — this tells you whether "search/filter directory" is the valuable part or whether the directory itself is.

**Follow volume and shape**
- Raw counts: follows given per active user, follows received per public profile, and — importantly — the *distribution*, not just the average. A handful of power users following everyone tells a different story than broad, thin adoption across the pilot cohort.
- Reciprocity rate: what fraction of follows are mutual (A follows B, B follows A) versus one-directional. High reciprocity suggests people are using it as a soft "connections" list even without one existing; that's a signal an intros/say-hi follow-up task (already flagged as fast-follow, not forgotten, in `docs/DECISIONS.md`) might be the next real investment, not a Pro paywall on follow volume itself.
- Repeat behavior: do users who follow once come back and follow more over subsequent weeks, or is it a one-time action taken during profile setup and then abandoned?

**Profile completeness correlation**
- `docs/VISION.md` §Pillar 3 already names profile-completeness as something that should be pulled by Hub/Trip Radar moments, not pushed by a standalone campaign. The equivalent question for Connect: do artists who opt into `is_public` and appear in Discover subsequently complete more of their profile (showreel, bio, gallery) than those who stay private? If discoverability itself drives completion, that's real product value worth protecting behind nothing, not gating.

**Trust and comfort signals**
- Any support/feedback-inbox messages (the mailto channel named in `docs/PILOT_PLAN.md` Phase 5) about unwanted visibility, discomfort being found, or requests to turn `is_public` back off. Even a small number of these in a small pilot is a stronger signal than it looks, because pilot users are self-selected as comfortable early adopters — friction here scales badly.

**What "good" would look like before this memo's recommendation would change**
A rough bar, stated as reasoning not a target to hit on a deadline: sustained (multi-week, not launch-week) directory return visits, a meaningful minority of public profiles receiving unsolicited follows (not just the owner's seed activity), and zero negative-trust signals in the feedback channel. Short of that, Connect v1 should be treated as free infrastructure that makes the *existing* Pro bundle (digest, advanced Fit, materials vault, unlimited Peer Calls — all still blocked features in their own right) more attractive once those ship, not a monetization surface of its own.

## 4. Options, ranked by my judgment — owner decides

**Option A — Do nothing to pricing now; instrument and wait.** Run the SQL-level checks in §3 after Task 10/11 have been live for a defined window (a full pilot cycle, not launch week). Lowest cost, lowest trust risk, and consistent with the "Pro ideas — not to decide now" framing §5.7 already used. This is what I'd recommend today, precisely because the feature has no usage yet.

**Option B — If §3's signals come back strong, treat Connect as a value-add inside the existing §5.7 Pro bundle, not a new line item.** E.g., a Pro tier's "unlimited Peer Calls / advanced Fit / materials vault" bundle becomes more attractive because Connect made the app worth opening for reasons beyond deadlines — but Connect itself (follow, discover, public profile) stays free for everyone, the way LinkedIn's basic connections are free and Premium sells something adjacent (visibility into who viewed you, InMail) rather than the connection itself. Cost: none beyond what's already planned: those Pro features are separately blocked/unbuilt regardless of Connect. Trust risk: low, because nothing currently free becomes paid.

**Option C — A paid tier that raises or removes a cap on follows, or adds priority placement in Discover.** I'd flag this as the highest-risk option and rank it last. It requires a new task to *invent* a cap or ranking mechanism that doesn't exist in Task 10/11's scope today (cost: real engineering work, plus a new owner decision to widen Connect's scope again). More importantly, paid placement in a discovery directory is a direct collision with the trust-first positioning `docs/VISION.md` and the market-scan gap analysis both name as Fellow.'s core differentiator versus every aggregator reviewed — introducing pay-to-rank into the one surface that's about *people*, not opportunities, carries reputational risk disproportionate to what a handful of pilot-stage subscriptions would earn. I would not recommend this without the owner explicitly weighing that tradeoff first, and not before Option A's data exists at all.

## 5. What I am not doing here

Per the brief: no new price is proposed anywhere in this document, no user or follow numbers are estimated (none exist to estimate), and nothing here touches or authorizes work on `intros`, messaging, follower counts, activity feeds, or any other still-blocked piece of Connect. This is a pricing-readiness checklist, not a pricing decision.

---

**Sources**: `docs/CUE_RADAR_Product_Plan_v2.md` §5.7, `docs/RESEARCH_market_scan.md` (ArtConnect, Contra, Behance Pro pricing figures, all cited there with primary links), `docs/VISION.md` (Trip Radar pay-to-rank caution, profile-completeness-by-product-moment argument), `docs/tasks/TASK_10_discover_connect_backend.md`, `docs/tasks/TASK_11_discover_connect_frontend.md`, `docs/DECISIONS.md` (2026-09-17 rule-10 amendment entry), `docs/PILOT_PLAN.md`.
