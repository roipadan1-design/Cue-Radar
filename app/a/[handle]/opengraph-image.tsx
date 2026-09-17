import { ImageResponse } from 'next/og'
import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/lib/types'

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

interface PageProps {
  params: Promise<{ handle: string }>
}

export default async function ProfileOGImage({ params }: PageProps) {
  const { handle } = await params

  const supabase = await createClient()
  const { data: profileData } = await supabase
    .from('profiles')
    .select('full_name, role_label, disciplines, locations, is_public')
    .eq('handle', handle)
    .maybeSingle()

  const profile = profileData as Pick<
    Profile,
    'full_name' | 'role_label' | 'disciplines' | 'locations' | 'is_public'
  > | null

  // If profile not found or not public, still render a generic card
  const name = profile?.full_name ?? handle
  const roleLabel = profile?.role_label ?? ''
  const disciplines = (profile?.disciplines ?? []).join(', ')
  const handleDisplay = `@${handle}`

  let fontData: ArrayBuffer | null = null
  try {
    fontData = await loadFont()
  } catch {
    // Proceed without custom font
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
          <span
            style={{
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase' as const,
              color: C.muted,
            }}
          >
            間 FELLOW.
          </span>
        </div>

        {/* Centre: name + role */}
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
              fontSize: '64px',
              fontWeight: 800,
              color: C.fg,
              lineHeight: 1.0,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase' as const,
            }}
          >
            {name}
          </div>
          {roleLabel && (
            <div
              style={{
                fontSize: '18px',
                fontWeight: 400,
                color: C.muted,
                letterSpacing: '0.02em',
              }}
            >
              {roleLabel}
            </div>
          )}
          {disciplines && (
            <div
              style={{
                fontSize: '13px',
                fontWeight: 500,
                letterSpacing: '0.06em',
                textTransform: 'uppercase' as const,
                color: C.muted,
              }}
            >
              {disciplines}
            </div>
          )}
        </div>

        {/* Bottom: handle */}
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
              color: C.accent,
            }}
          >
            {handleDisplay}
          </div>
          <div
            style={{
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '0.06em',
              textTransform: 'uppercase' as const,
              color: C.muted,
            }}
          >
            Artist Profile
          </div>
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
