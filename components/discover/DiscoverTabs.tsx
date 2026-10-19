'use client'

import Link from 'next/link'

// The ArtConnect discover pattern: sub-tabs across the top of the directory.
// Task 22 order: Organizations first (the Kyoto/Tokyo scene map is the pilot's
// core content), Curators, then Artists, which is paused as "coming soon" until
// the pilot has artist profiles to show.
const TABS: { key: string; label: string; soon?: boolean }[] = [
  { key: 'organizations', label: 'Organizations' },
  { key: 'curators', label: 'Curators' },
  { key: 'artists', label: 'Artists', soon: true },
]

interface DiscoverTabsProps {
  active: string
}

export default function DiscoverTabs({ active }: DiscoverTabsProps) {
  // Filters differ per tab (orgs have Type, curators don't), so a tab switch
  // starts clean rather than carrying params that mean nothing on the next tab.
  return (
    <div className="flex items-center gap-6 border-b border-line overflow-x-auto overflow-y-hidden">
      {TABS.map((tab) => (
        <Link
          key={tab.key}
          href={`/discover?tab=${tab.key}`}
          aria-current={active === tab.key ? 'page' : undefined}
          className={`pb-3 -mb-px shrink-0 t-row text-[15px] border-b-2 transition-colors ${
            active === tab.key
              ? 'border-fg text-fg'
              : 'border-transparent text-muted hover:text-fg'
          }`}
        >
          {tab.label}
          {tab.soon && (
            <span className="relative -top-1.5 ml-1.5 text-[10px] uppercase tracking-[0.06em] text-muted">
              Soon
            </span>
          )}
        </Link>
      ))}
    </div>
  )
}
