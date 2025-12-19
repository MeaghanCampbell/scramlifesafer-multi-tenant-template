import type { Access } from 'payload'

/**
 * Grants access only to the authenticated user for their own document.
 *
 * @param req - Payload request containing the authenticated user
 * @returns A filter matching the user's own ID, or `false` if not authenticated
 */
export const isSelf: Access = ({ req: { user } }) => {
    if (user) {
        return {
            id: {
                equals: user.id
            }
        }
    }
    return false
}

/**
 * Grants access to admins, or to the authenticated user for their own document.
 *
 * @param req - Payload request containing the authenticated user
 * @returns `true` for admins, or a filter matching the user's own ID
 */
export const isAdminOrSelf: Access = ({ req: { user } }) => {
    if (user) {
        if (user.role?.includes('admin')) {
            return true
        }
        return {
            id: {
                equals: user.id
            }
        }
    }
    return false
}


export const isSuperAdminOrSelf: Access = ({ req: {user} }) => {

    if(user) {

        if(user.role?.includes('super-admin')) {
            return true
        }

        return {
            id: {
                equals: user.id
            }
        }
        
    }

    return false

}
