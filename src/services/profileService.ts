/**
 * ============================================================================
 * CUE RADAR: Profile & Radar Preferences Supabase Service Layer
 * ============================================================================
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { 
  UserProfile, 
  RadarPreferences, 
  UserSavedOpportunity, 
  OpportunityStatus 
} from '../types/profile.ts';

// Environment variable retrieval (client-safe)
const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env;
const SUPABASE_URL = metaEnv?.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = metaEnv?.VITE_SUPABASE_ANON_KEY || '';

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!supabaseInstance && SUPABASE_URL && SUPABASE_ANON_KEY) {
    supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return supabaseInstance;
}

// Local storage key constants for seamless offline/local fallback
const STORAGE_KEYS = {
  PROFILE: 'cueradar_user_profile',
  RADAR_PREFS: 'cueradar_radar_preferences',
  SAVED_CALLS: 'cueradar_saved_opportunities'
};

// Default fallback profile for immediate UX
export const DEFAULT_PROFILE: UserProfile = {
  id: 'guest-artist-uuid',
  full_name: 'Elena Rostova',
  bio: 'Choreographer and sonic performance researcher experimenting with spatial acoustics, bodily kinetic feedback, and multi-channel field recordings. Co-founder of Kinetic Sensor Lab.',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  open_for_collaboration: true,
  collaboration_status_text: 'Available for European Residencies & Sound Commissions',
  locations: ['Cologne', 'Tel Aviv', 'Berlin'],
  disciplines: ['Contemporary Dance', 'Experimental Sound', 'Choreography', 'Live Electronics'],
  showreel_url: 'https://vimeo.com/76979871',
  showreel_title: 'Somatic Echoes: Multi-Channel Performance Anthology',
  showreel_duration: '03:45',
  showreel_credits: ['PACT Zollverein', 'TanzFaktur Köln', 'Kelim Center', 'NRW KULTUR'],
  social_links: {
    instagram: 'https://instagram.com/elenarostova.art',
    spotify: 'https://open.spotify.com/artist/kinetic',
    website: 'https://elenarostova.art',
    vimeo: 'https://vimeo.com/elenarostova',
    soundcloud: 'https://soundcloud.com/elena-rostova-sound'
  },
  portfolio_items: [
    {
      id: 'port-01',
      title: 'Acoustic Displacements (TanzFaktur Köln)',
      year: '2025',
      venue: 'TanzFaktur',
      city: 'Cologne',
      image: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&w=800&q=80',
      description: 'Multi-channel quadraphonic performance exploring subterranean reverberation and movement inertia.',
      disciplines: ['Dance', 'Spatial Sound'],
      media_type: 'video'
    },
    {
      id: 'port-02',
      title: 'Feedback / Flesh (Uferstudios Wedding)',
      year: '2024',
      venue: 'Uferstudios Studio 14',
      city: 'Berlin',
      image: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=800&q=80',
      description: 'Choreographic research piece examining microphone proximity and micro-tonal somatic feedback.',
      disciplines: ['Dance', 'Live Electronics'],
      media_type: 'video'
    },
    {
      id: 'port-03',
      title: 'Somatic Waves (Kelim Choreography Center)',
      year: '2024',
      venue: 'Kelim Center',
      city: 'Tel Aviv',
      image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
      description: 'Duet exploring silence, sudden physical articulation, and electroacoustic tape loops.',
      disciplines: ['Choreography', 'Sound'],
      media_type: 'audio'
    },
    {
      id: 'port-04',
      title: 'Interference Patterns (La Raffinerie)',
      year: '2023',
      venue: 'Charleroi danse',
      city: 'Brussels',
      image: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=800&q=80',
      description: 'Site-responsive architectural intervention in the historic Molenbeek industrial complex.',
      disciplines: ['Multidisciplinary', 'Installation'],
      media_type: 'image'
    }
  ],
  collaborators: [
    {
      id: 'collab-1',
      name: 'Marc Vandevelde',
      role: 'Sonic Architect & Spatialist',
      location: 'Brussels',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      recent_work: 'Resonances at Charleroi danse',
      mutual_connections: 7,
      connected: true
    },
    {
      id: 'collab-2',
      name: 'Maya Shenhav',
      role: 'Dramaturg & Movement Theorist',
      location: 'Tel Aviv',
      avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      recent_work: 'Somatic Waves at Kelim',
      mutual_connections: 12,
      connected: false
    },
    {
      id: 'collab-3',
      name: 'Leo Baumgartner',
      role: 'Kinetic Light Designer',
      location: 'Berlin',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      recent_work: 'Feedback / Flesh at Uferstudios',
      mutual_connections: 5,
      connected: true
    },
    {
      id: 'collab-4',
      name: 'Kenjiro Tanaka',
      role: 'Analog Modular Synthesist',
      location: 'Cologne',
      avatar_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
      recent_work: 'TanzFaktur Sound Lab',
      mutual_connections: 9,
      connected: false
    }
  ],
  drive_connected: true,
  portfolio_pdf_url: 'https://drive.google.com/file/d/dossier_2026.pdf'
};

export const DEFAULT_RADAR_PREFERENCES: RadarPreferences = {
  user_id: 'guest-artist-uuid',
  tracked_markets: ['Cologne', 'Tel Aviv', 'Berlin', 'Brussels'],
  tracked_disciplines: ['Contemporary Dance', 'Experimental Sound', 'Performance Art'],
  tracked_types: ['Residency', 'Grant / Funding', 'Open Call'],
  alert_frequency: 'weekly'
};

/**
 * 1. Fetch full user profile & radar preferences
 */
