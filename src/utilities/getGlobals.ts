import type { Config } from 'src/payload-types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

type Collection = keyof Config['collections']

async function getGlobals<T>(collection: Collection, tenantId: string, depth = 0): Promise<T | null> {
  const payload = await getPayload({ config: configPromise })

  const res = await payload.find({
    collection,
    depth,
    limit: 1,
    where: {
      tenant: { equals: tenantId },
    },
  })

  return (res.docs[0] as T | undefined) ?? null
}

/**
 * Cache one singleton doc per tenant per collection.
 */
export const getCachedGlobal = <T>(collection: Collection, tenantId: string, depth = 0) =>
  unstable_cache(
    async () => getGlobals<T>(collection, tenantId, depth),
    [String(collection), tenantId, String(depth)],
    {
      tags: [`${String(collection)}_${tenantId}`],
    },
  )

