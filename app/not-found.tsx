import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center space-y-4">
      <span className="font-mono text-accent text-sm">[404]</span>
      <h1 className="font-display text-3xl text-fg">Not found</h1>
      <Link
        href="/"
        className="text-sm font-mono text-muted hover:text-accent underline transition-colors"
      >
        Return to Hub
      </Link>
    </div>
  )
}
