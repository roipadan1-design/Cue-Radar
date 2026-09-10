"use client";

import Link from "next/link";
import { Bookmark } from "lucide-react";
import { HubOpportunity } from "@/lib/types";
import { DeadlineChip } from "./DeadlineChip";

interface OpportunityRowProps {
  opportunity: HubOpportunity;
  vocabMap: Record<string, string>;
  isSaved?: boolean;
  onToggleSave?: (oppId: string) => void;
}

export function OpportunityRow({
  opportunity,
  vocabMap,
  isSaved = false,
  onToggleSave,
}: OpportunityRowProps) {
  const typeLabel = vocabMap[`type:${opportunity.type}`] || opportunity.type;

  // Format funding display
  let fundingDisplay = "—";
  if (opportunity.funding_min || opportunity.funding_max) {
    const symbol = opportunity.currency === "USD" ? "$" : opportunity.currency === "GBP" ? "£" : "€";
    if (opportunity.funding_min && opportunity.funding_max) {
      fundingDisplay = `${symbol}${opportunity.funding_min.toLocaleString()}–${opportunity.funding_max.toLocaleString()}`;
    } else if (opportunity.funding_min) {
      fundingDisplay = `${symbol}${opportunity.funding_min.toLocaleString()}+`;
    } else if (opportunity.funding_max) {
      fundingDisplay = `Up to ${symbol}${opportunity.funding_max.toLocaleString()}`;
    }
  } else if (opportunity.funding_type === "artist_fee") {
    fundingDisplay = "Fee";
  } else if (opportunity.funding_type === "in_kind") {
    fundingDisplay = "In-kind";
  }

  const eligibility = opportunity.eligibility_geo.length > 0 ? opportunity.eligibility_geo.join(", ") : "Any";

  return (
    <article className="group relative flex flex-col p-4 bg-[#141416] border border-[#26262A] hover:border-[#EDEDED]/40 transition-colors">
      {/* Row 1: mono small - type label · funding */}
      <div className="flex items-center justify-between text-xs font-mono text-[#8A8A93] uppercase tracking-wider mb-2">
        <span>{typeLabel}</span>
        <span className="font-semibold text-[#EDEDED]">{fundingDisplay}</span>
      </div>

      {/* Row 2: title (only text >16px) */}
      <h3 className="font-display text-lg sm:text-xl font-semibold text-[#EDEDED] group-hover:text-[#D7FF3F] transition-colors mb-2 line-clamp-2">
        <Link href={`/opportunities/${opportunity.slug}`} className="focus:outline-none focus:ring-1 focus:ring-[#D7FF3F]">
          {opportunity.title}
        </Link>
      </h3>

      {/* Row 3: mono - source_name · city_name */}
      <div className="text-xs font-mono text-[#8A8A93] mb-3">
        <span>{opportunity.source_name}</span>
        <span className="mx-1.5">•</span>
        <span>{opportunity.city_name || opportunity.city || "Remote"}</span>
      </div>

      {/* Row 4: deadline chip */}
      <div className="mb-3">
        <DeadlineChip
          deadline={opportunity.deadline}
          daysLeft={opportunity.days_left}
          isRolling={opportunity.is_rolling}
        />
      </div>

      {/* Row 5: eligibility chip + save icon */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#26262A] text-xs font-mono text-[#8A8A93]">
        <span className="truncate max-w-[80%]">Eligibility: {eligibility}</span>
        <button
          type="button"
          onClick={() => onToggleSave?.(opportunity.opp_id)}
          aria-label={isSaved ? "Unsave opportunity" : "Save opportunity"}
          className="p-1 hover:text-[#D7FF3F] transition-colors focus:outline-none focus:ring-1 focus:ring-[#D7FF3F]"
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? "fill-[#D7FF3F] text-[#D7FF3F]" : "text-[#8A8A93]"}`} />
        </button>
      </div>
    </article>
  );
}
