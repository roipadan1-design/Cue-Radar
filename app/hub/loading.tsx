export default function HubLoading() {
  return (
    <div className="container-page py-8 md:py-10 animate-pulse">
      <div className="h-8 w-64 bg-surface rounded-[var(--radius)]" />
      <div className="h-4 w-96 max-w-full bg-surface rounded-[var(--radius)] mt-3 mb-8" />
      <div className="h-[140px] py-5 border-b border-line" />
      <div className="flex flex-col gap-3 mt-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-28 bg-surface border border-line rounded-[var(--radius)]" />
        ))}
      </div>
    </div>
  )
}
