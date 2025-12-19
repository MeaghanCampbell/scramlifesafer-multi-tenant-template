/**
 * Background Field Component
 * ----------------------------
 * Custom Payload admin field for selecting a background color option.
 * 
 * Provides a visual button group with color swatches for 'dark', 'light', and 'white'. 
 */

'use client'

import './index.css'
import React from 'react'
import { useField, FieldLabel, FieldDescription } from '@payloadcms/ui'

type Props = {
  path: string
  label?: string
  required?: boolean
  admin?: {
    description?: string
  }
}

const backgroundOptions = [
  { label: 'White', value: 'white', color: '#ffffff' },
  { label: 'Light', value: 'light', color: '#F3F4F6' },
]

export const BackgroundComponent: React.FC<Props> = ({
  path,
  label,
  required,
  admin,
}) => {
    const { value, setValue } = useField<string>({ path })

    const handleClick = (v: string) => setValue(v)

    return (
      <div className='field-type background-select'>
        {label && <FieldLabel htmlFor={path} label={label} required={required} />}
        {admin?.description && (
          <FieldDescription path={path} description={admin.description} />
        )}
  
        <div className="background-options">
          {backgroundOptions.map(({ value: optionValue, label, color }) => (
            <button
              key={optionValue}
              type="button"
              onClick={() => handleClick(optionValue)}
              className={`background-option ${value === optionValue ? 'selected' : ''}`}
            >
              <div style={{ backgroundColor: color }} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    )
}