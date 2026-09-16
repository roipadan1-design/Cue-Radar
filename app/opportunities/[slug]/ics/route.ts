import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

  const deadlineDate = new Date(opp.deadline)
  const dtStart = deadlineDate.toISOString().replace(/[-:]/g, '').split('T')[0]

  const nextDay = new Date(deadlineDate)
  nextDay.setDate(nextDay.getDate() + 1)
  const dtEnd = nextDay.toISOString().replace(/[-:]/g, '').split('T')[0]

  const nowStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Cue Radar//Opportunity Deadline//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${opp.opp_id}@cueradar.org`,
    `DTSTAMP:${nowStamp}`,
    `DTSTART;VALUE=DATE:${dtStart}`,
    `DTEND;VALUE=DATE:${dtEnd}`,
    `SUMMARY:Deadline: ${opp.title} (${sourceName})`,
    `DESCRIPTION:${opp.summary ? opp.summary.replace(/\n/g, ' ') : opp.title} - Apply at ${opp.apply_url}`,
    `URL:${opp.apply_url}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ]

  const icsContent = icsLines.join('\r\n')

  return new NextResponse(icsContent, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${slug}.ics"`,
    },
  })
}
