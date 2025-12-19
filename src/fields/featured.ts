/**
 * Custom Featured Field
 *
 * Adds a checkbox field to collections so they can be
 * marked as "featured" posts.
 */

import type { Field } from 'payload'

const featured: Field = {
  name: 'featured',
  label: 'Featured',
  type: 'select',
  interfaceName: 'featuredField',
  defaultValue: 'not-featured',
  options: [
    {
      label: 'Featured',
      value: 'featured',
    },
    {
      label: 'Not Featured',
      value: 'not-featured',
    },
  ],
  admin: {
    position: 'sidebar',
  },
}

export default featured
