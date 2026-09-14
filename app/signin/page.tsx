import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function SignInPage() {
  return (
    <div className="max-w-[720px] mx-auto min-h-[calc(100vh-160px)] px-4 md:px-6 flex flex-col justify-center gap-6">
      <div>
        <h1 className="t-title text-fg mb-2">Sign in</h1>
        <p className="t-body text-muted">
          One account. Your pipeline, your profile, your deadlines.
        </p>
      </div>

      <div className="flex flex-col items-start gap-2">
        <Button variant="secondary" disabled>
          Continue with Google
        </Button>
        <span className="t-meta text-muted">Saving is enabled once you sign in.</span>
      </div>

      <div>
        <Link href="/" className="t-meta text-muted hover:text-fg">
          Back
        </Link>
      </div>
    </div>
  )
}
