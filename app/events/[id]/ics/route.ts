import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { buildIcsCalendar, icsResponse } from '@/lib/ics'

interface RouteProps {
  params: Promise<{ id: string }>
}

export async function GET(request: Request, props: RouteProps) {
  const params = await props.params
  const id = params.id

  const supabase = await createClient()

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('event_id', id)
    .maybeSingle()

  if (!event || !event.date) {
    return new NextResponse('Event not found', { status: 404 })
  }

  const priceText =
    event.price_min === 0 || event.price_min === null || event.price_min === undefined
      ? 'Free'
      : `From ${event.price_min}`

  const icsContent = event.time
    ? buildIcsCalendar({
        kind: 'timed',
        uid: event.event_id,
        date: event.date,
        time: event.time,
        summary: `${event.title} — ${event.venue_name}`,
        description: `${priceText}${event.ticket_url ? ` - Tickets: ${event.ticket_url}` : ''}`,
        url: event.ticket_url || undefined,
      })
    : buildIcsCalendar({
        kind: 'all-day',
        uid: event.event_id,
        date: event.date,
        summary: `${event.title} — ${event.venue_name}`,
        description: `${priceText}${event.ticket_url ? ` - Tickets: ${event.ticket_url}` : ''}`,
        url: event.ticket_url || undefined,
      })

  return icsResponse(icsContent, `${id}.ics`)
}
