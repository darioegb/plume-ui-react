'use client'

import { createContext, useContext } from 'react'

export type DrawerSide = 'bottom' | 'left' | 'right' | 'top'

export type DrawerShape = 'rounded' | 'square'

export interface DrawerContextValue {
  shape: DrawerShape
  side: DrawerSide
}

export const DrawerContext = createContext<DrawerContextValue | undefined>(undefined)

export function useDrawerContext(part: string): DrawerContextValue {
  const context = useContext(DrawerContext)
  if (!context) throw new Error(`${part} must be used within a <Drawer>`)
  return context
}
