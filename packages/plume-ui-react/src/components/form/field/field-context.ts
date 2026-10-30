'use client'

import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'

export interface FieldContextValue {
  controlId: string
  disabled: boolean
  errorId: string
  helperId: string
  invalid: boolean
  isStyled: boolean
  labelId: string | undefined
  optionalText: ReactNode
  required: boolean
}

export const FieldContext = createContext<FieldContextValue | undefined>(undefined)

export const useFieldContext = (): FieldContextValue | undefined => useContext(FieldContext)

export function useFieldPartContext(part: string): FieldContextValue {
  const context = useContext(FieldContext)
  if (!context) throw new Error(`<${part}> must be used within a <Field>`)
  return context
}
