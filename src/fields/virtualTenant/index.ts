/**
 * Virtual Tenant Field
 *
 * Adds a Tenant field so super admin users can
 * view & filter collection items by tenant in
 * "all tenants" view
 */

import type { Field } from 'payload'
import { populateVirtualTenant } from './hooks/populateVirtualTenant'

const virtualTenant: Field =  {
    name: 'virtualTenant',
    label: 'Tenant Name',
    type: 'text',
    admin: {
      position: 'sidebar',
      readOnly: true,
    },
    hooks: {
      beforeChange: [populateVirtualTenant],
    }
}

export default virtualTenant
