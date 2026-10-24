'use client'

import { createContext, useContext } from 'react'
import type { ColorScheme, Shape, Size } from '../../../theme'
import type { PaginatorEntry } from './paginator-range'

export type PaginatorVariant = 'ghost' | 'outline' | 'solid' | 'unstyled'

export interface PaginatorLabels {
  first: string
  last: string
  next: string
  page: (page: number, current: boolean) => string
  pagination: string
  previous: string
}

export interface PaginatorContextValue {
  colorScheme: ColorScheme
  current: number
  disabled: boolean
  entries: PaginatorEntry[]
  go: (page: number) => void
  isStyled: boolean
  labels: PaginatorLabels
  pages: number
  shape: Shape
  showEdges: boolean
  size: Size
  variants: { current: PaginatorVariant; other: PaginatorVariant }
}

export const PaginatorContext = createContext<PaginatorContextValue | undefined>(undefined)

export function usePaginatorContext(part: string): PaginatorContextValue {
  const context = useContext(PaginatorContext)
  if (!context) throw new Error(`${part} must be used within a <Paginator>`)
  return context
}
