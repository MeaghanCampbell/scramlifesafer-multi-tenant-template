import type { Field } from 'payload'
import {
  AlignFeature,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { virtualFromCustomData } from '@/hooks/virtualFromCustomData'
import { isTenantAdmin } from '@/access/isTenantAdmin'
import { availableFields } from './customFields'
import { blockHoneypot } from '@/hooks/blockHoneypot'
import { populateRefererFormSubmit } from '@/hooks/populateReferrerFormSubmit'
import { populateDataFormSubmit } from '@/hooks/populateDataFormSubmit'
import { sendSubmissionToHubspot } from '@/hooks/sendSubmissionToHubspot'
import { setTenantFromForm } from '@/hooks/setTenantFromForm'

// FORM overrides (for the Forms collection)
export const formOverrides = () => ({
  access: {
    create: isTenantAdmin,
    delete: isTenantAdmin,
    read: () => true,
    update: isTenantAdmin,
  },
  admin: {
    group: 'Forms'
  },
  fields: ({ defaultFields }: { defaultFields: Field[] }): Field[] => {
    // Enhance confirmationMessage editor
    const enhancedDefaults = defaultFields.map((field) => {
      if ('name' in field && field.name === 'confirmationMessage') {
        return {
          ...field,
          editor: lexicalEditor({
            features: ({ rootFeatures }) => [
              ...rootFeatures,
              FixedToolbarFeature(),
              InlineToolbarFeature(),
              HeadingFeature({
                enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'],
              }),
              AlignFeature(),
            ],
          }),
        } as Field
      }
      return field
    })

    // Remove plugin's own `fields` builder (we’re replacing it)
    const filteredDefaults = enhancedDefaults.filter(
      (field) => !('name' in field && field.name === 'fields'),
    )

    return [
      {
        name: 'type',
        type: 'select',
        label: 'Form Type',
        options: [
          { label: 'Single Step', value: 'single' },
          { label: 'Multi Step', value: 'multiStep' },
        ],
        defaultValue: 'single',
        required: true,
      },
      {
        name: 'fields',
        type: 'blocks',
        label: 'Fields',
        blocks: Object.values(availableFields),
        admin: {
          condition: (_, siblingData) => siblingData?.type === 'single',
        },
      },
      {
        name: 'steps',
        type: 'array',
        label: 'Steps',
        admin: {
          condition: (_, siblingData) => siblingData?.type === 'multiStep',
        },
        fields: [
          {
            name: 'multiStepFields',
            type: 'blocks',
            label: 'Step Fields',
            blocks: Object.values(availableFields),
          },
        ],
      },

      ...filteredDefaults,

      {
        name: 'terms',
        type: 'richText',
        label: 'terms & conditions',
        admin: { position: 'sidebar' },
        editor: lexicalEditor({
          features: ({ rootFeatures }) => [
            ...rootFeatures,
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            AlignFeature(),
          ],
        }),
      },
      {
        name: 'hubspotID',
        type: 'text',
        label: 'Hubspot ID',
        admin: { position: 'sidebar' },
      },
    ]
  },
})

// FORM SUBMISSION overrides
export const formSubmissionOverrides = {
    slug: 'form-submissions',
    access: {
      read: isTenantAdmin,
      delete: isTenantAdmin,
    },
    admin: {
      defaultColumns: [
        'form',
        'firstname',
        'email',
        'createdAt',
      ],
      components: {
        afterList: ['@/components/ExportButton#ExportButton'],
      },
      group: 'Forms'
    },
    fields: ({ defaultFields }: { defaultFields: Field[] }): Field[] => {

      return [
        ...defaultFields,
        {
          name: 'url',
          label: 'Page URL',
          type: 'text',
        },
        {
          name: 'customData',
          label: 'Form Data',
          type: 'array',
          fields: [
            {
              name: 'label',
              label: 'Label',
              type: 'text',
              required: true,
              admin: {
                hidden: true
              }
            },
            {
              name: 'value',
              type: 'text',
            },
          ],
          admin: {
            components: {
              RowLabel: '@/components/FormSubmissionRowLabel#FormSubmissionRowLabel',
              Field: '@/components/FormSubmissionData#FormSubmissionData'
            }
          }
        },
        // Virtual Admin Data Display Fields
        virtualFromCustomData('firstname', 'First Name'),
        virtualFromCustomData('lastname', 'Last Name'),
        virtualFromCustomData('utm_source', 'UTM Source'),
        virtualFromCustomData('utm_medium', 'UTM Medium'),
        virtualFromCustomData('utm_campaign', 'UTM Campaign'),
        virtualFromCustomData('phone', 'Phone'),
        virtualFromCustomData('email', 'Email'),
      ];
    },
    hooks: {
      beforeValidate: [blockHoneypot],
      beforeChange: [populateRefererFormSubmit, setTenantFromForm, populateDataFormSubmit],
      afterChange: [sendSubmissionToHubspot]          
    }
}

