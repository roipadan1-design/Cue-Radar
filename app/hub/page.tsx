import Link from 'next/link'
import FilterBar from '@/components/hub/FilterBar'
import GroupHeader from '@/components/hub/GroupHeader'
import OpportunityRow from '@/components/hub/OpportunityRow'
import EmptyState from '@/components/hub/EmptyState'
import { getSeedMarkets, getSeedVocab, getSeedOpportunitiesStaging } from '@/lib/seed'
import type { HubFeedRow } from '@/lib/types'

interface HubPageProps {
  searchParams?: Promise<{
    city?: string
    type?: string
    discipline?: string
  }>
}

export default async function HubPage(props: HubPageProps) {
  const searchParams = (await props.searchParams) || {}
  const markets = getSeedMarkets()
  const vocab = getSeedVocab()
  const allRows = getSeedOpportunitiesStaging()

  // Apply search params filters
  let filteredRows = allRows
  if (searchParams.city) {
    filteredRows = filteredRows.filter((r) => r.city === searchParams.city)
  }
  if (searchParams.type) {
    filteredRows = filteredRows.filter((r) => r.type === searchParams.type)
  }
  if (searchParams.discipline) {
    filteredRows = filteredRows.filter((r) =>
      r.discipline_flags.includes(searchParams.discipline!)
    )
  }

  const totalCount = allRows.length

  // Categorize rows into groups
  const closingThisWeek: HubFeedRow[] = []
  const thisMonth: HubFeedRow[] = []
  const later: HubFeedRow[] = []
  const rolling: HubFeedRow[] = []

  filteredRows.forEach((r) => {
    if (r.is_rolling || !r.days_left) {
      rolling.push(r)
    } else if (r.days_left <= 7) {
      closingThisWeek.push(r)
    } else if (r.days_left <= 30) {
      thisMonth.push(r)
    } else {
      later.push(r)
    }
  })

  // Guest mode: locked=true for all rows
  // First 8 rows render, then guest banner, then remaining rows
  const limitCount = 8
  const locked = true

  return (
    <div className="max-w-[960px] mx-auto px-4 md:px-6 py-6">
      <div className="flex items-baseline gap-3 mb-4">
        <h1 className="t-title text-fg">Opportunities</h1>
        <span className="t-num t-title text-muted">{totalCount}</span>
      </div>

      <FilterBar markets={markets} vocab={vocab} />

      {totalCount === 0 ? (
        <EmptyState title="The feed is being curated — check back soon." />
      ) : filteredRows.length === 0 ? (
        <EmptyState
          title="No open calls match these filters."
          action={{ label: 'Reset', href: '/hub' }}
        />
      ) : (
        <div className="mt-2">
          {/* Render grouped rows */}
          {(() => {
            let renderedCount = 0
            const groups = [
              { label: 'CLOSING THIS WEEK', rows: closingThisWeek },
              { label: 'THIS MONTH', rows: thisMonth },
              { label: 'LATER', rows: later },
              { label: 'ROLLING', rows: rolling },
            ].filter((g) => g.rows.length > 0)

            return groups.map((group) => {
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
            })
          })()}
        </div>
      )}
    </div>
  )
}
