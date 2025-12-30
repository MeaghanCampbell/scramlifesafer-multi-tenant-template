/* eslint-disable @typescript-eslint/no-explicit-any */
import { parseCookies } from 'payload'
import type { Access } from 'payload'

export const isTenantAdmin: Access = ({ req, data }) => {
    
    const user = req?.user;
    if (!user) { return false }

    const cookies = parseCookies(req.headers)
    const selectedTenant = cookies.get('payload-tenant')

    const superAdmin = req?.user?.role?.includes('super-admin')
    const tenantAdmin = req?.user?.role?.includes('tenant-admin')

    if (superAdmin) {

      if (data?.tenant) {
        return true
      }
      
      if (selectedTenant && selectedTenant !== 'all-tenants') {
        return { tenant: { equals: selectedTenant } }
      }
      return true
    }

    if (tenantAdmin) {
      const tenantIDs = (user?.tenants ?? [])
        .map((t: any) => (typeof t === 'string' ? t : t?.tenant?.id ?? t?.tenant))
        .filter(Boolean) as string[]
  
      if (!tenantIDs.length) return false
      
      if (data?.tenant) {
        const targetTenantID = typeof data.tenant === 'string' ? data.tenant : data.tenant?.id
        if (tenantIDs.includes(targetTenantID)) {
          return true
        }
        return false
      }
      
      return { tenant: { in: tenantIDs } }
    }
  
  return false
}