'use client'

import * as React from 'react'
import { Checkbox } from '@/components/ui/checkbox'

type Option = {
  label: string
  value: string
}

interface MultiSelectProps {
  value: string[]
  onChange: (value: string[]) => void
  options: Option[]
  name?: string
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  value,
  onChange,
  options,
  name,
}) => {
  const handleToggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue))
    } else {
      onChange([...value, optionValue])
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {options.map((opt) => (
        <label key={opt.value} className="flex items-center gap-2 cursor-pointer text-secondary-100">
          <Checkbox
            checked={value.includes(opt.value)}
            onCheckedChange={() => handleToggle(opt.value)}
            id={`${name}-${opt.value}`}
          />
          <span>{opt.label}</span>
        </label>
      ))}
    </div>
  )
}
