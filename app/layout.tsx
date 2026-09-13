import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cue Radar",
  description: "Career OS for independent contemporary dance, performance and experimental sound artists",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
<<<<<<< Updated upstream
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
=======
      suppressHydrationWarning
      className={`${interTight.variable} ${jetbrainsMono.variable} h-full antialiased bg-[#0B0B0C] text-[#EDEDED]`}
>>>>>>> Stashed changes
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
