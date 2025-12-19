import { NextResponse, NextRequest } from 'next/server'
import { setTrackingCookiesFromRequest } from './utilities/setTrackingCookies'

export function middleware(request: NextRequest) {

    const response = NextResponse.next()
    setTrackingCookiesFromRequest(request, response)

    return response
    
}

export const config = {
    matcher: [
      {
        source: '/((?!api/|_next/|_static/|_vercel/|sitemap\\.xml|robots\\.txt|[\\w-]+\\.\\w+).*)',
        missing: [
          { type: 'header', key: 'purpose', value: 'prefetch' },
          { type: 'header', key: 'next-router-prefetch' },
        ],
      },
    ],
}