/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Page, MetaField } from '@/payload-types'

type SchemaArticle = {
  title: string
  slug?: string | null
  meta?: MetaField
  author?: string | null | undefined
  publishedAt?: string | null
  updatedAt: string
}

type CollectionType = 'posts' | 'news' | 'press' | 'product-updates' | 'events'

const collectionPaths: Record<CollectionType, string> = {
  posts: 'blog',
  news: 'newsroom/news',
  press: 'newsroom/press',
  'product-updates': 'newsroom/product-updates',
  events: 'events',
}

const normalizeBase = (baseUrl: string) => baseUrl.replace(/\/+$/, '')

const getImageUrl = (image: any): string | undefined => {
  if (!image) return undefined
  if (typeof image === 'string') return image || undefined
  if (typeof image === 'object' && 'url' in image) {
    const url = (image as any).url
    return typeof url === 'string' ? url || undefined : undefined
  }
  return undefined
}

const organizationSchema = (baseUrlRaw: string) => {
  const baseUrl = normalizeBase(baseUrlRaw)
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${baseUrl}/#org`,
    name: 'LifeSafer ISA',
    url: `${baseUrl}/`,
    description:
      'LifeSafer ISA provides intelligent speed assistance and speed limiting devices for court-mandated drivers, new drivers, and fleets.',
    parentOrganization: {
      '@type': 'Organization',
      name: 'LifeSafer',
      url: 'https://www.lifesafer.com/',
    },
    image:
      'https://www.lifesafer.com/wp-content/themes/lifesafer-2022/assets/img/lifesafer-cropped.svg',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.lifesafer.com/wp-content/themes/lifesafer-2022/assets/img/lifesafer-cropped.svg',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: '3630 Park 42 Drive, Suite 140E',
      addressLocality: 'Cincinnati',
      addressRegion: 'OH',
      postalCode: '45241',
      addressCountry: 'US',
    },
    telephone: '+1-800-234-5603',
    email: 'support@lifesaferisa.com',
    sameAs: [
      'https://www.instagram.com/lifesaferisa/',
      'https://www.linkedin.com/company/lifesafer-isa',
      'https://www.facebook.com/people/LifeSafer-Intelligent-Speed-Assistance/61565500260242/',
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+1-844-420-2216',
        contactType: 'sales',
        areaServed: 'US',
      },
    ],
  }
}

// const breadcrumbSchema = (baseUrlRaw: string, breadcrumbs: Page['breadcrumbs']) => {
//   if (!breadcrumbs?.length) return null
//   const baseUrl = normalizeBase(baseUrlRaw)

//   return {
//     '@context': 'https://schema.org',
//     '@type': 'BreadcrumbList',
//     itemListElement: breadcrumbs.map((crumb, index) => ({
//       '@type': 'ListItem',
//       position: index + 1,
//       name: (crumb?.label || '').replace(/\s+\(.*\)/, ''),
//       item: `${baseUrl}${crumb?.url || ''}`,
//     })),
//   }
// }

// Frequently Asked Questions

/** ────────────────────────────────────────────────────────────────────────────
 *  POSTS / NEWS / PRESS / PRODUCT-UPDATES / EVENTS
 *  Returns [Organization, WebSite, ArticleLike]
 *  ────────────────────────────────────────────────────────────────────────────
 */
export const generateSchemaFromPost = (
  doc: SchemaArticle,
  baseUrlRaw: string,
  collection: CollectionType,
  type: 'BlogPosting' | 'NewsArticle' | 'Article' = 'BlogPosting',
) => {
  const baseUrl = normalizeBase(baseUrlRaw)
  const { title, meta, slug, updatedAt, publishedAt } = doc
  const path = collectionPaths[collection]
  const fullUrl = `${baseUrl}/${path}/${slug}`

  const imageUrl = getImageUrl(meta?.image)

  const article = {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': `${fullUrl}#article`,
    headline: meta?.title || title,
    url: fullUrl,
    datePublished: publishedAt || undefined,
    dateModified: updatedAt || undefined,
    description: meta?.description || '',
    inLanguage: 'en-US',
    ...(imageUrl && {
      image: imageUrl,
      thumbnailUrl: imageUrl,
    }),
    publisher: { '@id': `${baseUrl}/#org` },
    isPartOf: { '@id': `${baseUrl}/#website` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${fullUrl}#webpage` },
  }

  return [organizationSchema(baseUrl), article]
}

/** ────────────────────────────────────────────────────────────────────────────
 *  PAGES
 *  Returns [Organization, WebPage, BreadcrumbList?]
 *  ────────────────────────────────────────────────────────────────────────────
 */
export const generateSchemaForPage = (data: Page, baseUrlRaw: string) => {
  const baseUrl = normalizeBase(baseUrlRaw)
  const { title, fullPath, meta, publishedAt, updatedAt, layout } = data
  const imageUrl = getImageUrl(meta?.image)

  const trimLeadingSlash = (s = '') => s.replace(/^\/+/, '')
  const joinUrl = (...parts: Array<string | undefined>) =>
    parts
      .filter(Boolean)
      .map(s => String(s))
      .join('/')
      .replace(/([^:]\/)\/+/g, '$1')
      .replace(/\/+$/, '')

  const fullUrl = joinUrl(
    baseUrl,
    trimLeadingSlash(fullPath || '')
  )

  const baseFields = {
    '@context': 'https://schema.org',
    '@id': `${fullUrl}#webpage`,
    name: meta?.title || title,
    url: fullUrl,
    description: meta?.description || '',
    ...(imageUrl && {
      image: imageUrl,
      thumbnailUrl: imageUrl,
      primaryImageOfPage: { '@type': 'ImageObject', url: imageUrl },
    }),
    datePublished: publishedAt || undefined,
    dateModified: updatedAt || undefined,
    inLanguage: 'en-US',
    isPartOf: { '@id': `${baseUrl}/#website` },
    publisher: { '@id': `${baseUrl}/#org` },
  }

  const richTextToPlain = (node: any): string => {
    try {
      const walk = (n: any): string => {
        if (!n) return ''
        if (typeof n === 'string') return n
        if (typeof n.text === 'string') return n.text
        if (Array.isArray(n)) return n.map(walk).join('')
        if (Array.isArray(n.children)) return n.children.map(walk).join('')
        if (typeof n.root === 'object') return walk(n.root)
        return ''
      }
      return walk(node).trim()
    } catch {
      return ''
    }
  }

  const getFaqEntities = (items: any[] = []) =>
    items.flatMap((item) =>
      item?.blockType === 'faq'
        ? (item?.faqData ?? []).map((faq: any) => ({
            '@type': 'Question',
            name: String(faq?.question ?? ''),
            acceptedAnswer: {
              '@type': 'Answer',
              text: richTextToPlain(faq?.answer),
            },
          }))
        : []
    )

  const faqEntities = getFaqEntities(layout as any[])
  const looksLikeFaqPage =
      faqEntities.length > 0 || (title && title.trim().toLowerCase() === 'frequently asked questions')
  
  const pageSchema = {
      ...baseFields,
      '@type': looksLikeFaqPage ? 'FAQPage' : 'WebPage',
      ...(looksLikeFaqPage ? { mainEntity: faqEntities } : {}),
  }
  

  // const crumbs = breadcrumbSchema(baseUrl, breadcrumbs)

  return [
    organizationSchema(baseUrl),
    pageSchema,
    // ...(crumbs ? [crumbs] : []),
  ]
}