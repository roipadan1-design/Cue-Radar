import Link from 'next/link'
import Wordmark from '@/components/brand/Wordmark'

export default function Footer() {
  const feedbackEmail = process.env.NEXT_PUBLIC_FEEDBACK_EMAIL
  if (!feedbackEmail) {
    throw new Error('NEXT_PUBLIC_FEEDBACK_EMAIL environment variable is missing')
  }

  return (
    <footer className="w-full border-t border-line px-5 py-4 text-xs text-muted flex items-center justify-between gap-4">
      <Wordmark />
      <nav className="flex items-center gap-4">
        <Link href="/#about" className="hover:text-fg underline transition-colors">
          About
        </Link>
        <a
          href={`mailto:${feedbackEmail}?subject=${encodeURIComponent('Report a problem with Fellow.')}`}
          className="hover:text-fg underline transition-colors"
        >
          Report a problem
        </a>
        <Link href="/privacy" className="hover:text-fg underline transition-colors">
          Privacy
        </Link>
      </nav>
    </footer>
  )
}
