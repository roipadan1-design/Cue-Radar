import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { buildIcsCalendar, icsResponse } from '@/lib/ics'

interface RouteProps {
  params: Promise<{ slug: string }>
}

export async function GET(request: Request, props: RouteProps) {
  const params = await props.params
  const slug = params.slug

  const supabase = await createClient()

  const { data: opp } = await supabase
    .from('opportunities')
    .select('*, sources(name)')
    .eq('slug', slug)
    .maybeSingle()

  if (!opp || !opp.deadline) {
    return new NextResponse('Opportunity deadline not found', { status: 404 })
  }

  const sourceName = (opp.sources as { name: string } | null)?.name || 'Cue Radar'

  const icsContent = buildIcsCalendar({
    kind: 'all-day',
    uid: opp.opp_id,
    date: opp.deadline,
    summary: `Deadline: ${opp.title} (${sourceName})`,
    description: `${opp.summary ? opp.summary.replace(/\n/g, ' ') : opp.title} - Apply at ${opp.apply_url}`,
    url: opp.apply_url,
  })

  return icsResponse(icsContent, `${slug}.ics`)
}
