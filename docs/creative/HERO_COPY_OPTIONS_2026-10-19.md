# Landing hero: three options (round two)

Creative Director proposal, 2026-10-19. Replaces the rejected round in `TASK_23_HOME_COPY.md`
(headline "Where to be tonight, who to know, what comes next."). Nothing here is wired into
`app/page.tsx`; the owner approves first.

Brief: the home for artists who work between cities, said in their own words. No "alternative",
"underground", "independent", "outside the mainstream". Three ideas in every option: connection,
opportunity, "what's on where I am, on my dates". No city names, no statistics, no dashes as
pauses, no "unlock / empower / thrive / journey".

Truth flags: open calls and funding are "Soon", and artist profiles are "Coming soon". So each
sub-line promises only what is live (what's on, spaces, curators) and puts open calls in future
or soft wording. If the owner wants open calls stated as present, the UI marker must change first.

Vocabulary borrowed from the trade: "the room", "the bill", "the run", "load-in", "the night",
"the work". Not used: "community", "discover", "platform".

## Ranked

### 1. Arrival (recommended)

- **Headline:** You just landed. Here is what's on tonight.
- **Sub-line:** Pick a city and your dates to see the shows, rooms and openings, the curators and spaces behind them, and the open calls coming next.
- **Button:** See what's on
- **Tone and angle:** The moment every touring artist knows: new city, one free evening, no one to ask. It shows the signature feature in the first sentence and lets connection and opportunity follow from it. Plain, second person, no label for the reader at all.

### 2. Belonging

- **Headline:** Every city has rooms you haven't walked into yet.
- **Sub-line:** Find the spaces, curators and makers where you're headed, see what they have on while you're there, and watch for the calls and residencies that follow.
- **Button:** Find the rooms
- **Tone and angle:** Leads with connection, the sense that a stranger's city already has a circle you can enter. "Rooms" is how artists name venues, studios and galleries without distinguishing them. Warmer than option 1, less direct about dates.

### 3. The road and the work

- **Headline:** Wherever the work takes you, someone is already making something.
- **Sub-line:** Before you load in, see what's on that week, who runs the spaces, and which residencies and open calls are worth the trip.
- **Button:** Plan the stay
- **Tone and angle:** Speaks to the working rhythm: project, travel, show, next project. Puts opportunity (residencies, calls) closest to the front. Longest headline, most literary; risks reading slightly softer than the others.

## Recommendation

Option 1. It is the only one that makes the signature feature concrete in the headline, and "You just landed" is how a touring artist would describe the situation to a friend, so it needs no label like "independent" to feel like theirs. Options 2 and 3 are good second reads if the owner wants more warmth or more weight on opportunity.

## Notes for implementation

- Dates in sub-line 1 assume the city page keeps its `from` / `to` date selection. Confirm before wiring.
- "Tonight" in headline 1 is honest only if the page shows today's events by default. If not, use "Here is what's on this week."
- Sentence case, no exclamation marks, no emoji, per the type system.
