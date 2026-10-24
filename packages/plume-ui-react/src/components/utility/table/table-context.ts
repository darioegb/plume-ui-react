'use client'

import type { ForwardedRef } from 'react'
import { createContext, useContext } from 'react'
import type { Size } from '../../../theme'
import type { TableLabels, TableVariant } from './table'

export interface TableContextValue {
  ariaLabel?: string
  ariaLabelledBy?: string
  hoverable: boolean
  isStyled: boolean
  labels: TableLabels
  loading: boolean
  size: Size
  stickyHeader: boolean
  tableRef: ForwardedRef<HTMLTableElement>
  variant: TableVariant
}

export const TableContext = createContext<TableContextValue | undefined>(undefined)

export function useTableContext(part: string): TableContextValue {
  const context = useContext(TableContext)
  if (!context) throw new Error(`${part} must be used within a <Table>`)
  return context
}
