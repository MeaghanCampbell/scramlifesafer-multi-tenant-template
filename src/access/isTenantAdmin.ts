import { parseCookies } from 'payload'
import type { Access } from 'payload'

export const isTenantAdmin: Access = ({ req }) => {
    
    const user = req?.user;
    const cookies = parseCookies(req.headers)
    const superAdmin = req?.user?.role?.includes('super-admin')
    const tenantAdmin = req?.user?.role?.includes('tenant-admin')
    const selectedTenant = cookies.get('payload-tenant')

    
    if (!user) {
        return false;
    }

    if(superAdmin) {
        if(selectedTenant != undefined && selectedTenant != 'all-tenants') {

            return {
                tenant: {
                    equals: selectedTenant
                }
            }
        } 
        return true
    }

    if (tenantAdmin) {
        const tenants = req.user?.tenants
      
        if (Array.isArray(tenants) && tenants.length > 0) {
          const tenantIDs = tenants
            .map((t) => {
              if (typeof t === 'string') return t
              if (typeof t === 'object' && t !== null && 'id' in t) return t.id
              return null
            })
            .filter(Boolean) as string[]
      
          if (tenantIDs.length === 0) return false
      
          return {
            tenant: {
              in: tenantIDs,
            },
          }
        }
    }


    return false
};
