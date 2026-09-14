import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ handle: string }>
}

export default async function PublicProfilePage(_props: PageProps) {
  // Until Task 04: notFound() for every handle
  notFound()
}
