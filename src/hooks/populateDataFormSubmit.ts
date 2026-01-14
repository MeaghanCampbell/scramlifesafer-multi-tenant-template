import { CollectionBeforeChangeHook } from 'payload'

const TRACKING_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'brand',
  'influencer_group',
]

export const populateDataFormSubmit: CollectionBeforeChangeHook = async ({ data }) => {
  const customData: { label: string; value: string }[] = []
  const submissionData: { field: string; value: string }[] = []

  if (data && typeof data === 'object') {
    Object.entries(data).forEach(([key, value]) => {
      if (['form', 'customData', 'submissionData', 'hubspotCookie', 'pageUri', 'pageName', 'updatedAt', 'createdAt'].includes(key)) return
      if (value === undefined || value === null) return

      customData.push({
        label: key,
        value: String(value),
      })
      
      // Populate submissionData for resend plugin
      submissionData.push({
        field: key,
        value: String(value),
      })
    })
  }

  TRACKING_KEYS.forEach((key) => {
    if (!customData.find(item => item.label === key)) {
      const trackingValue = data?.[key] || ''
      
      if (trackingValue !== '') {
        customData.push({
          label: key,
          value: trackingValue,
        })
        
        submissionData.push({
          field: key,
          value: trackingValue,
        })
      }
    }

    delete data[key]
  })

  data.customData = customData
  data.submissionData = submissionData

  return data
}