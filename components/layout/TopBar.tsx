import Link from 'next/link'

export default function TopBar() {
  return (
    <header className="sticky top-0 z-50 h-[52px] bg-surface border-b border-line px-5 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link href="/" className="font-display font-semibold tracking-wider text-fg">
          CUE RADAR
        </Link>
        <nav className="hidden md:flex items-center gap-4 text-sm text-muted">
          <Link href="/" className="hover:text-fg transition-colors">
            Hub
          </Link>
          <Link href="/saved" className="hover:text-fg transition-colors">
            Saved
          </Link>
        </nav>
      </div>
      <div>
        <button type="button" className="text-sm px-3 py-1 border border-line rounded-sm text-fg hover:border-muted transition-colors">
          Sign in
        </button>
      </div>
    </header>
  )
}
