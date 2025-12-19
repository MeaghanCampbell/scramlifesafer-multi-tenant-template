// src/plugins/formBuilder/index.ts
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import type { Plugin } from 'payload'
import { availableFields } from './customFields'
import { formOverrides, formSubmissionOverrides } from './overrides'

export const formBuilder: Plugin = formBuilderPlugin({
  fields: {
    ...availableFields,
  },
  formOverrides: formOverrides(),
  formSubmissionOverrides,
})
