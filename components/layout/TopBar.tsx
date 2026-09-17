import Link from 'next/link'
import Wordmark from '@/components/brand/Wordmark'
import SignOutButton from '@/components/layout/SignOutButton'
import TopBarNav from '@/components/layout/TopBarNav'

interface TopBarProps {
  isSignedIn: boolean
}

export default function TopBar({ isSignedIn }: TopBarProps) {
  return (
    <header className="sticky top-0 z-40 h-[52px] bg-surface border-b border-line px-4 md:px-6 flex items-center justify-between">
      <Wordmark />

      <div className="flex items-center gap-6">
        <TopBarNav isSignedIn={isSignedIn} />

        {isSignedIn ? (
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
