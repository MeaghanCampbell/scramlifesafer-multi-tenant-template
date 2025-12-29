import { PayloadRequest, CollectionSlug } from 'payload'

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  posts: '/blog',
  pages: '',
}

type Props = {
  collection: keyof typeof collectionPrefixMap
  slug: string
  domain: string
  req: PayloadRequest
}

export const generatePreviewPath = ({ collection, slug, domain }: Props) => {
  // Allow empty strings, e.g. for the homepage
  if (slug === undefined || slug === null) {
    return null
  }

  const path = `${collectionPrefixMap[collection] ?? ''}/${slug}`.replace(/\/+/g, '/')

  const params = new URLSearchParams({
    slug,
    collection,
    domain,
    path,
  })

  const url = `/next/preview?${params.toString()}`

  return url
}
