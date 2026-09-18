'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

// The ArtConnect discover pattern: sub-tabs across the top of the directory.
// "Curators" has no real data behind it (rule 1 — no invented profiles), so it's
// listed here too but the page renders an honest empty state for it rather than
// a query.
const TABS: { key: string; label: string }[] = [
  { key: 'artists', label: 'Artists' },
  { key: 'organizations', label: 'Organizations' },
  { key: 'curators', label: 'Curators' },
]

interface DiscoverTabsProps {
  active: string
}

export default function DiscoverTabs({ active }: DiscoverTabsProps) {
  const searchParams = useSearchParams()

  function tabHref(key: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', key)
    // "Search by name" is scoped to the entity type of the previous tab (artist
    // name vs. organisation name) — drop it on switch. City + discipline still
    // apply to both entity types, so they carry over.
    params.delete('q')
    return `/discover?${params.toString()}`
  }

  return (
    <div className="flex items-center gap-6 border-b border-line overflow-x-auto">
      {TABS.map((tab) => (
        <Link
          key={tab.key}
          href={tabHref(tab.key)}
          className={`pb-3 -mb-px shrink-0 t-row text-[15px] border-b-2 transition-colors ${
            active === tab.key
              ? 'border-fg text-fg'
              : 'border-transparent text-muted hover:text-fg'
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  )
}
