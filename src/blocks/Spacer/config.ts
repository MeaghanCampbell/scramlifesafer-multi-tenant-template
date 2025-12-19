/**
 * Spacer Block Configuration for Payload CMS
 * ------------------------------------------
 * A simple layout block used to add vertical spacing between sections.
 * 
 * This block includes:
 * - A "size" select field to control spacing (x-small, small, medium, large)
 * 
 * Intended for use nested inside other blocks.
 */

import type { Block } from 'payload'

export const Spacer: Block = {
    slug: 'spacer',
    interfaceName: 'SpacerBlock',
    fields: [
        {
            name: 'size',
            type: 'select',
            label: 'Size',
                options: [
                    {
                      label: 'X-Small',
                      value: 'x-small',
                    },
                    {
                      label: 'Small',
                      value: 'small',
                    },
                    {
                      label: 'Medium',
                      value: 'medium',
                    },
                    {
                        label: 'Large',
                        value: 'large',
                    },
                    {
                      label: 'X-Large',
                      value: 'x-large',
                    },
                    {
                      label: 'XX-Large',
                      value: 'xx-large',
                    },
                  ],
                  defaultValue: 'small',
        }
    ]
}