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

export interface ContactRoutes {
  website_url?: string | null
  portfolio_url?: string | null
  instagram_url?: string | null
  calendar_url?: string | null
  contact_email?: string | null
  contact_form_url?: string | null
  phone_public?: string | null
  other_links?: string[] | null
}

/** True when a record has at least one contact route to show. */
export function hasContactRoutes(c: ContactRoutes): boolean {
  return Boolean(
    c.website_url || c.portfolio_url || c.instagram_url || c.calendar_url || c.contact_email ||
      c.contact_form_url || c.phone_public || (c.other_links && c.other_links.length > 0),
  )
}

/**
 * Every public contact route we hold, as logos plus the e-mail and phone as plain
 * text so they can be copied. Only routes the person or organisation publishes themselves.
 */
export function ContactBlock({ routes }: { routes: ContactRoutes }) {
  return (
    <div className="flex flex-col gap-3">
      <IconLinkRow
        links={[
          { href: routes.website_url, label: 'Website' },
          { href: routes.portfolio_url, label: 'Portfolio' },
          { href: routes.instagram_url, label: 'Instagram' },
          { href: routes.contact_email ? `mailto:${routes.contact_email}` : null, kind: 'email', label: 'Email' },
          { href: routes.contact_form_url, kind: 'email', label: 'Contact form' },
          { href: routes.calendar_url, kind: 'calendar', label: 'Calendar' },
          ...(routes.other_links || []).map((href) => ({ href })),
        ]}
      />
      {routes.contact_email && (
        <p className="t-body text-fg-soft">
          <a href={`mailto:${routes.contact_email}`} className="underline underline-offset-2 hover:text-accent">
            {routes.contact_email}
          </a>
        </p>
      )}
      {routes.phone_public && (
        <p className="t-body text-fg-soft">
          <a href={`tel:${routes.phone_public.replace(/[^+\d]/g, '')}`} className="hover:text-accent">
            {routes.phone_public}
          </a>
        </p>
      )}
    </div>
  )
}
