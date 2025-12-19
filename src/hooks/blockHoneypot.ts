/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CollectionBeforeValidateHook } from 'payload'
import { APIError } from 'payload'
import { validateHoneypot } from '@/utilities/validateHoneypot'


export const blockHoneypot: CollectionBeforeValidateHook = ({ data, req }) => {
  const source = (data && Object.keys(data).length > 0) ? data : (req?.body ?? {})

  const hp = validateHoneypot(source as Record<string, unknown>)
  if (!hp.ok) throw new APIError('Something went wrong. Please try again.', 400)

  if (data) {
    delete (data as any).contact_website
    delete (data as any).hp_ts
    delete (data as any).hp_sig
  }
  return data
}
