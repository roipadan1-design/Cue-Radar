import Link from 'next/link'

export default function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-[52px] bg-surface border-t border-line px-5 flex items-center justify-around text-sm text-muted">
      <Link href="/" className="hover:text-fg transition-colors">
        Hub
      </Link>
      <Link href="/saved" className="hover:text-fg transition-colors">
        Saved
      </Link>
    </nav>
  )
}
