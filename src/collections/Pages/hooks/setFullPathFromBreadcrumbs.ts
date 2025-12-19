import type { CollectionBeforeChangeHook } from 'payload'

export const setFullPathFromBreadcrumbs: CollectionBeforeChangeHook = async ({ data }) => {
    const breadcrumbs = data?.breadcrumbs

  if (Array.isArray(breadcrumbs) && breadcrumbs.length > 0) {
    const lastCrumb = breadcrumbs[breadcrumbs.length - 1]

    if (lastCrumb?.url) {
      data.fullPath = lastCrumb.url.replace(/^\/+/, '')
    }
  }

  return data
}