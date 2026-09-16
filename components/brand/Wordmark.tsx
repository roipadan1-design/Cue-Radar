import Link from 'next/link'
import Mark from '@/components/brand/Mark'
import { BRAND } from '@/lib/brand'

export default function Wordmark() {
  return (
    <Link
      href="/"
      aria-label={BRAND.name}
      className="inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity"
    >
      <span className="text-muted font-normal select-none">[</span>
      <span className="text-fg flex items-center">
        <Mark size="sm" />
      </span>
      <span className="t-meta text-fg text-[12px] tracking-[0.06em] font-medium uppercase">
        {BRAND.wordmark}
      </span>
      <span className="text-muted font-normal select-none">]</span>
    </Link>
  )
}
