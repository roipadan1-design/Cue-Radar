import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import DiscoverTabs from '@/components/discover/DiscoverTabs'
import ListingFilterBar from '@/components/filters/ListingFilterBar'
import OrganizationRow from '@/components/discover/OrganizationRow'
import CuratorRow from '@/components/discover/CuratorRow'
import EmptyState from '@/components/hub/EmptyState'
import Badge from '@/components/ui/Badge'
import { vocabLabel } from '@/lib/labels'
import type { Curator, Market, Source, VocabEntry } from '@/lib/types'

type DiscoverTab = 'organizations' | 'curators' | 'artists'

interface DiscoverPageProps {
  searchParams?: Promise<{
    tab?: string
    q?: string
    city?: string
    type?: string
    discipline?: string
    newcomers?: string
    sort?: string
  }>
}

function resolveTab(raw?: string): DiscoverTab {
  if (raw === 'curators' || raw === 'artists') return raw
  return 'organizations'
}

function escapeLike(q: string): string {
  // Commas and parentheses would break PostgREST's or() syntax, so they become spaces.
  return q.replace(/[,()]/g, ' ').replace(/[%_]/g, '\\$&')
}

export default async function DiscoverPage(props: DiscoverPageProps) {
  const searchParams = (await props.searchParams) || {}
  const tab = resolveTab(searchParams.tab)
  const { q, city, type, discipline } = searchParams
  const newcomers = searchParams.newcomers === 'true'
  const hasActiveFilters = Boolean(q || city || type || discipline || newcomers)

  const supabase = await createClient()

  // Rule 4: cities, types and fields all come from the database. Cities are the
  // active pilot markets (Kyoto + Tokyo since migration 0011).
  const [{ data: marketsData }, { data: vocabData }] = await Promise.all([
    supabase.from('markets').select('*').eq('is_active', true).order('display_name', { ascending: true }),
    supabase.from('vocab').select('*').order('sort_order', { ascending: true }),
  ])
  const markets = (marketsData || []) as Market[]
  const vocab = (vocabData || []) as VocabEntry[]
  const marketBySlug = new Map(markets.map((m) => [m.slug, m]))
  const activeSlugs = markets.map((m) => m.slug)

  const cityOptions = markets.map((m) => ({ value: m.slug, label: m.display_name }))
  const disciplineOptions = vocab
    .filter((v) => v.category === 'discipline' && !v.deprecated)
    .map((v) => ({ value: v.value, label: v.label }))

  let sourceRows: Source[] = []
  let typeOptions: { value: string; label: string }[] = []
  let curatorRows: Curator[] = []
  let curatorsUnavailable = false

  if (tab === 'organizations') {
    // Type options = the types that actually occur in the pilot's organisations
    // (a query result, rule 4), labelled from vocab.
    const { data: typeData } = await supabase
      .from('sources')
      .select('source_type')
      .eq('status', 'active')
      .in('market', activeSlugs)
    const types = Array.from(new Set((typeData || []).map((r) => r.source_type as string))).sort()
    typeOptions = types.map((t) => ({ value: t, label: vocabLabel(vocab, 'source_type', t) }))

    let query = supabase
      .from('sources')
      .select('*')
      .eq('status', 'active')
      .in('market', activeSlugs)

    if (q) {
      const e = escapeLike(q)
      query = query.ilike('name', `%${e}%`)
    }
    if (city) query = query.eq('market', city)
    if (type) query = query.eq('source_type', type)
    if (discipline) query = query.contains('discipline_focus', [discipline])
    if (newcomers) query = query.eq('newcomer_friendly', 'yes')
    query =
      searchParams.sort === 'type'
        ? query.order('source_type', { ascending: true }).order('name', { ascending: true })
        : query.order('tier', { ascending: true }).order('name', { ascending: true })

    const { data, error } = await query
    if (error) console.error('Error querying sources for Discover:', error.message)
    sourceRows = (data || []) as Source[]
  } else if (tab === 'curators') {
    let query = supabase
      .from('curators')
      .select('*')
      .eq('status', 'active')
      .in('market', activeSlugs)
      .order('name', { ascending: true })

    if (q) {
      const e = escapeLike(q)
      query = query.or(`name.ilike.%${e}%,role_label.ilike.%${e}%,about.ilike.%${e}%`)
    }
    if (city) query = query.eq('market', city)
    if (discipline) query = query.contains('disciplines', [discipline])

    const { data, error } = await query
    if (error) {
      // The curators table arrives with migration 0012; until it is applied the
      // tab says so plainly instead of pretending the directory is empty.
      console.error('Error querying curators for Discover:', error.message)
      curatorsUnavailable = true
    }
    curatorRows = (data || []) as Curator[]
  }

  const resultCount = tab === 'organizations' ? sourceRows.length : curatorRows.length

  return (
    <div className="container-page py-6 md:py-10 flex flex-col gap-6">
      <div>
        <h1 className="t-title text-fg">Discover</h1>
        <p className="t-body text-muted mt-1">
          The venues, collectives, festivals and people behind the scene in each city.
        </p>
      </div>

      <Suspense fallback={<div className="h-[44px] border-b border-line" />}>
        <DiscoverTabs active={tab} />
      </Suspense>

      {tab === 'artists' ? (
        <div className="py-10 flex flex-col items-start gap-4 max-w-[52ch]">
          <Badge tone="accent" uppercase>
            Coming soon
          </Badge>
          <h2 className="t-title text-fg">Artist profiles are on their way.</h2>
          <p className="t-body text-muted">
            Soon you&apos;ll be able to find artists working in your field and city, and show
            them who you are. For now, start with the places and people already shaping the
            scene.
          </p>
        </div>
      ) : (
        <>
          <Suspense fallback={<div className="h-[160px]" />}>
            <ListingFilterBar
              basePath="/discover"
              searchPlaceholder={
                tab === 'organizations'
                  ? 'Search venues, galleries, collectives, festivals'
                  : 'Search curators and programmers'
              }
              dropdowns={
                tab === 'organizations'
                  ? [
                      { param: 'city', label: 'City', options: cityOptions },
                      { param: 'type', label: 'Type', options: typeOptions },
                      { param: 'discipline', label: 'Field', options: disciplineOptions },
                    ]
                  : [
                      { param: 'city', label: 'City', options: cityOptions },
                      { param: 'discipline', label: 'Field', options: disciplineOptions },
                    ]
              }
              toggles={tab === 'organizations' ? [{ param: 'newcomers', label: 'Open to newcomers' }] : []}
              resultCount={resultCount}
              resultNoun={tab === 'organizations' ? ['organization', 'organizations'] : ['curator', 'curators']}
              sort={
                tab === 'organizations'
                  ? {
                      param: 'sort',
                      options: [
                        { value: 'featured', label: 'Most relevant' },
                        { value: 'type', label: 'Type' },
                      ],
                    }
                  : undefined
              }
            />
          </Suspense>

          {tab === 'organizations' ? (
            sourceRows.length === 0 ? (
              hasActiveFilters ? (
                <EmptyState
                  title="No organizations match these filters."
                  action={{ label: 'Clear filters', href: '/discover?tab=organizations' }}
                />
              ) : (
                <EmptyState title="Organizations are being researched. Check back soon." />
              )
            ) : (
              <div className="flex flex-col gap-3">
                {sourceRows.map((source) => {
                  const m = source.market ? marketBySlug.get(source.market) : undefined
                  return (
                    <OrganizationRow
                      key={source.source_id}
                      source={source}
                      cityName={m?.display_name ?? null}
                      country={m?.country ?? null}
                      vocab={vocab}
                    />
                  )
                })}
              </div>
            )
          ) : curatorsUnavailable || curatorRows.length === 0 ? (
            hasActiveFilters && !curatorsUnavailable ? (
              <EmptyState
                title="No curators match these filters."
                action={{ label: 'Clear filters', href: '/discover?tab=curators' }}
              />
            ) : (
              <EmptyState
                title="Curators are being researched."
                body="We only list people whose public work we've checked, so this fills in as the research lands."
              />
            )
          ) : (
            <div className="flex flex-col gap-3">
              {curatorRows.map((curator) => {
                const m = curator.market ? marketBySlug.get(curator.market) : undefined
                return (
                  <CuratorRow
                    key={curator.curator_id}
                    curator={curator}
                    cityName={m?.display_name ?? null}
                    country={m?.country ?? null}
                    vocab={vocab}
                  />
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}
