'use client'

import { createContext, useContext } from 'react'

export interface SelectContentContextValue {
  ariaLabel: string | undefined
  searchPlaceholder: string | undefined
  setSearch: (element: HTMLInputElement | null) => void
}

export const SelectContentContext = createContext<SelectContentContextValue | undefined>(undefined)

export function useSelectContentContext(part: string): SelectContentContextValue {
  const context = useContext(SelectContentContext)
  if (!context) throw new Error(`${part} must be used within a <SelectContent>`)
  return context
}
