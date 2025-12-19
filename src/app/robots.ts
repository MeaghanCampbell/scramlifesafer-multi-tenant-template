import type { MetadataRoute } from 'next'

const rawBase = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.site-name.com'
const base = rawBase.replace(/\/+$/, '')

const isProd =
  process.env.NODE_ENV === 'production' ||
  /site-name\.com$/i.test(base)

export default function robots(): MetadataRoute.Robots {
  if (!isProd) {
    // Staging / preview
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
    }
  }

  // Production
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${base}/sitemap.xml`,
  }
}
