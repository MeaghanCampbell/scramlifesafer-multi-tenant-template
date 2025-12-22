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
import { setFullPathFromBreadcrumbs } from './hooks/setFullPathFromBreadcrumbs'
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
      url: ({ data, req }) => {
        const slugValue = (data?.fullPath ?? data?.slug)
        const slug = typeof slugValue === 'string' ? slugValue.trim() : ''
        if (!slug) return ''
      
        return generatePreviewPath({
          collection: 'pages',
          slug: slug,
          req
        })
      },
    },
    preview: (data, { req }) => {
      const slugValue = (data?.fullPath ?? data?.slug)
      const slug = typeof slugValue === 'string' ? slugValue.trim() : ''
      if (!slug) return ''
    
      return generatePreviewPath({
        collection: 'pages',
        slug: slug,
        req
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
              admin: {
                initCollapsed: true,
              },
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
    ...slugField()
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt, setFullPathFromBreadcrumbs, ensureUniqueFullPath ],
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
