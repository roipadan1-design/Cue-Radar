-- 0008_profiles_gallery.sql
-- Urgent fix: components/profile/ProfileForm.tsx (commit 02ae705) added a gallery-photo-upload
-- feature that writes `gallery: string[]` into the single profiles UPDATE call alongside every
-- other field (role_label, bio, disciplines, is_public, etc.). The `profiles` table never had a
-- `gallery` column in any of 0001-0007, so that UPDATE would fail with a Postgres
-- "column profiles.gallery does not exist" error and break profile saves entirely, not just the
-- gallery part. See docs/OWNER_TASKS.md Step 4m and docs/DECISIONS.md.
--
-- Additive only (AGENTS.md rule 6): adds one new nullable-by-default TEXT[] column with a safe
-- default, matching the existing array-column style on this table (see `locations`,
-- `disciplines` in 0001_core.sql). No DROP/DELETE/destructive ALTER.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS gallery TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
