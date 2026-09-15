import Link from 'next/link'

export default function TopBar() {
  return (
    <header className="sticky top-0 z-40 h-[52px] bg-surface border-b border-line px-4 md:px-6 flex items-center justify-between">
      <Link href="/" className="t-meta text-fg hover:text-fg transition-colors">
        CUE RADAR
      </Link>

      <div className="flex items-center gap-6">
        <nav className="hidden md:flex items-center gap-4 t-meta text-muted">
          <Link href="/hub" className="hover:text-fg transition-colors">
            Hub
          </Link>
          <span className="text-muted">·</span>
          <Link href="/saved" className="hover:text-fg transition-colors">
            Pipeline
          </Link>
          <span className="text-muted">·</span>
          <Link href="/profile/edit" className="hover:text-fg transition-colors">
            Profile
          </Link>
        </nav>

        <Link
          href="/signin"
          className="inline-flex items-center justify-center h-8 px-3 text-fg border border-line-strong rounded-[var(--radius)] t-body font-medium hover:border-fg transition-colors"
        >
          Sign in
        </Link>
      </div>
    </header>
  )
}
