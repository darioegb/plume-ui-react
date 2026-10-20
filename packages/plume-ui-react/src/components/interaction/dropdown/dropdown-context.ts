'use client'

import type { RefObject } from 'react'
import { createContext, useContext } from 'react'
import type { Placement } from '../../../overlay'
import type { Size } from '../../../theme'

export type DropdownVariant = 'elevated' | 'outline' | 'unstyled'

export type DropdownInitialItem = 'first' | 'last' | 'none'

export interface DropdownContextValue {
  closeOnSelect: boolean
  flip: boolean
  initialItem: RefObject<DropdownInitialItem>
  isStyled: boolean
  menuId: string
  offset: number
  open: boolean
  openMenu: (initialItem: DropdownInitialItem) => void
  placement: Placement
  setOpen: (open: boolean) => void
  setTrigger: (element: HTMLElement | null) => void
  shift: boolean
  size: Size
  trigger: HTMLElement | null
  triggerId: string
  variant: DropdownVariant
}

export const DropdownContext = createContext<DropdownContextValue | undefined>(undefined)

export function useDropdownContext(part: string): DropdownContextValue {
  const context = useContext(DropdownContext)
  if (!context) throw new Error(`${part} must be used within a <Dropdown>`)
  return context
}
