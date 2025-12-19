import type { Access } from 'payload'  

/**
 * Grants access to authenticated users, or to anyone if the document is published.
 *
 * @param req - Payload request containing the user object (if authenticated)
 * @returns `true` for authenticated users, or a query filter for published content
 */
export const authenticatedOrPublished: Access = ({ req: { user } }) => {
  if (user) {
    return true
  }

  return {
    _status: {
      equals: 'published',
    },
  }
}
