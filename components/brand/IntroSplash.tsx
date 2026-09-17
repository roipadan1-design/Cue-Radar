'use client'

import { useEffect, useRef, useState } from 'react'
import Mark from '@/components/brand/Mark'
import { BRAND } from '@/lib/brand'

// Must match the intro-curtain / intro-lockup duration in app/globals.css.
const INTRO_MS = 4000
// Only a safety net: the curtain normally unmounts on its own animationend.
const FAILSAFE_MS = INTRO_MS + 2000

// Module scope, not client-side storage (AGENTS.md rule 3): this only stops the
// intro replaying when the user navigates back to "/" within the same page
// load. A fresh load of the landing page plays it again.
let hasPlayed = false

export default function IntroSplash() {
  const [done, setDone] = useState(hasPlayed)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    if (hasPlayed) {
      setDone(true)
      return
    }
    hasPlayed = true

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDone(true)
      return
    }

    timer.current = window.setTimeout(() => setDone(true), FAILSAFE_MS)
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current)
    }
  }, [])

  if (done) return null

  return (
    <div
      className="intro-splash"
      role="presentation"
      aria-hidden
      onAnimationEnd={(event) => {
        // The lockup's animationend bubbles here too; only the curtain counts.
        if (event.target === event.currentTarget) setDone(true)
      }}
    >
      <div className="intro-splash__lockup flex items-center gap-2 text-fg">
        <span className="t-title text-muted font-normal select-none">[</span>
        <Mark size="md" />
        <span className="t-title text-fg tracking-[0.04em] uppercase">
          {BRAND.wordmark}
        </span>
        <span className="t-title text-muted font-normal select-none">]</span>
      </div>
    </div>
  )
}
