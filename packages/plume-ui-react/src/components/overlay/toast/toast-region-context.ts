'use client'

import { createContext, useContext } from 'react'
import type { ToastIcons } from './toast-context'

export interface ToastRegionContextValue {
  dismiss: (id: string) => void
  dismissLabel: string
  icons: false | ToastIcons | undefined
  isStyled: boolean
}

export const ToastRegionContext = createContext<ToastRegionContextValue | undefined>(undefined)

export function useToastRegion(part: string): ToastRegionContextValue {
  const context = useContext(ToastRegionContext)
  if (!context) throw new Error(`${part} must be used within a <ToastProvider>`)
  return context
}
