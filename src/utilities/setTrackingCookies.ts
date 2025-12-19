import type { NextRequest, NextResponse } from 'next/server'

export const TRACKING_QUERY_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'gclid',
  'enrollmentcode'
]

export function setTrackingCookiesFromRequest(req: NextRequest, res: NextResponse) {
  for (const key of TRACKING_QUERY_KEYS) {
    const val = req.nextUrl.searchParams.get(key)
    if (val) {
      res.cookies.set({
        name: key,
        value: encodeURIComponent(val),
        path: '/',
        maxAge: 60 * 60 * 24 * 365, // 1 year
        sameSite: 'lax',
        secure: true,
      })
    }
  }
}