export async function fetchUserProfile(userId: string): Promise<{
  profile: UserProfile | null;
  preferences: RadarPreferences | null;
  error: Error | null;
}> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    // Local storage fallback
    try {
      const storedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
      const storedPrefs = localStorage.getItem(STORAGE_KEYS.RADAR_PREFS);

      const profile: UserProfile = storedProfile ? JSON.parse(storedProfile) : DEFAULT_PROFILE;
      const preferences: RadarPreferences = storedPrefs ? JSON.parse(storedPrefs) : DEFAULT_RADAR_PREFERENCES;

      return { profile, preferences, error: null };
    } catch (err) {
      return { profile: DEFAULT_PROFILE, preferences: DEFAULT_RADAR_PREFERENCES, error: err as Error };
    }
  }

  try {
    const [profileRes, prefsRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
      supabase.from('radar_preferences').select('*').eq('user_id', userId).maybeSingle()
    ]);

    if (profileRes.error) throw profileRes.error;
    if (prefsRes.error && prefsRes.error.code !== 'PGRST116') throw prefsRes.error;

    return {
      profile: profileRes.data as UserProfile,
      preferences: (prefsRes.data as RadarPreferences) || DEFAULT_RADAR_PREFERENCES,
      error: null
    };
  } catch (error) {
    console.warn('[profileService] Error fetching from Supabase, falling back to local state:', error);
    return { profile: DEFAULT_PROFILE, preferences: DEFAULT_RADAR_PREFERENCES, error: error as Error };
  }
}

/**
 * 2. Update user profile
 */
