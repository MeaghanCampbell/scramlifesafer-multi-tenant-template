import type { Field, FieldHook } from 'payload'

export const virtualFromCustomData = (
  name: string,
  label: string,
  aliases: string[] = [],
): Field => {
  const afterRead: FieldHook = ({ data }) => {
    const rows = Array.isArray(data?.customData) ? data.customData : []

    const targets = [name, ...aliases].map((t) => t.toLowerCase())

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const match = rows.find((row: any) => {
      const rowLabel = String(row?.label || '').toLowerCase()
      return targets.includes(rowLabel)
    })

    return match?.value ?? ''
  }

  return {
    name,
    label,
    type: 'text',
    virtual: true,
    admin: {
      readOnly: true,
      hidden: true,
    },
    hooks: {
      afterRead: [afterRead],
    },
  }
}
