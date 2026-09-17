-- Migration 0006_follows.sql: Discover/Connect v1 backend — one-directional,
-- private follow relationships. See docs/tasks/TASK_10_discover_connect_backend.md
-- and docs/DECISIONS.md "AGENTS.md rule 10 amendment — Connect v1 unblock".
--
-- Additive only, per AGENTS.md rule 6: this only creates a new table, enables
-- RLS on it, and adds policies — no existing table, column, or row is touched.
-- Reuses the existing profiles.is_public column as the sole discoverability flag;
-- no second opt-in column is added. No structured say-hi/request-and-accept table,
-- no follower-count column/view/function, no public-read policy — a follow is
-- private bookkeeping between the two parties only.

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
