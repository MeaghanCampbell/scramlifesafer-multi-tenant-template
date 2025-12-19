import type { Block } from 'payload'
import { background } from '@/fields/background'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
  OrderedListFeature,
  UnorderedListFeature
} from '@payloadcms/richtext-lexical'
import beforeContent from '@/fields/beforeContent'
import afterContent from '@/fields/afterContent'
import { textColor } from '@/fields/richtext/features/textColor'

export const Text: Block = {
    slug: 'text',
    interfaceName: 'textBlock',
    fields: [
        background(),
        beforeContent,
        {
            name: 'content',
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
            label: 'Text Content',
        },
        afterContent
    ]

}