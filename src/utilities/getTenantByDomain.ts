import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

async function _getTenantByDomain(domain: string) {
  const payload = await getPayload({ config: configPromise })

  const res = await payload.find({
    collection: 'tenants',
    limit: 1,
    pagination: false,
    where: {
      domain: { equals: domain },
    },
  })

  return res.docs?.[0] ?? null
}

export const getTenantByDomain = (domain: string) =>
  unstable_cache(
    () => _getTenantByDomain(domain),
    ['tenant_by_domain', domain],
    { tags: [`tenant_by_domain_${domain}`] },
  )()
