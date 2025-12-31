import type { CollectionBeforeChangeHook } from 'payload'

export const setTenantFromForm: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
}) => {
  if (operation !== 'create') {
    return data
  }

  if (data.tenant) {
    return data
  }

  const formId = typeof data.form === 'string' ? data.form : data.form?.id

  if (!formId) {
    return data
  }

  try {
    const form = await req.payload.findByID({
      collection: 'forms',
      id: formId,
      depth: 0,
    })

    if (form?.tenant) {
      data.tenant = form.tenant
    }
  } catch (error) {
    console.error('Error fetching form tenant:', error)
  }

  return data
}