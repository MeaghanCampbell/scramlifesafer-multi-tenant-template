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
import { Spacer } from '@/blocks/Spacer/config';

const afterContent: Field = 
{
    name: 'afterContent',
    type: 'blocks',
    label: 'Nested Blocks (After)',
    admin: {
        description: 'Add layout blocks (Spacer(s)) that will appear below the main block content.'
    },
    blocks: [Spacer],
    required: false,
}

export default afterContent;