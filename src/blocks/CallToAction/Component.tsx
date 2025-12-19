import React from 'react'

import type { CallToActionBlock as CTABlockProps } from '@/payload-types'
import { getBackgroundColor, getBackgroundImage, getMarginAlign, getFlexJustify } from '@/utilities/getLayoutStyles'
import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { Container } from '@/components/Container'
import { RenderNestedBlocks } from '../RenderNestedBlocks'

export const CallToActionBlock: React.FC<CTABlockProps> = ({ 
  links, 
  richText,
  background,
  alignment,
  beforeContent,
  afterContent
}) => {

  const backgroundColor = getBackgroundColor(background ?? '')
  const backgroundImage = getBackgroundImage(background ?? '')   
  const marginAlign = getMarginAlign(alignment)
  const flexJustify = getFlexJustify(alignment)

  return (
    <Container backgroundColor={backgroundColor} backgroundImage={backgroundImage} className=''>
        <div className={`${marginAlign}`}>
            {beforeContent && <RenderNestedBlocks blocks={beforeContent} />}
        </div>
        <div className='gap-6 flex flex-col'>
            <div className={`max-w-[48rem] ${marginAlign}`}>
                {richText && <RichText className="mb-0" data={richText} />}
            </div>
            <div className={`gap-4 flex flex-col sm:flex-row ${flexJustify}`}>
                {(links || []).map(({ link }, i) => {
                    return <CMSLink key={i} {...link} />
                })}
            </div>
        </div>
        {afterContent && <RenderNestedBlocks blocks={afterContent} />}
    </Container>
  )
}
