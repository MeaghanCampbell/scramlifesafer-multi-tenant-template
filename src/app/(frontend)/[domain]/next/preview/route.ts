import type { CollectionSlug } from 'payload'
import { getPayload } from 'payload'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import configPromise from '@payload-config'

const PAYLOAD_TOKEN_COOKIE = 'payload-token'

export async function GET(req: NextRequest): Promise<Response> {
  const payload = await getPayload({ config: configPromise })

  const PREVIEW_SECRET = process.env.PREVIEW_SECRET
  if (!PREVIEW_SECRET) return new Response('PREVIEW_SECRET is not defined', { status: 500 })

  const { searchParams } = new URL(req.url)
  const path = searchParams.get('path')
  const collection = searchParams.get('collection') as CollectionSlug
  const slug = searchParams.get('slug')
  const domain = searchParams.get('domain')

  if (!path || !collection || !slug || !domain) {
    return new Response('Insufficient search params', { status: 404 })
  }

  if (!path.startsWith('/')) {
    return new Response('This endpoint can only be used for relative previews', { status: 500 })
  }

  // ✅ Require logged-in Payload session
  const payloadToken = req.cookies.get(PAYLOAD_TOKEN_COOKIE)?.value
  if (!payloadToken) return new Response('You are not allowed to preview this page', { status: 403 })

  try {
    jwt.verify(payloadToken, payload.secret)
  } catch {
    return new Response('You are not allowed to preview this page', { status: 403 })
  }

  // Mint short-lived tenant hop token
  const token = jwt.sign({ domain, path }, PREVIEW_SECRET, { expiresIn: '10m' })

  if (process.env.NODE_ENV === 'production') {
    redirect(`https://${domain}.com/next/enable-preview?token=${encodeURIComponent(token)}`)
  }
  redirect(`http://${domain}:3000/next/enable-preview?token=${encodeURIComponent(token)}`)
}
