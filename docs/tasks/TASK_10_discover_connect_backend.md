# Task 10 — Discover/Connect v1: backend (follows table and RLS)

Repository: `roipadan1-design/Cue-Radar`, base branch `main`. Owner department: **Backend/Data Engineer**. Read `AGENTS.md` (rule 10, as amended by this task — see §0), `docs/HANDOFF_V3.md`, `docs/CUE_RADAR_Product_Plan_v2.md` §5.1–§5.4, `docs/PILOT_PLAN.md`, `docs/DECISIONS.md` ("AGENTS.md rule 10 amendment — Connect v1 unblock") first. Work on branch `task/discover-connect-backend`, open **one PR** titled `Task 10: Discover/Connect v1 backend` against `main`.

---

## 0. This task is authorized by an AGENTS.md rule-10 amendment

`docs/PILOT_PLAN.md` explicitly parks the whole artist-to-artist "Connect" feature pending dedicated research, and `AGENTS.md` rule 10 blocked it entirely until a task named it. The owner has now explicitly unblocked exactly this narrow slice, and rule 10 has already been amended to read `(amended by Task 06, Task 10)` — **this task is that Task 10**. The unblocked scope, verbatim, is:

- Opt-in discoverable public profiles — reusing the existing `profiles.is_public` column. **Do not add a second opt-in column.**
- A search/filter directory screen (discipline + city filters) — built in **Task 11** (Discover/Connect v1 frontend), which depends on this task.
- A one-directional follow that is private between the two parties — no public follower count anywhere.

**Still blocked, not part of this task**: open messaging/DM, a public follower count, an activity feed, algorithmic match recommendations, peer calls, digest, analytics. Do not build any of these, even partially, even as a stub.

This narrows `docs/CUE_RADAR_Product_Plan_v2.md` §5.1's own v1 model (which explicitly says no generic "Discover artists" page in v1) — see `docs/DECISIONS.md` for why that's a deliberate, owner-directed override, not an oversight. Do not "fix" this task to match the plan doc.

---

## 1. Migration

Write `supabase/migrations/0006_follows.sql` (next free number — confirm against whatever Task 08's `0005_source_recurrence.sql` leaves as the latest at merge time; renumber if a conflict exists):

```sql
CREATE TABLE IF NOT EXISTS public.follows (
  follower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  followee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  PRIMARY KEY (follower_id, followee_id),
  CONSTRAINT chk_no_self_follow CHECK (follower_id <> followee_id)
);

ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Select own follows" ON public.follows FOR SELECT
  USING (auth.uid() = follower_id OR auth.uid() = followee_id);

CREATE POLICY "Insert own follow" ON public.follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Delete own follow" ON public.follows FOR DELETE
  USING (auth.uid() = follower_id);
```

Per `docs/CUE_RADAR_Product_Plan_v2.md` §5.2/§5.3 ("Connected... רשימת Connections פרטית, לא ציבורית" — private, not public) and the owner's explicit instruction: **there is no public-read policy on `follows`.** Select is restricted to the two parties in the row. No `UPDATE` policy — a follow is created or deleted, never edited.

This migration is additive only, per rule 6: no `DROP`, no `DELETE`, no destructive `ALTER`.

## 2. What this task explicitly does NOT build (fast-follow, not forgotten)

- **No `intros`/"say-hi" table.** `docs/CUE_RADAR_Product_Plan_v2.md` §5.3 describes a structured "say hi" request-and-accept flow with an email handoff and a weekly quota — none of that is in scope here. A `follows` row is bookkeeping only: it does not notify, message, or introduce anyone. This exclusion is already logged in `docs/DECISIONS.md` as a deliberate fast-follow, not an oversight — do not re-log it, but do not build it either.
- No public follower/following count anywhere, including via a Postgres function, a computed column, or a view. If a count is needed anywhere later, that is a new task's decision, not this one's.
- No `connections`, `peer_calls`, or `run_log` tables — those belong to later, still-blocked phases.

## 3. Types

In `lib/types.ts`, add:
```ts
export interface Follow {
  follower_id: string
  followee_id: string
  created_at: string
}
```
No changes to `Profile` — `is_public` already exists and is reused as-is.

## 4. Data access note for Task 11

Task 11 (frontend) will need: (a) a directory query over `profiles` where `is_public = true`, filtered by `discipline`/`current_city`, and (b) a way to check/toggle whether the signed-in user follows a given profile. Both are simple `select`/`insert`/`delete` against `profiles` (already publicly readable when `is_public`, per the existing `0001_core.sql` policy `"Select profiles"`) and the new `follows` table — no new view or RPC function is required for this scope. Do not add one speculatively.

---

## 5. Order of work

1. Write the migration (§1), confirm it's additive and idempotent-safe (`CREATE TABLE IF NOT EXISTS`).
2. Add the `Follow` type (§3).
3. Update `docs/OWNER_TASKS.md` with the apply-migration step, same style as the existing Step 4a/4b entries.
4. Verification (§6).

---

## 6. Verification (paste raw output in the PR — prose is not proof)

```bash
npm ci && npm run lint && npm run build
python -m unittest discover -s scripts
ls supabase/migrations/0006_follows.sql
grep -n "CREATE POLICY" supabase/migrations/0006_follows.sql
grep -n "FOR SELECT" supabase/migrations/0006_follows.sql   # must show auth.uid() = follower_id OR auth.uid() = followee_id, no "USING (true)"
grep -n "DROP\|DELETE FROM\|ALTER.*DROP" supabase/migrations/0006_follows.sql || echo OK_no_destructive_sql
grep -n "intros\|peer_calls\|connections" supabase/migrations/0006_follows.sql || echo OK_no_scope_creep
grep -n "Follow" lib/types.ts
```

If applied to the live database, also paste:
```sql
select tablename, policyname, cmd, qual from pg_policies where tablename = 'follows';
```
showing exactly three policies (select/insert/delete) and no public-read policy. If not applied in this session, say so explicitly and leave the SQL-Editor instructions in `docs/OWNER_TASKS.md`, per the precedent in `docs/DECISIONS.md`.

---

## 7. Do not

- Do not add a second profile-level opt-in column — reuse `profiles.is_public`.
- Do not add a public-read RLS policy on `follows`.
- Do not build `intros`, `connections`, `peer_calls`, messaging, an activity feed, or a follower-count column/view/function.
- Do not build any frontend UI — that is Task 11.
- Do not touch `docs/CUE_RADAR_Product_Plan_v2.md` itself; the supersession is recorded in `docs/DECISIONS.md`, not by editing the plan.
