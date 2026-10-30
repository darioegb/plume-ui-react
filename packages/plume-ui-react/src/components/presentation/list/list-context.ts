'use client'

import { createContext, useContext } from 'react'

export interface ListContextValue {
  isStyled: boolean
}

export const ListContext = createContext<ListContextValue | undefined>(undefined)

export function useListContext(part: string): ListContextValue {
  const context = useContext(ListContext)
  if (!context) throw new Error(`${part} must be used within a <List>`)
  return context
}
