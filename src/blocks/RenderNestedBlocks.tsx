/**
 * RenderNestedBlocks Component
 * 
 * Dynamically renders nested blocks added within other blocks
 * in Payload CMS. It maps block types to their corresponding React components
 * and displays them based on the user's input in the admin panel.
 * 
 * Supports:
 * - spacer: Component to add space between sections
 * - header: Adds header content to a section
 */

import React from 'react'
import { SpacerBlock } from '@/blocks/Spacer/Component'
import { HeaderBlock } from '@/blocks/Header/Component'

import type { SpacerBlock as SpacerBlockType, HeaderBlock as HeaderBlockType } from '@/payload-types'

export type NestedBlock = SpacerBlockType | HeaderBlockType

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nestedBlockComponents: Record<NestedBlock['blockType'], React.ComponentType<any>> = {
  spacer: SpacerBlock,
  headerBlock: HeaderBlock,
}

export const RenderNestedBlocks: React.FC<{blocks: NestedBlock[] | null | undefined}> = ({ blocks }) => {

  if (!blocks?.length) return null

  return (
    <>
      {blocks.map((block, index) => {
        const Block = nestedBlockComponents[block.blockType]
        return Block ? <Block key={index} {...block} /> : null
      })}
    </>
  )
}
