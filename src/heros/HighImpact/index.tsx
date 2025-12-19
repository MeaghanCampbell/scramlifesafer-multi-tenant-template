import React from 'react'
import type { HeroField } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { 
  getBackgroundColor, 
  getBackgroundImage, 
  getMarginAlign, 
  getFlexJustify 
} from '@/utilities/getLayoutStyles'
import { Container } from '@/components/Container'

export const HighImpactHero: React.FC<HeroField> = ({ 
  links, 
  media, 
  richText, 
  background, 
  alignment 
}) => {

  const backgroundColor = getBackgroundColor(background)
  const backgroundImage = getBackgroundImage(background)   
  const marginAlign = getMarginAlign(alignment)
  const flexJustify = getFlexJustify(alignment)

  return (

    <Container backgroundColor={backgroundColor} backgroundImage={backgroundImage} className='py-10 sm:py-16'>
      <div className='flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-16'>
        <div className='gap-6 flex flex-col w-full lg:w-1/2'>
          <div className={marginAlign}>
            {richText && <RichText data={richText} />}
          </div>
          <div className={`gap-4 flex flex-col sm:flex-row ${flexJustify}`}>
            {(links || []).map(({ link }, i) => {
              return <CMSLink key={i} {...link} />
            })}
          </div>
        </div>

        <div className='w-full lg:w-1/2'>
          {media && typeof media === 'object' && (
            <Media priority imgClassName='rounded' resource={media} />
          )}
        </div>
      </div>
    </Container>

  )
}
