import type { Metadata, Viewport } from 'next'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/components/Footer/Component'
import { Navigation } from '@/components/Navigation/Component'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'
import { getServerSideURL } from '@/utilities/getURL'
import { HoneypotSigProvider } from '@/components/HoneypotContext'
import { expectedSigFor } from '@/utilities/honeypotSign'

import './globals.css'

export default async function DomainLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ domain: string }>
}) {
  const { isEnabled } = await draftMode()
  const { domain } = await params
  const tsMs = Date.now()
  const hpSig = expectedSigFor(tsMs)
  const hpPair = `${tsMs}:${hpSig}`
  const language = 'en'

  return (
    <html lang={language}>
      <body data-tenant={domain}>

          {/* Tracking scripts here use next/script beforeInteractive or afterInteractive */}
          <HoneypotSigProvider sig={hpPair}>

            <AdminBar adminBarProps={{ preview: isEnabled }} />

            <Navigation />
              {children}
            <Footer />

          </HoneypotSigProvider>

      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  title: 'site-name',
  description: 'A website for site-name',
  robots: 'index, follow',
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    title: 'site-name',
    description: 'A website for site-name',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  maximumScale: 5,
}
