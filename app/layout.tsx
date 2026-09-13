import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Cue Radar — Career OS for Independent Artists',
  description: 'Aggregating open calls, funding opportunities, and residencies for alternative scene artists.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased bg-[#0B0B0C] text-[#EDEDED]`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
