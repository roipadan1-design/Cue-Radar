import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import OpportunityDetailView from '@/components/hub/OpportunityDetailView'
import type { HubFeedRow, VocabEntry } from '@/lib/types'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function OpportunityDetailPage({ params }: PageProps) {
  const resolvedParams = await params
  const slug = resolvedParams.slug

  const supabase = await createClient()

  // Fetch opportunity from hub_feed view
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
  if (user && finalOpp) {
    const { data: savedItem } = await supabase
      .from('user_saved_opportunities')
      .select('opp_id')
      .eq('user_id', user.id)
      .eq('opp_id', finalOpp.opp_id)
      .maybeSingle()

    isSaved = !!savedItem
  }

  return (
    <OpportunityDetailView
      row={finalOpp}
      vocab={(vocabData || []) as VocabEntry[]}
      isSaved={isSaved}
      userId={user?.id}
    />
  )
}
