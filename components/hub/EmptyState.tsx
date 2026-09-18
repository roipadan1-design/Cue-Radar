import Link from 'next/link'

interface EmptyStateProps {
  title: string
  body?: string
  action?: {
    label: string
    href: string
  }
}

export default function EmptyState({ title, body, action }: EmptyStateProps) {
  return (
    <div className="card p-8 text-center flex flex-col items-center justify-center my-6">
      <h2 className="t-row text-fg">{title}</h2>
      {body && <p className="t-body text-muted mt-2 max-w-md">{body}</p>}
      {action && (
        <Link
          href={action.href}
          className="mt-4 px-4 py-2 border border-line-strong rounded-[var(--radius-sm)] t-body text-fg hover:border-fg transition-colors"
        >
          {action.label}
        </Link>
      )}
    </div>
  )
}
