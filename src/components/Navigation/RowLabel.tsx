'use client'
import { Navigation } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const RowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<NonNullable<Navigation['navItems']>[number]>()

  const rowNum =
    data.rowNumber !== undefined ? data.rowNumber + 1 : ''

  const label =
    data?.data?.type === 'link' && data.data.link?.link?.label
      ? `Nav item ${rowNum}: ${data.data.link.link.label}`
      : data?.data?.type === 'dropdown' && data.data.dropdown?.title
        ? `Dropdown ${rowNum}: ${data.data.dropdown.title}`
        : 'Row'

  return <div>{label}</div>
}
