import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import DiscoverFilterBar from '@/components/discover/DiscoverFilterBar'
import ProfileCard from '@/components/discover/ProfileCard'
import EmptyState from '@/components/hub/EmptyState'
import type { Market, Profile, VocabEntry } from '@/lib/types'

interface DiscoverPageProps {
  searchParams?: Promise<{
    q?: string
    city?: string
    discipline?: string
  }>
}

export default async function DiscoverPage(props: DiscoverPageProps) {
  const searchParams = (await props.searchParams) || {}
  const q = searchParams.q
  const city = searchParams.city
  const discipline = searchParams.discipline

  const hasActiveFilters = Boolean(q || city || discipline)

  const supabase = await createClient()

  // Search matches full_name and role_label — both are real, queried
  // columns (per docs/creative/DISCOVER_V1_COPY.md's own flag to confirm
  // this before picking the placeholder copy; see docs/DECISIONS.md).
  let profilesQuery = supabase
    .from('profiles')
    .select('*')
    .eq('is_public', true)
    .order('full_name', { ascending: true })

  if (q) {
    const escaped = q.replace(/[%_]/g, '\\$&')
    profilesQuery = profilesQuery.or(`full_name.ilike.%${escaped}%,role_label.ilike.%${escaped}%`)
  }
  if (city) {
    profilesQuery = profilesQuery.eq('current_city', city)
  }
  if (discipline) {
    profilesQuery = profilesQuery.contains('disciplines', [discipline])
  }

  const [{ data: marketsData }, { data: vocabData }, { data: profilesData, error }] = await Promise.all([
    supabase.from('markets').select('*').order('display_name', { ascending: true }),
    supabase.from('vocab').select('*').order('sort_order', { ascending: true }),
    profilesQuery,
  ])

  if (error) {
    console.error('Error querying profiles for Discover:', error.message)
  }

  const markets = (marketsData || []) as Market[]
  const vocab = (vocabData || []) as VocabEntry[]
  const rows = (profilesData || []) as Profile[]

  return (
    <div className="max-w-[720px] mx-auto px-4 md:px-6 py-6">
      <div className="mb-1">
        <h1 className="t-title text-fg">Discover</h1>
        <p className="t-body text-muted mt-1">Artists who&apos;ve made their profile public.</p>
      </div>

      <Suspense fallback={<div className="h-[100px] py-4 border-b border-line" />}>
        <DiscoverFilterBar markets={markets} vocab={vocab} />
      </Suspense>

      {rows.length === 0 ? (
        hasActiveFilters ? (
          <EmptyState
            title="No profiles match these filters."
            action={{ label: 'Reset', href: '/discover' }}
          />
        ) : (
          <EmptyState title="No public profiles yet — check back soon." />
        )
      ) : (
        <div className="flex flex-col gap-4 mt-4">
          {rows.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} markets={markets} vocab={vocab} />
          ))}
        </div>
      )}
    </div>
  )
}
