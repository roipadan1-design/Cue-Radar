import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function OpportunityDetailPage(_props: PageProps) {
  // Until Task 04: call notFound() for every slug
  notFound()
}
