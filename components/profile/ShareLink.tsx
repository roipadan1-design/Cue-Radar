'use client'

import React, { useState } from 'react'

export default function ShareLink() {
  const [copied, setCopied] = useState(false)

  function handleShare() {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="t-meta text-muted hover:text-fg cursor-pointer"
    >
      {copied ? 'Copied' : 'Share'}
    </button>
  )
}
