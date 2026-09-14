import React from 'react'

interface ChipProps {
  tone?: 'neutral' | 'accent' | 'urgent'
  children: React.ReactNode
}

export default function Chip({ tone = 'neutral', children }: ChipProps) {
  const toneClasses = {
    neutral: 'border-line text-muted',
    accent: 'border-accent text-accent',
    urgent: 'border-urgent text-urgent',
  }

  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 text-[11px] font-mono border rounded-sm ${toneClasses[tone]}`}
    >
      {children}
    </span>
  )
}
