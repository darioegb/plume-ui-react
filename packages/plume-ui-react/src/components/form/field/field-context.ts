'use client'

import { createContext, useContext } from 'react'

export interface FieldContextValue {
  labelId: string | undefined
}

export const FieldContext = createContext<FieldContextValue | undefined>(undefined)

export const useFieldContext = (): FieldContextValue | undefined => useContext(FieldContext)
