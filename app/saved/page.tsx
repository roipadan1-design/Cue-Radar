import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SavedPipelineView from '@/components/saved/SavedPipelineView'
import type { SavedRow, HubFeedRow } from '@/lib/types'

interface SavedPageProps {
  searchParams?: Promise<{ status?: string }>
}

export default async function SavedPage(props: SavedPageProps) {
  const searchParams = (await props.searchParams) || {}
  const activeStatus = searchParams.status || 'saved'

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/signin?next=/saved')
  }

  // Fetch user saved opportunities
  const { data: userSaved } = await supabase
    .from('user_saved_opportunities')
    .select('*, opportunities(*, sources(name), markets(display_name))')
    .eq('user_id', user.id)
    .order('saved_at', { ascending: false })

  const savedRows: SavedRow[] = (userSaved || []).map((item) => {
    const opp = item.opportunities as unknown as {
      opp_id: string
      title: string
      slug: string
      type: string
      city?: string | null
      deadline?: string | null
      funding_min?: number | null
      funding_max?: number | null
      currency?: string | null
      funding_type?: string | null
      is_demo?: boolean | null
      sources?: { name: string } | null
      markets?: { display_name: string } | null
    } | null

    let oppData: HubFeedRow | undefined = undefined

    if (opp) {
      oppData = {
        ...opp,
        source_id: opp.opp_id,
        source_name: opp.sources?.name || 'Unknown Source',
        city_name: opp.markets?.display_name || null,
        covers: [],
        application_fee: 0,
        eligibility_geo: [],
        materials_required: [],
        apply_url: '',
        status: 'live',
        discipline_flags: [],
        is_rolling: !opp.deadline,
        is_demo: opp.is_demo ?? false,
      } as HubFeedRow
    }

    return {
      user_id: item.user_id,
      opp_id: item.opp_id,
      pipeline_status: item.pipeline_status,
      notes: item.notes,
      saved_at: item.saved_at,
      opportunity: oppData,
    }
  })

  return (
    <div className="container-page py-8 md:py-10">
      <h1 className="t-title text-fg mb-6">Saved calls</h1>
      <SavedPipelineView
        initialRows={savedRows}
        activeStatus={activeStatus}
        userId={user.id}
      />
    </div>
  )
}
