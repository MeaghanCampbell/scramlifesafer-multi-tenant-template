import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { NextRequest } from 'next/server'
import { getTenantByDomain } from '@/utilities/getTenantByDomain'
import { normalizeHost } from '@/utilities/normalizeHostDomain'

const getPagesSitemap = unstable_cache(
  async (tenantID: string, siteURL: string) => {
    const payload = await getPayload({ config })

    const results = await payload.find({
      collection: 'pages',
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
        fullPath: true,
        updatedAt: true,
      },
    })

    const dateFallback = new Date().toISOString()

    const defaultSitemap = [
      { loc: `${siteURL}/search`, lastmod: dateFallback },
      { loc: `${siteURL}/blog`, lastmod: dateFallback },
    ]

    const sitemap = results.docs
      ? results.docs.map((page) => {
          const path = page.fullPath === 'home' ? '' : `/${page.fullPath}`
          return {
            loc: `${siteURL}${path}`,
            lastmod: page.updatedAt || dateFallback,
          }
        })
      : []

    return [...defaultSitemap, ...sitemap]
  },
  ['pages-sitemap'],
  { tags: ['pages-sitemap'] }
)

export async function GET(req: NextRequest) {
  const host = req.headers.get('host')
  if (!host) return getServerSideSitemap([])

  const domain = normalizeHost(host) // sitename.com
  if (!domain) return getServerSideSitemap([])
  const tenant = await getTenantByDomain(domain)
  if (!tenant) return getServerSideSitemap([])

  const siteURL = `https://${domain}`

  const sitemap = await getPagesSitemap(String(tenant.id), siteURL)
  return getServerSideSitemap(sitemap)
}
