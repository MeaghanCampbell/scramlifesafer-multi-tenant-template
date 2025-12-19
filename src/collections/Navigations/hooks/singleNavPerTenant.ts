/* eslint-disable @typescript-eslint/no-explicit-any */
// Hook to ensure only one Nav is added per tenant

import { PayloadRequest } from 'payload'
import { ValidationError } from 'payload'

export const enforceSingleNavPerTenant = async ({ data, operation, req }: {
  data: any;
  operation: 'create' | 'update';
  req: PayloadRequest;
}) => {
  if (operation === 'create' || operation === 'update') {

    const existingNav = await req.payload.find({
      collection: 'navigations',
      where: { tenant: { equals: data.tenant } },
      depth: 0,
    });

    if (existingNav.totalDocs > 0 && operation === 'create') {
      throw new ValidationError({
        errors: [
          {
            message: `A navigation for this tenant already exists`,
            path: 'tenant',
          },
        ],
      });
    }
  }
};
