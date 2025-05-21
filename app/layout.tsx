import type React from 'react'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Intuipay - Where Global Education Meets Next-Gen Payments',
  description:
    'Support global universities and pay tuition & make donation across borders — with speed, trust, and simplicity.',
  keywords: [
    'global education',
    'international payments',
    'tuition payments',
    'cross-border payments',
    'education finance',
  ],
  authors: [{ name: 'Intuipay' }],
  creator: 'Intuipay',
  publisher: 'Intuipay',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://intuipay.com',
    title: 'Intuipay - Where Global Education Meets Next-Gen Payments',
    description:
      'Support global universities and pay tuition & make donation across borders — with speed, trust, and simplicity.',
    siteName: 'Intuipay',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Intuipay - Global Education Payments',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Intuipay - Where Global Education Meets Next-Gen Payments',
    description:
      'Support global universities and pay tuition & make donation across borders — with speed, trust, and simplicity.',
    images: ['/images/twitter-image.png'],
  },
  alternates: {
    canonical: 'https://intuipay.com',
  },
    generator: 'v0.dev'
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
