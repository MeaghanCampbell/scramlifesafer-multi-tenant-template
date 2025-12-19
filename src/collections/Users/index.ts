import type { CollectionConfig } from 'payload'

import { isSuperAdminOrSelf, isSelf } from '@/access/isSelf'
import { isSuperAdmin, isSuperAdminFieldLevel } from '@/access/isSuperAdmin'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    create: isSuperAdmin,
    delete: isSuperAdmin,
    read: isSuperAdminOrSelf,
    update: isSelf
  },
  admin: {
    defaultColumns: ['name', 'email', 'role', 'tenant'],
    useAsTitle: 'name',
    hidden: (req) => {
      return !req?.user?.role?.includes('super-admin')
    },
  },
  auth: {
    forgotPassword: {
        expiration: 3600000,
        generateEmailSubject: () => {
          return `Password Reset for site-name`
        },
        generateEmailHTML: (args) => {
          const { token, user } = args || {};

          const resetPasswordURL = `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/reset/${token}`

          return `
            <!doctype html>
            <html>
              <body>
                <p>Hello ${user.name},</p>
                <p>You are receiving this because you (or someone else) have requested the reset of the password for your account. Please click on the following link, or paste this into your browser to complete the process:</p>
                <p>
                  <a href="${resetPasswordURL}">Reset Password -></a>
                </p>
                <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
              </body>
            </html>
          `
        },
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      saveToJWT: true,
      type: 'select',
      hasMany: false,
      options: [
        {
          value: 'super-admin',
          label: 'Super Admin'
        },
        {
          value: 'tenant-admin',
          label: 'Tenant Admin'
        },
      ],
      access: {
        create: isSuperAdminFieldLevel,
        update: isSuperAdminFieldLevel
      }
    },
    // {
    //   name: 'tenant',
    //   saveToJWT: true,
    //   type: 'relationship',
    //   relationTo: 'tenants'
    // }
  ],
  timestamps: true,
}
