import type { Metadata } from 'next'
import React, { cache } from 'react'
import Script from 'next/script'
import { draftMode, headers } from 'next/headers'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import RichText from '@/components/RichText'
import { PostHero } from '@/heros/PostHero'
import { LivePreviewListener } from '@/components/LivePreviewListener'

import { generateSchemaFromPost } from '@/utilities/generateSchema'
import { generateMeta } from '@/utilities/generateMeta'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { Post } from '@/payload-types'

export const dynamicParams = true

type Args = {
  params: Promise<{
    domain: string
    slug?: string
  }>
}

export default async function PostPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { domain, slug = '' } = await paramsPromise

  const url = `/${domain}/blog/${slug}` // internal rewritten path
  const post = await queryPostBySlug({ domain, slug })

  if (!post) return <PayloadRedirects url={url} />

  const host = (await headers()).get('host')
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  const siteUrl = host
    ? `${protocol}://${host}`
    : (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.site-name.com')

  const schema = generateSchemaFromPost(
    post,
    siteUrl,
    'posts',
    'BlogPosting',
  )

  return (
    <>
      <article className="pt-16 pb-16">
        {/* Allows redirects for valid pages too */}
        <PayloadRedirects disableNotFound url={url} />

        {draft && <LivePreviewListener />}

        <PostHero post={post} />

        <div className="flex flex-col gap-4 pt-8 px-4 max-w-2xl mx-auto">
          <RichText data={post.content} />

          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <RelatedPosts
              className="mt-12 max-w-[52rem] lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
              docs={post.relatedPosts.filter((p) => typeof p === 'object')}
            />
          )}
        </div>
      </article>

      {schema && (
        <Script id="post-schema" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify(schema)}
        </Script>
      )}
    </>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { domain, slug = '' } = await paramsPromise
  const post = await queryPostBySlug({ domain, slug })
  return post ? generateMeta({ doc: post }) : {}
}

const queryPostBySlug = cache(async ({ domain, slug }: { domain: string; slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      and: [
        { slug: { equals: slug } },
        { 'tenant.domain': { equals: domain } }, // ✅ tenant filter
      ],
    },
  })

  return (result.docs?.[0] as Post) || null
})
