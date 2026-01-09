// import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
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
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

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
  // // Nested Docs Plugin has a saving order bug with the multi-tenat plugin
  // // If fixed, uncomment & remove the parent field on pages, and update the 
  // // setFullPathFromParent to use breadcrumbs instead
  // nestedDocsPlugin({
  //   collections: ['pages'],
  //   generateURL: (docs) =>  {
  //     return docs.reduce((url, doc) => `${url}/${String(doc.slug)}`, '')
  //   }
  // }),
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
      pages: {},
      posts: {},
      forms: {},
      redirects: {},
      'form-submissions': {},
      navigations: { isGlobal: true },
      footers: { isGlobal: true },
      search: {}
    },
    userHasAccessToAllTenants: (user) => isSuperAdmin(user),
    // debug: true, // optional: shows tenant fields in admin for troubleshooting
    // cleanupAfterTenantDelete: false, // optional safety if you don’t want cascading deletes
  }),
  vercelBlobStorage({
    enabled: true,
    collections: {
      media: true, // Enable for your media collection
    },
    token: process.env.BLOB_READ_WRITE_TOKEN!,
  }),
]
