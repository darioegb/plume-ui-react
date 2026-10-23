'use client'

import { createContext, useContext } from 'react'

export const TabIndexContext = createContext<number | undefined>(undefined)

export const useTabIndex = (explicit?: number): number => {
  const position = useContext(TabIndexContext)
  return explicit ?? position ?? 0
}
