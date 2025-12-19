import type { AccessArgs } from 'payload'
import type { User } from '@/payload-types'

type isAuthenticated = (args: AccessArgs<User>) => boolean

/**
 * Grants access only to authenticated users.
 *
 * @param args - Access arguments containing the request and user
 * @returns `true` if a user is present on the request, otherwise `false`
 */
export const authenticated: isAuthenticated = ({ req: { user } }) => {
  return Boolean(user)
}