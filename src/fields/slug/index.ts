/**
 * Custom Slug Field
 *
 * Generates a reusable slug field and a hidden lock checkbox for Payload CMS.
 * - The slug auto-generates from the `fieldToUse` (default: `'title'`).
 * - Includes hooks to format and ensure uniqueness.
 * - Uses a hidden checkbox (`slugLock`) to prevent auto-updates after creation.
 */

import type { CheckboxField, TextField } from 'payload'

import { formatSlugHook } from './formatSlug'
import { ensureUniqueSlug } from './hooks/ensureUniqueSlug'

type Overrides = {
  slugOverrides?: Partial<TextField>
  checkboxOverrides?: Partial<CheckboxField>
}

type Slug = (fieldToUse?: string, overrides?: Overrides) => [TextField, CheckboxField]

export const slugField: Slug = (fieldToUse = 'title', overrides = {}) => {
  const { slugOverrides, checkboxOverrides } = overrides

  const checkBoxField: CheckboxField = {
    name: 'slugLock',
    type: 'checkbox',
    defaultValue: true,
    admin: {
      hidden: true,
      position: 'sidebar',
    },
    ...checkboxOverrides,
  }

  // @ts-expect-error - Expect ts error here because of typescript mismatching Partial<TextField> with TextField
  const slugField: TextField = {
    name: 'slug',
    type: 'text',
    index: true,
    label: 'Slug',
    ...(slugOverrides || {}),
    hooks: {
      // Kept this in for hook or API based updates
      beforeValidate: [formatSlugHook(fieldToUse), ensureUniqueSlug]
    },
    admin: {
      position: 'sidebar',
      ...(slugOverrides?.admin || {}),
      components: {
        Field: {
          path: '@/fields/slug/SlugComponent#SlugComponent',
          clientProps: {
            fieldToUse,
            checkboxFieldPath: checkBoxField.name,
          },
        },
      },
    },
  }

  return [slugField, checkBoxField]
}

