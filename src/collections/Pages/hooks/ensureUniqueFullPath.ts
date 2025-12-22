import type { CollectionBeforeChangeHook } from 'payload'
import { ValidationError } from 'payload'

export const ensureUniqueFullPath: CollectionBeforeChangeHook = async ({ data, req, originalDoc }) => {
  if (data?._status !== 'published' || !data.fullPath || !data.tenant) return data

  const excludeSelf = originalDoc?.id
    ? { not_equals: originalDoc.id }
    : undefined

  const existing = await req.payload.find({
    collection: 'pages',
    where: {
      and: [
        { tenant: { equals: data.tenant } },
        { fullPath: { equals: data.fullPath } },
        ...(excludeSelf ? [{ id: excludeSelf }] : []),
      ],
    },
  })

  if (existing.docs.length > 0) {
    throw new ValidationError({
      errors: [{
          message: `A page with the full path "${data.fullPath}" already exists for this tenant.`,
          path: 'fullPath',
        }],
    })
  }

  return data
}
