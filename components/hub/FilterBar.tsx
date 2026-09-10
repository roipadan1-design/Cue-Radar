"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { Market, Vocab } from "@/lib/types";

interface FilterBarProps {
  markets: Market[];
  vocab: Vocab[];
}

export function FilterBar({ markets, vocab }: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedCity = searchParams.get("city") || "";
  const selectedType = searchParams.get("type") || "";
  const selectedDiscipline = searchParams.get("discipline") || "";

  const typeOptions = vocab.filter((v) => v.category === "type");
  const disciplineOptions = vocab.filter((v) => v.category === "discipline");

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const resetFilters = useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  const hasActiveFilters = Boolean(selectedCity || selectedType || selectedDiscipline);

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3 p-3 bg-[#141416] border border-[#26262A] text-xs font-mono mb-6">
      <span className="text-[#8A8A93] uppercase font-bold tracking-wider">Filter:</span>

      {/* City / Market Filter */}
      <select
        value={selectedCity}
        onChange={(e) => updateParam("city", e.target.value)}
        className="bg-[#0B0B0C] text-[#EDEDED] border border-[#26262A] px-2.5 py-1.5 focus:border-[#D7FF3F] focus:outline-none"
      >
        <option value="">All Cities / Markets</option>
        {markets.map((m) => (
          <option key={m.slug} value={m.slug}>
            {m.display_name} ({m.country})
          </option>
        ))}
      </select>

      {/* Type Filter */}
      <select
        value={selectedType}
        onChange={(e) => updateParam("type", e.target.value)}
        className="bg-[#0B0B0C] text-[#EDEDED] border border-[#26262A] px-2.5 py-1.5 focus:border-[#D7FF3F] focus:outline-none"
      >
        <option value="">All Types</option>
        {typeOptions.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>

      {/* Discipline Filter */}
      <select
        value={selectedDiscipline}
        onChange={(e) => updateParam("discipline", e.target.value)}
        className="bg-[#0B0B0C] text-[#EDEDED] border border-[#26262A] px-2.5 py-1.5 focus:border-[#D7FF3F] focus:outline-none"
      >
        <option value="">All Disciplines</option>
        {disciplineOptions.map((d) => (
          <option key={d.value} value={d.value}>
            {d.label}
          </option>
        ))}
      </select>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={resetFilters}
          className="ml-auto text-[#D7FF3F] underline hover:text-[#EDEDED] transition-colors focus:outline-none"
        >
          Reset Filters
        </button>
      )}
    </div>
  );
}
