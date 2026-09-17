import type { EventRow as EventRowType, VocabEntry } from '@/lib/types'
import Chip from '@/components/ui/Chip'

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

// Only rendered when there's an actual figure to show — a free event's price
// fact already lives in the "Free" tag above, not repeated here.
function formatPriceFigure(priceMin?: number | null): string | null {
  if (priceMin === null || priceMin === undefined || priceMin === 0) return null
  return `From €${priceMin}`
}

export default function EventRow({ event, vocab = [] }: EventRowProps) {
  const typeEntry = vocab.find((v) => v.category === 'event_type' && v.value === event.event_type)
  const typeLabel = typeEntry ? typeEntry.label : event.event_type

  const dateText = formatEventDate(event.date)
  const timeText = formatEventTime(event.time)
  const dateTimeText = timeText ? `${dateText} · ${timeText}` : dateText
  const isFree = event.price_min === 0
  const priceFigure = formatPriceFigure(event.price_min)

  return (
    <div className="p-4 border border-line rounded-[var(--radius)] bg-bg flex flex-col gap-2">
      <h3 className="t-row text-fg line-clamp-2">{event.title}</h3>
      <div className="t-body text-[14px] text-muted truncate">{event.venue_name}</div>

      <div className="flex flex-wrap items-center gap-2">
        <Chip>{typeLabel}</Chip>
        {isFree && <Chip tone="accent">Free</Chip>}
        {event.is_demo && <Chip>Demo</Chip>}
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="t-num text-fg font-medium">{dateTimeText}</div>
        {priceFigure && <div className="t-meta text-muted">{priceFigure}</div>}
      </div>

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
