'use client'

import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'

export type BreadcrumbVariant = 'plain' | 'filled' | 'unstyled'

export interface BreadcrumbContextValue {
  isStyled: boolean
  separator: ReactNode
  separatorClassName?: string
}

export const BreadcrumbContext = createContext<BreadcrumbContextValue | undefined>(undefined)

export function useBreadcrumbContext(part: string): BreadcrumbContextValue {
  const context = useContext(BreadcrumbContext)
  if (!context) throw new Error(`${part} must be used within a <Breadcrumb>`)
  return context
}
