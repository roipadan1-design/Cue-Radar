export type OpportunityStatus = 'not_started' | 'in_draft' | 'submitted' | 'shortlisted';

export type AlertFrequency = 'instant' | 'weekly' | 'high_priority_only';

export interface SocialLinks {
  instagram?: string;
  spotify?: string;
  website?: string;
  vimeo?: string;
  soundcloud?: string;
  [key: string]: string | undefined;
}

export interface PortfolioItem {
  id: string;
  title: string;
  venue: string;
  city: string;
  year: string;
  image: string;
  description: string;
  disciplines: string[];
  media_url?: string;
  media_type?: 'video' | 'audio' | 'image';
}

export interface Collaborator {
  id: string;
  name: string;
  role: string;
  location: string;
  avatar_url?: string;
  recent_work: string;
  mutual_connections: number;
  connected?: boolean;
}

export interface UserProfile {
  id: string;
  full_name: string;
  bio: string;
  avatar_url?: string;
  open_for_collaboration: boolean;
  collaboration_status_text?: string;
  locations: string[];
  disciplines: string[];
  showreel_url: string;
  showreel_title?: string;
  showreel_duration?: string;
  showreel_credits?: string[];
  social_links: SocialLinks;
  portfolio_items?: PortfolioItem[];
  collaborators?: Collaborator[];
  drive_connected: boolean;
  portfolio_pdf_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface RadarPreferences {
  id?: string;
  user_id: string;
  tracked_markets: string[];
  tracked_disciplines?: string[];
  tracked_types: string[];
  alert_frequency: AlertFrequency;
  created_at?: string;
  updated_at?: string;
}

export interface UserSavedOpportunity {
  id: string;
  user_id: string;
  opportunity_id: string;
  status: OpportunityStatus;
  saved_at: string;
  notes?: string;
  // Augmented frontend display fields
  title?: string;
  institution?: string;
  discipline?: string;
  type?: string;
  market?: string;
  deadline?: string;
  days_left?: number;
  grant_amount?: string;
}
