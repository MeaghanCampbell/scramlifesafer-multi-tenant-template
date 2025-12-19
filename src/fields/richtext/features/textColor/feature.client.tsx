'use client'

import type { ToolbarGroup, ToolbarGroupItem } from '@payloadcms/richtext-lexical'
import { $getSelection, $isRangeSelection } from '@payloadcms/richtext-lexical/lexical'
import { $patchStyleText } from '@payloadcms/richtext-lexical/lexical/selection'
import { createClientFeature } from '@payloadcms/richtext-lexical/client'
import type { TextColorProps } from './feature.server'

const Swatch = ({ color }: { color?: string }) => (
  <span
    aria-hidden="true"
    style={{
      display: 'inline-block',
      width: 10,
      height: 10,
      borderRadius: 2,
      background: color || 'transparent',
      border: '1px solid rgba(0,0,0,.2)',
      verticalAlign: 'middle',
      flex: '0 0 auto',
    }}
  />
)

function createColorDropdownGroup(items: ToolbarGroupItem[]): ToolbarGroup {
  return {
    type: 'dropdown',
    key: 'textColorDropdown',
    order: 50,
    items,
  }
}

function applyColor(color: string | null) {
  const selection = $getSelection()
  if (!$isRangeSelection(selection)) return
  $patchStyleText(selection, { color: color ?? '' })
}

function getActiveColor(): string | null {
  const selection = $getSelection()
  if (!$isRangeSelection(selection)) return null

  const style = selection.style || ''
  const match = style.match(/color:\s*([^;]+)\s*;?/i)
  const value = match?.[1]?.trim()

  return value && value.length ? value : null
}

export const TextColorClientFeature = createClientFeature<TextColorProps, TextColorProps>(
  ({ props }) => {
    const items: ToolbarGroupItem[] = []

    if (props?.allowClear) {
      items.push({
        key: 'textColor-clear',
        label: () => 'Default',
        onSelect: ({ editor }) => editor.update(() => applyColor(null)),
        isActive: () => getActiveColor() == null,
      })
    }

    for (const c of props?.colors ?? []) {
      items.push({
        key: `textColor-${c.value}`,
        label: () => c.label,
        ChildComponent: () => <Swatch color={c.value} />,
        onSelect: ({ editor }) => editor.update(() => applyColor(c.value)),
        isActive: () => getActiveColor() === c.value,
      })
    }

    return {
      sanitizedClientFeatureProps: props,
      toolbarInline: {
        groups: [createColorDropdownGroup(items)],
      },
    }
  },
)
