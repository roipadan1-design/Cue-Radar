import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import SourcesFilterBar from '@/components/sources/SourcesFilterBar'
import SourceCard from '@/components/sources/SourceCard'
import EmptyState from '@/components/hub/EmptyState'
import type { Market, Source, VocabEntry } from '@/lib/types'

interface SourcesPageProps {
  searchParams?: Promise<{
    q?: string
    city?: string
    discipline?: string
  }>
}

export default async function SourcesPage(props: SourcesPageProps) {
  const searchParams = (await props.searchParams) || {}
  const q = searchParams.q
  const city = searchParams.city
  const discipline = searchParams.discipline

  const hasActiveFilters = Boolean(q || city || discipline)

  const supabase = await createClient()

  // `markets!inner(...)` + `markets.is_active` scopes the directory to the pilot
  // (Israel-only right now) inside the same round-trip, instead of fetching 344
  // rows and discarding most of them. An inner join also drops the handful of
  // sources whose market is null or points at a parked city, which is the
  // correct behaviour: if we are not covering the city, we are not listing its
  // institutions. See supabase/migrations/0009_market_scope.sql.
  let sourcesQuery = supabase
    .from('sources')
    .select('*, markets!inner(display_name, is_active)')
    .eq('status', 'active')
    .eq('markets.is_active', true)
    .order('name', { ascending: true })

  if (q) {
    sourcesQuery = sourcesQuery.ilike('name', `%${q}%`)
  }
  if (city) {
    sourcesQuery = sourcesQuery.eq('market', city)
  }
  if (discipline) {
    sourcesQuery = sourcesQuery.contains('discipline_focus', [discipline])
  }

  const [
    { data: marketsData },
    { data: vocabData },
    { data: sourcesData, error },
    { count: allCount },
  ] = await Promise.all([
    // Rule 4: dynamic, no hardcoding — markets/vocab come from the database.
    // `is_active` scopes the pilot (Israel-only right now, see migration 0009);
    // the flag lives in the database precisely so no country or city list ever
    // gets written into a .tsx file.
    supabase
      .from('markets')
      .select('*')
      .eq('is_active', true)
      .order('display_name', { ascending: true }),
    supabase.from('vocab').select('*').order('sort_order', { ascending: true }),
    sourcesQuery,
    supabase
      .from('sources')
      .select('source_id, markets!inner(is_active)', { count: 'exact', head: true })
      .eq('status', 'active')
      .eq('markets.is_active', true),
  ])

  if (error) {
    console.error('Error querying sources:', error.message)
  }

  const markets = (marketsData || []) as Market[]
  const vocab = (vocabData || []) as VocabEntry[]
  const rows = (sourcesData || []) as (Source & {
    markets: { display_name: string; is_active: boolean } | null
  })[]
  const totalCount = allCount ?? 0

  return (
    <div className="container-page py-8">
      <div className="mb-5">
        <h1 className="t-title text-fg">Organisations</h1>
        <p className="t-body text-muted mt-2 max-w-[60ch]">
          Institutions, residency centres and production houses that run the calls in the feed.
        </p>
      </div>

      <Suspense fallback={<div className="h-[100px]" />}>
        <SourcesFilterBar markets={markets} vocab={vocab} />
      </Suspense>

      {rows.length === 0 ? (
        hasActiveFilters ? (
          <EmptyState
            title="No institutions match these filters."
            action={{ label: 'Reset', href: '/sources' }}
          />
        ) : (
          <EmptyState title="Sources are being curated — check back soon." />
        )
      ) : (
        <>
          <div className="flex items-center justify-between mt-5 mb-4 pb-3 border-b border-line">
            <span className="t-meta">
              {rows.length === totalCount
                ? `${totalCount} organisations`
                : `${rows.length} of ${totalCount} organisations`}
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {rows.map((source) => (
              <SourceCard
                key={source.source_id}
                source={source}
                cityName={source.markets?.display_name ?? null}
                vocab={vocab}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
