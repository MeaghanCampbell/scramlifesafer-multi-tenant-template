/**
 * Header Block Configuration for Payload CMS
 * ------------------------------------------
 * A reusable nested block for adding headline content and supporting links.
 * 
 * Fields:
 * - Rich text using Lexical Editor with headings, lists, and toolbars
 * - A link group field allowing up to 2 rows of links
 * 
 * Designed to be used inside other blocks as a section header or intro element.
 */


import type { Block } from 'payload';
import { linkGroup } from '@/fields/linkGroup'
import {
    FixedToolbarFeature,
    HeadingFeature,
    InlineToolbarFeature,
    OrderedListFeature,
    UnorderedListFeature,
    lexicalEditor,
    AlignFeature
} from '@payloadcms/richtext-lexical'
import { textColor } from '@/fields/richtext/features/textColor'

export const HeaderBlock: Block = {
    slug: 'headerBlock',
    interfaceName: 'HeaderBlock',
    labels: {
        singular: 'Header',
        plural: 'Headers',
    },
    fields: [
        {
            name: 'richText',
            type: 'richText',
            label: 'Text Content',
            editor: lexicalEditor({
              features: ({ rootFeatures }) => {
                return [
                  ...rootFeatures,
                  HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4', 'h5'] }),
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                  OrderedListFeature(),
                  UnorderedListFeature(),
                  AlignFeature(),
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