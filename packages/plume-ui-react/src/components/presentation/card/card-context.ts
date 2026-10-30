'use client'

import { createContext, useContext } from 'react'

export interface CardContextValue {
  isStyled: boolean
}

export const CardContext = createContext<CardContextValue | undefined>(undefined)

export function useCardContext(part: string): CardContextValue {
  const context = useContext(CardContext)
  if (!context) throw new Error(`${part} must be used within a <Card>`)
  return context
}
