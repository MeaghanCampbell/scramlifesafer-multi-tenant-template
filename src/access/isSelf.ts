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


export const isSuperAdminOrSelf: Access = ({ req: {user} }) => {

    if(user) {

        if(user.role === 'super-admin') {
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
