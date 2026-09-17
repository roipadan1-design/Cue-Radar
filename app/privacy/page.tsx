export const metadata = {
  title: 'Privacy',
}

export default function PrivacyPage() {
  const feedbackEmail = process.env.NEXT_PUBLIC_FEEDBACK_EMAIL
  if (!feedbackEmail) {
    throw new Error('NEXT_PUBLIC_FEEDBACK_EMAIL environment variable is missing')
  }

  return (
    <div className="max-w-[560px] mx-auto px-4 md:px-6 py-16 flex flex-col gap-4">
      <span className="t-meta text-muted">[Privacy]</span>
      <h1 className="t-title text-fg">Privacy</h1>
      <p className="t-body text-muted">
        Fellow. stores your email address, the profile fields you choose to fill in (name, role,
        bio, disciplines, links and the rest of the profile form), and the calls you save to your
        pipeline. That is all. Nothing is sold or shared with advertisers or data brokers. If you
        want your data deleted, write to{' '}
        <a
          href={`mailto:${feedbackEmail}?subject=${encodeURIComponent('Delete my Fellow. data')}`}
          className="text-fg underline underline-offset-4 hover:opacity-80"
        >
          {feedbackEmail}
        </a>{' '}
        and it will be removed on request.
      </p>
    </div>
  )
}
