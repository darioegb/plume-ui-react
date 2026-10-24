'use client'

import type { ReactNode, Ref } from 'react'
import { createContext, useContext } from 'react'

export type SelectDisplay = 'chips' | 'text'

export interface SelectTriggerContextValue {
  ariaLabel: string | undefined
  buttonRef: Ref<HTMLButtonElement>
  display: SelectDisplay
  labelledBy: string | undefined
  maxDisplay: number
  placeholder: ReactNode
  toggle: () => void
}

export const SelectTriggerContext = createContext<SelectTriggerContextValue | undefined>(undefined)

export function useSelectTriggerContext(part: string): SelectTriggerContextValue {
  const context = useContext(SelectTriggerContext)
  if (!context) throw new Error(`${part} must be used within a <SelectTrigger>`)
  return context
}
