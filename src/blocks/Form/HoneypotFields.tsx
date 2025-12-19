'use client'
import React, { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

const HONEYPOT_NAME = 'contact_website'
const HONEYPOT_TS   = 'hp_ts'
const HONEYPOT_SIG  = 'hp_sig'

export const HoneypotFields: React.FC<{ ts: string; sig: string }> = ({ ts, sig }) => {
  const { register, setValue } = useFormContext()

  useEffect(() => {
    setValue(HONEYPOT_TS, ts,  { shouldDirty: false, shouldTouch: false })
    setValue(HONEYPOT_SIG, sig, { shouldDirty: false, shouldTouch: false })
  }, [setValue, ts, sig])

  return (
    <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        {...register(HONEYPOT_NAME)}
        defaultValue=""
      />
      <input type="text" tabIndex={-1} readOnly {...register(HONEYPOT_TS)}  defaultValue={ts} />
      <input type="text" tabIndex={-1} readOnly {...register(HONEYPOT_SIG)} defaultValue={sig} />
    </div>
  )
}
