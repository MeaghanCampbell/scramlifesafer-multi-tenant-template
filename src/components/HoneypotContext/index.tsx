// stores tsMs:hpSig in React context around your site components

'use client'

import React, { createContext, useContext, useMemo } from 'react'

const HoneypotSigContext = createContext<string>('')

export const useHoneypotSig = () => useContext(HoneypotSigContext)

export const HoneypotSigProvider: React.FC<{ children: React.ReactNode, sig: string }> = ({ children, sig }) => {
  const value = useMemo(() => sig, [sig])
  return <HoneypotSigContext.Provider value={value}>{children}</HoneypotSigContext.Provider>
}