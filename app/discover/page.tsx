import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import DiscoverTabs from '@/components/discover/DiscoverTabs'
import DiscoverFilterBar from '@/components/discover/DiscoverFilterBar'
import ArtistRow from '@/components/discover/ArtistRow'
import OrganizationRow from '@/components/discover/OrganizationRow'
import EmptyState from '@/components/hub/EmptyState'
import type { Market, Profile, Source, VocabEntry } from '@/lib/types'

type DiscoverTab = 'artists' | 'organizations' | 'curators'

interface DiscoverPageProps {
  searchParams?: Promise<{
    tab?: string
    q?: string
    city?: string
    discipline?: string
  }>
}

function resolveTab(raw?: string): DiscoverTab {
  if (raw === 'organizations' || raw === 'curators') return raw
  return 'artists'
}

export default async function DiscoverPage(props: DiscoverPageProps) {
  const searchParams = (await props.searchParams) || {}
  const tab = resolveTab(searchParams.tab)
  const q = searchParams.q
  const city = searchParams.city
  const discipline = searchParams.discipline

  const hasActiveFilters = Boolean(q || city || discipline)

  const supabase = await createClient()

  // Rule 4 / Israel-only pilot: markets and vocab are never hard-coded. Cities are
  // scoped to `is_active = true` everywhere in Discover (name search, city search,
  // and the artist/organization city label all read from this same list).
  const [{ data: marketsData }, { data: vocabData }] = await Promise.all([
    supabase.from('markets').select('*').eq('is_active', true).order('display_name', { ascending: true }),
    supabase.from('vocab').select('*').order('sort_order', { ascending: true }),
  ])

  const markets = (marketsData || []) as Market[]
  const vocab = (vocabData || []) as VocabEntry[]

  let profileRows: Profile[] = []
  let sourceRows: (Source & { markets: { display_name: string; is_active: boolean } | null })[] = []

  if (tab === 'artists') {
    let profilesQuery = supabase
      .from('profiles')
      .select('*')
      .eq('is_public', true)
      .order('full_name', { ascending: true })

    if (q) {
      const escaped = q.replace(/[%_]/g, '\\$&')
      profilesQuery = profilesQuery.or(`full_name.ilike.%${escaped}%,role_label.ilike.%${escaped}%`)
    }
    if (city) profilesQuery = profilesQuery.eq('current_city', city)
    if (discipline) profilesQuery = profilesQuery.contains('disciplines', [discipline])

    const { data, error } = await profilesQuery
    if (error) console.error('Error querying profiles for Discover:', error.message)
    profileRows = (data || []) as Profile[]
  } else if (tab === 'organizations') {
    // `markets!inner(...)` + `markets.is_active` scopes the directory to the pilot.
    // Without the inner join this tab listed every organisation in the database —
    // Tbilisi, Berlin, Tokyo, Kraków — while the city filter above it offered only
    // Israeli cities, which is the exact "cities outside Israel" the pilot drops.
    // Matches how app/sources/page.tsx scopes the same table.
    let sourcesQuery = supabase
      .from('sources')
      .select('*, markets!inner(display_name, is_active)')
      .eq('status', 'active')
      .eq('markets.is_active', true)
      .order('name', { ascending: true })

    if (q) {
      const escaped = q.replace(/[%_]/g, '\\$&')
      sourcesQuery = sourcesQuery.ilike('name', `%${escaped}%`)
    }
    if (city) sourcesQuery = sourcesQuery.eq('market', city)
    if (discipline) sourcesQuery = sourcesQuery.contains('discipline_focus', [discipline])

    const { data, error } = await sourcesQuery
    if (error) console.error('Error querying sources for Discover:', error.message)
    sourceRows = (data || []) as (Source & {
      markets: { display_name: string; is_active: boolean } | null
    })[]
  }
  // tab === 'curators': no query — we hold no curator data (rule 1). See EmptyState below.

  return (
    <div className="container-page py-6 md:py-10 flex flex-col gap-6">
      <div>
        <h1 className="t-title text-fg">Discover</h1>
        <p className="t-body text-muted mt-1">
          Artists and organisations from the pilot markets.
        </p>
      </div>

      <Suspense fallback={<div className="h-[44px] border-b border-line" />}>
        <DiscoverTabs active={tab} />
      </Suspense>

      {tab !== 'curators' && (
        <Suspense fallback={<div className="h-[100px] py-4 border-b border-line" />}>
          <DiscoverFilterBar markets={markets} vocab={vocab} namePlaceholder="Search by name" />
        </Suspense>
      )}

      {tab === 'curators' ? (
        <EmptyState
          title="Curators aren't in the directory yet."
          body="We don't have curator profiles to show — this section stays empty rather than showing placeholder people. It will populate once that data exists."
        />
      ) : tab === 'artists' ? (
        profileRows.length === 0 ? (
          hasActiveFilters ? (
            <EmptyState
              title="No artists match these filters."
              action={{ label: 'Reset', href: '/discover?tab=artists' }}
            />
          ) : (
            <EmptyState title="No public profiles yet — check back soon." />
          )
        ) : (
          <div className="flex flex-col gap-4">
            {profileRows.map((profile) => (
              <ArtistRow key={profile.id} profile={profile} markets={markets} vocab={vocab} />
            ))}
          </div>
        )
      ) : sourceRows.length === 0 ? (
        hasActiveFilters ? (
          <EmptyState
            title="No organisations match these filters."
            action={{ label: 'Reset', href: '/discover?tab=organizations' }}
          />
        ) : (
          <EmptyState title="Organisations are being curated — check back soon." />
        )
      ) : (
        <div className="flex flex-col gap-4">
          {sourceRows.map((source) => (
            <OrganizationRow
              key={source.source_id}
              source={source}
              cityName={source.markets?.display_name ?? null}
              vocab={vocab}
            />
          ))}
        </div>
      )}
    </div>
  )
}
