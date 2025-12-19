import type { Access, FieldAccess } from 'payload'
import type { User } from '@/payload-types'

/**
 * Grants collection-level access only to users with the 'admin' role.
 *
 * @param req - Payload request containing the authenticated user
 * @returns `true` if the user has 'admin' role, otherwise `false`
 */
export const isAdmin: Access = ({ req }) => {
    if (!req?.user) {
        return false
    }
    return Boolean(req.user.role?.includes('admin'))
}

/**
 * Grants field-level access only to users with the 'admin' role.
 *
 * @param req - Payload request containing the authenticated user
 * @returns `true` if the user has 'admin' role, otherwise `false`
 */
export const isAdminFieldLevel: FieldAccess<{ id: string }, User> = ({ req: { user } }) => {

    return Boolean(user?.role?.includes('admin'))

}