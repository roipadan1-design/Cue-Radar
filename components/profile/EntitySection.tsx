import { IconLinkRow } from '@/components/ui/LinkIcon'

/** A titled block on an organisation or curator page ("About", "Contact"). */
export default function EntitySection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="t-body text-[16px] font-semibold text-fg">{title}</h2>
      {children}
    </section>
  )
}

/** Paragraphs from a plain-text field, split on blank lines. */
export function Paragraphs({ text }: { text: string }) {
  return (
    <div className="flex flex-col gap-3 max-w-[72ch]">
      {text
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p, i) => (
          <p key={i} className="t-body text-fg-soft leading-relaxed">
            {p}
          </p>
        ))}
    </div>
  )
}

/** Contact links as a row of logos (Task 23); the label becomes the tooltip. */
export function ContactLinks({ links }: { links: { label: string; href?: string | null }[] }) {
  return <IconLinkRow links={links.map((l) => ({ href: l.href, label: l.label, kind: l.label === 'Calendar' ? 'calendar' : undefined }))} />
}
