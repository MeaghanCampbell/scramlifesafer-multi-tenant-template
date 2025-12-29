import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { NextRequest } from 'next/server'
import { getTenantByDomain } from '@/utilities/getTenantByDomain'
import { normalizeHost } from '@/utilities/normalizeHostDomain'

const getPostsSitemap = unstable_cache(
  async (tenantID: string, siteURL: string) => {
    const payload = await getPayload({ config })

    const results = await payload.find({
      collection: 'posts',
      overrideAccess: false,
      draft: false,
      depth: 0,
      limit: 1000,
      pagination: false,
      where: {
        and: [
          { _status: { equals: 'published' } },
          { tenant: { equals: tenantID } }, // tenant-scoped
          { 'meta.hideFromSearch': { not_equals: true } },
        ],
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    const dateFallback = new Date().toISOString()

    const sitemap = results.docs
    ? results.docs.map((post) => {
        const path = `/blog/${post.slug}`
        return {
          loc: `${siteURL}${path}`,
          lastmod: post.updatedAt || dateFallback,
        }
      })
    : []

    return sitemap
  },
  ['posts-sitemap'],
  { tags: ['posts-sitemap'] }
)

export async function GET(req: NextRequest) {
  const host = req.headers.get('host')
  if (!host) return getServerSideSitemap([])

  const domain = normalizeHost(host) // sitename.com
  if (!domain) return getServerSideSitemap([])
  const tenant = await getTenantByDomain(domain)
  if (!tenant) return getServerSideSitemap([])

  const siteURL = `https://${domain}`

  const sitemap = await getPostsSitemap(String(tenant.id), siteURL)
  return getServerSideSitemap(sitemap)
}
