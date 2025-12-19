import type { Metadata } from 'next'

import { draftMode } from 'next/headers'
import React from 'react'
import { fetchPageBySlug } from '@/utilities/fetchPageBySlug'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import NotFound from '@/app/(frontend)/not-found'
import { generateSchemaForPage } from '@/utilities/generateSchema'
import Script from 'next/script'

export const dynamicParams = true;

type PageProps = {
  params: Promise<{
    slug: string[]
  }>
}

async function getPageData(slugParam?: string[]) {
  const segments = slugParam ?? []
  const fullPath = segments.length > 0 ? segments.join('/') : 'home'
  const page = await fetchPageBySlug(fullPath)
  return { page, fullPath }
}

export default async function Page({ params }: PageProps) {
  
  const { isEnabled: draft } = await draftMode()
  const { slug } = await params
  const { page } = await getPageData(slug)

  if (!page) return <NotFound />

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.site-name.com'
  const webPageSchema = generateSchemaForPage(page, siteUrl)

  return (
    <article>
      {draft && <LivePreviewListener />}

      <RenderHero {...page.hero} />
      <RenderBlocks blocks={page.layout} />
      {webPageSchema && (
        <Script id="structured-data" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify(webPageSchema)}
        </Script>
      )}
    </article>
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const { page } = await getPageData(slug)
  return page ? generateMeta({ doc: page }) : {}
}
