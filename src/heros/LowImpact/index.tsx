import React from 'react'
import type { HeroField } from '@/payload-types'
import { 
  getBackgroundColor, 
  getBackgroundImage, 
  getMarginAlign, 
  getFlexJustify 
} from '@/utilities/getLayoutStyles'
import RichText from '@/components/RichText'
import { Container } from '@/components/Container'
import { CMSLink } from '@/components/Link'


export const LowImpactHero: React.FC<HeroField> = ({ 
  richText,
  background,
  links,
  alignment
}) => {

  const backgroundColor = getBackgroundColor(background)
  const backgroundImage = getBackgroundImage(background)   
  const marginAlign = getMarginAlign(alignment)
  const flexJustify = getFlexJustify(alignment)

  return (
    <Container backgroundColor={backgroundColor} backgroundImage={backgroundImage} className='py-10 sm:py-16'>
      <div className='gap-6 flex flex-col'>
        <div className={`max-w-[48rem] ${marginAlign}`}>
          {richText && <RichText data={richText} />}
        </div>
        <div className={`gap-4 flex flex-col sm:flex-row ${flexJustify}`}>
          {(links || []).map(({ link }, i) => {
            return <CMSLink key={i} {...link} />
          })}
        </div>
      </div>
    </Container>
  )
}
