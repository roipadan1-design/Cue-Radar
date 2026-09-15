import Link from 'next/link'
import GroupHeader from '@/components/hub/GroupHeader'
import OpportunityRow from '@/components/hub/OpportunityRow'
import EmptyState from '@/components/hub/EmptyState'
import { groupHubRows } from '@/lib/seed'
import type { HubFeedRow } from '@/lib/types'

interface HubFeedViewProps {
  rows: HubFeedRow[]
  locked?: boolean
}

export default function HubFeedView({ rows, locked = true }: HubFeedViewProps) {
  if (rows.length === 0) {
    return <EmptyState title="No open calls match these filters." action={{ label: 'Reset', href: '/hub' }} />
  }

  const { closingThisWeek, thisMonth, later, rolling } = groupHubRows(rows)

  const limitCount = 8
  let renderedCount = 0

  const groups = [
    { label: 'CLOSING THIS WEEK', rows: closingThisWeek },
    { label: 'THIS MONTH', rows: thisMonth },
    { label: 'LATER', rows: later },
    { label: 'ROLLING', rows: rolling },
  ].filter((g) => g.rows.length > 0)

  return (
    <div className="mt-2">
      {groups.map((group) => {
        const groupRows = group.rows
        const groupStart = renderedCount
        renderedCount += groupRows.length

        return (
          <div key={group.label} className="mb-6">
            <GroupHeader label={group.label} count={groupRows.length} />
            <div>
              {groupRows.map((row, idx) => {
                const overallIndex = groupStart + idx
                const isAtBannerPoint = overallIndex === limitCount

                return (
                  <div key={row.opp_id}>
                    {isAtBannerPoint && (
                      <div className="my-6 p-6 bg-surface text-center">
                        <h2 className="t-row text-fg">
                          Sign in to see deadlines, funding and how to apply.
                        </h2>
                        <div className="mt-3">
                          <Link
                            href="/signin"
                            className="t-body text-fg underline underline-offset-4 hover:opacity-80"
                          >
                            Sign in
                          </Link>
                        </div>
                      </div>
                    )}
                    <OpportunityRow row={row} locked={locked} />
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
