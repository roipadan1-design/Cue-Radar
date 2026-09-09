import React, { useState, useEffect } from 'react';
import {
  User,
  Edit3,
  Eye,
  Save,
  Check,
  MapPin,
  Sparkles,
  Radio,
  Sliders,
  Bookmark,
  ExternalLink,
  UploadCloud,
  FolderCheck,
  Globe,
  Instagram,
  Music,
  Video,
  Trash2,
  Clock,
  Building,
  ShieldCheck,
  FileText,
  AlertCircle,
  Bell
} from 'lucide-react';
import type {
  UserProfile,
  RadarPreferences,
  UserSavedOpportunity,
  OpportunityStatus,
  AlertFrequency
} from '../types/profile.ts';
import {
  fetchUserProfile,
  updateUserProfile,
  updateRadarPreferences,
  updateOpportunityStatus,
  unsaveOpportunity,
  DEFAULT_PROFILE,
  DEFAULT_RADAR_PREFERENCES
} from '../services/profileService.ts';
import { ArtistHero } from './ArtistHero';
import { VideoShowcase } from './VideoShowcase';

// Available markets and disciplines
const AVAILABLE_MARKETS = [
  'Cologne',
  'Tel Aviv',
  'Berlin',
  'Brussels',
  'Zurich',
  'Vienna',
  'Amsterdam',
  'Paris'
];

const AVAILABLE_DISCIPLINES = [
  'Contemporary Dance',
  'Experimental Sound',
  'Choreography',
  'Performance Art',
  'Sonic Arts',
  'Multidisciplinary'
];

const OPPORTUNITY_TYPES = [
  'Residency',
  'Grant / Funding',
  'Co-Productions',
  'Open Calls'
];

// Initial mock saved opportunities with enriched metadata
const INITIAL_SAVED_CALLS: UserSavedOpportunity[] = [
  {
    id: 'save-1',
    user_id: 'guest-artist-uuid',
    opportunity_id: 'OPP-001',
    title: 'Guggenheim Performing Arts Fellowship 2026',
    institution: 'John Simon Guggenheim Foundation',
    discipline: 'Choreography & Kinetic Arts',
    type: 'Grant / Funding',
    market: 'International / Berlin',
    deadline: '2026-09-24',
    days_left: 15,
    grant_amount: '$45,000 USD',
    status: 'in_draft',
    saved_at: '2026-09-01T10:00:00Z'
  },
  {
    id: 'save-2',
    user_id: 'guest-artist-uuid',
    opportunity_id: 'OPP-002',
    title: 'Künstlerhaus Mousonturm & Tanzplattform Residency',
    institution: 'Mousonturm Frankfurt',
    discipline: 'Contemporary Dance',
    type: 'Residency',
    market: 'Cologne / Rhine-Ruhr',
    deadline: '2026-09-18',
    days_left: 9,
    grant_amount: '€4,200 + Studio Space',
    status: 'not_started',
    saved_at: '2026-09-03T14:30:00Z'
  },
  {
    id: 'save-3',
    user_id: 'guest-artist-uuid',
    opportunity_id: 'OPP-003',
    title: 'Spatial Sound & Acousmatic Research Commission',
    institution: 'ZKM | Center for Art and Media',
    discipline: 'Experimental Sound',
    type: 'Co-Productions',
    market: 'Berlin / Karlsruhe',
    deadline: '2026-10-02',
    days_left: 23,
    grant_amount: '€7,500 Production Budget',
    status: 'submitted',
    saved_at: '2026-08-28T09:15:00Z'
  },
  {
    id: 'save-4',
    user_id: 'guest-artist-uuid',
    opportunity_id: 'OPP-004',
    title: 'CCA Tel Aviv Center for Contemporary Dance Lab',
    institution: 'Center for Contemporary Art Tel Aviv',
    discipline: 'Performance Art',
    type: 'Open Calls',
    market: 'Tel Aviv',
    deadline: '2026-09-14',
    days_left: 5,
    grant_amount: 'NIS 18,000 + Tech Suite',
    status: 'shortlisted',
    saved_at: '2026-08-20T12:00:00Z'
  }
];

