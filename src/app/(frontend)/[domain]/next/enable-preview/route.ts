/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { draftMode } from 'next/headers'

export async function GET(req: NextRequest) {
  const PREVIEW_SECRET = process.env.PREVIEW_SECRET
  if (!PREVIEW_SECRET) {
    return NextResponse.json({ message: 'PREVIEW_SECRET is not defined' }, { status: 500 })
  }

  const token = req.nextUrl.searchParams.get('token')
  if (!token) {
    return NextResponse.json({ message: 'Missing token' }, { status: 400 })
  }

  let decoded: any
  try {
    decoded = jwt.verify(token, PREVIEW_SECRET, { ignoreExpiration: false })
  } catch {
    return NextResponse.json({ message: 'Invalid token' }, { status: 403 })
  }

  const { domain, path } = decoded ?? {}

  // Basic validation
  if (!domain || typeof path !== 'string' || !path.startsWith('/')) {
    return NextResponse.json({ message: 'Invalid token payload' }, { status: 400 })
  }

  const dm = await draftMode()
  dm.enable()

  // Check if we're in development
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.redirect(`http://${domain}:3000${path}`)
  }
  
  // Check if we're on Vercel preview (staging)
  const isStaging = process.env.VERCEL_ENV === 'preview'
  const targetDomain = isStaging ? `staging.${domain}.com` : `${domain}.com`
  
  return NextResponse.redirect(`https://${targetDomain}${path}`)
}
