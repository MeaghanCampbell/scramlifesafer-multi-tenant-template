import type { Access, FieldAccess } from 'payload'
import { User } from "@/payload-types"

export const isSuperAdminAccess: Access = ({ req }): boolean => {
    return isSuperAdmin(req.user)
  }

export const isSuperAdmin = (user: User | null): boolean => {
    return Boolean(user?.role?.includes('super-admin'))
}

export const isSuperAdminFieldLevel: FieldAccess<{ id: string }, User> = ({ req: { user } }) => {

    return Boolean(user?.role?.includes('super-admin'))

}