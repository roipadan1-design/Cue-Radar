import { ImageResponse } from 'next/og'
import { createClient } from '@/lib/supabase/server'
import type { HubFeedRow } from '@/lib/types'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Design tokens — DECISIONS.md §OG-Image-Hex-Exception
// CSS variables are not available in ImageResponse canvas context.
// Values are exact matches of app/globals.css tokens.
const C = {
  bg: '#0A0A0A',
  fg: '#F2F2F2',
  muted: '#8C8C8C',
  accent: '#B39DFF',
  line: '#1F1F1F',
} as const

async function loadFont(): Promise<ArrayBuffer> {
  const url = 'https://fonts.gstatic.com/s/archivo/v19/k3kPo8UDI-1M0wlSV9XQ.woff'
  const res = await fetch(url)
  return res.arrayBuffer()
}

function formatDeadlineText(row: HubFeedRow): string {
  if (!row.deadline || row.is_rolling) return 'Rolling deadline'
  try {
    const d = new Date(row.deadline)
    return `Closes ${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`
  } catch {
    return row.deadline
  }
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function OpportunityOGImage({ params }: PageProps) {
  const { slug } = await params

  const supabase = await createClient()
  const { data: opp } = await supabase
    .from('hub_feed')
    .select('title, source_name, city_name, deadline, is_rolling, type, funding_min, funding_max, currency')
    .eq('slug', slug)
    .maybeSingle()

  const row = opp as HubFeedRow | null

  const title = row?.title ?? 'Open Call'
  const source = row?.source_name ?? ''
  const city = row?.city_name ?? ''
  const deadlineText = row ? formatDeadlineText(row) : ''
  const locationLine = [source, city].filter(Boolean).join(' · ')

  let fontData: ArrayBuffer | null = null
  try {
    fontData = await loadFont()
  } catch {
    // Proceed without custom font — system fallback
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: C.bg,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px',
          fontFamily: 'Archivo, sans-serif',
          border: `1px solid ${C.line}`,
        }}
      >
        {/* Top bar: brand mark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3.5" y="3" width="7" height="18" fill={C.fg} />
              <rect x="13.5" y="12" width="7" height="9" fill={C.fg} />
            </svg>
            <span
              style={{
                fontSize: '13px',
                fontWeight: 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase' as const,
                color: C.muted,
              }}
            >
              FELLOW.
            </span>
          </div>
        </div>

        {/* Centre: title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              fontSize: '52px',
              fontWeight: 800,
              color: C.fg,
              lineHeight: 1.0,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase' as const,
              maxWidth: '960px',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical' as const,
            }}
          >
            {title}
          </div>
        </div>

        {/* Bottom: source · city  and  deadline */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <div
            style={{
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '0.06em',
              textTransform: 'uppercase' as const,
              color: C.muted,
            }}
          >
            {locationLine}
          </div>
          {deadlineText && (
            <div
              style={{
                fontSize: '13px',
                fontWeight: 500,
                letterSpacing: '0.06em',
                textTransform: 'uppercase' as const,
                color: C.accent,
              }}
            >
              {deadlineText}
            </div>
          )}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fontData
        ? [{ name: 'Archivo', data: fontData, weight: 800, style: 'normal' as const }]
        : [],
    },
  )
}
