import { createContext, useContext } from 'react'
import type { Size } from '../../../theme'

export interface __Name__ContextValue {
  baseId: string
  isStyled: boolean
  size: Size
}

export const __Name__Context = createContext<__Name__ContextValue | undefined>(undefined)

export function use__Name__Context(): __Name__ContextValue {
  const context = useContext(__Name__Context)
  if (!context) {
    throw new Error('__Name__Content must be used within a <__Name__>')
  }
  return context
}

export const get__Name__ContentId = (baseId: string): string => `${baseId}-content`
