import Link from 'next/link'

export const metadata = {
  title: 'Sample content',
}

export default function DemoPage() {
  return (
    <div className="max-w-[560px] mx-auto min-h-[calc(100vh-160px)] px-4 md:px-6 flex flex-col items-center justify-center text-center gap-4">
      <span className="t-meta text-muted">[Demo]</span>
      <h1 className="t-title text-fg">This is sample content</h1>
      <p className="t-body text-muted max-w-md">
        Rows marked <span className="text-fg">Demo</span> are fictional — invented institutions and
        invented calls — so the Hub feels full while the real feed is still being built out. They are
        never a real opportunity and there is nothing to apply to here. The team is verifying real,
        open calls city by city; demo rows are replaced as verified ones come in, and this notice
        disappears once there are enough of them.
      </p>
      <Link
        href="/hub"
        className="mt-4 t-body text-fg underline underline-offset-4 hover:opacity-80"
      >
        Browse open calls
      </Link>
    </div>
  )
}
