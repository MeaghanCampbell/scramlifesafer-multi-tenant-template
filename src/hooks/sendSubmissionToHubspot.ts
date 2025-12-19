import { CollectionAfterChangeHook } from 'payload'
import type { FormSubmission } from '@/payload-types'

export const sendSubmissionToHubspot: CollectionAfterChangeHook<FormSubmission> = async ({ doc, req }) => {
  req.payload.logger.info('Form Submission Received')

  const body = req.json ? await req : {}

  const { form, customData } = doc
  const portalID = process.env.HUBSPOT_PORTAL_ID || ''

  // @ts-expect-error - hubspotID is custom on forms
  if (!form?.hubspotID) {
    req.payload.logger.info('No HubSpot ID on form — skipping submission to HubSpot')
    return
  }

  const data = {
    context: {
      ...(body && 'hubspotCookie' in body && {
        hutk: body.hubspotCookie,
      }),
      pageName: 'pageName' in body ? body.pageName : '',
      pageUri: 'pageUri' in body ? body.pageUri : '',
    },
    fields: Array.isArray(customData)
      ? customData.map(({ label, value }) => ({
          name: label,
          value,
        }))
      : [],
  }

  // console.log('✅ Data sent to HubSpot:', data)

  try {
    // @ts-expect-error - hubspotID is on forms & gets sent through to submission
    await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${portalID}/${form.hubspotID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  } catch (e: unknown) {
    req.payload.logger.error({ e, msg: 'HubSpot submission failed' })
  }
}
