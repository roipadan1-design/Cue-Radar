import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import OpportunityRow from '@/components/hub/OpportunityRow'
import EventRow from '@/components/radar/EventRow'
import EntityHeader from '@/components/profile/EntityHeader'
import EntityTabs, { type EntityTab } from '@/components/profile/EntityTabs'
import EntitySection, { Paragraphs, ContactLinks } from '@/components/profile/EntitySection'
import { vocabLabel, placeLine } from '@/lib/labels'
import type { Curator, EventRow as EventRowType, HubFeedRow, Profile, Source, VocabEntry } from '@/lib/types'

export interface ClosedOpportunity {
  opp_id: string
  title: string
  deadline?: string | null
  created_at?: string | null
}

interface SourceDetailViewProps {
  source: Source
  cityName?: string | null
  country?: string | null
  sourceTypeLabel: string
  upcomingEvents: EventRowType[]
  people: Curator[]
  liveRows: HubFeedRow[]
  closedRows: ClosedOpportunity[]
  recurrenceMonth?: string | null
  vocab: VocabEntry[]
  profile?: Profile | null
}

function formatClosedDate(dateStr?: string | null): string {
  if (!dateStr) return ''
  try {
    return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(
      new Date(dateStr),
    )
  } catch {
    return dateStr
  }
}

/**
 * Organisation page, Task 22 layout (owner reference: ArtConnect's org page):
 * avatar + name + "Type · City, Country", text tabs, then About / Getting in /
 * Details / Contact. Tabs only appear when they have something real in them.
 */
export default function SourceDetailView({
  source,
  cityName,
  country,
  sourceTypeLabel,
  upcomingEvents,
  people,
  liveRows,
  closedRows,
  recurrenceMonth,
  vocab,
  profile = null,
}: SourceDetailViewProps) {
  const metaLine = [sourceTypeLabel, placeLine(cityName, country)].filter(Boolean).join(' · ')
  // `notes` is internal research bookkeeping ("UNVERIFIED; contact …") and is
  // never shown; only the written-for-the-page `about` field is public.
  const about = source.about
  const fields = (source.discipline_focus || []).map((d) => vocabLabel(vocab, 'discipline', d))
  const tags = source.scene_tags || []
  const where = [source.neighborhood, source.address].filter(Boolean).join(' · ')
  const hasCalls = liveRows.length > 0 || closedRows.length > 0

  const overview = (
    <div className="flex flex-col gap-10">
      {about ? (
        <EntitySection title="About">
          <Paragraphs text={about} />
        </EntitySection>
      ) : (
        <p className="t-body text-muted">We haven&apos;t written this one up yet.</p>
      )}

      {(source.newcomer_friendly === 'yes' || source.foreigner_notes) && (
        <EntitySection title="Getting in">
          {source.newcomer_friendly === 'yes' && (
            <p className="t-body text-fg-soft">Open to newcomers: you can just show up or sign up.</p>
          )}
          {source.foreigner_notes && <p className="t-body text-fg-soft max-w-[72ch]">{source.foreigner_notes}</p>}
        </EntitySection>
      )}

      {(fields.length > 0 || tags.length > 0 || where) && (
        <EntitySection title="Details">
          {where && <p className="t-body text-fg-soft">{where}</p>}
          {(fields.length > 0 || tags.length > 0) && (
            <div className="flex flex-wrap gap-1.5">
              {fields.map((f) => (
                <Badge key={f} tone="outline">
                  {f}
                </Badge>
              ))}
              {tags.map((t) => (
                <Badge key={t} tone="neutral">
                  {t.replace(/_/g, ' ')}
                </Badge>
              ))}
            </div>
          )}
          {recurrenceMonth && (
            <p className="t-body text-fg-soft">
              Calls usually open in <span className="text-accent">{recurrenceMonth}</span>
            </p>
          )}
        </EntitySection>
      )}

      {people.length > 0 && (
        <EntitySection title="People">
          <div className="flex flex-col">
            {people.map((p) => (
              <Link
                key={p.curator_id}
                href={`/curators/${p.curator_id}`}
                className="flex items-center justify-between gap-4 py-3 border-b border-line hover:text-fg"
              >
                <span className="t-body text-fg">{p.name}</span>
                <span className="t-meta text-muted">{p.role_label}</span>
              </Link>
            ))}
          </div>
        </EntitySection>
      )}

      <EntitySection title="Contact">
        <ContactLinks
          links={[
            { label: 'Website', href: source.website_url },
            { label: 'Instagram', href: source.instagram_url },
            { label: 'Calendar', href: source.calendar_url },
          ]}
        />
        {!source.website_url && !source.instagram_url && !source.calendar_url && (
          <p className="t-body text-muted">No public links on record.</p>
        )}
      </EntitySection>
    </div>
  )

  const events = (
    <div className="flex flex-col gap-3">
      {upcomingEvents.length === 0 ? (
        <p className="t-body text-muted">Nothing verified on the calendar right now.</p>
      ) : (
        upcomingEvents.map((event) => <EventRow key={event.event_id} event={event} vocab={vocab} />)
      )}
    </div>
  )

  const calls = (
    <div className="flex flex-col gap-4">
      {liveRows.map((row) => (
        <OpportunityRow key={row.opp_id} row={row} profile={profile} vocab={vocab} />
      ))}
      {closedRows.length > 0 && (
        <div className="flex flex-col">
          {closedRows.map((row) => (
            <div key={row.opp_id} className="flex items-center justify-between gap-4 py-3 border-b border-line">
              <span className="t-body text-muted line-clamp-1">{row.title}</span>
              <span className="t-meta text-muted shrink-0">Closed {formatClosedDate(row.deadline || row.created_at)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const tabs: EntityTab[] = [
    { key: 'overview', label: 'Overview', content: overview },
    { key: 'events', label: upcomingEvents.length ? `Events (${upcomingEvents.length})` : 'Events', content: events },
  ]
  if (hasCalls) tabs.push({ key: 'calls', label: 'Opportunities', content: calls })

  return (
    <div className="container-page py-8 md:py-12">
      <div className="mb-6">
        <Link href="/discover?tab=organizations" className="t-meta text-muted hover:text-fg transition-colors">
          ← Organizations
        </Link>
      </div>

      <EntityHeader name={source.name} nameJa={source.name_ja} metaLine={metaLine} />
      {source.is_demo && (
        <div className="mt-4">
          <Badge tone="outline">Demo</Badge>
        </div>
      )}

      <div className="mt-10">
        <EntityTabs tabs={tabs} />
      </div>
    </div>
  )
}
