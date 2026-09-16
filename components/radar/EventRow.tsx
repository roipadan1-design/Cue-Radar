import type { EventRow as EventRowType, VocabEntry } from '@/lib/types'

interface EventRowProps {
  event: EventRowType
  vocab?: VocabEntry[]
}

function formatEventDate(dateStr: string): string {
  const d = new Date(dateStr)
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(d)
}

function formatEventTime(timeStr?: string | null): string | null {
  if (!timeStr) return null
  const [hh, mm] = timeStr.split(':')
  if (hh === undefined || mm === undefined) return null
  return `${hh.padStart(2, '0')}:${mm.padStart(2, '0')}`
}

function formatPrice(priceMin?: number | null): string {
  if (priceMin === null || priceMin === undefined) return '—'
  if (priceMin === 0) return 'Free'
  return `From €${priceMin}`
}

export default function EventRow({ event, vocab = [] }: EventRowProps) {
  const typeEntry = vocab.find((v) => v.category === 'event_type' && v.value === event.event_type)
  const typeLabel = typeEntry ? typeEntry.label : event.event_type

  const dateText = formatEventDate(event.date)
  const timeText = formatEventTime(event.time)
  const priceText = formatPrice(event.price_min)

  const metaLine = [
    typeLabel,
    timeText ? `${dateText} · ${timeText}` : dateText,
    priceText,
    event.is_demo ? 'Demo' : null,
  ]
    .filter(Boolean)
    .join('  ·  ')

  return (
    <div className="py-4 border-b border-line flex flex-col gap-1.5">
      <h3 className="t-row text-fg line-clamp-2">{event.title}</h3>
      <div className="t-body text-[14px] text-muted truncate">{event.venue_name}</div>
      <div className="t-meta text-muted text-[11px] line-clamp-2">{metaLine}</div>

      <div className="flex items-center gap-4 pt-1">
        {event.ticket_url && (
          <a
            href={event.ticket_url}
            target="_blank"
            rel="noopener noreferrer"
            className="t-meta text-fg underline underline-offset-4 hover:opacity-80 min-h-[44px] flex items-center"
          >
            Tickets
          </a>
        )}
        <a
          href={`/events/${event.event_id}/ics`}
          download={`${event.event_id}.ics`}
          className="t-meta text-muted underline underline-offset-4 hover:text-fg min-h-[44px] flex items-center"
        >
          Add to calendar
        </a>
      </div>
    </div>
  )
}
