import React, { useState, useEffect } from 'react';
import {
  Compass,
  User,
  MapPin,
  Bookmark,
  Sliders,
  Menu,
  X,
  HardDrive,
  Sparkles,
  ExternalLink,
  Clock,
  Building2,
  Calendar,
  Layers,
  Radio,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Play,
  Share2,
  Bell,
  Check,
  Search,
  Filter
} from 'lucide-react';
import { UserProfileRadar } from './UserProfileRadar';

export type WorkspaceView = 'hub' | 'profile' | 'trip' | 'saved' | 'settings';

export interface NavItemConfig {
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
    sublabel: 'Open Calls & Master DB',
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
    sublabel: 'Local Venues & Calls',
    icon: MapPin,
    badge: { text: 'Cologne · Live', variant: 'amber' }
  },
  {
    id: 'saved',
    label: 'Saved Calls & Tracker',
    sublabel: 'Application Pipeline',
    icon: Bookmark,
    badge: { text: '4 Saved', variant: 'cyan' }
  },
  {
    id: 'settings',
    label: 'Radar Settings',
    sublabel: 'Alerts & Market Filters',
    icon: Sliders,
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [activeCity, setActiveCity] = useState<string>('Cologne');
  const [hubCategory, setHubCategory] = useState<string>('All');
  const [savedCount, setSavedCount] = useState<number>(4);

  const handleSelectView = (viewId: WorkspaceView) => {
    setActiveView(viewId);
    if (onViewChange) {
      onViewChange(viewId);
    }
    setIsMobileMenuOpen(false);
    // Smoothly scroll to top on view change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Lock body scroll when mobile drawer is open and support Escape key
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

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
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col md:flex-row antialiased font-sans select-none overflow-x-hidden">
      {/* ========================================================================= */}
      {/* 1. FIXED MOBILE HEADER (375px - 767px)                                    */}
      {/* ========================================================================= */}
      <header className="md:hidden sticky top-0 z-40 bg-[#121215]/95 backdrop-blur-md border-b border-[#27272a] px-3 sm:px-4 h-16 flex items-center justify-between">
        {/* Left: Brand / Logo */}
        <div
          onClick={() => handleSelectView('hub')}
          className="flex items-center gap-2.5 cursor-pointer touch-manipulation min-h-[44px] items-center"
        >
          <div className="w-8 h-8 rounded bg-[#18181b] border border-cyan-500/40 flex items-center justify-center font-bold text-cyan-400 text-sm font-mono shadow-[0_0_8px_rgba(6,182,212,0.25)] flex-shrink-0">
            間
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-bold text-sm tracking-wider text-white">CUE RADAR</span>
              <span className="px-1 py-0.2 rounded text-[8px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                OS
              </span>
            </div>
            <span className="text-[10px] font-mono text-zinc-400 tracking-tight mt-0.5">
              {NAV_ITEMS.find((item) => item.id === activeView)?.label}
            </span>
          </div>
        </div>

        {/* Right: Quick Action Shortcuts & Hamburger Trigger */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick 1-Tap "Artist Profile" Avatar Pill */}
          <button
            type="button"
            onClick={() => handleSelectView('profile')}
            aria-label="Open Artist Profile"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border transition-all touch-manipulation min-h-[44px] ${
              activeView === 'profile'
                ? 'bg-cyan-950/80 border-cyan-500/70 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                : 'bg-[#18181b] border-[#27272a] text-zinc-300 hover:border-cyan-500/40'
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-900 to-zinc-800 border border-cyan-500/40 flex items-center justify-center text-[10px] font-mono font-bold text-cyan-300 flex-shrink-0">
              RP
            </div>
            <span className="text-xs font-mono font-semibold hidden xs:inline-block">Profile</span>
          </button>

          {/* Quick Saved Calls Counter Pill */}
          <button
            type="button"
            onClick={() => handleSelectView('saved')}
            aria-label="View Saved Opportunities"
            className={`flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-md border transition-all touch-manipulation min-h-[44px] min-w-[44px] ${
              activeView === 'saved'
                ? 'bg-cyan-950/80 border-cyan-500/70 text-cyan-300'
                : 'bg-[#18181b] border-[#27272a] text-zinc-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold">{savedCount}</span>
          </button>

          {/* Mobile Menu Hamburger Button (Accessible Touch Target 44x44px) */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? 'Close navigation drawer' : 'Open navigation drawer'}
            className="flex items-center justify-center w-11 h-11 rounded-md bg-[#18181b] border border-[#27272a] text-zinc-200 hover:text-white hover:border-cyan-500/60 transition-all touch-manipulation active:scale-95"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-rose-400" />
            ) : (
              <Menu className="w-5 h-5 text-cyan-400" />
            )}
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MOBILE SLIDE-OVER DRAWER (BACKDROP + DRAWER CONTENT)                   */}
      {/* ========================================================================= */}
      {/* Backdrop */}
      <div
        role="presentation"
        aria-hidden="true"
        onClick={() => setIsMobileMenuOpen(false)}
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-50 md:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Slide-over Drawer Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
        className={`fixed top-0 left-0 bottom-0 z-50 w-[85vw] max-w-[320px] bg-[#121215] border-r border-[#27272a] flex flex-col shadow-2xl transition-transform duration-300 ease-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="h-16 px-4 border-b border-[#27272a] flex items-center justify-between bg-[#0e0e11]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#18181b] border border-cyan-500/50 flex items-center justify-center font-bold text-cyan-400 text-sm font-mono shadow-[0_0_8px_rgba(6,182,212,0.3)]">
              間
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-wider text-white">CUE RADAR</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-500/40">
                  v2.4
                </span>
              </div>
              <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
                Career OS
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
            className="w-11 h-11 flex items-center justify-center rounded-md bg-[#18181b] border border-[#27272a] text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Quick Profile Summary Box */}
        <div className="p-3.5 bg-[#0e0e11]/70 border-b border-[#27272a]">
          <div
            onClick={() => handleSelectView('profile')}
            className="p-2.5 rounded-lg bg-[#18181b] border border-cyan-500/30 flex items-center justify-between cursor-pointer hover:border-cyan-500/70 transition-all group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-900 to-zinc-800 border border-cyan-500/50 flex items-center justify-center text-cyan-300 font-mono text-xs font-bold flex-shrink-0">
                RP
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate flex items-center gap-1">
                  <span>{userName}</span>
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                </div>
                <div className="text-[10px] text-zinc-400 font-mono truncate">{userRole}</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
          </div>
        </div>

        {/* Drawer Core Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
          <div className="px-2 pb-1 text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
            Platform Modules
          </div>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectView(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all touch-manipulation min-h-[48px] ${
                  isActive
                    ? 'bg-[#18181b] text-cyan-400 font-medium border border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                    : 'text-zinc-300 hover:text-white hover:bg-[#18181b]/70 border border-transparent'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${
                    isActive
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                      : 'bg-[#18181b] text-zinc-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="min-w-0 flex-1 flex flex-col">
                  <span
                    className={`text-xs tracking-tight truncate ${
                      isActive ? 'text-white font-bold' : 'text-zinc-200'
                    }`}
                  >
                    {item.label}
                  </span>
                  <span className="text-[10px] text-zinc-400 truncate font-mono">
                    {item.sublabel}
                  </span>
                </div>

                {renderBadge(item.badge, false)}
              </button>
            );
          })}
        </nav>

        {/* Drawer Bottom Widget: Cloud Storage & Status */}
        <div className="p-3 border-t border-[#27272a] bg-[#0e0e11] space-y-2">
          <div className="p-2.5 rounded bg-[#18181b] border border-[#27272a] flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <HardDrive className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-[11px] font-mono text-zinc-200 truncate">
                  Google Drive Dossier
                </div>
                <div className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  CONNECTED &amp; SYNCED
                </div>
              </div>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
              READY
            </span>
          </div>

          <div className="text-[10px] font-mono text-center text-zinc-400 pt-1">
            268 Sources · 23 Markets · Live Radar
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. DESKTOP SIDEBAR NAVIGATION (md:flex)                                   */}
      {/* ========================================================================= */}
      <aside
        role="navigation"
        aria-label="Desktop Workspace Navigation"
        aria-expanded={!isCollapsed}
        className={`hidden md:flex flex-col fixed md:sticky top-0 left-0 h-screen z-30 bg-[#121215] border-r border-[#27272a] transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        {/* Desktop Header */}
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

          {!isCollapsed && (
            <button
              type="button"
              onClick={() => setIsCollapsed(true)}
              title="Collapse sidebar"
              className="p-1.5 rounded bg-[#18181b] border border-[#27272a] text-zinc-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Collapsed Toggle Button */}
        {isCollapsed && (
          <div className="flex justify-center py-2 border-b border-[#27272a]">
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

        {/* Active Radar Status Tag */}
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

        {/* Desktop Nav Items */}
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
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-cyan-400 rounded-r-full shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                )}

                <div
                  className={`flex-shrink-0 transition-transform ${
                    isActive
                      ? 'scale-110 text-cyan-400'
                      : 'group-hover:scale-105 text-zinc-400 group-hover:text-zinc-200'
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

        {/* Desktop Footer: Drive & User Info */}
        <div className="p-3 border-t border-[#27272a] bg-[#0e0e11] space-y-2.5">
          {!isCollapsed ? (
            <div className="p-2.5 rounded bg-[#18181b] border border-[#27272a] flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <HardDrive className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-[11px] font-mono text-zinc-200 truncate">
                    Google Drive Vault
                  </div>
                  <div className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    SYNCED &amp; SECURE
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
                <div className="text-[10px] text-zinc-400 font-mono truncate">{userRole}</div>
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

      {/* ========================================================================= */}
      {/* 4. MAIN RESPONSIVE WORKSPACE WRAPPER (Mobile Audited & Overflow-Free)     */}
      {/* ========================================================================= */}
      <main className="flex-1 min-w-0 bg-[#09090b] pb-24 md:pb-12">
        {/* Desktop Top Breadcrumb & Status Bar */}
        <div className="hidden md:flex h-14 px-6 bg-[#121215]/80 backdrop-blur border-b border-[#27272a] items-center justify-between sticky top-0 z-20">
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
            <span className="text-[11px] font-mono text-zinc-400">
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

        {/* Content Container (Constrained & Responsive for 375px - 1440px) */}
        <div className="px-3 py-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
          {/* ===================================================================== */}
          {/* VIEW 1: THE HUB                                                       */}
          {/* ===================================================================== */}
          {activeView === 'hub' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Header Title & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#27272a] pb-5">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex flex-wrap items-center gap-2">
                    <span>The Hub</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 whitespace-nowrap">
                      57 Active Calls
                    </span>
                  </h1>
                  <p className="text-xs font-mono text-zinc-400 mt-1">
                    Independent performing arts, sound labs &amp; international co-productions.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectView('saved')}
                    className="flex-1 sm:flex-initial px-3.5 py-2 sm:py-1.5 rounded text-xs font-mono bg-[#18181b] border border-[#27272a] text-zinc-300 hover:border-cyan-500/60 min-h-[44px] flex items-center justify-center gap-1.5"
                  >
                    <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Saved ({savedCount})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectView('trip')}
                    className="flex-1 sm:flex-initial px-3.5 py-2 sm:py-1.5 rounded text-xs font-mono bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold min-h-[44px] flex items-center justify-center gap-1"
                  >
                    <span>Trip Radar</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Mobile Filter Pills (Fit-Safe, Wrapping Without Horizontal Overflow) */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Filter className="w-3 h-3 text-cyan-400" />
                  <span>Discipline Filter</span>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {['All', 'Contemporary Dance', 'Experimental Sound', 'Residency', 'Grant & Funding'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setHubCategory(cat)}
                      className={`px-3 py-2 rounded text-xs font-mono transition-all min-h-[40px] flex items-center ${
                        hubCategory === cat
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/60 font-semibold shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                          : 'bg-[#18181b] text-zinc-400 border border-[#27272a] hover:border-zinc-600'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Responsive Cards Grid (Stacked on Mobile, 2 Cols on Tablet/Desktop) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    id: 'opp-1',
                    title: 'Guggenheim Performing Arts Fellowship 2026',
                    institution: 'John Simon Guggenheim Foundation',
                    discipline: 'Choreography & Kinetic Arts',
                    deadline: 'Ends in 15 Days',
                    grant: '$45,000 USD',
                    market: 'International / Berlin',
                    urgent: false
                  },
                  {
                    id: 'opp-2',
                    title: 'Künstlerhaus Mousonturm Residency Lab',
                    institution: 'Mousonturm Frankfurt',
                    discipline: 'Contemporary Dance',
                    deadline: 'Ends in 9 Days',
                    grant: '€4,200 + Studio Space',
                    market: 'Cologne / Rhine-Ruhr',
                    urgent: false
                  },
                  {
                    id: 'opp-3',
                    title: 'Spatial Sound & Acousmatic Research Commission',
                    institution: 'ZKM | Center for Art and Media',
                    discipline: 'Experimental Sound',
                    deadline: 'Ends in 23 Days',
                    grant: '€7,500 Production Budget',
                    market: 'Berlin / Karlsruhe',
                    urgent: false
                  },
                  {
                    id: 'opp-4',
                    title: 'CCA Tel Aviv Center for Contemporary Dance Lab',
                    institution: 'CCA Tel Aviv',
                    discipline: 'Performance Art',
                    deadline: 'Ends in 5 Days',
                    grant: 'NIS 18,000 + Tech Suite',
                    market: 'Tel Aviv',
                    urgent: true
                  }
                ].map((card) => (
                  <div
                    key={card.id}
                    className="bg-[#121215] border border-[#27272a] hover:border-zinc-500 rounded-lg p-4 sm:p-5 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono text-cyan-400 truncate">{card.market}</span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold whitespace-nowrap ${
                          card.urgent
                            ? 'bg-rose-950 text-rose-300 border border-rose-500/40 animate-pulse'
                            : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                        }`}
                      >
                        {card.deadline}
                      </span>
                    </div>

                    <h2 className="text-base font-bold text-white tracking-tight leading-snug break-words">
                      {card.title}
                    </h2>

                    <div className="text-xs text-zinc-400 font-mono flex flex-wrap items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                      <span className="text-zinc-300">{card.institution}</span>
                      <span>·</span>
                      <span className="text-zinc-400">{card.discipline}</span>
                    </div>

                    <div className="pt-2 border-t border-[#27272a] flex items-center justify-between gap-2">
                      <span className="text-xs font-mono text-emerald-400 font-semibold whitespace-nowrap">
                        {card.grant}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleSelectView('saved')}
                        className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1 min-h-[44px] py-1 px-2 touch-manipulation"
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

          {/* ===================================================================== */}
          {/* VIEW 2: ARTIST PROFILE & RADAR SETTINGS                               */}
          {/* ===================================================================== */}
          {activeView === 'profile' && (
            <div className="animate-in fade-in duration-200 space-y-4">
              {/* Back to Hub quick header on mobile */}
              <div className="flex items-center justify-between border-b border-[#27272a] pb-3 md:hidden">
                <button
                  type="button"
                  onClick={() => handleSelectView('hub')}
                  className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white min-h-[44px]"
                >
                  <ChevronLeft className="w-4 h-4 text-cyan-400" />
                  <span>Back to Hub Feed</span>
                </button>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                  Profile Mode
                </span>
              </div>

              {/* Full User Profile & Radar Component with 16:9 responsive video */}
              <UserProfileRadar />
            </div>
          )}

          {/* ===================================================================== */}
          {/* VIEW 3: TRIP RADAR                                                    */}
          {/* ===================================================================== */}
          {activeView === 'trip' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-[#27272a] pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
                    <span>Trip Radar</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-amber-950/80 border border-amber-500/40 text-amber-300 whitespace-nowrap">
                      City Proximity
                    </span>
                  </h1>
                  <p className="text-xs font-mono text-zinc-400 mt-1">
                    Connect tour routes with local residency houses and municipal production grants.
                  </p>
                </div>

                {/* City Picker Accessible on Mobile */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-xs font-mono text-zinc-400 whitespace-nowrap">HUB:</span>
                  <div className="relative">
                    <select
                      value={activeCity}
                      onChange={(e) => setActiveCity(e.target.value)}
                      className="bg-[#18181b] border border-[#27272a] rounded px-3 py-2 text-xs font-mono text-zinc-200 outline-none focus:border-cyan-500/70 cursor-pointer pr-8 min-h-[44px]"
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

              {/* City Scene Cards */}
              <div className="bg-[#121215] border border-[#27272a] rounded-lg p-4 sm:p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-mono uppercase text-zinc-200 font-bold">
                      {activeCity} Cultural Hotspots
                    </span>
                  </div>
                  <span className="text-xs font-mono text-cyan-400 whitespace-nowrap">12 Spaces</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    {
                      name: 'TanzFaktur Köln',
                      type: 'Production Space',
                      focus: 'Contemporary Choreography',
                      address: 'Siegburger Str. 233'
                    },
                    {
                      name: 'Alte Feuerwache Köln',
                      type: 'Socio-Cultural Center',
                      focus: 'Experimental Sound & Improv',
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
            </div>
          )}

          {/* ===================================================================== */}
          {/* VIEW 4: SAVED CALLS & APPLICATION TRACKER                             */}
          {/* ===================================================================== */}
          {activeView === 'saved' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-[#27272a] pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
                    <Bookmark className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                    <span>Saved Pipeline</span>
                  </h1>
                  <p className="text-xs font-mono text-zinc-400 mt-1">
                    Organize submissions, track drafts, and monitor open call outcomes.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectView('hub')}
                  className="px-4 py-2 rounded text-xs font-mono bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold min-h-[44px] flex items-center justify-center gap-1.5 self-start sm:self-auto"
                >
                  <span>Browse Hub</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Status Columns Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                {[
                  { status: 'Not Started', count: 1, color: 'text-zinc-400' },
                  { status: 'In Draft', count: 1, color: 'text-amber-400' },
                  { status: 'Submitted', count: 1, color: 'text-cyan-400' },
                  { status: 'Shortlisted', count: 1, color: 'text-emerald-400' }
                ].map((col, i) => (
                  <div key={i} className="p-3 rounded bg-[#121215] border border-[#27272a] text-center space-y-0.5">
                    <div className={`text-lg sm:text-xl font-mono font-bold ${col.color}`}>{col.count}</div>
                    <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">{col.status}</div>
                  </div>
                ))}
              </div>

              {/* Pipeline Opportunities List */}
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
                  }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg bg-[#121215] border border-[#27272a] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
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
                      className="px-3.5 py-2 rounded text-xs font-mono bg-[#18181b] border border-[#27272a] text-zinc-300 hover:text-white min-h-[44px] flex items-center justify-center self-start sm:self-center"
                    >
                      Dossier ↗
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* VIEW 5: RADAR SETTINGS                                                */}
          {/* ===================================================================== */}
          {activeView === 'settings' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-[#27272a] pb-5">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
                  <Sliders className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                  <span>Radar Settings</span>
                </h1>
                <p className="text-xs font-mono text-zinc-400 mt-1">
                  Tune autonomous alerts across 268 verified institutions and 23 cultural hubs.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-[#121215] border border-[#27272a] rounded-lg p-4 sm:p-6 space-y-4">
                  <h2 className="text-xs sm:text-sm font-mono uppercase text-zinc-200 font-bold flex items-center gap-2 border-b border-[#27272a] pb-3">
                    <Radio className="w-4 h-4 text-cyan-400" />
                    <span>Autonomous Scan Cadence</span>
                  </h2>
                  <div className="space-y-2">
                    <label className="flex items-center justify-between p-3.5 rounded bg-[#18181b] border border-[#27272a] cursor-pointer min-h-[48px]">
                      <div>
                        <div className="text-xs font-bold text-white">Daily High-Priority Scan</div>
                        <div className="text-[10px] text-zinc-400">Deadlines under 14 days</div>
                      </div>
                      <input type="radio" name="cadence" defaultChecked className="accent-cyan-400 w-4 h-4" />
                    </label>
                    <label className="flex items-center justify-between p-3.5 rounded bg-[#18181b] border border-[#27272a] cursor-pointer min-h-[48px]">
                      <div>
                        <div className="text-xs font-bold text-white">Weekly Comprehensive Digest</div>
                        <div className="text-[10px] text-zinc-400">Monday 08:00 UTC dispatch</div>
                      </div>
                      <input type="radio" name="cadence" className="accent-cyan-400 w-4 h-4" />
                    </label>
                  </div>
                </div>

                <div className="bg-[#121215] border border-[#27272a] rounded-lg p-4 sm:p-6 space-y-4">
                  <h2 className="text-xs sm:text-sm font-mono uppercase text-zinc-200 font-bold flex items-center gap-2 border-b border-[#27272a] pb-3">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    <span>Active Hub Markets</span>
                  </h2>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {['Cologne', 'Tel Aviv', 'Berlin', 'Brussels', 'Zurich', 'Vienna', 'Amsterdam', 'Paris'].map(
                      (city, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1.5 rounded text-xs font-mono bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 min-h-[36px] flex items-center"
                        >
                          ✓ {city}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ========================================================================= */}
      {/* 5. MOBILE BOTTOM DOCK BAR (Quick 1-Tap Thumb Navigation on Mobile)         */}
      {/* ========================================================================= */}
      <nav
        aria-label="Mobile Bottom Quick Bar"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#121215]/95 backdrop-blur-lg border-t border-[#27272a] px-2 py-1.5 flex items-center justify-around"
      >
        <button
          type="button"
          onClick={() => handleSelectView('hub')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg min-h-[48px] min-w-[56px] transition-all touch-manipulation ${
            activeView === 'hub' ? 'text-cyan-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-mono">Hub</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectView('trip')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg min-h-[48px] min-w-[56px] transition-all touch-manipulation ${
            activeView === 'trip' ? 'text-amber-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <MapPin className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-mono">Trip</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectView('saved')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg min-h-[48px] min-w-[56px] transition-all touch-manipulation relative ${
            activeView === 'saved' ? 'text-cyan-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Bookmark className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-mono">Saved</span>
          {savedCount > 0 && (
            <span className="absolute top-1 right-2 w-4 h-4 rounded-full bg-cyan-500 text-zinc-950 text-[9px] font-bold font-mono flex items-center justify-center">
              {savedCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => handleSelectView('profile')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg min-h-[48px] min-w-[56px] transition-all touch-manipulation ${
            activeView === 'profile' ? 'text-cyan-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <div className="w-5 h-5 rounded-full bg-cyan-900 border border-cyan-400 text-cyan-300 text-[9px] font-mono flex items-center justify-center font-bold mb-0.5">
            RP
          </div>
          <span className="text-[10px] font-mono">Profile</span>
        </button>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-lg min-h-[48px] min-w-[56px] text-zinc-400 hover:text-white transition-all touch-manipulation"
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-mono">Menu</span>
        </button>
      </nav>
    </div>
  );
};

export default NavigationSidebar;
