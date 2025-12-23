import type { Metadata } from 'next/types'
import React from 'react'

import { CollectionArchive } from '@/components/CollectionArchive'
import { Search } from '@/search/Component'
import { CardPostData } from '@/components/Card'
import { Container } from '@/components/Container'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const metadata: Metadata = {
  title: 'Search | site-name',
  description: 'Search site-name for solutions.',
  openGraph: {
    title: 'Search | site-name',
    description: 'Search site-name for solutions.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Search | site-name',
    description: 'Search site-name for solutions.',
  },
}

type Args = {
  params: Promise<{
    domain: string
  }>
  searchParams: Promise<{
    q?: string
  }>
}

export default async function Page({ params: paramsPromise, searchParams: searchParamsPromise }: Args) {
  const { domain } = await paramsPromise
  const { q: query } = await searchParamsPromise

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'search',
    depth: 1,
    limit: 12,
    select: {
      title: true,
      slug: true,
      meta: true,
    },
    pagination: false, // keep it lightweight
    where: {
      and: [
        // ✅ tenant filter (assumes search docs have tenant relationship like pages/posts)
        { 'tenant.domain': { equals: domain } },

        // ✅ only apply query filters if q is present
        ...(query
          ? [
              {
                or: [
                  { title: { like: query } },
                  { 'meta.description': { like: query } },
                  { 'meta.title': { like: query } },
                  { slug: { like: query } },
                ],
              },
            ]
          : []),
      ],
    },
  })

  const docs = result.docs as unknown as CardPostData[]
  const hasResults = docs.length > 0

  return (
    <div className="pt-24 pb-24">
      <Container className="mb-16">
        <div className="prose dark:prose-invert max-w-none text-center">
          <h1 className="mb-8 lg:mb-16">Search</h1>

          <div className="max-w-[50rem] mx-auto">
            <Search />
          </div>
        </div>
      </Container>

      {hasResults ? <CollectionArchive posts={docs} /> : <Container>No results found.</Container>}
    </div>
  )
}
