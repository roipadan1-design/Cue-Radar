import Link from 'next/link'
import type { EventRow as EventRowType, VocabEntry } from '@/lib/types'
import Badge from '@/components/ui/Badge'

interface EventRowProps {
  event: EventRowType
  vocab?: VocabEntry[]
}

const dayFormat = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })

function formatEventDate(dateStr: string, endStr?: string | null): string {
  const start = dayFormat.format(new Date(dateStr))
  if (!endStr || endStr === dateStr) return start
  return `${start} – ${dayFormat.format(new Date(endStr))}`
}

function formatEventTime(timeStr?: string | null): string | null {
  if (!timeStr) return null
  const [hh, mm] = timeStr.split(':')
  if (hh === undefined || mm === undefined) return null
  return `${hh.padStart(2, '0')}:${mm.padStart(2, '0')}`
}

// Only rendered when there's an actual figure; a free event says so in its badge.
// The currency comes from the row (JPY for the Japan pilot); a row without one
// shows the bare figure rather than a guessed symbol.
function formatPriceFigure(event: EventRowType): string | null {
  const { price_min: min, price_max: max, currency } = event
  if (min === null || min === undefined || min === 0) return null
  const fmt = (n: number) =>
    currency
      ? new Intl.NumberFormat('en-GB', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n)
      : String(n)
  return max && max > min ? `${fmt(min)}–${fmt(max)}` : `From ${fmt(min)}`
}

export default function EventRow({ event, vocab = [] }: EventRowProps) {
  const typeEntry = vocab.find((v) => v.category === 'event_type' && v.value === event.event_type)
  const typeLabel = typeEntry ? typeEntry.label : event.event_type

  const dateText = formatEventDate(event.date, event.end_date)
  const timeText = formatEventTime(event.time)
  const dateTimeText = timeText ? `${dateText} · ${timeText}` : dateText
  const isFree = event.price_min === 0
  const priceFigure = formatPriceFigure(event)
  const link = event.ticket_url || event.evidence_url

  return (
    <div className="p-4 border border-line rounded-[var(--radius)] bg-bg flex flex-col gap-2">
      <div className="t-num text-fg-soft text-[13px] font-medium">{dateTimeText}</div>
      <h3 className="t-row text-fg line-clamp-2">{event.title}</h3>
      <div className="t-body text-[14px] text-muted truncate">
        {event.source_id ? (
          <Link href={`/sources/${event.source_id}`} className="hover:text-fg underline-offset-4 hover:underline">
            {event.venue_name}
          </Link>
        ) : (
          event.venue_name
        )}
        {event.recurrence ? ` · ${event.recurrence}` : ''}
      </div>

      {event.description && <p className="t-body text-[14px] text-fg-soft line-clamp-3">{event.description}</p>}
      {event.lineup && <p className="t-meta text-muted line-clamp-1">With {event.lineup}</p>}

      <div className="flex flex-wrap items-center gap-1.5">
        <Badge tone="outline">{typeLabel}</Badge>
        {isFree && <Badge tone="accent">Free</Badge>}
        {event.language_barrier === 'none' && <Badge tone="neutral">No Japanese needed</Badge>}
        {event.booking_required === 'yes' && <Badge tone="neutral">Booking required</Badge>}
        {event.is_demo && <Badge tone="outline">Demo</Badge>}
        {priceFigure && <span className="t-meta text-muted ml-auto">{priceFigure}</span>}
      </div>

      <div className="flex items-center gap-4">
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="t-meta text-fg underline underline-offset-4 hover:opacity-80 min-h-[44px] flex items-center"
          >
            {event.ticket_url ? 'Tickets' : 'Details'}
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
