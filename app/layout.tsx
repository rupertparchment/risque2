import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Risqué - Baltimore\'s Premier Lifestyle Club',
  description: 'Modern, clean, and professional lifestyle venue in Baltimore City. No wait rooms, discreet location, and exceptional service.',
  metadataBase: new URL('https://risque2.com'),
  openGraph: {
    title: 'Risqué - Baltimore\'s Premier Lifestyle Club',
    description: 'Modern, clean, and professional lifestyle venue in Baltimore City.',
    url: 'https://risque2.com',
    siteName: 'Risqué',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
