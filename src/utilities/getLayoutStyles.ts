import type { AlignmentField, BackgroundField } from '@/payload-types'

/**
 * Returns a Tailwind background color class based on the background config.
 *
 * @param background - Background input containing type and color
 * @returns A Tailwind background color class or empty string
 */
export function getBackgroundColor(background?: BackgroundField): string {
  if (background?.type === 'color') {
    switch (background.color) {
      case 'light':
        return 'bg-slate-100'
      case 'white':
        return 'bg-white'
      default:
        return ''
    }
  }
  return ''
}


/**
 * Returns the image URL if background type is 'image'.
 *
 * @param background - Background input containing type and image
 * @returns Image URL string or null
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getBackgroundImage(background?: BackgroundField): any | null {
    if (background?.type === 'image' && background.image) {
      return background.image
    }
    return null
}

/**
 * Returns a Tailwind margin class based on the alignment config.
 *
 * @param alignment - Alignment input containing left, right or center
 * @returns A Tailwind margin class or empty string
 */
export function getMarginAlign(alignment?: AlignmentField): string {
    switch (alignment) {
      case 'center':
        return 'mx-auto'
      case 'right':
        return 'ml-auto'
      default:
        return ''
    }
}

/**
 * Returns a Tailwind flex justify class based on the alignment config.
 *
 * @param alignment - Alignment input containing left, right or center
 * @returns A Tailwind flex alignment class or justify-start (default left)
 */
export function getFlexJustify(alignment?: AlignmentField): string {
    switch (alignment) {
      case 'center':
        return 'justify-center'
      case 'right':
        return 'justify-end'
      default:
        return 'justify-start'
    }
}
  