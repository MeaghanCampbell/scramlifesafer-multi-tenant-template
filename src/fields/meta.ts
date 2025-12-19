/**
 * meta Field (SEO Group)
 * -----------------------
 * Configures SEO metadata fields using @payloadcms/plugin-seo.
 * 
 * Includes:
 * - Title, description, and image fields
 * - Preview and overview components
 * - Support for auto-generation of metadata
 */

import type { Field } from 'payload'
import {
    MetaDescriptionField,
    MetaImageField,
    MetaTitleField,
    OverviewField,
    PreviewField,
  } from '@payloadcms/plugin-seo/fields'

const meta: Field = 
    {
        name: 'meta',
        type: 'group',
        label: 'SEO',
        interfaceName: 'metaField',
        fields: [
          {
            name: 'hideFromSearch',
            label: 'Hide from Search Engines',
            type: 'checkbox',
            defaultValue: false,
            admin: {
              description: 'If checked, this page will not be indexed by search engines.',
            },
          },
          OverviewField({
            titlePath: 'meta.title',
            descriptionPath: 'meta.description',
            imagePath: 'meta.image',
          }),
          MetaTitleField({
            hasGenerateFn: true,
          }),
          MetaImageField({
            relationTo: 'media',
          }),

          MetaDescriptionField({}),
          PreviewField({
            // if the `generateUrl` function is configured
            hasGenerateFn: true,

            // field paths to match the target field for data
            titlePath: 'meta.title',
            descriptionPath: 'meta.description',
          }),
        ],
    }

export default meta;
