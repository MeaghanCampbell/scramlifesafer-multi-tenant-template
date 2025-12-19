/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SelectField } from '@payloadcms/plugin-form-builder/types'
import type { Control, FieldErrorsImpl, FieldValues } from 'react-hook-form'
import React from 'react'
import { Controller } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Error } from '../Error'
import { Width } from '../Width'
import { RadioGroup } from '@/components/ui/radio'

export const Radio: React.FC<
  SelectField & {
    control: Control<FieldValues, any>
    errors: Partial<FieldErrorsImpl>
  }
> = ({ name, label, options, control, errors, required, width }) => {
  
  return (
      <Width width={width}>
        <div className='mb-2'><Label>{label}</Label></div>
        <Controller
          name={name}
          control={control}
          defaultValue=""
          rules={{ required }}
          render={({ field: { value, onChange } }) => (
            <RadioGroup
              name={name}
              value={value}
              onChange={onChange}
              options={options}
            />
          )}
        />
        {errors[name] && <Error name={name} />}
      </Width>
  )
}
