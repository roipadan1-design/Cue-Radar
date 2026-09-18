import Link from 'next/link'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Avatar from '@/components/ui/Avatar'
import SaveOpportunityButton from '@/components/hub/SaveOpportunityButton'
import { formatFunding, formatDeadline, getCurrencySymbol } from '@/components/hub/OpportunityRow'
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

function formatDeadlineDate(dateStr?: string | null): string {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    return new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(d)
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
  // Demo rows (AGENTS.md rule 1) all share one placeholder apply_url on the
  // pre-rebrand domain (cue-radar.vercel.app/demo) — deriving the button
  // label from that hostname would leak the stale domain into a
  // customer-facing button, so demo rows get a neutral label instead of the
  // real host.
  let hostname = 'the demo page'
  if (!row.is_demo) {
    try {
      hostname = new URL(row.apply_url).hostname.replace(/^www\./, '')
    } catch {
      hostname = row.apply_url
    }
  }

  const typeEntry = vocab.find((v) => v.category === 'type' && v.value === row.type)
  const typeLabel = typeEntry ? typeEntry.label : row.type

  const verifiedFormatted = formatVerifiedDate(row.verified_at)
  const stale = isVerificationStale(row.verified_at)

  const deadlineInfo = formatDeadline(row)
  const fundingText = formatFunding(row)

  const isFree = row.application_fee === 0
  const feeText = isFree ? 'Free to apply' : `${getCurrencySymbol(row.currency)}${row.application_fee}`

  // `eligibility_geo` mixes ISO codes with plain words ('IL', 'EU', 'DE', 'NRW',
  // 'international'). There is no vocab category for it, so this only fixes the
  // casing of the word-shaped values and leaves the codes alone — a formatting
  // rule, not an invented code-to-country-name table (rule 1/4).
  const eligibilityText =
    row.eligibility_geo && row.eligibility_geo.length > 0
      ? row.eligibility_geo
          .map((g) => (g === g.toUpperCase() ? g : g.charAt(0).toUpperCase() + g.slice(1)))
          .join(', ')
      : '—'

  // Deliverable B: eligibility badge for signed-in users
  const eligibility = profile ? checkEligibility(profile, row) : null

  const coverLabels = (row.covers || []).map((code) => {
    const entry = vocab.find((v) => v.category === 'covers' && v.value === code)
    return entry ? entry.label : code
  })

  const applyButton = (
    <a href={row.apply_url} target="_blank" rel="noopener noreferrer" className="w-full">
      <Button variant="primary" className="w-full">
        Apply on {hostname}
      </Button>
    </a>
  )

  const saveButton = (
    <SaveOpportunityButton
      oppId={row.opp_id}
      slug={row.slug}
      initialSaved={isSaved}
      userId={userId}
      className="w-full justify-center"
    />
  )

  return (
    <div className="container-page py-6 md:py-10 pb-[120px] md:pb-16">
      {/* Back link */}
      <div className="mb-4">
        <Link href="/hub" className="t-meta text-muted hover:text-fg transition-colors">
          ← Opportunities
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-start gap-8 md:gap-10">
        {/* ===================== MAIN COLUMN ===================== */}
        <div className="order-2 md:order-none min-w-0 md:flex-1 md:max-w-[680px] flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <div className="t-meta text-muted">
              {typeLabel}
              {row.city_name ? `  ·  ${row.city_name}` : ''}
            </div>

            <h1 className="t-title normal-case text-fg">{row.title}</h1>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/sources/${row.source_id}`}
                className="flex items-center gap-2 hover:opacity-80"
              >
                <Avatar name={row.source_name} size={32} />
                <span className="t-body text-fg-soft">{row.source_name}</span>
              </Link>
              {row.is_demo && <Badge tone="outline">Demo</Badge>}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="accent">{typeLabel}</Badge>
              <Badge tone={isFree ? 'positive' : 'neutral'}>{feeText}</Badge>
              {eligibility && (
                <Badge
                  tone={eligibility.isEligible ? 'positive' : 'outline'}
                  title={eligibility.reasons.join(' · ')}
                >
                  {eligibility.isEligible ? 'Eligible ✓' : 'Check terms'}
                </Badge>
              )}
            </div>
          </div>

          {row.summary && (
            <section className="flex flex-col gap-3">
              <h2 className="t-section text-fg">Overview</h2>
              <p className="t-body text-fg-soft whitespace-pre-line">{row.summary}</p>
            </section>
          )}

          <section className="flex flex-col gap-3">
            <h2 className="t-section text-fg">Eligibility</h2>
            <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-x-6 gap-y-3">
              <div className="t-meta text-muted">Open to</div>
              <div className="t-body text-fg">{eligibilityText}</div>

              {row.career_stage && (
                <>
                  <div className="t-meta text-muted">Career stage</div>
                  <div className="t-body text-fg capitalize">{row.career_stage}</div>
                </>
              )}

              {row.discipline_flags && row.discipline_flags.length > 0 && (
                <>
                  <div className="t-meta text-muted">Discipline</div>
                  <div className="flex flex-wrap gap-1.5 items-center">
                    {row.discipline_flags.map((code) => {
                      const entry = vocab.find((v) => v.category === 'discipline' && v.value === code)
                      return (
                        <Badge key={code} tone="neutral">
                          {entry ? entry.label : code}
                        </Badge>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="t-section text-fg">Rewards</h2>
            <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-x-6 gap-y-3">
              <div className="t-meta text-muted">Funding</div>
              <div className="t-body text-fg t-num">{fundingText}</div>

              {coverLabels.length > 0 && (
                <>
                  <div className="t-meta text-muted">Covers</div>
                  <div className="flex flex-wrap gap-1.5 items-center">
                    {coverLabels.map((label) => (
                      <Badge key={label} tone="neutral">
                        {label}
                      </Badge>
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>
        </div>

        {/* ===================== DECISION RAIL ===================== */}
        <aside className="order-1 md:order-none md:w-[340px] md:shrink-0 flex flex-col gap-5 md:sticky md:top-20">
          <div className="card p-5 flex flex-col gap-4">
            <div>
              <div className="t-meta text-muted mb-1">Deadline</div>
              <div className={`t-row ${deadlineInfo.isUrgent ? 'text-urgent' : 'text-fg'}`}>
                {row.is_rolling || !row.deadline ? 'Rolling — no fixed deadline' : formatDeadlineDate(row.deadline)}
              </div>
            </div>

            {row.deadline ? (
              <a href={`/opportunities/${row.slug}/ics`} download={`${row.slug}.ics`}>
                <Button variant="subtle" className="w-full">
                  Add to calendar
                </Button>
              </a>
            ) : (
              <Button variant="subtle" className="w-full" disabled>
                Add to calendar (Rolling)
              </Button>
            )}
          </div>

          {/* "Does this sound like something for you?" — Save/Apply box */}
          <div className="card p-5 flex flex-col gap-3">
            <div className="t-row text-fg">Does this sound like something for you?</div>
            <div className="flex flex-col gap-2">
              {applyButton}
              {saveButton}
            </div>
          </div>

          <div className="card p-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h3 className="t-label">Cost</h3>
              <p className="t-body text-fg">{feeText}</p>
            </div>

            {row.materials_required && row.materials_required.length > 0 && (
              <div className="flex flex-col gap-1 pt-4 border-t border-line">
                <h3 className="t-label">Required documents</h3>
                <ul className="flex flex-col gap-1">
                  {row.materials_required.map((mat, idx) => (
                    <li key={idx} className="t-body text-fg">
                      {mat}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-col gap-1 pt-4 border-t border-line">
              <h3 className="t-label">Listed by</h3>
              <Link
                href={`/sources/${row.source_id}`}
                className="t-body text-fg hover:underline hover:underline-offset-4 w-fit"
              >
                {row.source_name}
              </Link>
              {verifiedFormatted && (
                <p className="t-meta text-muted">
                  Verified {verifiedFormatted}
                  {stale ? ' — re-verification suggested' : ''}
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile sticky bottom action bar — keeps Apply/Save reachable while
          scrolling a long Overview/Eligibility/Rewards body, on top of the
          full decision box already collapsed above the fold. */}
      <div className="md:hidden fixed bottom-[56px] left-0 right-0 z-30 bg-surface border-t border-line p-3 flex items-center gap-3 pb-[calc(12px+env(safe-area-inset-bottom))]">
        <div className="flex-1">{applyButton}</div>
        <SaveOpportunityButton oppId={row.opp_id} slug={row.slug} initialSaved={isSaved} userId={userId} />
      </div>
    </div>
  )
}
