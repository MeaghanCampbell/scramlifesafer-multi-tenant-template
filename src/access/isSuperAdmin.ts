import type { Access, FieldAccess } from 'payload'
import { User } from "@/payload-types"

export const isSuperAdmin: Access = ({ req }) => {
    if (!req?.user) {
        return false
    }
    return Boolean(req.user.role?.includes('super-admin'))
}

export const isSuperAdminFieldLevel: FieldAccess<{ id: string }, User> = ({ req: { user } }) => {

    return Boolean(user?.role?.includes('super-admin'))

}