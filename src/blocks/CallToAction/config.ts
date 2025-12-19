import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
  AlignFeature
} from '@payloadcms/richtext-lexical'
import { background } from '@/fields/background'
import beforeContent from '@/fields/beforeContent'
import afterContent from '@/fields/afterContent'
import { linkGroup } from '../../fields/linkGroup'
import alignment from '@/fields/alignment'
import { textColor } from '@/fields/richtext/features/textColor'

export const CallToAction: Block = {
  slug: 'cta',
  interfaceName: 'CallToActionBlock',
  fields: [
    background(),
    beforeContent,
    alignment,
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            AlignFeature(),
            textColor()
          ]
        },
      }),
      label: false,
    },
    linkGroup({
      appearances: ['primary', 'secondary', 'link'],
      overrides: {
        maxRows: 2,
      },
    }),
    afterContent
  ],
  labels: {
    plural: 'Calls to Action',
    singular: 'Call to Action',
  },
}
