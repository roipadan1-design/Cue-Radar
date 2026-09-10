export interface Market {
  slug: string;
  display_name: string;
  country: string;
  region: string;
  timezone: string;
  currency: string;
  lat: number;
  lng: number;
}

export interface Vocab {
  category: string;
  value: string;
  label: string;
  sort_order: number;
}

export interface HubOpportunity {
  opp_id: string;
  source_id: string;
  source_name: string;
  title: string;
  slug: string;
  summary: string | null;
  type: string;
  discipline_flags: string[];
  city: string | null;
  city_name: string | null;
  region: string | null;
  deadline: string | null;
  days_left: number | null;
  is_rolling: boolean;
  funding_min: number | null;
  funding_max: number | null;
  currency: string | null;
  funding_type: string | null;
  covers: string[];
  application_fee: number;
  eligibility_geo: string[];
  career_stage: string | null;
  materials_required: string[];
  apply_url: string;
  status: string;
  verified_at: string | null;
  verified_by: string | null;
  created_at: string;
  updated_at: string;
}
