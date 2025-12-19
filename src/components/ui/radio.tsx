'use client'

import * as React from 'react'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { cn } from '@/utilities/ui'

type Option = {
  label: string
  value: string
}

interface RadioGroupProps {
  value: string
  onChange: (val: string) => void
  options: Option[]
  name?: string
}

export const RadioGroup: React.FC<RadioGroupProps> = ({ value, onChange, options, name }) => {
  return (
    <RadioGroupPrimitive.Root
      className="flex flex-col gap-2"
      value={value}
      onValueChange={onChange}
      name={name}
    >
      {options.map((opt) => (
        <div key={opt.value} className="flex items-center space-x-2">
          <RadioGroupPrimitive.Item
            value={opt.value}
            id={`${name}-${opt.value}`}
            className={cn(
              'cursor-pointer bg-white h-4 w-4 rounded-full border border-slate-400 data-[state=checked]:border-primary data-[state=checked]:bg-primary-500 flex items-center justify-center',
            )}
          >
            <RadioGroupPrimitive.Indicator
              className={cn('h-2 w-2 rounded-full bg-white')}
            />
          </RadioGroupPrimitive.Item>
          <label htmlFor={`${name}-${opt.value}`} className="cursor-pointer">
            {opt.label}
          </label>
        </div>
      ))}
    </RadioGroupPrimitive.Root>
  )
}
