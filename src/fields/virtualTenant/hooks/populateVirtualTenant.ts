import type { FieldHook } from 'payload'

export const populateVirtualTenant: FieldHook = async ({ data, req, operation }) => {
  if (operation === 'create' || operation === 'update') {
    const tenantId = typeof data?.tenant === 'string' ? data.tenant : data?.tenant?.id
    
    if (tenantId) {
      try {
        const tenant = await req.payload.findByID({
          collection: 'tenants',
          id: tenantId,
          depth: 0,
        })
        return tenant?.name || tenantId
      } catch (error) {
        console.error('Error fetching tenant name:', error)
        return tenantId
      }
    }
  }
  
  return ''
}