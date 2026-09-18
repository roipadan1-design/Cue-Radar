import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container-reading min-h-[calc(100vh-160px)] flex flex-col items-center justify-center text-center gap-4">
      <span className="t-label">404</span>
      <h1 className="t-title text-fg">Page not found</h1>
      <p className="t-body text-muted max-w-sm">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/hub" className="mt-4 t-body text-fg underline underline-offset-4 hover:opacity-80">
        Return to Hub
      </Link>
    </div>
  )
}
