import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getActiveMarketSlugs, isInPilotScope } from '@/lib/markets'
import OpportunityDetailView from '@/components/hub/OpportunityDetailView'
import type { HubFeedRow, Profile, VocabEntry } from '@/lib/types'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function OpportunityDetailPage({ params }: PageProps) {
  const resolvedParams = await params
  const slug = resolvedParams.slug

  const supabase = await createClient()

  // Fetch opportunity from hub_feed view
  // Pilot scope is enforced here too, not only on the feed. Scoping the Hub alone
  // still left every out-of-scope opportunity reachable by direct URL, which is the
  // "no European city anywhere on the site" the owner asked for. See lib/markets.ts.
  const activeSlugs = await getActiveMarketSlugs(supabase)

  const { data: opp } = await supabase
    .from('hub_feed')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  let finalOpp: HubFeedRow | null = opp as HubFeedRow | null

  if (!finalOpp) {
    // Fallback lookup from opportunities joined with sources and markets
    const { data: rawOpp } = await supabase
      .from('opportunities')
      .select('*, sources(name), markets(display_name, region)')
      .eq('slug', slug)
      .maybeSingle()

    if (!rawOpp) {
      notFound()
    }

    const sourceObj = rawOpp.sources as { name: string } | null
    const marketObj = rawOpp.markets as { display_name: string; region: string } | null

    finalOpp = {
      ...rawOpp,
      source_name: sourceObj?.name || 'Unknown Source',
      city_name: marketObj?.display_name || null,
      region: marketObj?.region || null,
      is_rolling: !rawOpp.deadline,
    } as HubFeedRow
  }

  // Out-of-scope city -> 404, same as a slug that does not exist. The row is not
  // deleted and comes straight back when the pilot widens; it is simply not part of
  // this site right now.
  if (!isInPilotScope(finalOpp?.city, activeSlugs)) {
    notFound()
  }

  // Fetch vocab
  const { data: vocabData } = await supabase
    .from('vocab')
    .select('*')
    .order('sort_order', { ascending: true })

  // Check auth user and saved state
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let isSaved = false
  let profile: Profile | null = null

  if (user && finalOpp) {
    const [savedResult, profileResult] = await Promise.all([
      supabase
        .from('user_saved_opportunities')
        .select('opp_id')
        .eq('user_id', user.id)
        .eq('opp_id', finalOpp.opp_id)
        .maybeSingle(),
      supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
    ])

    isSaved = !!savedResult.data
    profile = profileResult.data as Profile | null
  }

  return (
    <OpportunityDetailView
      row={finalOpp}
      vocab={(vocabData || []) as VocabEntry[]}
      isSaved={isSaved}
      userId={user?.id}
      profile={profile}
    />
  )
}
