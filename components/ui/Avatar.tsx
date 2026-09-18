import React from 'react'

/**
 * Avatar with an initials fallback. Every ArtConnect row — artist, curator,
 * organisation, the org that posted an opportunity — is anchored by one of
 * these, which is most of why their listings read as things with owners rather
 * than as rows of text. Ours had the logic inlined in ProfileCard only.
 */
interface AvatarProps {
  src?: string | null
  name?: string | null
  size?: number
  rounded?: 'full' | 'md'
  className?: string
}

export function getInitials(name?: string | null): string {
  if (!name) return ''
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function Avatar({
  src,
  name,
  size = 44,
  rounded = 'full',
  className = '',
}: AvatarProps) {
  const radiusClass = rounded === 'full' ? 'rounded-full' : 'rounded-[var(--radius-sm)]'
  const shell = `shrink-0 bg-surface-2 border border-line overflow-hidden ${radiusClass} ${className}`.trim()
  const style = { width: size, height: size }

  if (src) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={src}
        alt={name || ''}
        width={size}
        height={size}
        style={style}
        className={`${shell} object-cover`}
      />
    )
  }

  const initials = getInitials(name)

  return (
    <div
      style={style}
      aria-hidden={initials ? undefined : true}
      className={`${shell} flex items-center justify-center`}
    >
      <span
        className="font-semibold text-muted leading-none select-none"
        style={{ fontSize: Math.max(10, Math.round(size * 0.34)) }}
      >
        {initials}
      </span>
    </div>
  )
}
