import type { CollectionConfig } from 'payload'
import { isSuperAdminAccess } from '@/access/isSuperAdmin'

export const Tenants: CollectionConfig = {
    slug: 'tenants',
    access: {
        create: isSuperAdminAccess,
        delete: isSuperAdminAccess,
        update: isSuperAdminAccess,
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