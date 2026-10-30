'use client'

import { createContext, useContext } from 'react'

export interface ButtonLabels {
  busy: string
}

export interface ButtonContextValue {
  busy: boolean
  busyText: string
  isStyled: boolean
  labels: ButtonLabels
}

export const ButtonContext = createContext<ButtonContextValue | undefined>(undefined)

export function useButtonContext(part: string): ButtonContextValue {
  const context = useContext(ButtonContext)
  if (!context) throw new Error(`<${part}> must be rendered inside a <Button>`)
  return context
}
