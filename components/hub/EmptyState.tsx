"use client";

import { useRouter, usePathname } from "next/navigation";

interface EmptyStateProps {
  isFiltered?: boolean;
}

export function EmptyState({ isFiltered = false }: EmptyStateProps) {
  const router = useRouter();
  const pathname = usePathname();

  if (isFiltered) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-[#141416] border border-[#26262A] text-center font-mono">
        <p className="text-base text-[#EDEDED] font-semibold mb-2">No matching opportunities found</p>
        <p className="text-xs text-[#8A8A93] mb-6">Try adjusting your active city, type, or discipline filters.</p>
        <button
          type="button"
          onClick={() => router.push(pathname)}
          className="px-4 py-2 bg-[#D7FF3F] text-[#0B0B0C] font-semibold text-xs hover:bg-white transition-colors"
        >
          Reset All Filters
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-12 bg-[#141416] border border-[#26262A] text-center font-mono">
      <p className="text-base text-[#EDEDED] font-semibold mb-2">The feed is being curated</p>
      <p className="text-xs text-[#8A8A93]">Check back soon — verified open calls, grants, and residencies are updated regularly.</p>
    </div>
  );
}
