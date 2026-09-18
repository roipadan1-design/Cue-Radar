import React from 'react'

/**
 * Small status pill. ArtConnect leans on these heavily — an opportunity card
 * there carries a coloured type badge and a "FREE" fee badge, and they are what
 * makes a dense listing scannable. Ours previously used one grey `Chip` for
 * everything, so nothing on a card had priority over anything else.
 *
 * Tones map to semantic CSS variables only (rule 7) — no hex anywhere.
 */
export type BadgeTone = 'neutral' | 'accent' | 'positive' | 'urgent' | 'outline'

interface BadgeProps {
  tone?: BadgeTone
  uppercase?: boolean
  children: React.ReactNode
  className?: string
  title?: string
}

const TONE_CLASSES: Record<BadgeTone, string> = {
  neutral: 'bg-surface-2 text-fg-soft border-transparent',
  accent: 'bg-accent text-accent-ink border-transparent',
  positive: 'bg-positive text-accent-ink border-transparent',
  urgent: 'bg-urgent text-fg border-transparent',
  outline: 'bg-transparent text-muted border-line-strong',
}

export default function Badge({
  tone = 'neutral',
  uppercase = false,
  children,
  className = '',
  title,
}: BadgeProps) {
  return (
    <span
      title={title}
      className={`inline-flex items-center gap-1 h-[22px] px-2 rounded-[var(--radius-sm)] border text-[11px] font-semibold leading-none whitespace-nowrap ${
        uppercase ? 'uppercase tracking-[0.06em]' : ''
      } ${TONE_CLASSES[tone]} ${className}`.trim()}
    >
      {children}
    </span>
  )
}
