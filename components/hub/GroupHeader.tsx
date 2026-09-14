import React from 'react'

interface GroupHeaderProps {
  label: string
  count: number
}

export default function GroupHeader({ label, count }: GroupHeaderProps) {
  return (
    <div className="sticky top-[52px] z-30 bg-bg/95 backdrop-blur-sm py-2.5 border-b border-line">
      <div className="t-meta text-muted flex items-center gap-1.5">
        <span>{label}</span>
        <span className="text-line">·</span>
        <span className="t-num">{count}</span>
      </div>
    </div>
  )
}
