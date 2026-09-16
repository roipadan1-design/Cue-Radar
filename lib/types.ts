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
}

export type OpportunityDetail = HubFeedRow

export interface ProfileSocialLinks {
  instagram?: string | null
  spotify?: string | null
  website?: string | null
  vimeo?: string | null
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
  // Preview-only for now: no `gallery` column exists on the real `profiles` table yet
  // (see docs/ROADMAP.md Task 09). Populated by the dev-only demo fixture
  // (data/seed/profile_demo.json) so PublicProfileView can render a real gallery grid
  // in /dev/preview/profile. Safe to leave undefined for real profiles.
  gallery?: string[]
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
}

export interface SavedRow {
  user_id: string
  opp_id: string
  pipeline_status: PipelineStatus
  notes?: string | null
  saved_at: string
  opportunity?: HubFeedRow
}
