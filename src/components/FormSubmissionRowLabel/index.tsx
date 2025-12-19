'use client'

import { useRowLabel } from '@payloadcms/ui'

export const FormSubmissionRowLabel = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, rowNumber } = useRowLabel<{ label?: string }>()

  const customLabel = `${data.label || 'Data Item'}`

  return <div>{customLabel}</div>
}