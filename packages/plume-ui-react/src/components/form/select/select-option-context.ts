'use client'

import type { ReactNode, RefObject } from 'react'
import { createContext, useContext } from 'react'

export interface SelectOptionContextValue {
  description: ReactNode
  descriptionId: string
  icon: ReactNode
  selected: boolean
  setDescribed: (described: boolean) => void
  textId: string
  textRef: RefObject<HTMLSpanElement | null>
}

export const SelectOptionContext = createContext<SelectOptionContextValue | undefined>(undefined)

export function useSelectOptionContext(part: string): SelectOptionContextValue {
  const context = useContext(SelectOptionContext)
  if (!context) throw new Error(`${part} must be used within a <SelectOption>`)
  return context
}
