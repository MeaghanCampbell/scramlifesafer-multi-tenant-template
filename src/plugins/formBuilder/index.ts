import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import type { Plugin } from 'payload'
import { availableFields } from './customFields'
import { formOverrides, formSubmissionOverrides } from './overrides'
import { beforeEmailFormSubmit } from '@/hooks/beforeEmailFormSubmit';

export const formBuilder: Plugin = formBuilderPlugin({
  fields: {
    ...availableFields,
  },
  beforeEmail: beforeEmailFormSubmit,
  formOverrides: formOverrides(),
  formSubmissionOverrides,
})
