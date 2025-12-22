// This function ensures that the slug field is unique based on tenant

import type { FieldHook } from 'payload'
import { ValidationError } from 'payload'

export const ensureUniqueSlug: FieldHook = async ({ data, req, value, originalDoc, collection }) => {

    if (collection?.slug === 'pages') {
      // Skip this hook entirely for pages
      return value
    }
    
    if (collection?.slug) {
    
      // ensures you're fetching the latest published version of originalDoc
      // Need to have this if autosave is going to be on
      const publishedDoc = originalDoc?.id
        ? await req.payload.findByID({
            collection: collection?.slug,
            id: originalDoc.id,
            depth: 0,
            draft: false,
          })
        : null;

      // If the value hasn't changed, skip validation
      if (publishedDoc && 'slug' in publishedDoc && publishedDoc.slug === value) {
          return value;
        }

      if(data?.tenant) {
          const TenantID = typeof data?.tenant === 'object' ? data.tenant.id : data?.tenant

          const findDuplicatePages = await req.payload.find({
            collection: collection?.slug,
            where: {
              and: [
                {
                  tenant: {
                    equals: TenantID,
                  },
                },
                {
                  slug: {
                    equals: value,
                  },
                },
              ],
            },
          })

          if (findDuplicatePages.docs.length > 0 && req.user) {
              throw new ValidationError({
                errors: [
                  {
                    message: `A page with the slug "${value}" already exists for this tenant.`,
                    path: 'slug',
                  },
                ],
              });
          }
      }

      return value;
    }
}