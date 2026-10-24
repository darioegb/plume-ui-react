'use client'

import type { MouseEvent } from 'react'
import { createContext, useContext } from 'react'

export interface ChipLabels {
  remove: string
}

export interface ChipContextValue {
  customRemoveLabel: boolean
  disabled: boolean
  isStyled: boolean
  labelId: string
  labels: ChipLabels
  onRemove?: (event: MouseEvent<HTMLButtonElement>) => void
  removeId: string
}

export const ChipContext = createContext<ChipContextValue | undefined>(undefined)

export function useChipContext(part: string): ChipContextValue {
  const context = useContext(ChipContext)
  if (!context) throw new Error(`<${part}> must be rendered inside a <Chip>`)
  return context
}
