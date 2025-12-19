import React from 'react'
import type { TextBlock as TextBlockProps } from '@/payload-types'
import RichText from '@/components/RichText'
import { Container } from '@/components/Container'
import { RenderNestedBlocks } from '../RenderNestedBlocks'
import { getBackgroundColor, getBackgroundImage } from '@/utilities/getLayoutStyles'


export const TextBlock: React.FC<TextBlockProps> = ({
    background,
    content, 
    afterContent,
    beforeContent
  }) => {

    const backgroundColor = getBackgroundColor(background ?? '')
    const backgroundImage = getBackgroundImage(background ?? '')    

    return (
        <Container backgroundColor={backgroundColor} backgroundImage={backgroundImage}>
            {beforeContent && <RenderNestedBlocks blocks={beforeContent} />}
            {content && <RichText data={content} />}
            {afterContent && <RenderNestedBlocks blocks={afterContent} />}
        </Container>
    )

  }