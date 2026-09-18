'use client'

import { useState } from 'react'
import Link from 'next/link'
import Chip from '@/components/ui/Chip'
import OpportunityRow from '@/components/hub/OpportunityRow'
import type { HubFeedRow, Profile, Source, VocabEntry } from '@/lib/types'

export interface ClosedOpportunity {
  opp_id: string
  title: string
  deadline?: string | null
  created_at?: string | null
}

interface SourceDetailViewProps {
  source: Source
  cityName?: string | null
  sourceTypeLabel: string
  liveRows: HubFeedRow[]
  closedRows: ClosedOpportunity[]
  recurrenceMonth?: string | null
  vocab: VocabEntry[]
  profile?: Profile | null
  sourcesDirectoryLive: boolean
}

function formatClosedDate(dateStr?: string | null): string {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(d)
  } catch {
    return dateStr
  }
}

export default function SourceDetailView({
  source,
  cityName,
  sourceTypeLabel,
  liveRows,
  closedRows,
  recurrenceMonth,
  vocab,
  profile = null,
  sourcesDirectoryLive,
}: SourceDetailViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'archive'>('overview')

  const metaLine = [sourceTypeLabel, cityName].filter(Boolean).join('  ·  ')
  const hasArchiveContent = liveRows.length > 0 || closedRows.length > 0

  return (
    <div className="container-page py-8">
      {/* Back link — page-level nav, same position/weight as OpportunityDetailView's
          own back link, so it stays reachable regardless of which tab is active. */}
      {sourcesDirectoryLive && (
        <div className="mb-4">
          <Link href="/sources" className="t-meta text-muted hover:text-fg transition-colors">
            ← Organisations
          </Link>
        </div>
      )}

      {/* Tab bar */}
      <div className="flex gap-2 border-b border-line mb-6" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'overview'}
          onClick={() => setActiveTab('overview')}
          className={`min-h-[44px] px-1 mr-5 text-[15px] font-semibold border-b-2 -mb-px transition-colors ${
            activeTab === 'overview'
              ? 'border-fg text-fg'
              : 'border-transparent text-muted hover:text-fg'
          }`}
        >
          Overview
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'archive'}
          onClick={() => setActiveTab('archive')}
          className={`min-h-[44px] px-1 mr-5 text-[15px] font-semibold border-b-2 -mb-px transition-colors ${
            activeTab === 'archive'
              ? 'border-fg text-fg'
              : 'border-transparent text-muted hover:text-fg'
          }`}
        >
          Past &amp; open calls
        </button>
      </div>

      {/* Overview panel */}
      <div hidden={activeTab !== 'overview'} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div className="t-meta text-muted">{metaLine}</div>
          <h1 className="t-title text-fg">{source.name}</h1>
        </div>

        {source.is_demo && <Chip className="self-start">Demo</Chip>}

        {(source.website_url || source.opencalls_url || source.instagram_url) && (
          <div className="flex flex-wrap gap-4">
            {source.website_url && (
              <a
                href={source.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] inline-flex items-center t-body text-fg hover:underline hover:underline-offset-4"
              >
                Website
              </a>
            )}
            {source.opencalls_url && (
              <a
                href={source.opencalls_url}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] inline-flex items-center t-body text-fg hover:underline hover:underline-offset-4"
              >
                Open calls
              </a>
            )}
            {source.instagram_url && (
              <a
                href={source.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] inline-flex items-center t-body text-fg hover:underline hover:underline-offset-4"
              >
                Instagram
              </a>
            )}
          </div>
        )}

        {source.notes && <p className="max-w-[60ch] t-body text-fg">{source.notes}</p>}

        {recurrenceMonth && (
          <p className="t-body text-fg">
            Usually opens in <span className="text-accent">{recurrenceMonth}</span>
          </p>
        )}
      </div>

      {/* Past & open calls panel */}
      <div hidden={activeTab !== 'archive'} className="flex flex-col gap-4">
        {!hasArchiveContent && <p className="t-body text-muted">No past calls recorded yet.</p>}

        {liveRows.length > 0 && (
          <div className="flex flex-col gap-4">
            {liveRows.map((row) => (
              <OpportunityRow key={row.opp_id} row={row} profile={profile} vocab={vocab} />
            ))}
          </div>
        )}

        {closedRows.length > 0 && (
          <div className="flex flex-col">
            {closedRows.map((row) => (
              <div
                key={row.opp_id}
                className="flex items-center justify-between gap-4 py-3 border-b border-line"
              >
                <span className="t-body text-muted line-clamp-1">{row.title}</span>
                <span className="t-meta text-muted shrink-0">
                  Closed {formatClosedDate(row.deadline || row.created_at)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
