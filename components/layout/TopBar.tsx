import Link from 'next/link'
import Wordmark from '@/components/brand/Wordmark'
import SignOutButton from '@/components/layout/SignOutButton'
import { createClient } from '@/lib/supabase/server'
import { LayoutList, Route, Bookmark, User } from 'lucide-react'

export default async function TopBar() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const navItems = [
    { label: 'Hub', href: '/hub', icon: LayoutList },
    { label: 'Circuit', href: '/circuit', icon: Route },
    { label: 'Saved', href: '/saved', icon: Bookmark },
    { label: 'Profile', href: '/profile/edit', icon: User },
  ]

  return (
    <header className="sticky top-0 z-40 h-[52px] bg-surface border-b border-line px-4 md:px-6 flex items-center justify-between">
      <Wordmark />

      <div className="flex items-center gap-6">
        <nav className="hidden md:flex items-center gap-5 t-meta text-muted">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-1.5 hover:text-fg transition-colors"
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {user ? (
          <SignOutButton />
        ) : (
          <Link
            href="/signin"
            className="inline-flex items-center justify-center h-8 px-3 text-fg border border-line-strong rounded-[var(--radius)] t-body text-xs font-medium hover:border-fg transition-colors"
          >
            Sign in
          </Link>
        )}
      </div>
    </header>
  )
}
