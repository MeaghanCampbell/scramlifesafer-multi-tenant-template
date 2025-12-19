import { createServerFeature } from '@payloadcms/richtext-lexical'

export type TextColorOption = {
  label: string
  value: string
}

export type TextColorProps = {
  colors: TextColorOption[]
  allowClear?: boolean
}

export const TextColorFeature = createServerFeature<TextColorProps, TextColorProps, TextColorProps>({
  key: 'textColor',
  feature: ({ props }) => {
    return {
      ClientFeature: '@/fields/richtext/features/textColor/feature.client#TextColorClientFeature',
      clientFeatureProps: props,
    }
  },
})
