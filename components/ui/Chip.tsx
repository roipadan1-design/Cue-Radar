import React from 'react'
import Link from 'next/link'

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
    'inline-flex items-center justify-center px-2.5 py-1.5 t-meta text-[11px] border rounded-[var(--radius)] transition-colors min-h-[44px] shrink-0 font-medium cursor-pointer'

  const activeClasses = active
    ? 'bg-fg text-bg border-fg'
    : tone === 'urgent'
    ? 'border-urgent text-urgent'
    : tone === 'accent'
    ? 'border-accent text-accent'
    : 'border-line-strong text-muted hover:border-fg hover:text-fg'

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
