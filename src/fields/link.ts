import type { Field, GroupField } from 'payload'

import deepMerge from '@/utilities/deepMerge'

export type LinkAppearances = 'primary' | 'secondary' | 'link' 

export const appearanceOptions: Record<LinkAppearances, { label: string; value: string }> = {
  primary: {
    label: 'Primary',
    value: 'primary',
  },
  secondary: {
    label: 'Secondary',
    value: 'secondary',
  },
  link: {
    label: 'Link',
    value: 'link',
  }
}

type LinkType = (options?: {
  appearances?: LinkAppearances[] | false
  disableLabel?: boolean
  overrides?: Partial<GroupField>
}) => Field

export const link: LinkType = ({ appearances, disableLabel = false, overrides = {} } = {}) => {
  const linkResult: GroupField = {
    name: 'link',
    type: 'group',
    interfaceName: 'LinkField',
    admin: {
      hideGutter: true,
    },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'behavior',
            type: 'radio',
            label: 'Link Behavior',
            defaultValue: 'navigate',
            options: [
              { label: 'Navigate to link', value: 'navigate' },
              { label: 'Open Modal or Sidebar', value: 'openTarget' },
            ],
          },
          {
            name: 'newTab',
            type: 'checkbox',
            label: 'Open in new tab',
            admin: {
              condition: (_, siblingData) => siblingData?.behavior === 'navigate',
              style: {
                alignSelf: 'flex-end',
              },
              width: '50%',
            },
          },
        ]
      }
    ],
  }

  const linkTypes: Field[] = [
    {
      name: 'type',
      type: 'radio',
      admin: {
        condition: (_, siblingData) => siblingData?.behavior === 'navigate',
  
      },
      defaultValue: 'reference',
      options: [
        { label: 'Internal link', value: 'reference' },
        { label: 'Custom URL', value: 'custom' },
      ],
    },
    {
      name: 'reference',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) =>
          siblingData?.behavior === 'navigate' && siblingData?.type === 'reference',
        width: '100%',
      },
      label: 'Document to link to',
      maxDepth: 1,
      relationTo: ['pages'],
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        condition: (_, siblingData) =>
          siblingData?.behavior === 'navigate' && siblingData?.type === 'custom',
        width: '100%',
      },
      label: 'Custom URL',
      required: true,
    },
  ]

  const openTargetField: Field = {
    name: 'targetId',
    label: 'Target Modal or Sidebar ID',
    type: 'text',
    admin: {
      condition: (_, siblingData) => siblingData?.behavior === 'openTarget',
      description: 'Must match the ID of the modal or sidebar to open.',
    },
  }

  if (!disableLabel) {
    linkResult.fields.push({
      type: 'row',
      fields: [
        ...linkTypes,
        {
          name: 'label',
          type: 'text',
          admin: {
            width: '50%',
          },
          label: 'Label',
        },
        {
          name: 'mobileLabel',
          type: 'text',
          admin: {
            width: '50%',
            description: 'Only fill in this field if label should be different on mobile.'
          },
          label: 'Mobile Label'
        }
      ],
    })
  } else {
    linkResult.fields = [...linkResult.fields, ...linkTypes]
  }

  linkResult.fields.push(openTargetField)

  if (appearances !== false) {
    let appearanceOptionsToUse = [appearanceOptions.primary, appearanceOptions.secondary, appearanceOptions.link]

    if (appearances) {
      appearanceOptionsToUse = appearances.map((appearance) => appearanceOptions[appearance])
    }

    linkResult.fields.push({
      name: 'appearance',
      type: 'select',
      admin: {
        description: 'Choose how the link should be rendered.',
      },
      defaultValue: 'primary',
      options: appearanceOptionsToUse,
    })
  }

  return deepMerge(linkResult, overrides)
}
