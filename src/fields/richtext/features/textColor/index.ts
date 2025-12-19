import { TextColorFeature } from './feature.server'
import type { TextColorProps } from './feature.server'

const DEFAULT_COLORS = [
  { label: 'White', value: '#FFFFFF' },
  { label: 'Black', value: '#000000' },
  { label: 'Gray', value: '#62748e' },
] as const

const DEFAULT_PROPS: TextColorProps = {
  colors: [...DEFAULT_COLORS],
  allowClear: true,
}

/**
 * Text color feature with defaults.
 * Call with no args to use defaults,
 * or pass partial overrides.
 */
export const textColor = (
  overrides: Partial<TextColorProps> = {},
) => {
  return TextColorFeature({
    ...DEFAULT_PROPS,
    ...overrides,
  })
}
