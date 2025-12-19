/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import 'react-phone-number-input/style.css'
import PhoneInputWithCountry from 'react-phone-number-input/react-hook-form'
import { isPossiblePhoneNumber } from 'react-phone-number-input'

import type { TextField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, Control } from 'react-hook-form'

import { Label } from '@/components/ui/label'
import React, { useEffect, useState } from 'react'

import { Error } from '../Error'
import { Width } from '../Width'

type PhoneProps = TextField & {
    errors: Partial<FieldErrorsImpl<FieldValues>>
    control: Control<FieldValues>
}

export const Phone: React.FC<PhoneProps> = ({
    name,
    defaultValue,
    errors,
    label,
    control,
    required,
    width,
}) => {

    // Browser-detected country (set after mount, client only)
    const [detectedCountry, setDetectedCountry] = useState<string | undefined>(
        undefined,
    )

    // 1️⃣ SSR-safe "base" default country (same on server and client)
    const defaultCountryFromPayload =
        typeof defaultValue === 'string'
        ? defaultValue.toUpperCase()
        : undefined

    // 2️⃣ What we actually pass to the component
    const defaultCountry = defaultCountryFromPayload ?? detectedCountry

    // 3️⃣ Only after mount, read navigator and override if we have nothing better
    useEffect(() => {
        // Only run in browser
        const locale =
        window.navigator.language ||
        (Array.isArray(window.navigator.languages) &&
            window.navigator.languages[0])

        const countryPart = locale?.split('-')[1]
        const country = countryPart?.toUpperCase()

        // Only override if we didn't already have a default from Payload
        if (!defaultCountryFromPayload && country) {
        setDetectedCountry(country)
        }
    }, [defaultCountryFromPayload])

    return (
        <Width width={width}>
            <Label htmlFor={name}>
                {label}
                {required && (
                <span className="required">
                    * <span className="sr-only">(required)</span>
                </span>
                )}
            </Label>
        
            <PhoneInputWithCountry
                name={name}
                control={control}
                id={name}
                placeholder="Enter phone number"
                defaultCountry={defaultCountry as any}
                className="PhoneInput w-full"
                numberInputProps={{
                    className: 'ml-2 flex h-10 w-full rounded border border-border bg-white px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50',
                }}
                rules={{
                required: required ? 'This field is required' : false,
                validate: (value: string | undefined) =>
                    !value || isPossiblePhoneNumber(value) || 'Invalid phone number',
                }}
            />
        
            {errors[name] && <Error name={name} />}
        </Width>
    )
}

