'use client'

import { createContext, useContext } from 'react'

export interface FieldContextValue {
  controlId: string
  labelId: string | undefined
}

export const FieldContext = createContext<FieldContextValue | undefined>(undefined)

export const useFieldContext = (): FieldContextValue | undefined => useContext(FieldContext)
