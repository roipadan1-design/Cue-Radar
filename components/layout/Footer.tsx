export default function Footer() {
  return (
    <footer className="hidden md:block w-full border-t border-line px-6 py-4 t-meta text-muted">
      <div className="max-w-[960px] mx-auto flex items-center justify-between">
        <span>CUE RADAR</span>
        <a
          href="https://github.com/roipadan1-design/Cue-Radar/blob/main/docs/HANDOFF_V3.md"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-fg underline underline-offset-4 transition-colors"
        >
          docs/HANDOFF_V3.md
        </a>
      </div>
    </footer>
  )
}
