import type { PayloadRequest } from 'payload'

export const isPayloadAdminPanel = (req: PayloadRequest) => {
  // If there’s an authenticated user, this is an admin-origin request.
  // This includes relationship option queries to /api/* from the admin UI.
  if (req.user) return true

  const adminRoute = req.payload.config.routes.admin // usually '/admin'
  const url = req.url || ''

  // Handles server-side admin page loads
  if (url.startsWith(adminRoute)) return true

  return false
}