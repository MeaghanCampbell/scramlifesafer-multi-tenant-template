import type { Metadata } from 'next/types'
import React from 'react'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { Container } from '@/components/Container'
import { getTenantByDomain } from '@/utilities/getTenantByDomain'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { headers } from 'next/headers'

export const dynamic = 'force-static'
export const revalidate = 600

type Props = {
  params: Promise<{
    domain: string
  }>
  searchParams?: Promise<{
    page?: string
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

export default async function Page({ params, searchParams }: Props) {
  const { domain } = await params
  const sp = (await searchParams) ?? {}
  const currentPage = sp.page ? Number(sp.page) : 1

  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    page: Number.isFinite(currentPage) && currentPage > 0 ? currentPage : 1,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      meta: true,
    },
    where: {
      and: [
        { 'tenant.domain': { equals: domain } }, // ✅ tenant filter
      ],
    },
  })

  return (
    <Container className="pt-24 pb-24">
      <h1>Blog</h1>

      <div className="mb-8">
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={12}
          totalDocs={posts.totalDocs}
        />
      </div>

      <CollectionArchive posts={posts.docs} />

      {posts.totalPages > 1 && posts.page && (
        <Pagination page={posts.page} totalPages={posts.totalPages} />
      )}
    </Container>
  )
}
