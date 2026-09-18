import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import Avatar from '@/components/ui/Avatar'
import SaveOpportunityButton from '@/components/hub/SaveOpportunityButton'
import { checkEligibility } from '@/lib/fit'
import type { HubFeedRow, Profile, VocabEntry } from '@/lib/types'

interface OpportunityRowProps {
  row: HubFeedRow
  locked?: boolean
  saved?: boolean
  userId?: string
  profile?: Profile | null
  vocab?: VocabEntry[]
}

export function getCurrencySymbol(currency?: string | null): string {
  return currency === 'USD' ? '$' : currency === 'GBP' ? '£' : '€'
}

export function formatFunding(row: HubFeedRow): string {
  if (row.funding_min || row.funding_max) {
    const symbol = getCurrencySymbol(row.currency)
    if (row.funding_min && row.funding_max) {
      if (row.funding_min === row.funding_max) {
        return `${symbol}${row.funding_min.toLocaleString('en-US')}`
      }
      return `${symbol}${row.funding_min.toLocaleString('en-US')}–${row.funding_max.toLocaleString('en-US')}`
    }
    if (row.funding_min) return `${symbol}${row.funding_min.toLocaleString('en-US')}`
    if (row.funding_max) return `${symbol}${row.funding_max.toLocaleString('en-US')}`
  }
  if (row.funding_type === 'artist_fee' || row.funding_type === 'stipend') return 'Fee'
  if (row.funding_type === 'in_kind') return 'In-kind'
  return '—'
}

export function formatDeadline(row: HubFeedRow): { text: string; isUrgent: boolean } {
  if (row.is_rolling || !row.deadline) {
    return { text: 'Rolling', isUrgent: false }
  }

  if (row.days_left !== undefined && row.days_left !== null) {
    if (row.days_left < 0) {
      return { text: 'Closed', isUrgent: false }
    }
    if (row.days_left < 7) {
      return { text: `${row.days_left} ${row.days_left === 1 ? 'day' : 'days'} left`, isUrgent: true }
    }
    const deadlineDate = new Date(row.deadline)
    const month = deadlineDate.toLocaleString('en-US', { month: 'short' })
    const day = deadlineDate.getDate()
    return { text: `Closes ${month} ${day}`, isUrgent: false }
  }

  return { text: row.deadline, isUrgent: false }
}

/**
 * The single differentiator tag shown on a card face: whichever of
 * "funded" or "no fee" is the more decision-relevant fact for this row.
 * Returns null when neither applies, keeping the tag cap at two.
 */
export function getDifferentiatorTag(row: HubFeedRow): string | null {
  const isFunded =
    (row.funding_min ?? 0) > 0 ||
    (row.funding_max ?? 0) > 0 ||
    ['grant', 'stipend', 'artist_fee', 'salaried'].includes(row.funding_type ?? '')
  if (isFunded) return 'Funded'
  if (row.application_fee === 0) return 'No fee'
  return null
}

export default function OpportunityRow({
  row,
  locked = false,
  saved = false,
  userId,
  profile = null,
  vocab = [],
}: OpportunityRowProps) {
  const fundingText = formatFunding(row)
  const deadlineInfo = formatDeadline(row)

  const typeEntry = vocab.find((v) => v.category === 'type' && v.value === row.type)
  const typeLabel = typeEntry ? typeEntry.label : row.type
  const cityLabel = row.city_name || row.city || null

  // "Reward" row — a quiet, textual stand-in for ArtConnect's reward icon
  // strip. Built only from fields we actually have (covers[] + a funding
  // summary when one exists) — no icons are invented for rewards we can't
  // evidence. Capped at four so it stays a glance, not a list.
  const coverLabels = (row.covers || []).map((code) => {
    const entry = vocab.find((v) => v.category === 'covers' && v.value === code)
    return entry ? entry.label : code
  })
  const rewardTags = [...coverLabels, ...(fundingText !== '—' ? [fundingText] : [])]
  const visibleRewardTags = rewardTags.slice(0, 4)
  const extraRewardCount = rewardTags.length - visibleRewardTags.length

  const isFree = row.application_fee === 0
  const feeText = isFree ? 'Free' : `${getCurrencySymbol(row.currency)}${row.application_fee} fee`

  // Eligibility badge — only for signed-in users (profile present)
  const eligibility = !locked && profile ? checkEligibility(profile, row) : null

  return (
    <div className="card card-interactive relative p-5 md:p-6">
      {/* Stretched link: makes the whole card clickable while still letting the
          source_name link below sit above it (z-10) as its own tap target —
          avoids nesting an <a> inside an <a>. */}
      <Link
        href={`/opportunities/${row.slug}`}
        className="absolute inset-0 z-0"
        aria-label={row.title}
      />
      <div className="relative flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1 flex flex-col gap-1.5">
            <h3 className="t-row text-fg line-clamp-2">{row.title}</h3>
            <div className="flex flex-wrap items-center gap-2">
              {typeLabel && <Badge tone="accent">{typeLabel}</Badge>}
              {cityLabel && (
                <Link
                  href={`/hub?city=${row.city}`}
                  className="relative z-10 t-meta text-fg-soft underline underline-offset-4 hover:text-fg"
                >
                  {cityLabel}
                </Link>
              )}
              {row.is_demo && <Badge tone="outline">Demo</Badge>}
            </div>
          </div>

          {/* Owner — no source logos exist in our data, so the avatar always
              falls back to initials rather than an invented image. */}
          <Link
            href={`/sources/${row.source_id}`}
            className="relative z-10 flex shrink-0 items-center gap-2 hover:opacity-80"
          >
            <Avatar name={row.source_name} size={28} rounded="full" />
            <span className="hidden sm:inline t-meta text-fg-soft max-w-[140px] truncate">
              {row.source_name}
            </span>
          </Link>
        </div>

        {visibleRewardTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            {visibleRewardTags.map((tag) => (
              <Badge key={tag} tone="neutral">
                {tag}
              </Badge>
            ))}
            {extraRewardCount > 0 && <Badge tone="neutral">+{extraRewardCount}</Badge>}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <Badge tone={isFree ? 'positive' : 'neutral'}>{feeText}</Badge>
          <span className={`t-meta ${deadlineInfo.isUrgent ? 'text-urgent' : 'text-muted'}`}>
            Deadline: {deadlineInfo.text}
          </span>
          {eligibility && (
            <span
              className={`t-meta ${eligibility.isEligible ? 'text-accent' : 'text-muted'}`}
              title={eligibility.reasons.join(' · ')}
            >
              {eligibility.isEligible ? 'Eligible ✓' : 'Check terms'}
            </span>
          )}
        </div>

        <div className="relative z-10 flex items-center justify-end gap-2 pt-1">
          {!locked && (
            <SaveOpportunityButton
              oppId={row.opp_id}
              slug={row.slug}
              initialSaved={saved}
              userId={userId}
              className="h-9 px-3 text-[14px]"
            />
          )}
          <Link
            href={`/opportunities/${row.slug}`}
            className="inline-flex h-9 items-center justify-center gap-1 rounded-[var(--radius-sm)] bg-accent px-3 text-[14px] font-semibold text-accent-ink transition-opacity hover:opacity-90"
          >
            See more →
          </Link>
        </div>
      </div>
    </div>
  )
}
