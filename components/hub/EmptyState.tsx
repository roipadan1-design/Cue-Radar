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
    <div className="bg-surface p-8 text-center flex flex-col items-center justify-center my-6">
      <h2 className="t-row text-fg">{title}</h2>
      {body && <p className="t-body text-muted mt-2 max-w-md">{body}</p>}
      {action && (
        <Link
          href={action.href}
          className="mt-4 t-body text-fg underline underline-offset-4 hover:opacity-80 transition-opacity"
        >
          {action.label}
        </Link>
      )}
    </div>
  )
}
