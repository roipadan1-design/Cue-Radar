export type PipelineStatus = 'saved' | 'drafting' | 'submitted' | 'accepted' | 'rejected'

export interface Market {
  slug: string
  display_name: string
  country: string
  region: string
  timezone: string
  currency: string
  lat: number
  lng: number
}

export interface VocabEntry {
  category: string
  value: string
  label: string
  sort_order: number
  deprecated?: boolean
}

export interface HubFeedRow {
  opp_id: string
  source_id: string
  title: string
  slug: string
  summary?: string | null
  type: string
  discipline_flags: string[]
  city?: string | null
  deadline?: string | null
  funding_min?: number | null
  funding_max?: number | null
  currency?: string | null
  funding_type?: string | null
  covers: string[]
  application_fee: number
  eligibility_geo: string[]
  career_stage?: string | null
  materials_required: string[]
  apply_url: string
  status: 'draft' | 'approved' | 'live' | 'expired' | 'archived'
  verified_at?: string | null
  verified_by?: string | null
  created_at?: string
  updated_at?: string
  source_name: string
  city_name?: string | null
  region?: string | null
  days_left?: number | null
  is_rolling: boolean
  is_demo: boolean
  recurrence?: 'annual' | 'biennial' | 'rolling' | 'one_off' | null
  expected_next_open?: string | null
}

export type OpportunityDetail = HubFeedRow

export interface ProfileSocialLinks {
  instagram?: string | null
  spotify?: string | null
  website?: string | null
  vimeo?: string | null
  // Task 23
  youtube?: string | null
  soundcloud?: string | null
  bandcamp?: string | null
}

export interface Profile {
  id: string
  handle: string
  full_name: string
  role_label?: string | null
  bio?: string | null
  avatar_url?: string | null
  locations: string[]
  current_city?: string | null
  current_city_from?: string | null
  current_city_until?: string | null
  disciplines: string[]
  showreel_url?: string | null
  social_links: ProfileSocialLinks
  open_for_collab: boolean
  available_from?: string | null
  is_public: boolean
  created_at?: string
  updated_at?: string
  // `profiles.gallery TEXT[]` — added by supabase/migrations/0008_profiles_gallery.sql
  // and applied to the live database (Task 21). Wired through ProfileForm/PublicProfileView.
  gallery?: string[]
}

export interface ProfileWork {
  title: string
  kind: string
  year: number
}

export type ProfileView = Profile & {
  disciplines: string[]
  active_since: number | null
  languages: string[]
  works: ProfileWork[]
}

export interface EventRow {
  event_id: string
  market?: string | null
  venue_name: string
  title: string
  event_type: string
  disciplines: string[]
  date: string
  time?: string | null
  price_min?: number | null
  ticket_url?: string | null
  lat?: number | null
  lng?: number | null
  is_demo: boolean
  // Task 22 (migration 0012)
  source_id?: string | null
  title_ja?: string | null
  end_date?: string | null
  end_time?: string | null
  recurrence?: string | null
  price_max?: number | null
  currency?: string | null
  lineup?: string | null
  description?: string | null
  language_barrier?: 'none' | 'some' | 'high' | null
  booking_required?: 'yes' | 'no' | 'recommended' | null
  evidence_url?: string | null
}

export interface Source {
  source_id: string
  name: string
  source_type: string
  market?: string | null
  discipline_focus: string[]
  tier: number
  website_url?: string | null
  opencalls_url?: string | null
  instagram_url?: string | null
  scrape_method?: string | null
  status: 'active' | 'dormant' | 'closed'
  needs_verification: boolean
  notes?: string | null
  is_demo: boolean
  // Task 22 (migration 0012)
  name_ja?: string | null
  about?: string | null
  neighborhood?: string | null
  address?: string | null
  calendar_url?: string | null
  scene_tags?: string[] | null
  underground_score?: number | null
  newcomer_friendly?: 'yes' | 'no' | 'unknown' | null
  foreigner_notes?: string | null
  evidence_url?: string | null
  verified_at?: string | null
  // Migration 0014: contact routes
  contact_email?: string | null
  email_type?: 'organisation_role' | 'personal_published' | null
  contact_form_url?: string | null
  phone_public?: string | null
  other_links?: string[] | null
}

/** Researched public profile of a curator / programmer (migration 0012). Not a user. */
export interface Curator {
  curator_id: string
  name: string
  name_ja?: string | null
  role_label: string
  market?: string | null
  about?: string | null
  disciplines: string[]
  affiliations: string[]
  website_url?: string | null
  instagram_url?: string | null
  evidence_url?: string | null
  verified_at?: string | null
  status: 'active' | 'inactive'
  // Migration 0014: contact routes
  contact_email?: string | null
  email_type?: 'organisation_role' | 'personal_published' | null
  contact_form_url?: string | null
  portfolio_url?: string | null
  other_links?: string[] | null
}

export interface Follow {
  follower_id: string
  followee_id: string
  created_at: string
}

export interface SavedRow {
  user_id: string
  opp_id: string
  pipeline_status: PipelineStatus
  notes?: string | null
  saved_at: string
  opportunity?: HubFeedRow
}
