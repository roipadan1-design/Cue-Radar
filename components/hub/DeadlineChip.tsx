"use client";

interface DeadlineChipProps {
  deadline: string | null;
  daysLeft: number | null;
  isRolling: boolean;
}

export function DeadlineChip({ deadline, daysLeft, isRolling }: DeadlineChipProps) {
  if (isRolling || !deadline) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 text-xs font-mono border border-[#26262A] text-[#EDEDED] bg-[#141416]">
        Rolling
      </span>
    );
  }

  if (daysLeft === null) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 text-xs font-mono border border-[#26262A] text-[#8A8A93] bg-[#141416]">
        {deadline}
      </span>
    );
  }

  if (daysLeft < 0) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 text-xs font-mono border border-[#26262A] text-[#8A8A93] line-through bg-[#141416]">
        Expired ({deadline})
      </span>
    );
  }

  if (daysLeft < 7) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 text-xs font-mono border border-[#FF5A3C] text-[#FF5A3C] bg-[#FF5A3C]/10 font-bold">
        {daysLeft}d left ({deadline})
      </span>
    );
  }

  if (daysLeft <= 30) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 text-xs font-mono border border-[#D7FF3F] text-[#D7FF3F] bg-[#D7FF3F]/10 font-bold">
        {daysLeft}d left ({deadline})
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 text-xs font-mono border border-[#26262A] text-[#EDEDED] bg-[#141416]">
      {daysLeft}d left ({deadline})
    </span>
  );
}
