import Link from 'next/link'
import Wordmark from '@/components/brand/Wordmark'
import SignOutButton from '@/components/layout/SignOutButton'
import TopBarNav from '@/components/layout/TopBarNav'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'

interface TopBarProps {
  isSignedIn: boolean
  avatarUrl?: string | null
  fullName?: string | null
}

/**
 * ArtConnect shell shape: wordmark far left, a horizontal text nav, then on
 * the right a primary CTA plus an account control. 64px tall (was 52px with
 * uppercase micro-labels), inner row constrained by .container-page so the
 * nav aligns with the page content below it instead of sitting flush to the
 * viewport edge.
 */
export default function TopBar({ isSignedIn, avatarUrl, fullName }: TopBarProps) {
  const profileHref = isSignedIn ? '/profile/edit' : '/signin?next=/profile/edit'

  return (
    <header className="sticky top-0 z-40 h-16 bg-surface border-b border-line">
      <div className="container-page h-full flex items-center justify-between gap-6">
        <div className="flex items-center gap-8 min-w-0">
          <Wordmark />
          <TopBarNav isSignedIn={isSignedIn} />
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {isSignedIn ? (
            <>
              <Button href="/hub" size="sm" className="hidden sm:inline-flex">
                Browse open calls
              </Button>
              <Link
                href={profileHref}
                aria-label="Your profile"
                className="rounded-full transition-opacity hover:opacity-80"
              >
                <Avatar src={avatarUrl} name={fullName} size={32} />
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="hidden sm:inline t-body text-fg-soft hover:text-fg transition-colors"
              >
                Sign in
              </Link>
              <Button href="/signup" size="sm">
                Sign up
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
