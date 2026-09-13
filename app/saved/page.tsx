"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSavedOpportunities, getPipelineStages } from "@/lib/savedOpportunities";

export default function SavedPage() {
  const [savedOpportunities, setSavedOpportunities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const router = useRouter();

  useEffect(() => {
    setIsLoading(false);
    setSavedOpportunities(getSavedOpportunities());
  }, []);

  const filteredOpportunities = savedOpportunities.filter((item) => {
    if (activeFilter === "all") return true;
    return item.pipeline_status === activeFilter;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0B0C] text-[#EDEDED] font-mono p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-xs text-[#8A8A93]">Loading saved opportunities...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#EDEDED] font-mono p-8">
      <div className="max-w-7xl mx-auto">
        {filteredOpportunities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-[#141416] border border-[#26262A] rounded-lg">
            <p className="text-base text-[#EDEDED] font-semibold mb-2">
              {activeFilter === "all" ? "No saved opportunities yet" : `No ${activeFilter} opportunities`}
            </p>
            <p className="text-xs text-[#8A8A93] mb-6">
              {activeFilter === "all"
                ? "Start saving opportunities from the hub to track your applications"
                : `No opportunities in the ${activeFilter} stage`}
            </p>
            <Link href="/" className="px-4 py-2 bg-[#D7FF3F] text-[#0B0B0C] font-semibold text-xs hover:bg-white transition-colors">
              Browse Opportunities
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {["saved", "drafting", "submitted", "accepted", "rejected"].map((status) => {
              const stageOpportunities = filteredOpportunities.filter(
                (item) => item.pipeline_status === status
              );
              const pipelineStages = getPipelineStages();
              const stageInfo = pipelineStages[status as keyof typeof pipelineStages];

              return (
                <div key={status} className="bg-[#141416] border border-[#26262A] rounded-lg p-4">
                  <div className="mb-4 pb-2 border-b border-[#26262A]">
                    <h3 className={`font-display text-lg font-semibold ${stageInfo.color} mb-1`}>
                      {stageInfo.label}
                    </h3>
                    <p className="text-xs text-[#8A8A93]">{stageInfo.description}</p>
                    <div className="text-xs text-[#8A8A93] mt-1">
                      {stageOpportunities.length} opportunity{stageOpportunities.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {stageOpportunities.map((item) => (
                      <div
                        key={item.opp_id}
                        className="bg-[#0B0B0C] border border-[#26262A] rounded p-3 hover:border-[#D7FF3F] transition-colors cursor-pointer"
                        onClick={() => router.push(`/opportunities/${item.opp_id}`)}
                      >
                        <div className="mb-2">
                          <h4 className="font-semibold text-sm text-[#EDEDED] line-clamp-2 leading-tight">
                            Opportunity {item.opp_id}
                          </h4>
                        </div>
                        <div className="text-xs text-[#8A8A93]">
                          {item.opportunity?.source_name || "Unknown source"}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className={`${stageInfo.color} px-2 py-0.5 text-xs rounded border border-current`}>
                            {stageInfo.label}
                          </span>
                        </div>
                        {item.notes && (
                          <div className="text-xs text-[#8A8A93] italic line-clamp-2 mt-2">
                            "{item.notes}"
                          </div>
                        )}
                      </div>
                    ))}
                    {stageOpportunities.length === 0 && (
                      <div className="border-2 border-dashed border-[#26262A] rounded p-6 text-center">
                        <div className="text-xs text-[#8A8A93] mb-2">
                          No {stageInfo.label.toLowerCase()} opportunities
                        </div>
                        <div className="text-xs text-[#8A8A93]">
                          Start saving opportunities from the main hub
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}