export async function updateUserProfile(
  userId: string, 
  data: Partial<UserProfile>
): Promise<{ data: UserProfile | null; error: Error | null }> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    try {
      const current = localStorage.getItem(STORAGE_KEYS.PROFILE);
      const profile: UserProfile = current ? JSON.parse(current) : DEFAULT_PROFILE;
      const updated: UserProfile = { ...profile, ...data, id: userId, updated_at: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
      return { data: updated, error: null };
    } catch (err) {
      return { data: null, error: err as Error };
    }
  }

  try {
    const { data: updated, error } = await supabase
      .from('profiles')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return { data: updated as UserProfile, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * 3. Update radar preferences
 */
export async function updateRadarPreferences(
  userId: string,
  preferences: Partial<RadarPreferences>
): Promise<{ data: RadarPreferences | null; error: Error | null }> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    try {
      const current = localStorage.getItem(STORAGE_KEYS.RADAR_PREFS);
      const existing: RadarPreferences = current ? JSON.parse(current) : DEFAULT_RADAR_PREFERENCES;
      const updated: RadarPreferences = { ...existing, ...preferences, user_id: userId, updated_at: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEYS.RADAR_PREFS, JSON.stringify(updated));
      return { data: updated, error: null };
    } catch (err) {
      return { data: null, error: err as Error };
    }
  }

  try {
    const { data: updated, error } = await supabase
      .from('radar_preferences')
      .upsert({
        user_id: userId,
        ...preferences,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) throw error;
    return { data: updated as RadarPreferences, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * 4. Save an opportunity for tracking
 */
export async function saveOpportunity(
  userId: string,
  opportunityId: string
): Promise<{ data: UserSavedOpportunity | null; error: Error | null }> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SAVED_CALLS);
      const list: UserSavedOpportunity[] = raw ? JSON.parse(raw) : [];
      const existingIndex = list.findIndex(i => i.opportunity_id === opportunityId);

      const newItem: UserSavedOpportunity = {
        id: `saved-${Date.now()}`,
        user_id: userId,
        opportunity_id: opportunityId,
        status: 'not_started',
        saved_at: new Date().toISOString()
      };

      if (existingIndex === -1) {
        list.push(newItem);
        localStorage.setItem(STORAGE_KEYS.SAVED_CALLS, JSON.stringify(list));
      }

      return { data: newItem, error: null };
    } catch (err) {
      return { data: null, error: err as Error };
    }
  }

  try {
    const { data, error } = await supabase
      .from('user_saved_opportunities')
      .upsert({
        user_id: userId,
        opportunity_id: opportunityId,
        status: 'not_started',
        saved_at: new Date().toISOString()
      }, { onConflict: 'user_id,opportunity_id' })
      .select()
      .single();

    if (error) throw error;
    return { data: data as UserSavedOpportunity, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * 5. Update opportunity workflow status (not_started | in_draft | submitted | shortlisted)
 */
export async function updateOpportunityStatus(
  userId: string,
  opportunityId: string,
  status: OpportunityStatus
): Promise<{ data: UserSavedOpportunity | null; error: Error | null }> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SAVED_CALLS);
      const list: UserSavedOpportunity[] = raw ? JSON.parse(raw) : [];
      const item = list.find(i => i.opportunity_id === opportunityId);
      if (item) {
        item.status = status;
        localStorage.setItem(STORAGE_KEYS.SAVED_CALLS, JSON.stringify(list));
        return { data: item, error: null };
      }
      return { data: null, error: new Error('Opportunity not found') };
    } catch (err) {
      return { data: null, error: err as Error };
    }
  }

  try {
    const { data, error } = await supabase
      .from('user_saved_opportunities')
      .update({ status })
      .eq('user_id', userId)
      .eq('opportunity_id', opportunityId)
      .select()
      .single();

    if (error) throw error;
    return { data: data as UserSavedOpportunity, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * 6. Remove/unsave an opportunity
 */
export async function unsaveOpportunity(
  userId: string,
  opportunityId: string
): Promise<{ success: boolean; error: Error | null }> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SAVED_CALLS);
      const list: UserSavedOpportunity[] = raw ? JSON.parse(raw) : [];
      const filtered = list.filter(i => i.opportunity_id !== opportunityId);
      localStorage.setItem(STORAGE_KEYS.SAVED_CALLS, JSON.stringify(filtered));
      return { success: true, error: null };
    } catch (err) {
      return { success: false, error: err as Error };
    }
  }

  try {
    const { error } = await supabase
      .from('user_saved_opportunities')
      .delete()
      .eq('user_id', userId)
      .eq('opportunity_id', opportunityId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}
