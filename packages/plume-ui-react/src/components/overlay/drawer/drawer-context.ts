'use client'

import { createContext, useContext } from 'react'

export type DrawerSide = 'bottom' | 'left' | 'right' | 'top'

export interface DrawerContextValue {
  side: DrawerSide
}

export const DrawerContext = createContext<DrawerContextValue | undefined>(undefined)

export function useDrawerContext(part: string): DrawerContextValue {
  const context = useContext(DrawerContext)
  if (!context) throw new Error(`${part} must be used within a <Drawer>`)
  return context
}
