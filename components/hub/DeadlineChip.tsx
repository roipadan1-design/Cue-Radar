"use client";

interface DeadlineChipProps {
  deadline: string | null;
  daysLeft: number | null;
  isRolling: boolean;
}

export function DeadlineChip({ deadline, daysLeft, isRolling }: DeadlineChipProps) {
  if (isRolling || !deadline) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 t-meta border border-line-strong text-fg bg-surface rounded-[var(--radius)]">
        Rolling
      </span>
    );
  }

  if (daysLeft === null) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 t-meta border border-line-strong text-muted bg-surface rounded-[var(--radius)]">
        {deadline}
      </span>
    );
  }

  if (daysLeft < 0) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 t-meta border border-line-strong text-muted line-through bg-surface rounded-[var(--radius)]">
        Expired ({deadline})
      </span>
    );
  }

  if (daysLeft < 7) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 t-meta border border-urgent text-urgent bg-urgent/10 font-bold rounded-[var(--radius)]">
        {daysLeft}d left ({deadline})
      </span>
    );
  }

  if (daysLeft <= 30) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 t-meta border border-accent text-accent bg-accent/10 font-bold rounded-[var(--radius)]">
        {daysLeft}d left ({deadline})
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 t-meta border border-line-strong text-fg bg-surface rounded-[var(--radius)]">
      {daysLeft}d left ({deadline})
    </span>
  );
}
