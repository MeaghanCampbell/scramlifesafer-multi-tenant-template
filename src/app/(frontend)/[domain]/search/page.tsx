import type { Metadata } from 'next/types'
import React from 'react'

import { CollectionArchive } from '@/components/CollectionArchive'
import { Search } from '@/search/Component'
import { CardPostData } from '@/components/Card'
import { Container } from '@/components/Container'
import { getTenantByDomain } from '@/utilities/getTenantByDomain'
import { headers } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

type Props = {
  params: Promise<{
    domain: string
  }>
  searchParams: Promise<{
    q?: string
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { domain } = await params

  const tenant = await getTenantByDomain(domain)
  const tenantName = tenant?.name ?? domain

  const title = `Blog | ${tenantName}`
  const description = `Explore articles, product updates, and insights from ${tenantName}.`

  const host = (await headers()).get("host")
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https"
  const origin = host ? `${protocol}://${host}` : ""
  const path = '/blog'
  const url = origin ? new URL(path, origin) : path

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: { title, description, url },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}

export default async function Page({ params: paramsPromise, searchParams: searchParamsPromise }: Props) {
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
    pagination: false,
    where: {
      and: [
  
        { 'tenant.domain': { equals: domain } },

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
