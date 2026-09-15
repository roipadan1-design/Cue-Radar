import { Suspense } from 'react'
import FilterBar from '@/components/hub/FilterBar'
import EmptyState from '@/components/hub/EmptyState'
import { getSeedMarkets, getSeedVocab } from '@/lib/seed'

export default async function HubPage() {
  const markets = getSeedMarkets()
  const vocab = getSeedVocab()

  // Until Task 04: The hub has no data from the DB.
  // Count is computed dynamically as 0.
  const totalCount = 0

  return (
    <div className="max-w-[960px] mx-auto px-4 md:px-6 py-6">
      <div className="flex items-baseline gap-3 mb-4">
        <h1 className="t-title text-fg">Opportunities</h1>
        <span className="t-num t-title text-muted">{totalCount}</span>
      </div>

      <Suspense fallback={<div className="h-[69px] py-4 border-b border-line" />}>
        <FilterBar markets={markets} vocab={vocab} />
      </Suspense>

      <EmptyState title="The feed is being curated — check back soon." />
    </div>
  )
}
