/**
 * Spacer Block Component
 * ---------------------
 * Renders vertical spacing based on the selected size option.
 * Supports responsive padding classes for consistent layout spacing.
 */

import React from 'react'
import type { SpacerBlock as SpacerBlockProps } from '@/payload-types'

export const SpacerBlock: React.FC<SpacerBlockProps> = ({ size }) => {
  let className = ''

  switch (size) {
    case 'x-small':
      className = 'py-1'
      break
    case 'small':
      className = 'py-2'
      break
    case 'medium':
      className = 'py-4'
      break
    case 'large':
      className = 'py-6 sm:py-9'
      break
    case 'x-large':
      className = 'py-8 sm:py-12'
      break
    case 'xx-large':
      className = 'py-10 sm:py-16'
      break
    default:
      className = ''
  }

  return <div className={className} />
}
