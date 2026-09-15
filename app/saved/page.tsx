import Link from 'next/link'
import EmptyState from '@/components/hub/EmptyState'
import type { SavedRow } from '@/lib/types'

interface PipelinePageProps {
  searchParams?: Promise<{ status?: string }>
}

export default async function PipelinePage(props: PipelinePageProps) {
  const searchParams = (await props.searchParams) || {}
  const activeStatus = searchParams.status || 'saved'

  // Until Task 04: Saved rows come from DB (currently empty array)
  const savedRows: SavedRow[] = []

  const counts: Record<string, number> = {}
  savedRows.forEach((r) => {
    counts[r.pipeline_status] = (counts[r.pipeline_status] || 0) + 1
  })

  const tabs = [
    { label: 'Saved', status: 'saved' },
    { label: 'Drafting', status: 'drafting' },
    { label: 'Submitted', status: 'submitted' },
    { label: 'Accepted', status: 'accepted' },
    { label: 'Rejected', status: 'rejected' },
  ].map((tab) => {
    const count = counts[tab.status]
    return {
      ...tab,
      displayLabel: count !== undefined ? `${tab.label} · ${count}` : tab.label,
    }
  })

  return (
    <div className="max-w-[960px] mx-auto px-4 md:px-6 py-6">
      <h1 className="t-title text-fg mb-4">Pipeline</h1>

      {/* Tabs */}
      <div className="flex items-center gap-6 overflow-x-auto border-b border-line pb-[1px] no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeStatus === tab.status
          return (
            <Link
              key={tab.status}
              href={`/saved?status=${tab.status}`}
              className={`t-meta py-2 whitespace-nowrap border-b-2 transition-colors ${
                isActive
                  ? 'text-fg border-fg font-semibold'
                  : 'text-muted border-transparent hover:text-fg'
              }`}
            >
              {tab.displayLabel}
            </Link>
          )
        })}
      </div>

      {/* Empty state */}
      <div className="mt-6">
        <EmptyState
          title="Nothing here yet."
          action={
            activeStatus === 'saved'
              ? { label: 'Browse open calls', href: '/hub' }
              : undefined
          }
        />
      </div>
    </div>
  )
}
