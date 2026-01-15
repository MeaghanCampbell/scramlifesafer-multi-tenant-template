import type { Metadata } from 'next/types'
import React from 'react'
import { notFound } from 'next/navigation'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { Container } from '@/components/Container'
import { headers } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { getTenantByDomain } from '@/utilities/getTenantByDomain'

export const revalidate = 600
export const dynamicParams = true

const LIMIT = 12

type PageParams = {
  domain: string
  pageNumber: string
}

type Args = {
  params: Promise<PageParams>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { domain, pageNumber } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const sanitizedPageNumber = Number(pageNumber)
  if (!Number.isInteger(sanitizedPageNumber) || sanitizedPageNumber < 1) notFound()

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: LIMIT,
    page: sanitizedPageNumber,
    overrideAccess: false,
    where: {
      and: [{ 'tenant.domain': { equals: domain } }],
    },
  })

  // if someone requests a page beyond the last page, 404
  if (posts.totalPages > 0 && sanitizedPageNumber > posts.totalPages) notFound()

  return (
    <Container className="pt-24 pb-24">
      <h1>Posts</h1>

      <div className="mb-8">
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={LIMIT}
          totalDocs={posts.totalDocs}
        />
      </div>

      <CollectionArchive posts={posts.docs} />

      {posts?.page && posts?.totalPages > 1 && (
        <Pagination page={posts.page} totalPages={posts.totalPages} />
      )}
    </Container>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>
}): Promise<Metadata> {
  const { domain, pageNumber } = await params

  const page = Number(pageNumber)
  // If you prefer 404 here too (instead of a generic metadata):
  if (!Number.isInteger(page) || page < 1) notFound()

  const tenant = await getTenantByDomain(domain)
  const tenantName = tenant?.name ?? domain

  const baseTitle = `Blog | ${tenantName}`
  const title = page > 1 ? `${baseTitle} (Page ${page})` : baseTitle

  const description = `Explore articles, product updates, and insights from ${tenantName}.`

  const host = (await headers()).get("host")
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https"
  const origin = host ? `${protocol}://${host}` : ""
  const path = `/blog/page/${pageNumber}`
  const url = origin ? new URL(path, origin) : path

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}
