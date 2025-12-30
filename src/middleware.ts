import { NextResponse, NextRequest } from 'next/server'
import { setTrackingCookiesFromRequest } from './utilities/setTrackingCookies'
import { normalizeHost, tenantKeyFromDomain } from './utilities/normalizeHostDomain'

/**
 * Middleware matcher configuration
 * Excludes API routes, Next.js internals, static files, and Vercel files
 * Includes XML files (for sitemaps)
 */
export const config = {
  matcher: ['/((?!api/|_next/|_static/|_vercel/|.*\\.(?!xml$)\\w+).*)'],
}

/**
 * Multi-tenant middleware
 * Rewrites incoming requests to tenant-specific paths based on domain
 */
export function middleware(req: NextRequest) {
  const { nextUrl } = req
  const { pathname, search } = nextUrl
  const hostname = req.headers.get('host')

  // Bypass middleware for API routes, Next.js internals, and admin panel
  if (pathname.startsWith('/api/') || pathname.startsWith('/_next/') || pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  // Extract tenant information from the hostname
  const domain = normalizeHost(hostname) // e.g., "example.com"
  const tenantDomain = domain ? tenantKeyFromDomain(domain) : undefined // e.g., "example"

  // If no tenant can be determined, pass through without rewriting
  if (!tenantDomain) {
    return NextResponse.next()
  }

  // Map root path to /home for tenant routing
  const path = pathname === '/' ? '/home' : pathname

  // Rewrite the URL to include tenant prefix for internal routing
  // e.g., /about -> /tenant-name/about
  const rewriteUrl = nextUrl.clone()
  rewriteUrl.pathname = `/${tenantDomain}${path}`
  rewriteUrl.search = search

  const res = NextResponse.rewrite(rewriteUrl)

  // Set tracking cookies on the response for analytics/tracking
  setTrackingCookiesFromRequest(req, res)

  return res
}