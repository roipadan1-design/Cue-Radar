import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import FilterBar from '@/components/hub/FilterBar'
import OpportunityRow from '@/components/hub/OpportunityRow'
import OpportunityDetailView from '@/components/hub/OpportunityDetailView'
import PublicProfileView from '@/components/profile/PublicProfileView'
import ProfileForm from '@/components/profile/ProfileForm'
import HubFeedView from '@/components/hub/HubFeedView'
import Chip from '@/components/ui/Chip'
import {
  getSeedMarkets,
  getSeedVocab,
  getSeedOpportunitiesStaging,
  getDemoProfile,
} from '@/lib/seed'
import type { Profile, SavedRow } from '@/lib/types'

export default function DevPreviewPage() {
  if (process.env.NODE_ENV === 'production') {
    notFound()
  }

  const markets = getSeedMarkets()
  const vocab = getSeedVocab()
  const allRows = getSeedOpportunitiesStaging()
  const demoProfile = getDemoProfile()

  // Generate specific rows for deadline states preview
  const rowFar = allRows.find((r) => r.days_left && r.days_left > 30) || allRows[0]
  const rowMedium =
    allRows.find((r) => r.days_left && r.days_left >= 7 && r.days_left <= 30) ||
    allRows[1] ||
    allRows[0]
  const rowUrgent =
    allRows.find((r) => r.days_left && r.days_left < 7 && r.days_left >= 0) ||
    allRows[2] ||
    allRows[0]
  const rowRolling = allRows.find((r) => r.is_rolling) || allRows[3] || allRows[0]

  // Pipeline preview rows with notes if available
  const sampleSavedRows: SavedRow[] = allRows.slice(0, 3).map((r, i) => ({
    user_id: 'dev_user',
    opp_id: r.opp_id,
    pipeline_status: i === 0 ? 'saved' : 'drafting',
    notes: null,
    saved_at: new Date().toISOString(),
    opportunity: r,
  }))

  const savedCount = sampleSavedRows.filter((s) => s.pipeline_status === 'saved').length
  const draftingCount = sampleSavedRows.filter((s) => s.pipeline_status === 'drafting').length

  // Empty profile for fallback testing
  const emptyProfile: Profile = {
    id: 'empty-user-id',
    handle: '',
    full_name: '',
    role_label: null,
    bio: null,
    avatar_url: null,
    locations: [],
    current_city: null,
    current_city_from: null,
    current_city_until: null,
    disciplines: [],
    showreel_url: null,
    social_links: {},
    open_for_collab: false,
    available_from: null,
    is_public: false,
  }

  return (
    <div className="max-w-[960px] mx-auto px-4 md:px-6 py-8 flex flex-col gap-16 pb-24">
      <div className="border-b border-line pb-4 flex items-center justify-between">
        <h1 className="t-title text-fg">Dev Component Preview</h1>
        <Chip>DRAFT</Chip>
      </div>

      {/* 1. Hub Guest Mode */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="t-meta text-muted">DEV PREVIEW · HUB GUEST MODE</span>
          <Chip>DRAFT</Chip>
        </div>
        <div className="border-t border-line pt-4">
          <Suspense fallback={<div className="h-[69px] py-4 border-b border-line" />}>
            <FilterBar markets={markets} vocab={vocab} />
          </Suspense>
          <HubFeedView rows={allRows} locked={true} />
        </div>
      </section>

      {/* 2. Hub Signed In Mode */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="t-meta text-muted">DEV PREVIEW · HUB SIGNED-IN MODE</span>
          <Chip>DRAFT</Chip>
        </div>
        <div className="border-t border-line pt-4">
          <Suspense fallback={<div className="h-[69px] py-4 border-b border-line" />}>
            <FilterBar markets={markets} vocab={vocab} />
          </Suspense>
          <HubFeedView rows={allRows} locked={false} />
        </div>
      </section>

      {/* 3. Deadline States */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="t-meta text-muted">DEV PREVIEW · DEADLINE STATES</span>
          <Chip>DRAFT</Chip>
        </div>
        <div className="border-t border-line pt-4 flex flex-col gap-2">
          <div>
            <span className="t-meta text-muted">&gt; 30 Days</span>
            <OpportunityRow row={rowFar} locked={false} />
          </div>
          <div>
            <span className="t-meta text-muted">7 - 30 Days</span>
            <OpportunityRow row={rowMedium} locked={false} />
          </div>
          <div>
            <span className="t-meta text-muted">&lt; 7 Days (Urgent)</span>
            <OpportunityRow row={rowUrgent} locked={false} />
          </div>
          <div>
            <span className="t-meta text-muted">Rolling</span>
            <OpportunityRow row={rowRolling} locked={false} />
          </div>
        </div>
      </section>

      {/* 4. Detail Page Layout */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="t-meta text-muted">DEV PREVIEW · OPPORTUNITY DETAIL</span>
          <Chip>DRAFT</Chip>
        </div>
        <div className="border-t border-line pt-4">
          {allRows[0] && <OpportunityDetailView row={allRows[0]} vocab={vocab} />}
        </div>
      </section>

      {/* 5. Pipeline Board */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="t-meta text-muted">DEV PREVIEW · PIPELINE BOARD</span>
          <Chip>DRAFT</Chip>
        </div>
        <div className="border-t border-line pt-4 flex flex-col gap-4">
          <div className="flex items-center gap-6 border-b border-line pb-[1px]">
            <span className="t-meta text-fg border-b-2 border-fg py-2 font-semibold">
              Saved · {savedCount}
            </span>
            <span className="t-meta text-muted py-2">
              Drafting · {draftingCount}
            </span>
            <span className="t-meta text-muted py-2">Submitted</span>
            <span className="t-meta text-muted py-2">Accepted</span>
            <span className="t-meta text-muted py-2">Rejected</span>
          </div>
          <div className="flex flex-col">
            {sampleSavedRows.map((savedItem) => {
              const r = savedItem.opportunity!
              return (
                <div key={`pipeline-${r.opp_id}`} className="py-2">
                  <OpportunityRow row={r} locked={false} />
                  <div className="px-1 mt-1 flex items-center justify-between gap-4">
                    {savedItem.notes ? (
                      <p className="t-body text-muted text-xs line-clamp-1">
                        {savedItem.notes}
                      </p>
                    ) : (
                      <span />
                    )}
                    {r.days_left !== undefined && r.days_left !== null && r.days_left < 0 && (
                      <Chip tone="urgent">Expired</Chip>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 6. Public Profile (Demo) */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="t-meta text-muted">DEV PREVIEW · PUBLIC PROFILE (REAL DEMO)</span>
          <Chip>DRAFT</Chip>
        </div>
        <div className="border-t border-line pt-4">
          <PublicProfileView profile={demoProfile} isOwner={true} />
        </div>
      </section>

      {/* 7. Public Profile (Empty Fallback) */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="t-meta text-muted">DEV PREVIEW · PUBLIC PROFILE (FALLBACKS)</span>
          <Chip>DRAFT</Chip>
        </div>
        <div className="border-t border-line pt-4">
          <PublicProfileView profile={emptyProfile} isOwner={true} />
        </div>
      </section>

      {/* 8. Edit Profile Form */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="t-meta text-muted">DEV PREVIEW · EDIT PROFILE FORM</span>
          <Chip>DRAFT</Chip>
        </div>
        <div className="border-t border-line pt-4">
          <ProfileForm />
        </div>
      </section>
    </div>
  )
}
