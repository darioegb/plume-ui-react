'use client'

import { createContext, useContext } from 'react'

export interface SelectGroupContextValue {
  labelId: string
}

export const SelectGroupContext = createContext<SelectGroupContextValue | undefined>(undefined)

export function useSelectGroupContext(part: string): SelectGroupContextValue {
  const context = useContext(SelectGroupContext)
  if (!context) throw new Error(`${part} must be used within a <SelectGroup>`)
  return context
}
