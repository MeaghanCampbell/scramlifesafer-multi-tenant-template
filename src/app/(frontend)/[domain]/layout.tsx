import type { Metadata, Viewport } from 'next'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/components/Footer/Component'
import { Navigation } from '@/components/Navigation/Component'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'
import { getServerSideURL } from '@/utilities/getURL'
import { HoneypotSigProvider } from '@/components/HoneypotContext'
import { GoogleTagManager } from '@next/third-parties/google'
import { expectedSigFor } from '@/utilities/honeypotSign'
import Script from 'next/script'

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

          {/* GTM & Osano Scripts - Replace GTM Container ID & Osano src to work for your site */}
          {/* <GoogleTagManager gtmId='GTM-XXXXX' /> */}
          {/* <Script id="osano" strategy='lazyOnload' src="https://cmp.osano.com/AzZMwZTuSswkf3YSk/5396eee0-1243-4e3f-a82f-3215eb8dec93/osano.js" /> */}
          {/* <noscript>
            <iframe src='https://www.googletagmanager.com/ns.html?id=GTM-XXXXX' height="0" width="0" style={{display:'none', visibility:'hidden'}}></iframe>
          </noscript> */}

          <HoneypotSigProvider sig={hpPair}>

            <AdminBar adminBarProps={{ preview: isEnabled }} />

            <Navigation domain={domain} />
              {children}
            <Footer domain={domain} />

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
