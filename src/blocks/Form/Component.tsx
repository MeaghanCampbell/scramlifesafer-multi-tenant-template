/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import type { FormFieldBlock} from '@payloadcms/plugin-form-builder/types'
import type { Form as FormType } from '@/payload-types'
import { usePathname, useRouter } from 'next/navigation'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import RichText from '@/components/RichText'
import { Button } from '@/components/ui/button'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import { fields } from './fields'
import { getClientSideURL } from '@/utilities/getURL'
import { HoneypotFields } from './HoneypotFields'
import { getCookie } from '@/utilities/getCookie'
import { emitCustomerSubmission } from '@/utilities/analytics'
import { useHpSigPair } from './UseHoneypotSig'
import { buildInitialFormState } from './buildInitialFormState'
import { GlobalHiddenFields } from './GlobalHiddenFields'

export type Value = unknown

export interface Property {
  [key: string]: Value
}

export interface Data {
  [key: string]: Property | Property[]
}

export type FormBlockType = {
  blockName?: string
  blockType?: 'formBlock'
  enableIntro: boolean
  form: FormType
  introContent?: DefaultTypedEditorState
  ctaText?: string
}

export const FormBlock: React.FC<{id?: string} & FormBlockType> = ({
  form: formFromProps,
  form: { id: formID, confirmationMessage, confirmationType, redirect, submitButtonLabel, terms, type } = {},
  enableIntro,
  introContent,
  ctaText,
}) => {
  
  // helper variables and initialize states
  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const router = useRouter()
  const hpPair = useHpSigPair()

  const [serverTs, serverSig] = useMemo(() => {
    const [ts, sig] = (hpPair || '').split(':')
    return [ts || '', sig || '']
  }, [hpPair])
  
  const firedRef = useRef(false)
  const renderStartRef = useRef<number>(Date.now())

  // Multi-Step form logic
  const isMultiStep = formFromProps?.type === 'multiStep'

  const steps = useMemo(() => {
    if (!isMultiStep) {
      return [[1, formFromProps?.fields || []]]
    }

    return formFromProps?.steps?.map((step, i) => {
      return [i + 1, step.multiStepFields] as [number, typeof step.multiStepFields, string?]
    }) || []
  }, [formFromProps, isMultiStep])

  const [currentStep, setCurrentStep] = useState(1)

  const totalSteps = steps.length
  const [_, currentFields, currentStepLabel] = steps.find(([step]) => step === currentStep) || []

  // form initialization
  // react-form-hook initialized with default values for each field
  // defaults are calculated by `buildInitialFormState` helper based on block type
  const formMethods = useForm({
    // @ts-expect-error - extended the form type beyond the payload form builder plugin type
    defaultValues: buildInitialFormState(formFromProps.fields ?? []),
  })
  
  // extracted props
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = formMethods

  const pathname = usePathname()

  // OnSubmit:
  // Runs Honeypot, builds/sends data to /api/form-submissions, redirects or shows conf message
  const onSubmit = useCallback(
    (data: FormFieldBlock[]) => {
      let loadingTimerID: ReturnType<typeof setTimeout>
      const submitForm = async () => {
        setError(undefined)

        const elapsed = Date.now() - renderStartRef.current
        // too fast; honeypot block
        if (elapsed < 2000) {
            setError({ message: 'Please wait a moment and try again.' })
            return
        }

        loadingTimerID = setTimeout(() => {
          setIsLoading(true)
        }, 1000)

        try {
          const hubspotCookie = getCookie('hubspotutk')
          const pageUri = `${getClientSideURL()}/${pathname}`
          const slugParts = pageUri.split('/')
          const pageName = slugParts.at(-1) === '' ? 'Home' : slugParts.at(-1)
          const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              form: formID,
              ...data,
              hubspotCookie,
              pageUri,
              pageName
            })
          })

          const res = await req.json()

          clearTimeout(loadingTimerID)

          if (req.status >= 400) {
            setIsLoading(false)

            setError({
              message: res.errors?.[0]?.message || 'Internal Server Error',
              status: res.status,
            })

            return
          }

          setIsLoading(false)
          setHasSubmitted(true)

          if (!firedRef.current) {
            firedRef.current = true
            emitCustomerSubmission({
              formId: String(formID ?? 'payload_form'),
              formName: (formFromProps?.title as string) || 'Payload Form',
              fields: {
                // you can pass all values; helper will whitelist:
                ...data,
                // optionally include your hubspot cookie or utms if stored:
                hubspotutk: getCookie('hubspotutk'),
              },
              page: `${getClientSideURL()}/${pathname}`,
            })
          }

          if (confirmationType === 'redirect' && redirect) {
            const { url } = redirect

            const redirectUrl = url

            if (redirectUrl) router.push(redirectUrl)
          }
        } catch (err) {
          console.warn(err)
          setIsLoading(false)
          setError({
            message: 'Something went wrong.',
          })
        }
      }

      void submitForm()
    },
    [pathname, formID, serverSig, confirmationType, redirect, formFromProps?.title, router],
  )

  return (
    <div className='bg-slate-100 max-w-3xl p-8 mx-auto rounded'>
      <FormProvider {...formMethods}>
        {!isLoading && hasSubmitted && confirmationType === 'message' && confirmationMessage && (
          <div className='text-center font-bold'>
            <RichText data={confirmationMessage} />
          </div>
        )}

        {isLoading && !hasSubmitted && <p>Loading, please wait...</p>}
        {error && <div>{`${error.status || '500'}: ${error.message || ''}`}</div>}
        {!hasSubmitted && (
          <>

            {enableIntro && introContent && (
              <div className="mb-4">
                <RichText data={introContent} />
              </div>
            )}

            {type === 'multiStep' && (
              <div className="mb-6">
                <p className="text-base font-medium text-slate-800 mb-2">{`Step ${currentStep} of ${totalSteps}`}</p>
                <div className="flex gap-2">
                  {Array.from({ length: totalSteps }).map((_, index) => {
                    const stepNumber = index + 1
                    const isActive = currentStep >= stepNumber
                    return (
                      <div
                        key={index}
                        className={`h-2 flex-1 rounded transition-colors duration-300 ${
                          isActive ? 'bg-secondary-dark' : 'bg-secondary-light/80'
                        }`}
                      />
                    )
                  })}
                </div>
              </div>
            )}

            <form id={formID} onSubmit={handleSubmit(onSubmit)}>

              <div key={`step-${currentStep}`} className="flex flex-wrap gap-4 mb-4 last:mb-0">
                {Array.isArray(currentFields) &&
                  currentFields.map((field: any, index: React.Key | null | undefined) => {
                    const Field = fields?.[field.blockType as keyof typeof fields]
                    return Field ? (
                      <React.Fragment key={index}>
                        <Field
                        form={formFromProps}
                        {...field}
                        {...formMethods}
                        control={control}
                        errors={errors}
                        register={register}
                        name={field.name}
                        conditions={field.conditions}
                        conditionOperator={field.conditionOperator}
                      />
                    </React.Fragment>
                  ) : null
                })}   
              </div>

              <GlobalHiddenFields />
              <HoneypotFields ts={serverTs} sig={serverSig} />

              {currentStep === totalSteps && terms && (
                <div className="text-xs mt-4">
                  <RichText data={terms} />
                </div>
              )}

              <div className="flex justify-between">
                {currentStep > 1 && (
                  <Button type="button" variant="secondary" onClick={() => setCurrentStep(currentStep - 1)} className="cursor-pointer mt-4">
                    Back
                  </Button>
                )}

                {currentStep < totalSteps ? (
                  <div className='w-full flex justify-end'>
                    <Button
                      type="button"
                      className="cursor-pointer mt-4 float-right"
                      onClick={async () => {
                        // @ts-expect-error - map type error
                        const isStepValid = await formMethods.trigger(currentFields?.map((field: any) => field.name).filter(Boolean))

                        if (isStepValid) {
                          setCurrentStep(currentStep + 1)
                        }
                      }}
                    >
                      Next
                    </Button>
                  </div>
                ) : (
                  <Button form={formID} type="submit" className="cursor-pointer mt-4">
                    {ctaText || submitButtonLabel || 'Submit'}
                  </Button>
                )}
              </div>
            </form>
            
          </>
        )}
      </FormProvider>
    </div>
  )
}
