'use client'

import { useState } from 'react'

export interface EntityTab {
  key: string
  label: string
  content: React.ReactNode
}

/**
 * ArtConnect-style text tabs ("Overview  Opportunities"): the active one is
 * underlined, the rest muted. Plain text, no boxes.
 */
export default function EntityTabs({ tabs }: { tabs: EntityTab[] }) {
  const [active, setActive] = useState(tabs[0]?.key)

  return (
    <div>
      <div className="flex gap-6 mb-6" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={active === tab.key}
            onClick={() => setActive(tab.key)}
            className={`min-h-[44px] t-body text-[16px] font-medium transition-colors ${
              active === tab.key
                ? 'text-fg underline underline-offset-[6px] decoration-2'
                : 'text-muted hover:text-fg'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div key={tab.key} role="tabpanel" hidden={active !== tab.key}>
          {tab.content}
        </div>
      ))}
    </div>
  )
}
