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

  let sourcesQuery = supabase
    .from('sources')
    .select('*, markets(display_name)')
    .eq('status', 'active')
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
    // Rule 4: dynamic, no hardcoding — markets/vocab come from the database
    supabase.from('markets').select('*').order('display_name', { ascending: true }),
    supabase.from('vocab').select('*').order('sort_order', { ascending: true }),
    sourcesQuery,
    supabase.from('sources').select('source_id', { count: 'exact', head: true }).eq('status', 'active'),
  ])

  if (error) {
    console.error('Error querying sources:', error.message)
  }

  const markets = (marketsData || []) as Market[]
  const vocab = (vocabData || []) as VocabEntry[]
  const rows = (sourcesData || []) as (Source & { markets: { display_name: string } | null })[]
  const totalCount = allCount ?? 0

  return (
    <div className="max-w-[960px] mx-auto px-4 md:px-6 py-6">
      <div className="mb-1">
        <h1 className="t-title text-fg">Sources</h1>
        <p className="t-body text-muted mt-1">Institutions running opportunities on Fellow.</p>
      </div>

      <Suspense fallback={<div className="h-[100px] py-4 border-b border-line" />}>
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
          <div className="t-meta text-muted mt-4 mb-4">
            Showing {rows.length} of {totalCount}
          </div>
          <div className="flex flex-col gap-4">
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
