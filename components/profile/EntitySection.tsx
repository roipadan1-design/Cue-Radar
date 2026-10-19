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

/** "Website  Instagram" contact links, as ArtConnect lays them out. */
export function ContactLinks({ links }: { links: { label: string; href?: string | null }[] }) {
  const present = links.filter((l) => l.href)
  if (present.length === 0) return null
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2">
      {present.map((l) => (
        <a
          key={l.label}
          href={l.href as string}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-[44px] inline-flex items-center t-body text-fg hover:underline underline-offset-4"
        >
          {l.label}
        </a>
      ))}
    </div>
  )
}
