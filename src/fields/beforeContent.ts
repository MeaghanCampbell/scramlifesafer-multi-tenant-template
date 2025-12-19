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
import { HeaderBlock } from '@/blocks/Header/config';

const beforeContent: Field = 
{
    name: 'beforeContent',
    type: 'blocks',
    admin: {
        description: 'Add layout blocks (Spacer or Header) that will appear above the main block content.'
    },
    label: 'Nested Blocks (Before)',
    blocks: [Spacer, HeaderBlock],
    required: false,
}

export default beforeContent;
