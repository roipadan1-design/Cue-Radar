import Link from 'next/link'
import Button from '@/components/ui/Button'
import Chip from '@/components/ui/Chip'
import SaveOpportunityButton from '@/components/hub/SaveOpportunityButton'
import { formatFunding, formatDeadline } from '@/components/hub/OpportunityRow'
import { checkEligibility } from '@/lib/fit'
import type { HubFeedRow, Profile, VocabEntry } from '@/lib/types'

interface OpportunityDetailViewProps {
  row: HubFeedRow
  vocab?: VocabEntry[]
  isSaved?: boolean
  userId?: string
  profile?: Profile | null
}

function formatVerifiedDate(dateStr?: string | null): string {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(d)
  } catch {
    return dateStr
  }
}

/** Returns true if the verified_at date is more than 30 days ago */
function isVerificationStale(dateStr?: string | null): boolean {
  if (!dateStr) return false
  try {
    const verified = new Date(dateStr)
    const diffMs = Date.now() - verified.getTime()
    const diffDays = diffMs / (1000 * 60 * 60 * 24)
    return diffDays > 30
  } catch {
    return false
  }
}

export default function OpportunityDetailView({
  row,
  vocab = [],
  isSaved = false,
  userId,
  profile = null,
}: OpportunityDetailViewProps) {
  let hostname = ''
  try {
    hostname = new URL(row.apply_url).hostname.replace(/^www\./, '')
  } catch {
    hostname = row.apply_url
  }

  // Resolve vocab label for type
  const typeEntry = vocab.find((v) => v.category === 'type' && v.value === row.type)
  const typeLabel = typeEntry ? typeEntry.label : row.type

  const verifiedFormatted = formatVerifiedDate(row.verified_at)
  const stale = isVerificationStale(row.verified_at)
  const trustLine = verifiedFormatted
    ? `Verified ${verifiedFormatted}  ·  Source: ${row.source_name}`
    : `Source: ${row.source_name}`

  const deadlineInfo = formatDeadline(row)
  const fundingText = formatFunding(row)

  const symbol = row.currency === 'USD' ? '$' : row.currency === 'GBP' ? '£' : '€'
  const feeText = row.application_fee > 0 ? `${symbol}${row.application_fee}` : '—'

  const eligibilityText =
    row.eligibility_geo && row.eligibility_geo.length > 0
      ? row.eligibility_geo.join(', ')
      : '—'

  // Deliverable B: eligibility badge for signed-in users
  const eligibility = profile ? checkEligibility(profile, row) : null

  return (
    <div className="max-w-[720px] mx-auto px-4 md:px-6 py-6 pb-[120px] md:pb-12">
      {/* 1. Back link */}
      <div className="mb-4">
        <Link href="/hub" className="t-meta text-muted hover:text-fg transition-colors">
          ← Opportunities
        </Link>
      </div>

      {/* 2. Meta line */}
      <div className="t-meta text-muted mb-1">
        {typeLabel}
        {row.source_name && (
          <>
            {'  ·  '}
            <Link
              href={`/sources/${row.source_id}`}
              className="text-muted hover:underline hover:underline-offset-4"
            >
              {row.source_name}
            </Link>
          </>
        )}
        {row.city_name ? `  ·  ${row.city_name}` : ''}
      </div>

      {/* Trust line — Deliverable C */}
      <div className="t-meta text-muted mb-1">{trustLine}</div>
      {stale && (
        <div className="t-meta text-muted mb-4">
          Re-verification suggested
        </div>
      )}
      {!stale && <div className="mb-4" />}

      {/* 3. Title (sentence case) */}
      <h1 className="t-title normal-case text-fg mb-1">{row.title}</h1>
      {row.is_demo && (
        <div className="mb-3">
          <Chip>Demo</Chip>
        </div>
      )}
      {!row.is_demo && <div className="mb-3" />}

      {/* Deliverable B: eligibility badge */}
      {eligibility && (
        <div className="mb-6 flex items-center gap-2">
          <span
            className={`t-meta ${eligibility.isEligible ? 'text-accent' : 'text-muted'}`}
          >
            {eligibility.isEligible ? 'Eligible ✓' : 'Check eligibility terms'}
          </span>
          {eligibility.reasons.length > 0 && (
            <span className="t-meta text-muted">
              · {eligibility.reasons.join(' · ')}
            </span>
          )}
        </div>
      )}

      {/* 4. Fact block */}
      <div className="my-6 py-4 border-y border-line grid grid-cols-1 md:grid-cols-[140px_1fr] gap-x-6 gap-y-3">
        <div className="t-meta text-muted">Deadline</div>
        <div className="t-body text-fg">
          <span className={`t-num ${deadlineInfo.isUrgent ? 'text-urgent font-semibold' : ''}`}>
            {deadlineInfo.text}
          </span>
        </div>

        <div className="t-meta text-muted">Funding</div>
        <div className="t-body text-fg t-num">{fundingText}</div>

        {row.discipline_flags && row.discipline_flags.length > 0 && (
          <>
            <div className="t-meta text-muted">Discipline</div>
            <div className="flex flex-wrap gap-1.5 items-center">
              {row.discipline_flags.map((code) => {
                const entry = vocab.find((v) => v.category === 'discipline' && v.value === code)
                return <Chip key={code}>{entry ? entry.label : code}</Chip>
              })}
            </div>
          </>
        )}

        {row.covers && row.covers.length > 0 && (
          <>
            <div className="t-meta text-muted">Covers</div>
            <div className="flex flex-wrap gap-1.5 items-center">
              {row.covers.map((c) => (
                <Chip key={c}>{c}</Chip>
              ))}
            </div>
          </>
        )}

        <div className="t-meta text-muted">Eligibility</div>
        <div className="t-body text-fg">{eligibilityText}</div>

        {row.career_stage && (
          <>
            <div className="t-meta text-muted">Career stage</div>
            <div className="t-body text-fg capitalize">{row.career_stage}</div>
          </>
        )}

        <div className="t-meta text-muted">Application fee</div>
        <div className="t-body text-fg t-num">{feeText}</div>

        {row.verified_at && (
          <>
            <div className="t-meta text-muted">Verified</div>
            <div className="t-body text-muted t-num">{verifiedFormatted}</div>
          </>
        )}
      </div>

      {/* Desktop action buttons (under fact block) */}
      <div className="hidden md:flex flex-col items-start gap-3 mb-8">
        <div className="flex items-center gap-3">
          <a href={row.apply_url} target="_blank" rel="noopener noreferrer">
            <Button variant="primary">Apply on {hostname}</Button>
          </a>
          <SaveOpportunityButton
            oppId={row.opp_id}
            slug={row.slug}
            initialSaved={isSaved}
            userId={userId}
          />
        </div>
        {row.deadline ? (
          <a href={`/opportunities/${row.slug}/ics`} download={`${row.slug}.ics`}>
            <Button variant="ghost">Add to calendar</Button>
          </a>
        ) : (
          <Button variant="ghost" disabled>
            Add to calendar (Rolling)
          </Button>
        )}
      </div>

      {/* 5. Summary */}
      {row.summary && (
        <div className="my-6">
          <p className="t-body text-fg">{row.summary}</p>
        </div>
      )}

      {/* 6. Materials required */}
      {row.materials_required && row.materials_required.length > 0 && (
        <div className="my-6">
          <h2 className="t-meta text-muted mb-3">Materials required</h2>
          <div className="border-t border-line">
            {row.materials_required.map((mat, idx) => (
              <div key={idx} className="py-2.5 border-b border-line t-body text-fg">
                {mat}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Mobile sticky bottom action bar */}
      <div className="md:hidden fixed bottom-[56px] left-0 right-0 z-30 bg-surface border-t border-line p-3 flex items-center justify-between gap-3 pb-[calc(12px+env(safe-area-inset-bottom))]">
        <a href={row.apply_url} target="_blank" rel="noopener noreferrer" className="flex-1">
          <Button variant="primary" className="w-full">
            Apply on {hostname}
          </Button>
        </a>
        <SaveOpportunityButton
          oppId={row.opp_id}
          slug={row.slug}
          initialSaved={isSaved}
          userId={userId}
        />
      </div>
    </div>
  )
}
