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
    <div className="bg-surface border border-line rounded-sm p-8 text-center flex flex-col items-center justify-center my-6">
      <h2 className="text-lg font-medium text-fg">{title}</h2>
      {body && <p className="text-sm text-muted mt-2 max-w-md">{body}</p>}
      {action && (
        <Link
          href={action.href}
          className="mt-4 px-4 py-2 border border-line rounded-sm text-sm text-fg hover:border-accent hover:text-accent transition-colors"
        >
          {action.label}
        </Link>
      )}
    </div>
  )
}
