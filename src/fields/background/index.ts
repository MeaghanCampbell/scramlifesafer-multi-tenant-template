/**
 * background Field
 * ----------------
 * A reusable group field for selecting a background style.
 * 
 * Includes:
 * - Type selector: 'color' or 'image'
 * - Text input for color (conditionally shown)
 * - Media upload for background image (conditionally shown)
 */

import type { Field } from 'payload'
import deepMerge from '@/utilities/deepMerge'

export const background = (overrides: Record<string, unknown> = {}): Field =>
  deepMerge(
    {
      name: 'background',
      type: 'group',
      label: 'Background',
      interfaceName: 'backgroundField',
      fields: [
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Color', value: 'color' },
            { label: 'Image', value: 'image' },
          ],
          defaultValue: 'color',
          required: true,
        },
        {
          name: 'color',
          type: 'text',
          admin: {
            components: {
              Field: {
                path: '@/fields/background/BackgroundComponent#BackgroundComponent',
              },
            },
            condition: (_: unknown, siblingData: Record<string, unknown>) =>
              siblingData?.type === 'color',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (_: unknown, siblingData: Record<string, unknown>) =>
              siblingData?.type === 'image',
          },
        },
      ],
    },
    overrides
  )

