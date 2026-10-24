'use client'

import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'
import type { ToastData } from './toast-context'

export interface ToastItemContextValue {
  dismiss: () => void
  dismissLabel: string
  icon: ReactNode
  isStyled: boolean
  onAction: () => void
  toast: ToastData
}

export const ToastItemContext = createContext<ToastItemContextValue | undefined>(undefined)

export function useToastItem(part: string): ToastItemContextValue {
  const context = useContext(ToastItemContext)
  if (!context) throw new Error(`${part} must be used within a <Toast>`)
  return context
}
