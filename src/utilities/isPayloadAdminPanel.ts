// Checks if a page is being accessed from the admin panel

import type { PayloadRequest } from 'payload';

export const isPayloadAdminPanel = (req: PayloadRequest) => {

  if (req.payloadAPI === 'REST' && req.url?.startsWith(req.payload.config.routes.admin)) {
    return true;
  }

  const adminRoute = req.payload.config.routes.admin;
  const url = req.url || '';

  const isAdminPath = url.startsWith(adminRoute);

  return isAdminPath;
};