export const UserProfileRadar: React.FC = () => {
  // Navigation tabs: 'profile' | 'radar' | 'saved'
  const [activeTab, setActiveTab] = useState<'profile' | 'radar' | 'saved'>('profile');
  
  // Profile edit mode
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  
  // State management
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [editFormData, setEditFormData] = useState<UserProfile>(DEFAULT_PROFILE);
  const [radarPrefs, setRadarPrefs] = useState<RadarPreferences>(DEFAULT_RADAR_PREFERENCES);
  const [savedCalls, setSavedCalls] = useState<UserSavedOpportunity[]>(INITIAL_SAVED_CALLS);
  
  // Notifications & loading states
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Initialize data on mount
  useEffect(() => {
    async function loadData() {
      const { profile: loadedProfile, preferences: loadedPrefs } = await fetchUserProfile('guest-artist-uuid');
      if (loadedProfile) {
        setProfile(loadedProfile);
        setEditFormData(loadedProfile);
      }
      if (loadedPrefs) {
        setRadarPrefs(loadedPrefs);
      }
    }
    loadData();
  }, []);

  const triggerNotice = (msg: string) => {
    setSaveSuccessNotice(msg);
    setTimeout(() => setSaveSuccessNotice(null), 3500);
  };

  // Profile Save Handler
  const handleSaveProfile = async () => {
    setIsSaving(true);
    const { data, error } = await updateUserProfile(profile.id, editFormData);
    setIsSaving(false);
    if (!error && data) {
      setProfile(data);
      setIsEditMode(false);
      triggerNotice('Profile updated & synchronized successfully');
    } else {
      triggerNotice('Failed to update profile');
    }
  };

  // Toggle Location/Market in Edit Form
  const toggleLocationBadge = (market: string) => {
    const current = editFormData.locations || [];
    const updated = current.includes(market)
      ? current.filter(m => m !== market)
      : [...current, market];
    setEditFormData({ ...editFormData, locations: updated });
  };

  // Toggle Discipline in Edit Form
  const toggleDisciplineBadge = (discipline: string) => {
    const current = editFormData.disciplines || [];
    const updated = current.includes(discipline)
      ? current.filter(d => d !== discipline)
      : [...current, discipline];
    setEditFormData({ ...editFormData, disciplines: updated });
  };

  // Radar Preferences Handlers
  const handleToggleTrackedMarket = async (market: string) => {
    const current = radarPrefs.tracked_markets || [];
    const updated = current.includes(market)
      ? current.filter(m => m !== market)
      : [...current, market];
    const newPrefs = { ...radarPrefs, tracked_markets: updated };
    setRadarPrefs(newPrefs);
    await updateRadarPreferences(radarPrefs.user_id, newPrefs);
    triggerNotice(`Market alert updated: ${market}`);
  };

  const handleToggleDiscipline = async (disc: string) => {
    const current = radarPrefs.tracked_disciplines || [];
    const updated = current.includes(disc)
      ? current.filter(d => d !== disc)
      : [...current, disc];
    const newPrefs = { ...radarPrefs, tracked_disciplines: updated };
    setRadarPrefs(newPrefs);
    await updateRadarPreferences(radarPrefs.user_id, newPrefs);
  };

  const handleToggleType = async (type: string) => {
    const current = radarPrefs.tracked_types || [];
    const updated = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type];
    const newPrefs = { ...radarPrefs, tracked_types: updated };
    setRadarPrefs(newPrefs);
    await updateRadarPreferences(radarPrefs.user_id, newPrefs);
  };

  const handleFrequencyChange = async (freq: AlertFrequency) => {
    const newPrefs = { ...radarPrefs, alert_frequency: freq };
    setRadarPrefs(newPrefs);
    await updateRadarPreferences(radarPrefs.user_id, newPrefs);
    triggerNotice(`Alert cadence set to ${freq.replace('_', ' ')}`);
  };

  // Saved Opportunities Workflow Handlers
  const handleStatusChange = async (opportunityId: string, status: OpportunityStatus) => {
    setSavedCalls(prev =>
      prev.map(item => item.opportunity_id === opportunityId ? { ...item, status } : item)
    );
    await updateOpportunityStatus(profile.id, opportunityId, status);
    triggerNotice(`Opportunity status updated to "${status.replace('_', ' ')}"`);
  };

  const handleUnsave = async (opportunityId: string) => {
    setSavedCalls(prev => prev.filter(item => item.opportunity_id !== opportunityId));
    await unsaveOpportunity(profile.id, opportunityId);
    triggerNotice('Removed from saved tracker');
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 text-zinc-100 font-sans antialiased">
      {/* Toast Notification */}
      {saveSuccessNotice && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#121215] border border-cyan-500/40 rounded shadow-xl shadow-cyan-950/40 text-cyan-400 text-xs tracking-wider uppercase font-mono animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>{saveSuccessNotice}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-[#121215] border border-[#27272a] rounded-lg p-6 mb-8 relative overflow-hidden backdrop-blur-md">
        {/* Subtle decorative grid/glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-500/10 via-transparent to-transparent pointer-events-none rounded-full blur-3xl" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#27272a] pb-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#18181b] border-2 border-cyan-500/40 flex items-center justify-center text-cyan-400 relative group">
              <User className="w-8 h-8" />
              {profile.drive_connected && (
                <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#121215]" title="Google Drive Synced" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-white">{profile.full_name}</h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
                  VERIFIED ARTIST
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono mt-1 flex items-center gap-2">
                <span>CUE ID: {profile.id.slice(0, 16)}</span>
                <span>·</span>
                <span className="text-cyan-400/90">{profile.locations.join(' · ') || 'Unset Locations'}</span>
              </p>
            </div>
          </div>

          {/* Mode Switcher: Public View vs Edit Mode */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (isEditMode) {
                  setEditFormData(profile);
                  setIsEditMode(false);
                } else {
                  setEditFormData(profile);
                  setIsEditMode(true);
                  setActiveTab('profile');
                }
              }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded text-xs font-mono tracking-wider transition-all ${
                isEditMode
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                  : 'bg-[#18181b] text-zinc-300 border border-[#27272a] hover:border-cyan-500/60 hover:text-white'
              }`}
            >
              {isEditMode ? (
                <>
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span>EXIT EDIT</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>EDIT PROFILE</span>
                </>
              )}
            </button>

            {isEditMode && (
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-4 py-2 rounded text-xs font-mono tracking-wider bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold transition-all disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'SAVING...' : 'SAVE CHANGES'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex items-center gap-2 border-b border-[#27272a] pb-1">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-mono tracking-wider uppercase transition-colors relative ${
              activeTab === 'profile'
                ? 'text-cyan-400 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile & Dossier</span>
            {activeTab === 'profile' && (
              <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('radar')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-mono tracking-wider uppercase transition-colors relative ${
              activeTab === 'radar'
                ? 'text-cyan-400 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Radar Preferences</span>
            <span className="ml-1 px-1.5 py-0.2 text-[10px] rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-mono">
              {radarPrefs.tracked_markets.length}
            </span>
            {activeTab === 'radar' && (
              <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-mono tracking-wider uppercase transition-colors relative ${
              activeTab === 'saved'
                ? 'text-cyan-400 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved Calls Tracker</span>
            <span className="ml-1 px-1.5 py-0.2 text-[10px] rounded-full bg-zinc-800 text-zinc-300 border border-[#27272a] font-mono">
              {savedCalls.length}
            </span>
            {activeTab === 'saved' && (
              <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            )}
          </button>
        </div>
      </div>

      {/* TAB 1: PROFILE & BIO EDITOR / PUBLIC VIEW */}
      {activeTab === 'profile' && (
        <div className="flex flex-col gap-6">
          <ArtistHero profile={profile} onEdit={() => { setEditFormData(profile); setIsEditMode(true); }} />
          <VideoShowcase url={profile.showreel_url} />
          {/* Bio & Basic Details */}
          <div className="bg-[#121215] border border-[#27272a] rounded-lg p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-4">
              <h2 className="text-sm font-mono tracking-wider uppercase text-zinc-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Artist Dossier & Statement</span>
              </h2>
              <span className="text-xs text-zinc-500 font-mono">
                {isEditMode ? 'EDITING ACTIVE' : 'PUBLIC PREVIEW'}
              </span>
            </div>

            {isEditMode ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1.5">FULL ARTIST NAME</label>
                  <input
                    type="text"
                    value={editFormData.full_name}
                    onChange={e => setEditFormData({ ...editFormData, full_name: e.target.value })}
                    className="w-full bg-[#18181b] border border-[#27272a] focus:border-cyan-500/70 rounded px-3 py-2 text-sm text-zinc-100 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                    PRIMARY SCENES & MARKETS (SELECT ACTIVE CITIES)
                  </label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {AVAILABLE_MARKETS.map(market => {
                      const isSelected = editFormData.locations?.includes(market);
                      return (
                        <button
                          key={market}
                          type="button"
                          onClick={() => toggleLocationBadge(market)}
                          className={`px-3 py-1 rounded text-xs font-mono border transition-all ${
                            isSelected
                              ? 'bg-cyan-950/70 border-cyan-500 text-cyan-300'
                              : 'bg-[#18181b] border-[#27272a] text-zinc-400 hover:border-zinc-600'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}
                          {market}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                    ARTISTIC DISCIPLINES
                  </label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {AVAILABLE_DISCIPLINES.map(disc => {
                      const isSelected = editFormData.disciplines?.includes(disc);
                      return (
                        <button
                          key={disc}
                          type="button"
                          onClick={() => toggleDisciplineBadge(disc)}
                          className={`px-3 py-1 rounded text-xs font-mono border transition-all ${
                            isSelected
                              ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300'
                              : 'bg-[#18181b] border-[#27272a] text-zinc-400 hover:border-zinc-600'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}
                          {disc}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                    ARTISTIC STATEMENT / BIO
                  </label>
                  <textarea
                    rows={4}
                    value={editFormData.bio}
                    onChange={e => setEditFormData({ ...editFormData, bio: e.target.value })}
                    placeholder="Enter artist statement, research foci, or residency objectives..."
                    className="w-full bg-[#18181b] border border-[#27272a] focus:border-cyan-500/70 rounded px-3 py-2 text-sm text-zinc-100 outline-none transition-colors"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line font-sans">
                  {profile.bio || 'No artist bio provided yet. Click "Edit Profile" above to draft your statement.'}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {profile.disciplines?.map(disc => (
                    <span
                      key={disc}
                      className="px-2.5 py-0.5 rounded text-xs font-mono bg-zinc-800/80 border border-[#27272a] text-zinc-300"
                    >
                      {disc}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Showreel & Media Uplink */}
          <div className="bg-[#121215] border border-[#27272a] rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <h3 className="text-sm font-mono tracking-wider uppercase text-zinc-300 flex items-center gap-2">
                <Video className="w-4 h-4 text-cyan-400" />
                <span>Showreel & Performance Uplink</span>
              </h3>
              <span className="text-xs text-zinc-500 font-mono">EMBED & PORTFOLIO VIDEO</span>
            </div>

            {isEditMode ? (
              <div className="space-y-2">
                <label className="block text-xs font-mono text-zinc-400">
                  SHOWREEL VIDEO URL (VIMEO, YOUTUBE, OR MP4 STREAM)
                </label>
                <input
                  type="url"
                  value={editFormData.showreel_url}
                  onChange={e => setEditFormData({ ...editFormData, showreel_url: e.target.value })}
                  placeholder="https://vimeo.com/..."
                  className="w-full bg-[#18181b] border border-[#27272a] focus:border-cyan-500/70 rounded px-3 py-2 text-sm text-zinc-100 outline-none transition-colors"
                />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="aspect-video w-full rounded bg-[#09090b] border border-[#27272a] flex items-center justify-center relative overflow-hidden group">
                  {profile.showreel_url ? (
                    <div className="text-center p-6 space-y-3">
                      <Video className="w-10 h-10 text-cyan-400 mx-auto opacity-70 group-hover:opacity-100 transition-opacity" />
                      <div className="text-xs font-mono text-zinc-400">{profile.showreel_url}</div>
                      <a
                        href={profile.showreel_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 text-xs font-mono hover:bg-cyan-500/20 transition-all"
                      >
                        <span>Open Video Uplink</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ) : (
                    <div className="text-center text-zinc-500 text-xs font-mono space-y-1">
                      <p>No showreel currently linked.</p>
                      <p className="text-zinc-600">Provide Vimeo or YouTube embed link in edit mode.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Social Links & Cloud Dossier Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Social & Web Links */}
            <div className="bg-[#121215] border border-[#27272a] rounded-lg p-6 space-y-4">
              <h3 className="text-sm font-mono tracking-wider uppercase text-zinc-300 flex items-center gap-2 border-b border-[#27272a] pb-3">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>External Links & Portfolios</span>
              </h3>

              {isEditMode ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1 flex items-center gap-1.5">
                      <Instagram className="w-3.5 h-3.5 text-zinc-400" />
                      <span>INSTAGRAM</span>
                    </label>
                    <input
                      type="text"
                      value={editFormData.social_links?.instagram || ''}
                      onChange={e =>
                        setEditFormData({
                          ...editFormData,
                          social_links: { ...editFormData.social_links, instagram: e.target.value }
                        })
                      }
                      placeholder="https://instagram.com/..."
                      className="w-full bg-[#18181b] border border-[#27272a] rounded px-3 py-1.5 text-xs text-zinc-100 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1 flex items-center gap-1.5">
                      <Music className="w-3.5 h-3.5 text-zinc-400" />
                      <span>SPOTIFY / BANDCAMP</span>
                    </label>
                    <input
                      type="text"
                      value={editFormData.social_links?.spotify || ''}
                      onChange={e =>
                        setEditFormData({
                          ...editFormData,
                          social_links: { ...editFormData.social_links, spotify: e.target.value }
                        })
                      }
                      placeholder="https://open.spotify.com/..."
                      className="w-full bg-[#18181b] border border-[#27272a] rounded px-3 py-1.5 text-xs text-zinc-100 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-zinc-400" />
                      <span>OFFICIAL WEBSITE</span>
                    </label>
                    <input
                      type="text"
                      value={editFormData.social_links?.website || ''}
                      onChange={e =>
                        setEditFormData({
                          ...editFormData,
                          social_links: { ...editFormData.social_links, website: e.target.value }
                        })
                      }
                      placeholder="https://yourdomain.art"
                      className="w-full bg-[#18181b] border border-[#27272a] rounded px-3 py-1.5 text-xs text-zinc-100 outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {profile.social_links?.website && (
                    <a
                      href={profile.social_links.website}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between p-2.5 rounded bg-[#18181b] border border-[#27272a] text-xs font-mono hover:border-cyan-500/50 transition-colors"
                    >
                      <span className="flex items-center gap-2 text-zinc-300">
                        <Globe className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Website</span>
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
                    </a>
                  )}

                  {profile.social_links?.instagram && (
                    <a
                      href={profile.social_links.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between p-2.5 rounded bg-[#18181b] border border-[#27272a] text-xs font-mono hover:border-cyan-500/50 transition-colors"
                    >
                      <span className="flex items-center gap-2 text-zinc-300">
                        <Instagram className="w-3.5 h-3.5 text-pink-400" />
                        <span>Instagram</span>
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
                    </a>
                  )}

                  {profile.social_links?.spotify && (
                    <a
                      href={profile.social_links.spotify}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between p-2.5 rounded bg-[#18181b] border border-[#27272a] text-xs font-mono hover:border-cyan-500/50 transition-colors"
                    >
                      <span className="flex items-center gap-2 text-zinc-300">
                        <Music className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Audio Portfolio</span>
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Cloud Materials & Google Drive Status */}
            <div className="bg-[#121215] border border-[#27272a] rounded-lg p-6 space-y-4">
              <h3 className="text-sm font-mono tracking-wider uppercase text-zinc-300 flex items-center gap-2 border-b border-[#27272a] pb-3">
                <FolderCheck className="w-4 h-4 text-emerald-400" />
                <span>Cloud Dossier & Storage</span>
              </h3>

              <div className="p-3.5 rounded bg-[#18181b] border border-[#27272a] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-300 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Google Drive Integration</span>
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                    CONNECTED
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-normal">
                  Dossiers, application drafts, and high-res audio stems are synchronized to your designated Cue Radar folder.
                </p>
              </div>

              <div className="p-3.5 rounded bg-[#18181b] border border-[#27272a] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <div>
                    <div className="text-xs font-mono text-zinc-200">Portfolio Dossier (PDF)</div>
                    <div className="text-[10px] text-zinc-500 font-mono">Dossier_Rostova_2026.pdf · 4.8MB</div>
                  </div>
                </div>
                <button
                  type="button"
                  className="px-2.5 py-1 text-[11px] font-mono rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/50 transition-colors"
                >
                  Upload New
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RADAR PREFERENCES (SMART ALERT ENGINE) */}
      {activeTab === 'radar' && (
        <div className="space-y-6">
          <div className="bg-[#121215] border border-[#27272a] rounded-lg p-6 space-y-6">
            <div className="border-b border-[#27272a] pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-mono tracking-wider uppercase text-zinc-200 flex items-center gap-2">
                  <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span>Smart Alert Engine & Tracking Filters</span>
                </h2>
                <p className="text-xs text-zinc-400 font-mono mt-1">
                  Configure autonomous scanning across 268 verified production houses and foundations.
                </p>
              </div>
              <span className="text-xs font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
                ACTIVE RADAR
              </span>
            </div>

            {/* Section 1: Tracked Markets */}
            <div className="space-y-3">
              <label className="block text-xs font-mono text-zinc-300 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>TRACKED MARKETS & CITIES (MULTI-SELECT)</span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {AVAILABLE_MARKETS.map(market => {
                  const isTracked = radarPrefs.tracked_markets?.includes(market);
                  return (
                    <button
                      key={market}
                      type="button"
                      onClick={() => handleToggleTrackedMarket(market)}
                      className={`px-3.5 py-1.5 rounded text-xs font-mono border transition-all flex items-center gap-1.5 ${
                        isTracked
                          ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200 shadow-sm shadow-cyan-950'
                          : 'bg-[#18181b] border-[#27272a] text-zinc-400 hover:border-zinc-600'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isTracked ? 'bg-cyan-400' : 'bg-zinc-600'}`} />
                      <span>{market}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Disciplines Checkboxes */}
            <div className="space-y-3 border-t border-[#27272a] pt-5">
              <label className="block text-xs font-mono text-zinc-300 flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                <span>DISCIPLINE RADAR (SELECT TO RECEIVE TAILORED CALLS)</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {AVAILABLE_DISCIPLINES.map(disc => {
                  const isChecked = radarPrefs.tracked_disciplines?.includes(disc);
                  return (
                    <label
                      key={disc}
                      onClick={() => handleToggleDiscipline(disc)}
                      className={`flex items-center gap-3 p-3 rounded border cursor-pointer select-none transition-all ${
                        isChecked
                          ? 'bg-emerald-950/40 border-emerald-500/60 text-zinc-100'
                          : 'bg-[#18181b] border-[#27272a] text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                        isChecked ? 'bg-emerald-500 border-emerald-400 text-zinc-950' : 'border-zinc-600'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="text-xs font-mono">{disc}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Section 3: Opportunity Types */}
            <div className="space-y-3 border-t border-[#27272a] pt-5">
              <label className="block text-xs font-mono text-zinc-300">
                OPPORTUNITY CLASSIFICATIONS
              </label>
              <div className="flex flex-wrap gap-2.5">
                {OPPORTUNITY_TYPES.map(type => {
                  const isChecked = radarPrefs.tracked_types?.includes(type);
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleToggleType(type)}
                      className={`px-3.5 py-1.5 rounded text-xs font-mono border transition-all ${
                        isChecked
                          ? 'bg-zinc-800 border-zinc-400 text-white font-semibold'
                          : 'bg-[#18181b] border-[#27272a] text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {isChecked ? '● ' : '○ '}
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 4: Frequency Selector */}
            <div className="space-y-3 border-t border-[#27272a] pt-5">
              <label className="block text-xs font-mono text-zinc-300 flex items-center gap-2">
                <Bell className="w-3.5 h-3.5 text-cyan-400" />
                <span>ALERT NOTIFICATION CADENCE</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'instant', label: 'Instant Alert', desc: 'Real-time alert when new open call drops' },
                  { id: 'weekly', label: 'Weekly Digest', desc: 'Every Monday morning summary' },
                  { id: 'high_priority_only', label: 'High Priority Only', desc: 'Only grants > €5,000 or top tier' }
                ].map(opt => {
                  const isSelected = radarPrefs.alert_frequency === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleFrequencyChange(opt.id as AlertFrequency)}
                      className={`p-3.5 rounded border text-left transition-all ${
                        isSelected
                          ? 'bg-cyan-950/60 border-cyan-500 text-cyan-100 shadow-md shadow-cyan-950/50'
                          : 'bg-[#18181b] border-[#27272a] text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono font-bold">{opt.label}</span>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />}
                      </div>
                      <p className="text-[11px] text-zinc-500">{opt.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SAVED OPPORTUNITIES & WORKFLOW TRACKER */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              Active Application Pipeline ({savedCalls.length} Tracked)
            </h2>
            <div className="text-[11px] font-mono text-zinc-500">
              Auto-syncs with your local workspace & Supabase
            </div>
          </div>

          {savedCalls.length === 0 ? (
            <div className="p-12 text-center bg-[#121215] border border-[#27272a] rounded-lg space-y-2">
              <Bookmark className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="text-sm font-mono text-zinc-400">No saved open calls in pipeline</p>
              <p className="text-xs text-zinc-600">Save opportunities from The Hub feed to monitor deadlines.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {savedCalls.map(item => {
                const isUrgent = (item.days_left ?? 99) <= 7;
                return (
                  <div
                    key={item.id}
                    className="p-5 rounded-lg bg-[#121215] border border-[#27272a] hover:border-zinc-600 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    {/* Left: Info */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {item.type}
                        </span>
                        <span className="text-[11px] font-mono text-cyan-400">
                          {item.market}
                        </span>
                        {item.grant_amount && (
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/30 text-emerald-300">
                            {item.grant_amount}
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-white tracking-tight truncate">
                        {item.title}
                      </h3>

                      <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono">
                        <span className="flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-zinc-500" />
                          <span>{item.institution}</span>
                        </span>
                        <span>·</span>
                        <span>{item.discipline}</span>
                      </div>
                    </div>

                    {/* Right: Deadline Badge & Status Dropdown */}
                    <div className="flex flex-wrap items-center gap-3 self-start md:self-center">
                      {/* Deadline Countdown Badge */}
                      <div
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-semibold border ${
                          isUrgent
                            ? 'bg-rose-950/70 border-rose-500/60 text-rose-300 animate-pulse'
                            : 'bg-zinc-900 border-zinc-700 text-zinc-300'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Ends in {item.days_left} Days</span>
                      </div>

                      {/* Status Dropdown */}
                      <div className="relative">
                        <select
                          value={item.status}
                          onChange={e =>
                            handleStatusChange(item.opportunity_id, e.target.value as OpportunityStatus)
                          }
                          className="bg-[#18181b] border border-[#27272a] rounded px-3 py-1.5 text-xs font-mono text-zinc-200 outline-none focus:border-cyan-500/70 cursor-pointer"
                        >
                          <option value="not_started">Status: Not Started</option>
                          <option value="in_draft">Status: In Draft</option>
                          <option value="submitted">Status: Submitted</option>
                          <option value="shortlisted">Status: Shortlisted</option>
                        </select>
                      </div>

                      {/* Unsave Button */}
                      <button
                        type="button"
                        onClick={() => handleUnsave(item.opportunity_id)}
                        className="p-2 text-zinc-500 hover:text-rose-400 rounded hover:bg-zinc-800 transition-colors"
                        title="Remove from saved pipeline"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
