import type { CollectionBeforeChangeHook } from 'payload'

export const setFullPathFromParent: CollectionBeforeChangeHook = async ({ 
  data, 
  req 
}) => {
  const slug = data?.slug

  if (!slug) {
    return data
  }

  // Helper function to recursively build the path
  const buildFullPath = async (parentId: string | null): Promise<string[]> => {
    if (!parentId) {
      return []
    }

    try {
      const parentPage = await req.payload.findByID({
        collection: 'pages',
        id: parentId,
        depth: 0,
      })

      if (!parentPage || !parentPage.slug) return []

      // Recursively get the parent's path
      const grandParentPath = await buildFullPath(
        typeof parentPage.parent === 'string'
          ? parentPage.parent
          : parentPage.parent?.id ?? null
      )

      // Return the accumulated path
      return [...grandParentPath, parentPage.slug]
      
    } catch (error) {
      console.error('Error fetching parent page:', error)
      return []
    }
  }

  const parent = data?.parent
  const parentId = typeof parent === 'string' ? parent : parent?.id

  if (!parentId) {
    // No parent, so fullPath is just the slug
    data.fullPath = slug
  } else {
    // Build the full path from all ancestors
    const ancestorSlugs = await buildFullPath(parentId)
    data.fullPath = [...ancestorSlugs, slug].join('/')
  }

  return data
}