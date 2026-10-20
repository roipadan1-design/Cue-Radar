-- 0014_contact_routes.sql
-- Contact routes for organisations and people (the point of the product is connections).
-- Only public, professional routes published by the person or organisation themselves.
-- Rule 6: additive only. Existing rows keep NULL / empty until research fills them.

ALTER TABLE public.sources ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE public.sources ADD COLUMN IF NOT EXISTS email_type TEXT CHECK (email_type IS NULL OR email_type IN ('organisation_role', 'personal_published'));
ALTER TABLE public.sources ADD COLUMN IF NOT EXISTS contact_form_url TEXT;
ALTER TABLE public.sources ADD COLUMN IF NOT EXISTS phone_public TEXT;
ALTER TABLE public.sources ADD COLUMN IF NOT EXISTS other_links TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

ALTER TABLE public.curators ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE public.curators ADD COLUMN IF NOT EXISTS email_type TEXT CHECK (email_type IS NULL OR email_type IN ('organisation_role', 'personal_published'));
ALTER TABLE public.curators ADD COLUMN IF NOT EXISTS contact_form_url TEXT;
ALTER TABLE public.curators ADD COLUMN IF NOT EXISTS portfolio_url TEXT;
ALTER TABLE public.curators ADD COLUMN IF NOT EXISTS other_links TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
