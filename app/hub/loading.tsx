export default function HubLoading() {
  return (
    <div className="max-w-[960px] mx-auto px-4 md:px-6 py-6 animate-pulse">
      <div className="h-[100px] py-4 border-b border-line" />
      <div className="h-4 w-40 bg-surface rounded-[var(--radius)] mt-6" />
      <div className="h-8 w-64 bg-surface rounded-[var(--radius)] mt-3" />
      <div className="h-4 w-56 bg-surface rounded-[var(--radius)] mt-3 mb-6" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-20 bg-surface border border-line rounded-[var(--radius)]" />
        ))}
      </div>
    </div>
  )
}
