'use client'

import { createContext, useContext } from 'react'

export interface BadgeContextValue {
  isStyled: boolean
}

export const BadgeContext = createContext<BadgeContextValue | undefined>(undefined)

export function useBadgeContext(part: string): BadgeContextValue {
  const context = useContext(BadgeContext)
  if (!context) throw new Error(`${part} must be used within a <Badge>`)
  return context
}
