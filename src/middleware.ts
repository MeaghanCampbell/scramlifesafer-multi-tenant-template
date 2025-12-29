import { NextResponse, NextRequest } from 'next/server'
import { setTrackingCookiesFromRequest } from './utilities/setTrackingCookies'
import { normalizeHost, tenantKeyFromDomain } from './utilities/normalizeHostDomain'

export const config = {
  matcher: ['/((?!api/|_next/|_static/|_vercel/|.*\\.(?!xml$)\\w+).*)'],
}

export function middleware(req: NextRequest) {

    const { nextUrl } = req
    const { pathname, search } = nextUrl
    const hostname = req.headers.get('host')
    const domain = normalizeHost(hostname) // sitename.com
    const tenantDomain = domain ? tenantKeyFromDomain(domain) : undefined // sitename

    if (
      pathname.startsWith('/_next/preview') ||
      pathname.startsWith('/api/preview') ||
      pathname.startsWith('/admin') ||
      !tenantDomain
    ) {
      return NextResponse.next()
    }
  
    const path = pathname === '/' ? '/home' : pathname
  
    // Internal rewrite for routing
    const rewriteUrl = nextUrl.clone()
    rewriteUrl.pathname = `/${tenantDomain}${path}`
    rewriteUrl.search = search
  
    const res = NextResponse.rewrite(rewriteUrl)
  
    // set cookies on the response
    setTrackingCookiesFromRequest(req, res)
  
    return res

}