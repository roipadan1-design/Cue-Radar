'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import EmptyState from '@/components/hub/EmptyState'
import { formatFunding, formatDeadline } from '@/components/hub/OpportunityRow'
import { createClient } from '@/lib/supabase/client'
import type { SavedRow, PipelineStatus } from '@/lib/types'

interface SavedPipelineViewProps {
  initialRows: SavedRow[]
  activeStatus: string
  userId: string
}

const STATUS_OPTIONS: { label: string; value: PipelineStatus }[] = [
  { label: 'Saved', value: 'saved' },
  { label: 'Drafting', value: 'drafting' },
  { label: 'Submitted', value: 'submitted' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Rejected', value: 'rejected' },
]

export default function SavedPipelineView({
  initialRows,
  activeStatus,
  userId,
}: SavedPipelineViewProps) {
  const router = useRouter()
  const [rows, setRows] = useState<SavedRow[]>(initialRows)

  const counts: Record<string, number> = {}
  rows.forEach((r) => {
    counts[r.pipeline_status] = (counts[r.pipeline_status] || 0) + 1
  })

  const tabs = STATUS_OPTIONS.map((opt) => {
    const count = counts[opt.value] || 0
    return {
      label: opt.label,
      status: opt.value,
      displayLabel: `${opt.label} · ${count}`,
    }
  })

  const filteredRows = rows.filter((r) => r.pipeline_status === activeStatus)

  const handleStatusChange = async (oppId: string, newStatus: PipelineStatus) => {
    setRows((prev) =>
      prev.map((r) => (r.opp_id === oppId ? { ...r, pipeline_status: newStatus } : r))
    )

    const supabase = createClient()
    const { error } = await supabase
      .from('user_saved_opportunities')
      .update({ pipeline_status: newStatus })
      .eq('user_id', userId)
      .eq('opp_id', oppId)

    if (error) {
      router.refresh()
    }
  }

  const handleUnsave = async (oppId: string) => {
    setRows((prev) => prev.filter((r) => r.opp_id !== oppId))

    const supabase = createClient()
    const { error } = await supabase
      .from('user_saved_opportunities')
      .delete()
      .eq('user_id', userId)
      .eq('opp_id', oppId)

    if (error) {
      router.refresh()
    }
  }

  return (
    <div className="flex flex-col gap-6">
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

      {/* List or Empty State */}
      {filteredRows.length === 0 ? (
        <EmptyState
          title="Nothing here yet."
          action={
            activeStatus === 'saved'
              ? { label: 'Browse open calls', href: '/hub' }
              : undefined
          }
        />
      ) : (
        <div className="flex flex-col border-t border-line">
          {filteredRows.map((item) => {
            const opp = item.opportunity
            if (!opp) return null

            const deadlineInfo = formatDeadline(opp)
            const fundingText = formatFunding(opp)

            return (
              <div
                key={item.opp_id}
                className="py-4 border-b border-line flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex flex-col gap-1 max-w-[600px]">
                  <div className="t-meta text-muted">
                    {opp.type} · {opp.source_name} {opp.city_name ? `· ${opp.city_name}` : ''}
                  </div>
                  <Link
                    href={`/opportunities/${opp.slug}`}
                    className="t-row text-fg font-semibold hover:underline"
                  >
                    {opp.title}
                  </Link>
                  <div className="flex flex-wrap items-center gap-3 t-meta text-muted mt-1">
                    <span>
                      Deadline:{' '}
                      <strong className={deadlineInfo.isUrgent ? 'text-urgent' : 'text-fg'}>
                        {deadlineInfo.text}
                      </strong>
                    </span>
                    <span>·</span>
                    <span>
                      Funding: <strong className="text-fg">{fundingText}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={item.pipeline_status}
                    onChange={(e) =>
                      handleStatusChange(item.opp_id, e.target.value as PipelineStatus)
                    }
                    className="h-9 px-3 bg-surface border border-line rounded-[var(--radius)] t-meta text-fg focus:outline-none focus:border-fg"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => handleUnsave(item.opp_id)}
                    className="t-meta text-muted hover:text-urgent transition-colors px-2 py-1"
                    title="Remove from saved"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
