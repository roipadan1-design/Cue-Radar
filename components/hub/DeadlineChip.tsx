"use client";

interface DeadlineChipProps {
  deadline: string | null;
  daysLeft: number | null;
  isRolling: boolean;
}

export function DeadlineChip({ deadline, daysLeft, isRolling }: DeadlineChipProps) {
  if (isRolling || !deadline) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 text-xs border border-gray-800 text-gray-200 bg-gray-950">
        Rolling
      </span>
    );
  }

  if (daysLeft === null) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 text-xs border border-gray-800 text-gray-400 bg-gray-950">
        {deadline}
      </span>
    );
  }

  if (daysLeft < 0) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 text-xs border border-gray-800 text-gray-400 line-through bg-gray-950">
        Expired ({deadline})
      </span>
    );
  }

  if (daysLeft < 7) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 text-xs border border-red-500 text-red-500 bg-red-500/10 font-bold">
        {daysLeft}d left ({deadline})
      </span>
    );
  }

  if (daysLeft <= 30) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 text-xs border border-purple-400 text-purple-400 bg-purple-400/10 font-bold">
        {daysLeft}d left ({deadline})
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 text-xs border border-gray-800 text-gray-200 bg-gray-950">
      {daysLeft}d left ({deadline})
    </span>
  );
}
