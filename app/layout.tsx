import type { Metadata } from 'next'
import { Archivo, Manrope } from 'next/font/google'
import TopBar from '@/components/layout/TopBar'
import MobileNav from '@/components/layout/MobileNav'
import Footer from '@/components/layout/Footer'
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
    <html lang="en" className={`${archivo.variable} ${manrope.variable}`}>
      <body className="min-h-screen flex flex-col bg-bg text-fg font-body antialiased">
        <TopBar />
        <main className="flex-1 w-full mx-auto pb-[72px] md:pb-0">
          {children}
        </main>
        <Footer />
        <MobileNav />
      </body>
    </html>
  )
}
