import type { Metadata } from 'next'
import { Inter_Tight, JetBrains_Mono } from 'next/font/google'
import TopBar from '@/components/layout/TopBar'
import MobileNav from '@/components/layout/MobileNav'
import Footer from '@/components/layout/Footer'
import './globals.css'

const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: '600',
  variable: '--font-display',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Cue Radar',
  description: 'Career OS for independent contemporary dance, performance, and experimental sound artists.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${interTight.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen flex flex-col bg-bg text-fg font-mono">
        <TopBar />
        <main className="flex-1 w-full max-w-[1200px] mx-auto px-5 py-6">
          {children}
        </main>
        <Footer />
        <MobileNav />
      </body>
    </html>
  )
}
