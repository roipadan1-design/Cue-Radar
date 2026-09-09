import React, { useState, useEffect } from 'react';
import {
  Compass,
  User,
  Navigation,
  BookmarkCheck,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  HardDrive,
  Sparkles,
  ExternalLink,
  MapPin,
  Clock,
  Building2,
  Calendar,
  Layers,
  Radio,
  ChevronDown
} from 'lucide-react';
import { UserProfileRadar } from './UserProfileRadar';

export type WorkspaceView = 'hub' | 'profile' | 'trip' | 'saved' | 'settings';

interface NavItemConfig {
  id: WorkspaceView;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: {
    text: string;
    variant: 'cyan' | 'emerald' | 'amber' | 'zinc';
  };
}

const NAV_ITEMS: NavItemConfig[] = [
  {
    id: 'hub',
    label: 'The Hub',
    sublabel: 'Open Calls & Funding Database',
    icon: Compass,
    badge: { text: '57 Active', variant: 'cyan' }
  },
  {
    id: 'profile',
    label: 'Artist Profile',
    sublabel: 'Showreel, Bio & Uplinks',
    icon: User,
    badge: { text: 'Verified', variant: 'emerald' }
  },
  {
    id: 'trip',
    label: 'Trip Radar',
    sublabel: 'City Gigs & Local Opportunities',
    icon: Navigation,
    badge: { text: 'Cologne · Live', variant: 'amber' }
  },
  {
    id: 'saved',
    label: 'Saved Calls & Tracker',
    sublabel: 'Application Pipeline',
    icon: BookmarkCheck,
    badge: { text: '4 Saved', variant: 'cyan' }
  },
  {
    id: 'settings',
    label: 'Radar Settings',
    sublabel: 'Alerts & Market Filters',
    icon: SlidersHorizontal,
    badge: { text: 'Auto-Scan', variant: 'zinc' }
  }
];

