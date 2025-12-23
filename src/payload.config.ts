// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'

import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
// import { resendAdapter } from '@payloadcms/email-resend'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { Navigations } from './collections/Navigations'
import { Footers } from './collections/Footers'
import { Tenants } from './collections/Tenants'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const allowedDomains = process.env.ALLOWED_DOMAINS
    ? process.env.ALLOWED_DOMAINS.split(',')
    : [];

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
  routes: { api: '/api', admin: '/admin' },
  admin: {
    avatar: 'default',
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      title: 'site-name',
      description: 'The admin panel for site-name',
      icons: [
        {
          rel: 'icon',
          type: 'image/ico',
          url: '/favicon.ico',
        }
      ]
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  editor: defaultLexical,
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  // email: resendAdapter({
  //   defaultFromAddress: 'no-reply@connect.site-name.com',
  //   defaultFromName: 'site-name',
  //   apiKey: process.env.RESEND_API_KEY || '',
  // }),
  collections: [Pages, Posts, Media, Categories, Users, Tenants, Navigations, Footers],
  cors: {
    origins: allowedDomains
  },
  plugins: [
    ...plugins,
    // storage-adapter-placeholder
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  }
})
