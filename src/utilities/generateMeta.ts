import type { Metadata } from 'next'

import type { Media, Page, Post, Config } from '../payload-types'
import { headers } from 'next/headers'
import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

const getImageURL = async (
  image?: Media | Config['db']['defaultIDType'] | null,
): Promise<string> => {
  const host = (await headers()).get('host')
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'

  const metadataBase = host
    ? new URL(`${protocol}://${host}`)
    : new URL(getServerSideURL())

  // default OG image
  let url = new URL('/website-template-OG.webp', metadataBase).toString()

  if (image && typeof image === 'object' && 'url' in image && image.url) {
    const ogUrl = image.sizes?.og?.url
    url = new URL(ogUrl ?? image.url, metadataBase).toString()
  }

  return url
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
}): Promise<Metadata> => {
  const { doc } = args

  const ogImage = await getImageURL(doc?.meta?.image)

  const title = doc?.meta?.title ?? 'site-name'
  const description = doc?.meta?.description ?? ''

  const path = Array.isArray(doc?.slug) ? `/${doc.slug.join('/')}` : (doc?.slug ? `/${doc.slug}` : '/')

  return {
    description,
    openGraph: mergeOpenGraph({
      title,
      description,
      url: path,
      images: ogImage
        ? [{ url: ogImage }]
        : undefined,
    }),
    title,
  }
}
