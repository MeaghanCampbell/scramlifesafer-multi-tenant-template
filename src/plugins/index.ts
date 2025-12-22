import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import { Plugin } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { searchFields } from '@/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/search/beforeSync'
import { formBuilder } from './formBuilder'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import { Page, Post } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'
import { isSuperAdmin } from '@/access/isSuperAdmin'

const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Payload Website Template` : 'Payload Website Template'
}

const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: ['pages', 'posts'],
    overrides: {
      admin: {
        description: 'Enter only the path segment, e.g. /about or /new-drivers/pricing'
      },
      hooks: {
        afterChange: [revalidateRedirects]
      }
    },
    redirectTypeFieldOverride: {
      admin: {
        description: 'Choose the type of redirect to use.'
      }
    }
  }),
  nestedDocsPlugin({
    collections: ['pages'],
    generateURL: (docs) =>  {
      return docs.reduce((url, doc) => `${url}/${String(doc.slug)}`, '')
    }
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilder,
  searchPlugin({
    collections: ['posts'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields]
      },
    },
  }),
  multiTenantPlugin({
    collections: {
      pages: {},     // tenant-enabled
      posts: {},     // tenant-enabled
      forms: {},
      redirects: {},
      navigations: { isGlobal: true },
      footers: { isGlobal: true },
    },
    userHasAccessToAllTenants: (user) => isSuperAdmin(user),
    // debug: true, // optional: shows tenant fields in admin for troubleshooting
    // cleanupAfterTenantDelete: false, // optional safety if you don’t want cascading deletes
  }),
]
