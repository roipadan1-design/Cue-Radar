import React from 'react'
import {
  Instagram,
  Youtube,
  Facebook,
  Twitter,
  Linkedin,
  Globe,
  CalendarDays,
  Mail,
  Ticket,
  type LucideIcon,
} from 'lucide-react'

/**
 * Task 23: every outbound link on the site is a small clickable logo, drawn in
 * the site's own colours (no brand colours, rule 7). lucide covers most brands;
 * the ones it lacks (Spotify, Vimeo, SoundCloud, Bandcamp, TikTok) are drawn
 * here in the same 24px, 2px-stroke line style so the row reads as one set.
 */

export type LinkKind =
  | 'instagram'
  | 'youtube'
  | 'spotify'
  | 'vimeo'
  | 'soundcloud'
  | 'bandcamp'
  | 'tiktok'
  | 'facebook'
  | 'x'
  | 'linkedin'
  | 'calendar'
  | 'email'
  | 'tickets'
  | 'website'

const LABELS: Record<LinkKind, string> = {
  instagram: 'Instagram',
  youtube: 'YouTube',
  spotify: 'Spotify',
  vimeo: 'Vimeo',
  soundcloud: 'SoundCloud',
  bandcamp: 'Bandcamp',
  tiktok: 'TikTok',
  facebook: 'Facebook',
  x: 'X',
  linkedin: 'LinkedIn',
  calendar: 'Calendar',
  email: 'Email',
  tickets: 'Tickets',
  website: 'Website',
}

/** "@name" or "name" -> full Instagram URL; full URLs pass through. */
export function toInstagramUrl(v?: string | null): string | null {
  if (!v) return null
  const t = v.trim()
  if (!t) return null
  if (/^https?:\/\//.test(t)) return t
  return `https://www.instagram.com/${t.replace(/^@/, '')}`
}

/** Works out which logo a URL gets from its host. Anything unknown is a website. */
export function detectLinkKind(url: string): LinkKind {
  if (url.startsWith('mailto:')) return 'email'
  if (url.startsWith('webcal:') || /\.ics(\?|$)/.test(url)) return 'calendar'
  let host = ''
  try {
    host = new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return 'website'
  }
  if (host.endsWith('instagram.com')) return 'instagram'
  if (host.endsWith('youtube.com') || host === 'youtu.be') return 'youtube'
  if (host.endsWith('spotify.com')) return 'spotify'
  if (host.endsWith('vimeo.com')) return 'vimeo'
  if (host.endsWith('soundcloud.com')) return 'soundcloud'
  if (host.endsWith('bandcamp.com')) return 'bandcamp'
  if (host.endsWith('tiktok.com')) return 'tiktok'
  if (host.endsWith('facebook.com')) return 'facebook'
  if (host === 'x.com' || host.endsWith('twitter.com')) return 'x'
  if (host.endsWith('linkedin.com')) return 'linkedin'
  return 'website'
}

type SvgProps = { size: number; className?: string }
function Line({ size, className, children }: SvgProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

const CUSTOM: Partial<Record<LinkKind, (p: SvgProps) => React.ReactElement>> = {
  spotify: (p) => (
    <Line {...p}>
      <circle cx="12" cy="12" r="10" />
      <path d="M7 9.5c3.5-1 7-.7 10 1" />
      <path d="M7.5 12.8c3-.8 5.8-.5 8.3.9" />
      <path d="M8 15.9c2.4-.6 4.6-.4 6.6.7" />
    </Line>
  ),
  vimeo: (p) => (
    <Line {...p}>
      <path d="M3 8.5l1 1.2c1.2-.9 2-1.2 2.4-.6.8 1.2 1.6 6.5 3.2 8.6 1.6 2 4.8-.6 7.8-5.6 2.5-4.2 2.1-7.3-1-7.1-1.5.1-2.8 1.3-3.6 3.3 1.7-.9 2.8-.3 2 1.8-.9 2.4-2.7 4.6-3.4 3.3-.8-1.4-1-5.4-2-6.7C8.3 5.3 5.9 6.6 3 8.5z" />
    </Line>
  ),
  soundcloud: (p) => (
    <Line {...p}>
      <path d="M4 17v-3" />
      <path d="M7 17v-6" />
      <path d="M10 17V9" />
      <path d="M13 17V7.5a5 5 0 0 1 5.6 4A3 3 0 0 1 19 17z" />
    </Line>
  ),
  bandcamp: (p) => (
    <Line {...p}>
      <path d="M8 6h14l-6 12H2z" />
    </Line>
  ),
  tiktok: (p) => (
    <Line {...p}>
      <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" />
      <path d="M14 3c.4 2.6 2.2 4.4 5 4.6" />
    </Line>
  ),
}

const LUCIDE: Partial<Record<LinkKind, LucideIcon>> = {
  instagram: Instagram,
  youtube: Youtube,
  facebook: Facebook,
  x: Twitter,
  linkedin: Linkedin,
  calendar: CalendarDays,
  email: Mail,
  tickets: Ticket,
  website: Globe,
}

export function LinkGlyph({ kind, size = 18, className }: { kind: LinkKind; size?: number; className?: string }) {
  const Custom = CUSTOM[kind]
  if (Custom) return <Custom size={size} className={className} />
  const Icon = LUCIDE[kind] ?? Globe
  return <Icon size={size} className={className} aria-hidden="true" />
}

interface IconLinkProps {
  href: string
  kind?: LinkKind
  label?: string
  /** Show the label next to the logo (default: logo only, label as tooltip). */
  showLabel?: boolean
}

/** One clickable logo. Square, hairline border, accent on hover. */
export function IconLink({ href, kind, label, showLabel = false }: IconLinkProps) {
  const k = kind ?? detectLinkKind(href)
  const text = label ?? LABELS[k]
  return (
    <a
      href={href}
      target={href.startsWith('mailto:') ? undefined : '_blank'}
      rel="noopener noreferrer"
      aria-label={text}
      title={text}
      className={`inline-flex items-center justify-center gap-2 h-10 ${
        showLabel ? 'px-3' : 'w-10'
      } rounded-[var(--radius)] border border-line-strong text-fg-soft hover:border-accent hover:text-accent transition-colors`}
    >
      <LinkGlyph kind={k} />
      {showLabel && <span className="text-[14px] font-medium">{text}</span>}
    </a>
  )
}

/** A row of logos from a list of possibly-empty URLs. Renders nothing if all are empty. */
export function IconLinkRow({
  links,
  showLabels = false,
}: {
  links: { href?: string | null; kind?: LinkKind; label?: string }[]
  showLabels?: boolean
}) {
  const present = links.filter((l): l is { href: string; kind?: LinkKind; label?: string } => Boolean(l.href))
  if (present.length === 0) return null
  return (
    <div className="flex flex-wrap items-center gap-2">
      {present.map((l) => (
        <IconLink key={l.href} href={l.href} kind={l.kind} label={l.label} showLabel={showLabels} />
      ))}
    </div>
  )
}
