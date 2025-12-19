import type { Access, FieldAccess } from 'payload'
import type { User } from '@/payload-types'

/**
 * Grants access to users with the 'editor' or 'admin' role.
 *
 * @param req - Payload request containing the authenticated user
 * @returns `true` if the user has 'editor' or 'admin' role, otherwise `false`
 */
export const isEditor: Access = ({ req }) => {
    if (!req?.user) {
        return false
    }
    if (req.user.role?.includes('editor') || req.user.role?.includes('admin')) {
        return true
    }
    return false
}

/**
 * Grants field-level access only to users with the 'editor' or 'admin' role.
 *
 * @param req - Payload request containing the authenticated user
 * @returns `true` if the user has 'editor' or 'admin' role, otherwise `false`
 */
export const isEditorFieldLevel: FieldAccess<{ id: string }, User> = ({ req: { user } }) => {

    if (user?.role?.includes('editor') || user?.role?.includes('admin')) {
        return true
    }
    return false

}