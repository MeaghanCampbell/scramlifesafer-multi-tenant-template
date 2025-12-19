import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '@/access/isSuperAdmin'

export const Tenants: CollectionConfig = {
    slug: 'tenants',
    access: {
        create: isSuperAdmin,
        delete: isSuperAdmin,
        update: isSuperAdmin,
        read: () => true,
    },
    admin: { 
        useAsTitle: 'name' 
    },
    fields: [
        { 
            name: 'name', 
            type: 'text', 
            required: true 
        },
        { 
            name: 'domain', 
            type: 'text', 
            required: true 
        },
    ],
}