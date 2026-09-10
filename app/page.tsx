import { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { HubOpportunity, Market, Vocab } from "@/lib/types";
import { FilterBar } from "@/components/hub/FilterBar";
import { OpportunityRow } from "@/components/hub/OpportunityRow";
import { EmptyState } from "@/components/hub/EmptyState";

interface PageProps {
  searchParams: Promise<{
    city?: string;
    type?: string;
    discipline?: string;
  }>;
}

export default async function HubPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const cityFilter = resolvedParams.city || "";
  const typeFilter = resolvedParams.type || "";
  const disciplineFilter = resolvedParams.discipline || "";

  const supabase = await createClient();

  let opportunities: HubOpportunity[] = [];
  let markets: Market[] = [];
  let vocab: Vocab[] = [];

  if (supabase) {
    const [oppRes, mktRes, vocabRes] = await Promise.all([
      supabase.from("hub_feed").select("*").order("deadline", { ascending: true, nullsFirst: false }),
      supabase.from("markets").select("*").order("display_name", { ascending: true }),
      supabase.from("vocab").select("*").order("sort_order", { ascending: true }),
    ]);

    if (oppRes.data) opportunities = oppRes.data as HubOpportunity[];
    if (mktRes.data) markets = mktRes.data as Market[];
    if (vocabRes.data) vocab = vocabRes.data as Vocab[];
  }

  // Vocab map for label lookup
  const vocabMap: Record<string, string> = {};
  vocab.forEach((v) => {
    vocabMap[`${v.category}:${v.value}`] = v.label;
  });

  // Client-side filtering logic simulation on server
  let filteredOpportunities = opportunities;

  if (cityFilter) {
    filteredOpportunities = filteredOpportunities.filter((o) => o.city === cityFilter);
  }
  if (typeFilter) {
    filteredOpportunities = filteredOpportunities.filter((o) => o.type === typeFilter);
  }
  if (disciplineFilter) {
    filteredOpportunities = filteredOpportunities.filter(
      (o) => o.discipline_flags && o.discipline_flags.includes(disciplineFilter)
    );
  }

  const liveDeadlineCount = opportunities.length;
  const isFiltered = Boolean(cityFilter || typeFilter || disciplineFilter);

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#EDEDED] font-mono px-4 py-8 sm:px-8 max-w-7xl mx-auto flex flex-col">
      {/* Header / Navigation */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#26262A] mb-8">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[#EDEDED]">
            CUE RADAR
          </h1>
          <p className="text-xs text-[#8A8A93] mt-1">
            Career OS for Independent Contemporary Dance & Experimental Sound
          </p>
        </div>

        <nav className="flex items-center gap-4 text-xs font-mono">
          <Link href="/" className="text-[#D7FF3F] font-semibold underline">
            Hub
          </Link>
          <Link href="/saved" className="text-[#8A8A93] hover:text-[#EDEDED] transition-colors">
            Saved
          </Link>
          <Link href="/profile/edit" className="text-[#8A8A93] hover:text-[#EDEDED] transition-colors">
            Profile
          </Link>
        </nav>
      </header>

      {/* Hero Stats */}
      <section className="mb-6 flex items-baseline justify-between">
        <div className="flex items-baseline gap-3">
          <span className="font-display text-3xl sm:text-4xl font-semibold text-[#EDEDED]">
            {liveDeadlineCount}
          </span>
          <span className="text-xs text-[#8A8A93] uppercase tracking-wider">
            Live Verified Opportunities
          </span>
        </div>
        {isFiltered && (
          <span className="text-xs text-[#8A8A93]">
            Showing {filteredOpportunities.length} of {opportunities.length}
          </span>
        )}
      </section>

      {/* Dynamic FilterBar */}
      <Suspense fallback={<div className="h-12 bg-[#141416] animate-pulse mb-6" />}>
        <FilterBar markets={markets} vocab={vocab} />
      </Suspense>

      {/* Opportunities Feed or Empty State */}
      <main className="flex-1">
        {filteredOpportunities.length === 0 ? (
          <EmptyState isFiltered={isFiltered} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOpportunities.map((opportunity) => (
              <OpportunityRow
                key={opportunity.opp_id}
                opportunity={opportunity}
                vocabMap={vocabMap}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 pt-6 border-t border-[#26262A] text-xs text-[#8A8A93] flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>Cue Radar — Curated Contemporary Performance & Sound</span>
        <span>Updated automatically via Sheet Sync</span>
      </footer>
    </div>
  );
}
