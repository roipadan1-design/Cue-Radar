import React from 'react'
import Link from 'next/link'

/**
 * Filter control. Chip is now *only* a filter — the read-only tags it used to
 * double as on cards are `Badge`. Keeping one component for both is what made
 * every opportunity card look like a row of identical grey buttons.
 *
 * The 44px min-height is retained for touch targets, but chips are no longer
 * uppercase (see the .t-meta note in app/globals.css).
 */
interface ChipProps {
  tone?: 'neutral' | 'accent' | 'urgent'
  active?: boolean
  href?: string
  onClick?: () => void
  children: React.ReactNode
  className?: string
  title?: string
}

export default function Chip({
  tone = 'neutral',
  active = false,
  href,
  onClick,
  children,
  className = '',
  title,
}: ChipProps) {
  const baseClasses =
    'inline-flex items-center justify-center gap-1.5 px-3 h-9 min-h-[36px] text-[14px] font-medium border rounded-[var(--radius-pill)] transition-colors shrink-0 cursor-pointer whitespace-nowrap'

  const activeClasses = active
    ? 'bg-fg text-bg border-fg'
    : tone === 'urgent'
    ? 'border-urgent text-urgent hover:bg-surface-2'
    : tone === 'accent'
    ? 'border-accent text-accent hover:bg-surface-2'
    : 'border-line-strong text-fg-soft hover:border-fg hover:text-fg'

  const combined = `${baseClasses} ${activeClasses} ${className}`.trim()

  if (href) {
    return (
      <Link href={href} className={combined} title={title}>
        {children}
      </Link>
    )
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={combined} title={title}>
        {children}
      </button>
    )
  }

  return (
    <span className={combined} title={title}>
      {children}
    </span>
  )
}
