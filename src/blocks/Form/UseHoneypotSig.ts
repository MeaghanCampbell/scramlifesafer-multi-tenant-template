// Exports the hpPair from the provider to use on the Form component

'use client'
import { useHoneypotSig } from '@/components/HoneypotContext'
export const useHpSigPair = () => useHoneypotSig()