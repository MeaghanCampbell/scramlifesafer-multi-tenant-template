import type { CollectionConfig } from 'payload'
import { isTenantAdmin } from '@/access/isTenantAdmin';
import { link } from '@/fields/link'
import { revalidateNavigation } from './hooks/revalidateNavigation'
import { enforceSingleNavPerTenant } from './hooks/singleNavPerTenant'
import { isPayloadAdminPanel } from '@/utilities/isPayloadAdminPanel';
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished';

export const Navigations: CollectionConfig = {
    slug: 'navigations',
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
    admin: {
        defaultColumns: ['tenant', 'updatedAt'],
        group: 'Globals'
    },
    fields: [
        {
          name: 'navItems',
          type: 'array',
          fields: [
            {
              name: 'type',
              type: 'select',
              label: 'Nav Item Type',
              options: [
                { label: 'Link', value: 'link' },
                { label: 'Dropdown', value: 'dropdown' },
              ],
              required: true,
              defaultValue: 'link'
            },
            {
              name: 'link',
              type: 'group',
              label: '',
              admin: {
                condition: (_, { type } = {}) => ['link'].includes(type),
              },
              fields: [
                link({
                  appearances: false,
                }),
              ],
            },
            {
              name: 'dropdown',
              type: 'group',
              label: 'Dropdown',
              admin: {
                condition: (_, siblingData) => siblingData?.type === 'dropdown',
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Parent Title',
                  required: true,
                },
                {
                  name: 'items',
                  type: 'array',
                  label: 'Items',
                  fields: [
                    link({
                      appearances: false,
                    }),
                  ]
                }
              ]
            },
          ],
          maxRows: 6,
          admin: {
            components: {
                RowLabel: '@/components/Navigation/RowLabel#RowLabel',
            },
          },
        },
        {
          name: 'cta',
          type: 'array',
          label: 'CTA Button(s)',
          fields: [
            link({
              appearances: ['link', 'primary', 'secondary'],
            }),
          ],
          maxRows: 2,
        },
    ],
    hooks: {
        afterChange: [revalidateNavigation],
        beforeChange: [enforceSingleNavPerTenant]
    },
}