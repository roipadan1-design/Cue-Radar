interface MarkProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'chrome' | 'splash'
  className?: string
}

const SIZE_PX: Record<'sm' | 'md' | 'lg', number> = {
  sm: 20,
  md: 40,
  lg: 96,
}

export default function Mark({ size = 'md', variant = 'chrome', className = '' }: MarkProps) {
  const px = SIZE_PX[size]
  // The splash notch only reads as deliberate at md/lg (BRAND_MARK_FINAL_SPEC.md
  // §4) — at sm it would render at ~2.5x2.5px and look like a stray pixel, so
  // splash silently falls back to the plain chrome geometry at that size.
  const useSplash = variant === 'splash' && size !== 'sm'

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      className={`inline-block select-none ${className}`.trim()}
      style={{ color: 'currentColor' }}
    >
      {useSplash ? (
        <>
          <path d="M6.5 3 H10.5 V21 H3.5 V6 H6.5 Z" fill="currentColor" />
          <rect x="3.5" y="3" width="3" height="3" fill="var(--accent)" />
        </>
      ) : (
        <rect x="3.5" y="3" width="7" height="18" fill="currentColor" />
      )}
      <rect x="13.5" y="12" width="7" height="9" fill="currentColor" />
    </svg>
  )
}
