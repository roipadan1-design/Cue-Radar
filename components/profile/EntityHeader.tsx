import Avatar from '@/components/ui/Avatar'

interface EntityHeaderProps {
  name: string
  nameJa?: string | null
  metaLine: string
}

/**
 * Header shared by organisation and curator pages (owner reference: ArtConnect's
 * org and curator pages): a large round avatar, the name beside it, and one muted
 * "Type · City, Country" line under the name. Initials only; we republish no
 * logos or portraits.
 */
export default function EntityHeader({ name, nameJa, metaLine }: EntityHeaderProps) {
  return (
    <div className="flex items-center gap-5 md:gap-6">
      <Avatar name={name} size={112} />
      <div className="flex flex-col gap-1 min-w-0">
        <h1 className="text-[28px] md:text-[36px] leading-[1.1] font-semibold text-fg font-display break-words">
          {name}
        </h1>
        {nameJa && <p className="t-body text-fg-soft">{nameJa}</p>}
        {metaLine && <p className="t-body text-muted">{metaLine}</p>}
      </div>
    </div>
  )
}
