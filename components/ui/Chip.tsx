import React from 'react'

interface ChipProps {
  tone?: 'neutral' | 'accent' | 'urgent'
  children: React.ReactNode
}

export default function Chip({ tone = 'neutral', children }: ChipProps) {
  const toneClasses = {
    neutral: 'border-line-strong text-muted',
    accent: 'border-fg text-fg',
    urgent: 'border-urgent text-urgent',
  }

  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 t-meta text-[11px] border rounded-[var(--radius)] ${toneClasses[tone]}`}
    >
      {children}
    </span>
  )
}
