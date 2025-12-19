/* eslint-disable @typescript-eslint/no-explicit-any */

import type { FormFieldBlock } from '@payloadcms/plugin-form-builder/types'

/**
 * buildInitialFormState Utility
 * -----------------------------
 * Generates an object of default form field values from a list of Payload FormBuilder field blocks.
 *
 * - Supports common blockTypes like 'checkbox', 'text', 'email', 'select', 'state', and 'country'
 * - Returns an object suitable for `react-hook-form`'s `defaultValues`
 * - Fields without a supported blockType are skipped
 *
 * @param fields - Array of Payload FormBuilder field blocks
 * @returns Record<string, any> - A flat object mapping field names to initial values
 */
export const buildInitialFormState = (fields: FormFieldBlock[]) => {
  return fields?.reduce((initialSchema, field) => {
    const { blockType } = field;
    const name = (field as any).name;
    const defaultValue = (field as any).defaultValue;

    if (blockType === 'checkbox') {
      return {
        ...initialSchema,
        [name]: defaultValue ?? false,
      }
    }

    const defaultEmptyFields = [
      'country',
      'email',
      'text',
      'number',
      'checkbox',
      'textarea',
      'firstname',
      'lastname',
      'select',
      'state',
      'phone',
      'hidden',
      'multiselect',
      'radio',
    ]

    if (defaultEmptyFields.includes(blockType)) {
      return {
        ...initialSchema,
        [name]: defaultValue ?? '',
      }
    }

    return initialSchema
  }, {} as FormFieldBlock[])
}
