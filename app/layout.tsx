import type { Metadata, Viewport } from 'next'
import { Archivo, Manrope, Noto_Sans_JP } from 'next/font/google'
import TopBar from '@/components/layout/TopBar'
import MobileNav from '@/components/layout/MobileNav'
import Footer from '@/components/layout/Footer'
import { BRAND } from '@/lib/brand'
import { createClient } from '@/lib/supabase/server'
import './globals.css'

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['800'],
  variable: '--font-display',
})

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
})

const notoSansJP = Noto_Sans_JP({
  weight: '700',
  // @ts-expect-error Next.js Google font loader supports text parameter for character subsetting at runtime
  text: '間',
  preload: false,
  variable: '--font-mark',
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

  return (
    <html
      lang="en"
      className={`${archivo.variable} ${manrope.variable} ${notoSansJP.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-bg text-fg font-body antialiased">
        <TopBar />
        <main className="flex-1 w-full mx-auto pb-[72px] md:pb-0">
          {children}
        </main>
        <Footer />
        <MobileNav isSignedIn={Boolean(user)} />
      </body>
    </html>
  )
}
