import React from 'react'
import type { Page } from '@/payload-types'
import { blockComponents } from './registry'

export const RenderBlocks: React.FC<{ blocks: Page['layout'][0][] }> = ({ blocks }) => {
  if (!blocks?.length) return null

  return (
    <>
      {blocks.map((block, i) => {
        const Block =
          blockComponents[block.blockType as keyof typeof blockComponents]
        return Block ? <Block key={i} {...block} /> : null
      })}
    </>
  )
}