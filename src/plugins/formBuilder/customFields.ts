import type { Block } from 'payload'
import { fields } from '@payloadcms/plugin-form-builder'
import { addConditionFields } from '@/utilities/addConditionalFields'
import {
  baseNameField,
  baseLabelField,
  baseWidthField,
  baseRequiredField,
} from './baseFields'

// Custom "First Name" block with locked name = "firstname"
const createPresetFieldBlock = (opts: {
  slug: string
  singular: string
  plural: string
  defaultName: string
  defaultLabel: string
}): Block =>
  ({
    slug: opts.slug,
    labels: {
      singular: opts.singular,
      plural: opts.plural,
    },
    fields: [
      {
        type: 'row',
        fields: [
          {
            ...baseNameField,
            defaultValue: opts.defaultName, // e.g. "firstname"
            admin: {
              ...(baseNameField || {}),
              readOnly: true,                // lock the name
            },
          },
          {
            ...baseLabelField,
            defaultValue: opts.defaultLabel, // e.g. "First Name"
            admin: {
              ...(baseLabelField || {}),
              width: '50%',
            },
          },
        ],
      },
      {
        type: 'row',
        fields: [
          {
            ...baseWidthField,
            admin: {
              ...(baseWidthField || {}),
              width: '50%',
            },
          },
          {
            name: 'defaultValue',
            type: 'text',
            label: 'Default Value',
            admin: {
              width: '50%',
            },
          },
        ],
      },
      baseRequiredField,
    ],
  }) as Block

// Concrete blocks
export const firstnameBlock = createPresetFieldBlock({
  slug: 'firstname',
  singular: 'First Name',
  plural: 'First Name Fields',
  defaultName: 'firstname',
  defaultLabel: 'First Name',
})

export const lastnameBlock = createPresetFieldBlock({
  slug: 'lastname',
  singular: 'Last Name',
  plural: 'Last Name Fields',
  defaultName: 'lastname',
  defaultLabel: 'Last Name',
})

export const phoneBlock = createPresetFieldBlock({
  slug: 'phone',
  singular: 'Phone',
  plural: 'Phone Fields',
  defaultName: 'phone',
  defaultLabel: 'Phone',
})

export const emailBlock = createPresetFieldBlock({
  slug: 'email',
  singular: 'Email',
  plural: 'Email Fields',
  defaultName: 'email',
  defaultLabel: 'Email',
})

export const stateBlock = createPresetFieldBlock({
  slug: 'state',
  singular: 'State',
  plural: 'State Fields',
  defaultName: 'state',
  defaultLabel: 'State',
})

export const countryBlock = createPresetFieldBlock({
  slug: 'country',
  singular: 'Country',
  plural: 'Country Fields',
  defaultName: 'country',
  defaultLabel: 'Country',
})

// All field blocks available to the form builder
export const availableFields = {
  // generic builder fields
  text: addConditionFields(fields.text),
  checkbox: addConditionFields(fields.checkbox),
  select: addConditionFields(fields.select),
  message: addConditionFields(fields.message),
  number: addConditionFields(fields.number),
  textarea: addConditionFields(fields.textarea),

  // any other custom ones you already had (hidden, multiselect, radio, etc.)
  multiselect: addConditionFields({
    ...fields.select,
    slug: 'multiselect',
    labels: { singular: 'Multi-Select', plural: 'Multi-Selects' },
  }),
  radio: addConditionFields({
    ...fields.select,
    slug: 'radio',
    labels: { singular: 'Radio', plural: 'Radio Buttons' },
  }),
  hidden: addConditionFields({
    ...fields.text,
    slug: 'hidden',
    labels: { singular: 'Hidden Field', plural: 'Hidden Fields' },
  }),

  // preset “locked-name” fields
  firstname: addConditionFields(firstnameBlock),
  lastname: addConditionFields(lastnameBlock),
  phone: addConditionFields(phoneBlock),
  email: addConditionFields(emailBlock),
  state: addConditionFields(stateBlock),
  country: addConditionFields(countryBlock),
}