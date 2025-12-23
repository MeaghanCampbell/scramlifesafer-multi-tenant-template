import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Page } from '@/payload-types'
import { draftMode } from 'next/headers'

export async function fetchPageBySlug(args: {
  domain: string
  fullPath: string
}): Promise<Page | null> {
  const { domain, fullPath } = args

  const { isEnabled: draftEnabled } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const page = await payload.find({
    collection: 'pages',
    draft: draftEnabled,
    limit: 1,
    overrideAccess: draftEnabled,
    where: {
      and: [
        { fullPath: { equals: fullPath } },
        // ✅ Multi-tenant plugin relationship field on the doc:
        { 'tenant.domain': { equals: domain } },
      ],
    },
  })

  return page.docs?.[0] || null
}
