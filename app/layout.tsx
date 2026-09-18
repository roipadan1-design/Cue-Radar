import type { Metadata, Viewport } from 'next'
import { Archivo, Manrope } from 'next/font/google'
import TopBar from '@/components/layout/TopBar'
import MobileNav from '@/components/layout/MobileNav'
import Footer from '@/components/layout/Footer'
import { BRAND } from '@/lib/brand'
import { createClient } from '@/lib/supabase/server'
import './globals.css'

// 500/600 carry the new heading scale (see app/globals.css). 800 is kept only for
// the wordmark lockup; nothing else on the site is that heavy any more.
const archivo = Archivo({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-display',
})

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: {
    default: BRAND.name,
    template: `%s · ${BRAND.name}`,
  },
  description: BRAND.tagline,
}

export const viewport: Viewport = {
  themeColor: BRAND.themeColor,
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Only fetched for the account control in TopBar (avatar + initials
  // fallback). Not persisted client-side (rule 3) — read fresh on every
  // request like the rest of the shell.
  let avatarUrl: string | null = null
  let fullName: string | null = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('avatar_url, full_name')
      .eq('id', user.id)
      .maybeSingle()
    avatarUrl = profile?.avatar_url ?? null
    fullName = profile?.full_name ?? null
  }

  return (
    <html
      lang="en"
      className={`${archivo.variable} ${manrope.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-bg text-fg font-body antialiased">
        <TopBar isSignedIn={Boolean(user)} avatarUrl={avatarUrl} fullName={fullName} />
        <main className="flex-1 w-full container-page pb-[72px] md:pb-0">
          {children}
        </main>
        <Footer />
        <MobileNav isSignedIn={Boolean(user)} />
      </body>
    </html>
  )
}
