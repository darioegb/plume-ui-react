'use client'

import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'

export type ToastStatus = 'neutral' | 'info' | 'success' | 'warning' | 'error'

export interface ToastAction {
  label: string
  onClick?: () => void
}

export type ToastIcons = Partial<Record<ToastStatus, ReactNode>>

export interface ToastData {
  action?: ToastAction
  description?: ReactNode
  dismissible: boolean
  duration: number
  icon?: ReactNode
  id: string
  onDismiss?: () => void
  revision: number
  status: ToastStatus
  title?: ReactNode
}

export interface ToastOptions {
  action?: ToastAction
  description?: ReactNode
  dismissible?: boolean
  duration?: number
  icon?: ReactNode
  id?: string
  onDismiss?: () => void
  status?: ToastStatus
  title?: ReactNode
}

export type ToastContent = ReactNode | ToastOptions

export interface ToastApi {
  dismiss: (id: string) => void
  dismissAll: () => void
  error: (content: ToastContent, options?: ToastOptions) => string
  info: (content: ToastContent, options?: ToastOptions) => string
  success: (content: ToastContent, options?: ToastOptions) => string
  toast: (content: ToastContent, options?: ToastOptions) => string
  warning: (content: ToastContent, options?: ToastOptions) => string
}

export const ToastContext = createContext<ToastApi | undefined>(undefined)

export function useToast(): ToastApi {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within a <ToastProvider>')
  return context
}
