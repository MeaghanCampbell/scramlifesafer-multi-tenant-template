import { NextResponse, NextRequest } from 'next/server'
import { setTrackingCookiesFromRequest } from './utilities/setTrackingCookies'

export const config = {
  matcher: ['/((?!api/|_next/|_static/|_vercel/|[\\w-]+\\.\\w+).*)'],
}

export function middleware(req: NextRequest) {

    const { nextUrl } = req
    const { pathname, search } = nextUrl
    const hostname = req.headers.get('host')
    let tenantDomain: string | undefined

    if (hostname) {
      const normalizedHost = hostname.startsWith('www.') ? hostname.slice(4) : hostname
  
      if (process.env.NODE_ENV === 'production') {
        // website.com -> website
        tenantDomain = normalizedHost.replace(/\.[^/.]+$/, '')
      } else {
        // localhost:3000 -> localhost
        tenantDomain = normalizedHost.replace(/:\d+$/, '')
      }
    }

    if (
      pathname.startsWith('/_next/preview') ||
      pathname.startsWith('/api/preview') ||
      pathname.startsWith('/admin') ||
      !tenantDomain
    ) {
      return NextResponse.next()
    }
  
    const path = pathname === '/' ? '/home' : pathname
  
    const rewriteUrl = nextUrl.clone()
    rewriteUrl.pathname = `/${tenantDomain}${path}`
    rewriteUrl.search = search
  
    const res = NextResponse.rewrite(rewriteUrl)
  
    // set cookies on the response
    setTrackingCookiesFromRequest(req, res)
  
    return res

}