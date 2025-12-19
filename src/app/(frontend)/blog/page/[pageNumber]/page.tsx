import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import { notFound } from 'next/navigation'
import { Container } from '@/components/Container'

export const revalidate = 600

type PageParams = {
  pageNumber: string
}

type Args = {
  params: Promise<PageParams>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { pageNumber } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const sanitizedPageNumber = Number(pageNumber)

  if (!Number.isInteger(sanitizedPageNumber)) notFound()

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    page: sanitizedPageNumber,
    overrideAccess: false,
  })

  return (
    <Container className="pt-24 pb-24">
      <h1>Posts</h1>
      <div className="mb-8">
        <PageRange
              collection="posts"
              currentPage={posts.page}
              limit={12}
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

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const { totalDocs } = await payload.count({
    collection: 'posts',
    overrideAccess: false,
  })

  const totalPages = Math.ceil(totalDocs / 10)

  const pages: { pageNumber: string }[] = []

  for (let i = 1; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) })
  }

  return pages
}

export async function generateMetadata(
  { params }: { params: Promise<PageParams> }
): Promise<Metadata> {
  const { pageNumber } = await params

  return {
    title: 'Blog | site-name',
    description: 'Explore articles, product updates, and insights from site-name.',
    openGraph: {
      title: 'Blog | site-name',
      description: 'Explore articles, product updates, and insights from site-name.',
      url: `/blog/page/${pageNumber}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Blog | site-name',
      description: 'Explore articles, product updates, and insights from site-name.',
    },
  }
}