export interface NavigationSidebarProps {
  initialView?: WorkspaceView;
  onViewChange?: (view: WorkspaceView) => void;
  userName?: string;
  userRole?: string;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  initialView = 'hub',
  onViewChange,
  userName = 'Roi Padan',
  userRole = 'Sound & Kinetic Artist'
}) => {
  const [activeView, setActiveView] = useState<WorkspaceView>(initialView);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [activeCity, setActiveCity] = useState<string>('Cologne');

  const handleSelectView = (viewId: WorkspaceView) => {
    setActiveView(viewId);
    if (onViewChange) {
      onViewChange(viewId);
    }
    setIsMobileOpen(false);
  };

  // Close mobile drawer on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen]);

  const renderBadge = (badge: NavItemConfig['badge'], isCollapsedView: boolean) => {
    if (!badge || isCollapsedView) return null;

    const colorClasses = {
      cyan: 'bg-cyan-950/80 text-cyan-400 border-cyan-500/40',
      emerald: 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40',
      amber: 'bg-amber-950/80 text-amber-400 border-amber-500/40',
      zinc: 'bg-zinc-800 text-zinc-400 border-zinc-700'
    }[badge.variant];

    return (
      <span
        className={`ml-auto px-1.5 py-0.5 text-[10px] font-mono tracking-wider font-semibold rounded border ${colorClasses} transition-colors whitespace-nowrap`}
      >
        {badge.text}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col md:flex-row antialiased font-sans select-none">
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#121215] border-b border-[#27272a] sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#18181b] border border-cyan-500/40 flex items-center justify-center font-bold text-cyan-400 text-sm font-mono shadow-sm shadow-cyan-950">
            間
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wider text-white">CUE RADAR</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                OS
              </span>
            </div>
            <div className="text-[10px] font-mono text-zinc-400">
              {NAV_ITEMS.find((item) => item.id === activeView)?.label}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-expanded={isMobileOpen}
          aria-label="Toggle navigation drawer"
          className="p-2 rounded bg-[#18181b] border border-[#27272a] text-zinc-300 hover:text-white hover:border-cyan-500/60 transition-colors"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          role="presentation"
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Navigation Sidebar (Desktop + Mobile Drawer) */}
      <aside
        role="navigation"
        aria-label="Main Application Navigation"
        aria-expanded={!isCollapsed}
        className={`fixed md:sticky top-0 left-0 h-screen z-50 md:z-30 bg-[#121215] border-r border-[#27272a] flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? 'md:w-20' : 'md:w-72'
        } ${
          isMobileOpen
            ? 'w-72 translate-x-0'
            : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#27272a] relative">
          <div
            className={`flex items-center gap-3 overflow-hidden cursor-pointer ${
              isCollapsed ? 'justify-center w-full' : ''
            }`}
            onClick={() => handleSelectView('hub')}
          >
            <div className="w-8 h-8 rounded bg-[#18181b] border border-cyan-500/50 flex-shrink-0 flex items-center justify-center font-bold text-cyan-400 text-sm font-mono shadow-[0_0_10px_rgba(6,182,212,0.25)]">
              間
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm tracking-wider text-white truncate">
                    CUE RADAR
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-cyan-950/90 text-cyan-400 border border-cyan-500/40">
                    2.4
                  </span>
                </div>
                <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
                  Career OS
                </span>
              </div>
            )}
          </div>

          {/* Desktop Collapse / Expand Toggle Button */}
          {!isCollapsed && (
            <button
              type="button"
              onClick={() => setIsCollapsed(true)}
              title="Collapse sidebar"
              className="hidden md:flex p-1.5 rounded bg-[#18181b] border border-[#27272a] text-zinc-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-1.5 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Expand toggle in collapsed state */}
        {isCollapsed && (
          <div className="hidden md:flex justify-center py-2 border-b border-[#27272a]">
            <button
              type="button"
              onClick={() => setIsCollapsed(false)}
              title="Expand sidebar"
              className="p-1.5 rounded bg-[#18181b] border border-[#27272a] text-zinc-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Active Workspace Status Pill (Expanded Only) */}
        {!isCollapsed && (
          <div className="px-4 py-3 bg-[#0e0e11] border-b border-[#27272a] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono text-zinc-300 uppercase tracking-wider">
                Workspace Active
              </span>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
              RADAR ON
            </span>
          </div>
        )}

        {/* Main Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin scrollbar-thumb-zinc-800">
          {!isCollapsed && (
            <div className="px-2 pb-2 text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
              Core Modules
            </div>
          )}

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectView(item.id)}
                aria-current={isActive ? 'page' : undefined}
                title={isCollapsed ? item.label : undefined}
                className={`w-full group relative flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-all duration-150 ${
                  isActive
                    ? 'bg-[#18181b] text-cyan-400 font-medium border border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.18)]'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-[#18181b]/70 border border-transparent'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
              >
                {/* Active Glowing Indicator Stripe */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-cyan-400 rounded-r-full shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                )}

                <div
                  className={`flex-shrink-0 transition-transform ${
                    isActive ? 'scale-110 text-cyan-400' : 'group-hover:scale-105 text-zinc-400 group-hover:text-zinc-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {!isCollapsed && (
                  <div className="min-w-0 flex-1 flex flex-col">
                    <span
                      className={`text-xs tracking-tight truncate ${
                        isActive ? 'text-white font-semibold' : 'text-zinc-300'
                      }`}
                    >
                      {item.label}
                    </span>
                    <span className="text-[10px] text-zinc-400 truncate font-mono">
                      {item.sublabel}
                    </span>
                  </div>
                )}

                {renderBadge(item.badge, isCollapsed)}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer: Cultural Database & Cloud Storage Widgets */}
        <div className="p-3 border-t border-[#27272a] bg-[#0e0e11] space-y-2.5">
          {/* Cloud Storage / Google Drive Status */}
          {!isCollapsed ? (
            <div className="p-2.5 rounded bg-[#18181b] border border-[#27272a] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <HardDrive className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-[11px] font-mono text-zinc-200 truncate">
                    Google Drive Vault
                  </div>
                  <div className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    SYNCED & SECURE
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
          ) : (
            <div
              className="flex justify-center py-2"
              title="Google Drive Vault: Connected"
            >
              <div className="w-8 h-8 rounded bg-[#18181b] border border-[#27272a] flex items-center justify-center text-emerald-400">
                <HardDrive className="w-4 h-4" />
              </div>
            </div>
          )}

          {/* User Profile Summary */}
          {!isCollapsed ? (
            <div
              onClick={() => handleSelectView('profile')}
              className="p-2 rounded hover:bg-[#18181b] border border-transparent hover:border-[#27272a] cursor-pointer transition-all flex items-center gap-2.5"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-900 to-zinc-800 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-mono text-xs font-bold flex-shrink-0">
                RP
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-zinc-200 truncate flex items-center gap-1.5">
                  <span>{userName}</span>
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                </div>
                <div className="text-[10px] text-zinc-400 font-mono truncate">
                  {userRole}
                </div>
              </div>
            </div>
          ) : (
            <div
              onClick={() => handleSelectView('profile')}
              className="flex justify-center cursor-pointer"
              title={`${userName} (${userRole})`}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-900 to-zinc-800 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-mono text-xs font-bold">
                RP
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Workspace Wrapper */}
      <main className="flex-1 min-w-0 overflow-y-auto bg-[#09090b]">
        {/* Top Breadcrumb Bar */}
        <div className="h-14 px-6 bg-[#121215]/80 backdrop-blur border-b border-[#27272a] flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
              Workspace
            </span>
            <span className="text-zinc-600 font-mono">/</span>
            <span className="text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              {NAV_ITEMS.find((item) => item.id === activeView)?.label}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline-block">
              268 Verified Cultural Sources · 23 Markets
            </span>
            <button
              type="button"
              onClick={() => handleSelectView('settings')}
              className="px-2.5 py-1 text-xs font-mono rounded bg-[#18181b] border border-[#27272a] text-zinc-300 hover:text-white hover:border-cyan-500/50 transition-colors"
            >
              Radar Setup
            </button>
          </div>
        </div>

        {/* Interactive View Routing Bodies */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
          {/* VIEW 1: THE HUB */}
          {activeView === 'hub' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#27272a] pb-6">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                    <span>The Hub</span>
                    <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                      57 Active Open Calls
                    </span>
                  </h1>
                  <p className="text-xs font-mono text-zinc-400 mt-1.5">
                    Curated opportunities for independent contemporary dance, experimental sound &amp; hybrid arts.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectView('saved')}
                    className="px-3.5 py-1.5 rounded text-xs font-mono bg-[#18181b] border border-[#27272a] text-zinc-300 hover:border-cyan-500/60"
                  >
                    View Saved (4)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectView('trip')}
                    className="px-3.5 py-1.5 rounded text-xs font-mono bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold transition-colors"
                  >
                    Open Trip Radar ↗
                  </button>
                </div>
              </div>

              {/* Sample Feed Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Guggenheim Performing Arts Fellowship 2026',
                    institution: 'John Simon Guggenheim Foundation',
                    discipline: 'Choreography & Kinetic Arts',
                    deadline: 'Ends in 15 Days',
                    grant: '$45,000 USD',
                    market: 'International / Berlin',
                    urgent: false
                  },
                  {
                    title: 'Künstlerhaus Mousonturm Residency Lab',
                    institution: 'Mousonturm Frankfurt',
                    discipline: 'Contemporary Dance',
                    deadline: 'Ends in 9 Days',
                    grant: '€4,200 + Studio Space',
                    market: 'Cologne / Rhine-Ruhr',
                    urgent: false
                  },
                  {
                    title: 'Spatial Sound & Acousmatic Research Commission',
                    institution: 'ZKM | Center for Art and Media',
                    discipline: 'Experimental Sound',
                    deadline: 'Ends in 23 Days',
                    grant: '€7,500 Production Budget',
                    market: 'Berlin / Karlsruhe',
                    urgent: false
                  },
                  {
                    title: 'CCA Tel Aviv Center for Contemporary Dance Lab',
                    institution: 'CCA Tel Aviv',
                    discipline: 'Performance Art',
                    deadline: 'Ends in 5 Days',
                    grant: 'NIS 18,000 + Tech Suite',
                    market: 'Tel Aviv',
                    urgent: true
                  }
                ].map((card, i) => (
                  <div
                    key={i}
                    className="bg-[#121215] border border-[#27272a] hover:border-zinc-500 rounded-lg p-5 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-cyan-400">{card.market}</span>
                      <span
                        className={`text-[11px] font-mono px-2 py-0.5 rounded font-semibold ${
                          card.urgent
                            ? 'bg-rose-950 text-rose-300 border border-rose-500/40 animate-pulse'
                            : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                        }`}
                      >
                        {card.deadline}
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-white tracking-tight">{card.title}</h2>
                    <div className="text-xs text-zinc-400 font-mono flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{card.institution}</span>
                      <span>·</span>
                      <span>{card.discipline}</span>
                    </div>
                    <div className="pt-2 border-t border-[#27272a] flex items-center justify-between">
                      <span className="text-xs font-mono text-emerald-400 font-semibold">{card.grant}</span>
                      <button
                        type="button"
                        onClick={() => handleSelectView('saved')}
                        className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
                      >
                        <span>Manage in Pipeline</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 2: ARTIST PROFILE & RADAR INTEGRATION */}
          {activeView === 'profile' && (
            <div className="animate-in fade-in duration-200">
              <UserProfileRadar />
            </div>
          )}

          {/* VIEW 3: TRIP RADAR (LOCAL GIGS & OPPORTUNITIES PER CITY) */}
          {activeView === 'trip' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-[#27272a] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                    <Navigation className="w-6 h-6 text-amber-400" />
                    <span>Trip Radar</span>
                    <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-amber-950/80 border border-amber-500/40 text-amber-300">
                      Live City Proximity
                    </span>
                  </h1>
                  <p className="text-xs font-mono text-zinc-400 mt-1.5">
                    Cross-reference tour dates and residencies with cultural hubs, festivals, and co-production spaces.
                  </p>
                </div>

                {/* City Picker */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-zinc-400">SELECT HUB:</span>
                  <div className="relative">
                    <select
                      value={activeCity}
                      onChange={(e) => setActiveCity(e.target.value)}
                      className="bg-[#18181b] border border-[#27272a] rounded px-3 py-1.5 text-xs font-mono text-zinc-200 outline-none focus:border-cyan-500/70 cursor-pointer pr-8"
                    >
                      <option value="Cologne">Cologne / Rhine-Ruhr</option>
                      <option value="Tel Aviv">Tel Aviv</option>
                      <option value="Berlin">Berlin</option>
                      <option value="Brussels">Brussels</option>
                      <option value="Zurich">Zurich</option>
                      <option value="Vienna">Vienna</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* City Scene Overview */}
              <div className="bg-[#121215] border border-[#27272a] rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-mono uppercase text-zinc-200 font-bold">
                      {activeCity} Cultural Hotspots &amp; Venues
                    </span>
                  </div>
                  <span className="text-xs font-mono text-cyan-400">12 Verified Spaces</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    {
                      name: 'TanzFaktur Köln',
                      type: 'Production & Performance Space',
                      focus: 'Contemporary Choreography',
                      address: 'Siegburger Str. 233'
                    },
                    {
                      name: 'Alte Feuerwache Köln',
                      type: 'Socio-Cultural Center',
                      focus: 'Experimental Sound & Improvisation',
                      address: 'Melchiorstraße 3'
                    },
                    {
                      name: 'Künstlerdorf Schöppingen',
                      type: 'Residency Institute',
                      focus: 'Sonic Art & Mixed Media',
                      address: 'Feuerstiege 6'
                    }
                  ].map((venue, idx) => (
                    <div key={idx} className="p-3.5 rounded bg-[#18181b] border border-[#27272a] space-y-1">
                      <div className="text-xs font-bold text-white">{venue.name}</div>
                      <div className="text-[11px] font-mono text-amber-400">{venue.type}</div>
                      <div className="text-[10px] text-zinc-400">{venue.focus}</div>
                      <div className="text-[10px] font-mono text-zinc-400 pt-1">{venue.address}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Local Open Calls in Chosen City */}
              <div className="bg-[#121215] border border-[#27272a] rounded-lg p-6 space-y-4">
                <h2 className="text-sm font-mono uppercase text-zinc-200 font-bold flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span>Upcoming Local Deadlines in {activeCity}</span>
                </h2>
                <div className="space-y-2.5">
                  <div className="p-3.5 rounded bg-[#18181b] border border-[#27272a] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-white">NRW Landesbüro Freie Darstellende Künste</div>
                      <div className="text-[11px] font-mono text-zinc-400">Rechercheförderung &amp; Concept Grants</div>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-mono rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 self-start sm:self-center">
                      Ends in 18 Days · €5,000
                    </span>
                  </div>
                  <div className="p-3.5 rounded bg-[#18181b] border border-[#27272a] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-white">Kölner Tanz- und Theaterpreise 2026</div>
                      <div className="text-[11px] font-mono text-zinc-400">Independent Stage Production Award</div>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-mono rounded bg-amber-950 text-amber-300 border border-amber-500/40 self-start sm:self-center">
                      Submission Open · €10,000
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 4: SAVED CALLS & TRACKER */}
          {activeView === 'saved' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-[#27272a] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                    <BookmarkCheck className="w-6 h-6 text-cyan-400" />
                    <span>Saved Calls &amp; Application Pipeline</span>
                  </h1>
                  <p className="text-xs font-mono text-zinc-400 mt-1.5">
                    Manage submission deadlines, track dossier prep, and monitor shortlisted outcomes.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectView('hub')}
                  className="px-3.5 py-1.5 rounded text-xs font-mono bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold"
                >
                  Browse Open Calls ↗
                </button>
              </div>

              {/* Kanban-style Status Columns Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { status: 'Not Started', count: 1, color: 'text-zinc-400' },
                  { status: 'In Draft', count: 1, color: 'text-amber-400' },
                  { status: 'Submitted', count: 1, color: 'text-cyan-400' },
                  { status: 'Shortlisted', count: 1, color: 'text-emerald-400' }
                ].map((col, i) => (
                  <div key={i} className="p-3.5 rounded bg-[#121215] border border-[#27272a] text-center space-y-1">
                    <div className={`text-xl font-mono font-bold ${col.color}`}>{col.count}</div>
                    <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">{col.status}</div>
                  </div>
                ))}
              </div>

              {/* Pipeline List */}
              <div className="space-y-3">
                {[
                  {
                    title: 'Guggenheim Fellowship 2026',
                    institution: 'John Simon Guggenheim Foundation',
                    status: 'In Draft',
                    deadline: '15 Days Left',
                    stage: 'Dossier & Video Showreel attached'
                  },
                  {
                    title: 'Künstlerhaus Mousonturm Residency',
                    institution: 'Mousonturm Frankfurt',
                    status: 'Not Started',
                    deadline: '9 Days Left',
                    stage: 'Awaiting motivation letter'
                  },
                  {
                    title: 'Spatial Sound Commission',
                    institution: 'ZKM Karlsruhe',
                    status: 'Submitted',
                    deadline: '23 Days Left',
                    stage: 'Application ID #ZKM-2026-88'
                  },
                  {
                    title: 'CCA Contemporary Dance Lab',
                    institution: 'CCA Tel Aviv',
                    status: 'Shortlisted',
                    deadline: '5 Days Left',
                    stage: 'Interview scheduled for Sep 12'
                  }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg bg-[#121215] border border-[#27272a] flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                          {item.status}
                        </span>
                        <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {item.deadline}
                        </span>
                      </div>
                      <h2 className="text-sm font-bold text-white">{item.title}</h2>
                      <div className="text-xs text-zinc-400 font-mono">{item.institution} · {item.stage}</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectView('profile')}
                      className="px-3 py-1.5 rounded text-xs font-mono bg-[#18181b] border border-[#27272a] text-zinc-300 hover:text-white self-start md:self-center"
                    >
                      Open Dossier ↗
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 5: RADAR SETTINGS */}
          {activeView === 'settings' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-[#27272a] pb-6">
                <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                  <SlidersHorizontal className="w-6 h-6 text-cyan-400" />
                  <span>Radar Settings &amp; Alert Engine</span>
                </h1>
                <p className="text-xs font-mono text-zinc-400 mt-1.5">
                  Configure real-time monitoring across 268 verified production houses, cultural foundations, and residencies.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#121215] border border-[#27272a] rounded-lg p-6 space-y-4">
                  <h2 className="text-sm font-mono uppercase text-zinc-200 font-bold flex items-center gap-2 border-b border-[#27272a] pb-3">
                    <Radio className="w-4 h-4 text-cyan-400" />
                    <span>Autonomous Crawler Cadence</span>
                  </h2>
                  <div className="space-y-2">
                    <label className="flex items-center justify-between p-3 rounded bg-[#18181b] border border-[#27272a] cursor-pointer">
                      <div>
                        <div className="text-xs font-bold text-white">Daily High-Priority Scan</div>
                        <div className="text-[10px] text-zinc-400">Scans all calls ending in &lt; 14 days</div>
                      </div>
                      <input type="radio" name="cadence" defaultChecked className="accent-cyan-400" />
                    </label>
                    <label className="flex items-center justify-between p-3 rounded bg-[#18181b] border border-[#27272a] cursor-pointer">
                      <div>
                        <div className="text-xs font-bold text-white">Weekly Comprehensive Digest</div>
                        <div className="text-[10px] text-zinc-400">Every Monday 08:00 UTC dispatch</div>
                      </div>
                      <input type="radio" name="cadence" className="accent-cyan-400" />
                    </label>
                  </div>
                </div>

                <div className="bg-[#121215] border border-[#27272a] rounded-lg p-6 space-y-4">
                  <h2 className="text-sm font-mono uppercase text-zinc-200 font-bold flex items-center gap-2 border-b border-[#27272a] pb-3">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    <span>Target Market Scope</span>
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {['Cologne', 'Tel Aviv', 'Berlin', 'Brussels', 'Zurich', 'Vienna', 'Amsterdam', 'Paris'].map(
                      (city, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 rounded text-xs font-mono bg-cyan-950/60 border border-cyan-500/40 text-cyan-300"
                        >
                          ✓ {city}
                        </span>
                      )
                    )}
                  </div>
                  <p className="text-[11px] font-mono text-zinc-400 pt-2">
                    Active filtering scans 23 cultural markets and 268 verified institutions continuously.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
