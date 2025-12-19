import { isTenantAdmin } from '@/access/isTenantAdmin';
import type { CollectionConfig } from 'payload'
import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished';
import { isPayloadAdminPanel } from '@/utilities/isPayloadAdminPanel';

export const Footers: CollectionConfig = {
    slug: 'footers',
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
        defaultColumns: ['tenant', 'updatedAt']
    },
    fields: [
        {
          name: 'navItems',
          label: 'Footer Items',
          type: 'array',
          fields: [
            link({
              appearances: false,
            }),
          ],
          maxRows: 6,
          admin: {
            components: {
              RowLabel: '@/components/Footer/RowLabel#RowLabel',
            },
          },
        },
    ],
    hooks: {
        afterChange: [revalidateFooter],
    },
}