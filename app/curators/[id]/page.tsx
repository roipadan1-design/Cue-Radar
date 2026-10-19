import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getActiveMarketSlugs, isInPilotScope } from '@/lib/markets'
import Badge from '@/components/ui/Badge'
import EntityHeader from '@/components/profile/EntityHeader'
import EntityTabs from '@/components/profile/EntityTabs'
import EntitySection, { Paragraphs, ContactLinks } from '@/components/profile/EntitySection'
import { vocabLabel, placeLine } from '@/lib/labels'
import type { Curator, Source, VocabEntry } from '@/lib/types'

interface PageProps {
  params: Promise<{ id: string }>
}

/**
 * Curator page, Task 22 (owner reference: ArtConnect's curator page): avatar +
 * name + "Curator · City, Country", Overview with About and Contact, and a second
 * tab for the organisations they work with. Researched public information only.
 */
export default async function CuratorPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('curators')
    .select('*, markets(display_name, country)')
    .eq('curator_id', id)
    .eq('status', 'active')
    .maybeSingle()

  if (!data) notFound()

  const activeSlugs = await getActiveMarketSlugs(supabase)
  if (!isInPilotScope((data as { market?: string | null }).market, activeSlugs)) notFound()

  const curator = data as Curator
  const marketObj = (data as { markets?: { display_name: string; country: string } | null }).markets
  const metaLine = [curator.role_label, placeLine(marketObj?.display_name, marketObj?.country)]
    .filter(Boolean)
    .join(' · ')

  const [{ data: vocabData }, { data: orgData }] = await Promise.all([
    supabase.from('vocab').select('*').order('sort_order', { ascending: true }),
    curator.affiliations?.length
      ? supabase.from('sources').select('source_id, name, source_type').in('source_id', curator.affiliations)
      : Promise.resolve({ data: [] }),
  ])
  const vocab = (vocabData || []) as VocabEntry[]
  const orgs = (orgData || []) as Pick<Source, 'source_id' | 'name' | 'source_type'>[]
  const fields = (curator.disciplines || []).map((d) => vocabLabel(vocab, 'discipline', d))

  const overview = (
    <div className="flex flex-col gap-10">
      {curator.about ? (
        <EntitySection title="About">
          <Paragraphs text={curator.about} />
        </EntitySection>
      ) : (
        <p className="t-body text-muted">We haven&apos;t written this one up yet.</p>
      )}

      {fields.length > 0 && (
        <EntitySection title="Fields">
          <div className="flex flex-wrap gap-1.5">
            {fields.map((f) => (
              <Badge key={f} tone="outline">
                {f}
              </Badge>
            ))}
          </div>
        </EntitySection>
      )}

      <EntitySection title="Contact">
        <ContactLinks
          links={[
            { label: 'Website', href: curator.website_url },
            { label: 'Instagram', href: curator.instagram_url },
          ]}
        />
        {!curator.website_url && !curator.instagram_url && (
          <p className="t-body text-muted">No public links on record.</p>
        )}
      </EntitySection>
    </div>
  )

  const works = (
    <div className="flex flex-col">
      {orgs.length === 0 ? (
        <p className="t-body text-muted">No organisations on record yet.</p>
      ) : (
        orgs.map((o) => (
          <Link
            key={o.source_id}
            href={`/sources/${o.source_id}`}
            className="flex items-center justify-between gap-4 py-3 border-b border-line"
          >
            <span className="t-body text-fg">{o.name}</span>
            <span className="t-meta text-muted">{vocabLabel(vocab, 'source_type', o.source_type)}</span>
          </Link>
        ))
      )}
    </div>
  )

  return (
    <div className="container-page py-8 md:py-12">
      <div className="mb-6">
        <Link href="/discover?tab=curators" className="t-meta text-muted hover:text-fg transition-colors">
          ← Curators
        </Link>
      </div>
      <EntityHeader name={curator.name} nameJa={curator.name_ja} metaLine={metaLine} />
      <div className="mt-10">
        <EntityTabs
          tabs={[
            { key: 'overview', label: 'Overview', content: overview },
            { key: 'works', label: 'Works with', content: works },
          ]}
        />
      </div>
    </div>
  )
}
