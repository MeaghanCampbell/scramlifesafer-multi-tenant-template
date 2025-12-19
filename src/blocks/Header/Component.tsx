/**
 * Header Block Component
 * ---------------------
 * Renders a header section with rich text and optional links.
 * Used as a nested block within larger layout components.
 */

import React from 'react'
import type { HeaderBlock as HeaderBlockProps } from '@/payload-types'
import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'

export const HeaderBlock: React.FC<HeaderBlockProps> = ({
    richText,
    links,
}) => {
    return (
        <div className='flex flex-col gap-6'>
            {richText && <RichText className="mb-0" data={richText} />}
            {(links || []).map((item: { link: Parameters<typeof CMSLink>[0] }, i: number) => (
                <span key={i} className='flex items-center gap-4'>
                    <CMSLink {...item.link} />
                </span>
            ))}
        </div>
    )
}