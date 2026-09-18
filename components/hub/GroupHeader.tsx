import React from 'react'

interface GroupHeaderProps {
  label: string
  count: number
}

export default function GroupHeader({ label, count }: GroupHeaderProps) {
  return (
    <div className="sticky top-16 z-30 bg-bg/95 backdrop-blur-sm py-2.5 border-b border-line">
      <h2 className="t-label flex items-center gap-1.5">
        <span>{label}</span>
        <span className="text-muted">·</span>
        <span className="t-num">{count}</span>
      </h2>
    </div>
  )
}
