import React from 'react'
import Link from 'next/link'

/**
 * Sizes and variants follow the ArtConnect control set: one solid primary, one
 * bordered secondary, a quiet ghost, and a `subtle` filled-grey used for the
 * secondary action that sits next to a primary on a card (their "Save" next to
 * "See more"). Radius and colour come from CSS variables only (rule 7).
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'subtle' | 'ghost'
  size?: 'sm' | 'md'
  href?: string
  children: React.ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'md',
  href,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const sizeStyles = size === 'sm' ? 'h-9 px-3 text-[14px]' : 'h-11 px-4 text-[15px]'

  const variantStyles =
    variant === 'primary'
      ? 'bg-accent text-accent-ink hover:opacity-90'
      : variant === 'secondary'
      ? 'border border-line-strong text-fg hover:border-fg hover:bg-surface-2'
      : variant === 'subtle'
      ? 'bg-surface-2 text-fg border border-line hover:border-line-strong'
      : 'text-fg hover:underline hover:underline-offset-4 px-0 h-auto'

  const combinedClasses = `inline-flex items-center justify-center gap-2 font-semibold rounded-[var(--radius-sm)] transition-colors focus-visible:outline-2 focus-visible:outline-fg focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
    variant === 'ghost' ? '' : sizeStyles
  } ${variantStyles} ${className}`.trim()

  if (href && !disabled) {
    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    )
  }

  return (
    <button className={combinedClasses} disabled={disabled} {...props}>
      {children}
    </button>
  )
}
