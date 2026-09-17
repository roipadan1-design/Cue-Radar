import { NextResponse } from 'next/server'

/**
 * Shared .ics (iCalendar) builder, used by both the opportunity-deadline
 * calendar route (`app/opportunities/[slug]/ics/route.ts`) and the
 * event calendar route (`app/events/[id]/ics/route.ts`), so the format is
 * defined once instead of duplicated per route (see docs/DECISIONS.md).
 */

interface IcsAllDayEvent {
  kind: 'all-day'
  uid: string
  /** YYYY-MM-DD — the calendar app blocks out this single day. */
  date: string
  summary: string
  description?: string
  url?: string
}

interface IcsTimedEvent {
  kind: 'timed'
  uid: string
  /** YYYY-MM-DD */
  date: string
  /** HH:MM or HH:MM:SS, floating local time (no timezone conversion). */
  time: string
  /** Defaults to 120 minutes (2 hours) when not given. */
  durationMinutes?: number
  summary: string
  description?: string
  url?: string
}

export type IcsEventInput = IcsAllDayEvent | IcsTimedEvent

function pad(n: number): string {
  return n.toString().padStart(2, '0')
}

function formatDateStamp(d: Date): string {
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
}

function escapeIcsText(text: string): string {
  return text.replace(/\r?\n/g, ' ').replace(/,/g, '\\,').replace(/;/g, '\\;')
}

export function buildIcsCalendar(event: IcsEventInput): string {
  const nowStamp = formatDateStamp(new Date())

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Fellow.//Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.uid}@cueradar.org`,
    `DTSTAMP:${nowStamp}`,
  ]

  if (event.kind === 'all-day') {
    const startDate = new Date(event.date)
    const dtStart = startDate.toISOString().replace(/[-:]/g, '').split('T')[0]
    const nextDay = new Date(startDate)
    nextDay.setDate(nextDay.getDate() + 1)
    const dtEnd = nextDay.toISOString().replace(/[-:]/g, '').split('T')[0]
    lines.push(`DTSTART;VALUE=DATE:${dtStart}`, `DTEND;VALUE=DATE:${dtEnd}`)
  } else {
    const [hh = '00', mm = '00', ss = '00'] = event.time.split(':')
    const start = new Date(
      `${event.date}T${hh.padStart(2, '0')}:${mm.padStart(2, '0')}:${ss.padStart(2, '0')}`,
    )
    const durationMinutes = event.durationMinutes ?? 120
    const end = new Date(start.getTime() + durationMinutes * 60000)
    const fmt = (d: Date) =>
      `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(
        d.getMinutes(),
      )}${pad(d.getSeconds())}`
    lines.push(`DTSTART:${fmt(start)}`, `DTEND:${fmt(end)}`)
  }

  lines.push(`SUMMARY:${escapeIcsText(event.summary)}`)
  if (event.description) lines.push(`DESCRIPTION:${escapeIcsText(event.description)}`)
  if (event.url) lines.push(`URL:${event.url}`)
  lines.push('STATUS:CONFIRMED', 'END:VEVENT', 'END:VCALENDAR')

  return lines.join('\r\n')
}

export function icsResponse(content: string, filename: string): NextResponse {
  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
