import type { CollectionConfig } from 'payload'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { isTenantAdmin } from '@/access/isTenantAdmin'
import { CallToAction } from '../../blocks/CallToAction/config'
import { FormBlock } from '../../blocks/Form/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { Spacer } from '@/blocks/Spacer/config'
import { Text } from '@/blocks/Text/config'
import { Modal } from '@/blocks/Modal/config'
import { hero } from '@/heros/config'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { isPayloadAdminPanel } from '@/utilities/isPayloadAdminPanel'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'
import meta from '@/fields/meta'
import { setFullPathFromParent } from './hooks/setFullPathFromParent'
import { ensureUniqueFullPath } from './hooks/ensureUniqueFullPath'
import { slugField } from '@/fields/slug'

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  indexes: [
    {
      fields: ['tenant', 'fullPath'],
      unique: true,
    },
  ],
  access: {
    create: isTenantAdmin,
    delete: isTenantAdmin,
    read: (args) => {
      if(isPayloadAdminPanel(args.req)) {
        return isTenantAdmin(args)
      }
      return authenticatedOrPublished(args)
    },    
    update: isTenantAdmin,
  },
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt', 'parent', '_status', 'tenant'],
    livePreview: {
      url: async ({ data, req }) => {
        const slugValue = data?.fullPath ?? data?.slug
        const slug = typeof slugValue === 'string' ? slugValue.trim() : ''
        const tenantID = typeof data?.tenant === 'string' ? data.tenant : null
    
        if (!slug || !tenantID) return null
    
        const tenant = await req.payload.findByID({
          collection: 'tenants',
          id: tenantID,
          depth: 0,
        })
    
        const domain = typeof tenant?.domain === 'string' ? tenant.domain : null
        if (!domain) return null
    
        return generatePreviewPath({
          collection: 'pages',
          slug,
          domain,
          req,
        })
      },
    },
    preview: async (data, { req }) => {
      const slugValue = data?.fullPath ?? data?.slug
      const slug = typeof slugValue === 'string' ? slugValue.trim() : ''
      const tenantID = typeof data?.tenant === 'string' ? data.tenant : null
    
      if (!slug || !tenantID) return null
    
      const tenant = await req.payload.findByID({
        collection: 'tenants',
        id: tenantID,
        depth: 0,
      })
    
      const domain = typeof tenant?.domain === 'string' ? tenant.domain : null
      if (!domain) return null
    
      return generatePreviewPath({
        collection: 'pages',
        slug,
        domain,
        req,
      })
    },
    
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: 'Hero',
        },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [CallToAction, MediaBlock, FormBlock, Spacer, Text, Modal],
              required: true,
            },
          ],
          label: 'Content',
        },
        {
          label: 'SEO',
          fields: [meta]
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'fullPath',
      type: 'text',
      admin: {
        hidden: true,
      }
    },
    ...slugField(),
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'pages',
      admin: {
        position: 'sidebar',
      },
      filterOptions: ({ data }) => ({
        tenant: { equals: data?.tenant }
      }),
    },
  ],
  hooks: {
    beforeChange: [populatePublishedAt, setFullPathFromParent, ensureUniqueFullPath ],
    afterChange: [revalidatePage],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 500,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
