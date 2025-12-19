import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { Tenant } from '@/payload-types'
import { headers } from 'next/headers';

/**
 * Resolve the current tenant based on the request Host header.
 * This should be called in Server Components / route handlers only.
 */
export async function getTenantFromHeaders(): Promise<Tenant | null> {
  const headersList = await headers()
  const rawHost = headersList.get('host')
  if (!rawHost) return null
  const host = rawHost.toLowerCase().replace(/^www\./, '')

  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'tenants',
    limit: 1,
    where: {
      domain: {
        equals: host,
      },
    },
  })

  return docs[0] ?? null
}
