/* eslint-disable @typescript-eslint/no-explicit-any */
// Hook to ensure only one footer is added per tenant

import { PayloadRequest } from 'payload'
import { ValidationError } from 'payload'

export const enforceSingleFooterPerTenant = async ({ data, operation, req }: {
  data: any;
  operation: 'create' | 'update';
  req: PayloadRequest;
}) => {
  if (operation === 'create' || operation === 'update') {

    const existingFooter = await req.payload.find({
      collection: 'footers',
      where: { tenant: { equals: data.tenant } },
      depth: 0,
    });

    if (existingFooter.totalDocs > 0 && operation === 'create') {
      throw new ValidationError({
        errors: [
          {
            message: `A footer for this tenant already exists`,
            path: 'tenant',
          },
        ],
      });
      
    }
  }
};