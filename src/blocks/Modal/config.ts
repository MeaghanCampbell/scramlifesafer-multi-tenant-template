/**
 * Modal Block Configuration for Payload CMS
 * ------------------------------------------------
 *
 */

import type { Block } from 'payload'
import { linkGroup } from '@/fields/linkGroup'
import { background } from '@/fields/background'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
  OrderedListFeature,
  UnorderedListFeature
} from '@payloadcms/richtext-lexical'
import { textColor } from '@/fields/richtext/features/textColor'

export const Modal: Block = {
    slug: 'modal',
    interfaceName: 'modalBlock',
    fields: [
        background(),
        {
          name: 'targetId',
          type: 'text',
          label: 'Modal ID',
          required: true,
          unique: false,
          admin: {
            description: 'Enter a unique ID to target this modal from a link.',
          },
        },
        {
            name: 'richText',
            type: 'richText',
            editor: lexicalEditor({
              features: ({ rootFeatures }) => {
                return [
                  ...rootFeatures,
                  HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4', 'h5'] }),
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                  OrderedListFeature(),
                  UnorderedListFeature(),
                  textColor()
                ]
              },
            }),            
        },
        linkGroup({
            appearances: ['link', 'primary', 'secondary'],
            overrides: {
              maxRows: 2,
            },
        }),
    ]
    
}