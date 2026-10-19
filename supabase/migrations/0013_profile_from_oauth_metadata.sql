-- 0013_profile_from_oauth_metadata.sql
-- Task 23: someone who signs up with Google gets their name and profile photo filled in
-- automatically, so a new profile isn't a blank grey circle.
--
-- Google puts the photo in raw_user_meta_data as 'avatar_url' (and 'picture'), and the
-- name as 'full_name' (and 'name'). The provisioning trigger from 0001 only read
-- full_name; this replaces the function body (same name, same trigger, nothing dropped)
-- so it also reads the photo. Email/password sign-ups have no metadata and keep the
-- existing defaults.
--
-- Rule 6: no DROP / DELETE. CREATE OR REPLACE keeps the trigger bound to the function.

CREATE OR REPLACE FUNCTION public.handle_new_user_provisioning()
RETURNS TRIGGER AS $$
DECLARE
  base_handle TEXT;
BEGIN
  base_handle := 'u_' || LOWER(SUBSTRING(NEW.id::text FROM 1 FOR 8));

  INSERT INTO public.profiles (id, handle, full_name, avatar_url, is_public)
  VALUES (
    NEW.id,
    base_handle,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Independent Artist'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', ''),
    false
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.radar_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Backfill: existing Google users whose profile photo is still empty get their Google
-- photo. Only empty values are touched; a photo someone uploaded is never replaced.
UPDATE public.profiles p
SET avatar_url = COALESCE(u.raw_user_meta_data->>'avatar_url', u.raw_user_meta_data->>'picture')
FROM auth.users u
WHERE u.id = p.id
  AND COALESCE(p.avatar_url, '') = ''
  AND COALESCE(u.raw_user_meta_data->>'avatar_url', u.raw_user_meta_data->>'picture') IS NOT NULL;
