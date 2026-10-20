'use client'

import { createContext, useContext } from 'react'
import type { Placement } from '../../../overlay'
import type { Size } from '../../../theme'

export interface PopoverContextValue {
  contentId: string
  flip: boolean
  isStyled: boolean
  offset: number
  open: boolean
  placement: Placement
  setOpen: (open: boolean) => void
  setTrigger: (element: HTMLElement | null) => void
  shift: boolean
  size: Size
  trigger: HTMLElement | null
  variant: PopoverVariant
}

export type PopoverVariant = 'elevated' | 'outline' | 'unstyled'

export const PopoverContext = createContext<PopoverContextValue | undefined>(undefined)

export function usePopoverContext(part: string): PopoverContextValue {
  const context = useContext(PopoverContext)
  if (!context) throw new Error(`${part} must be used within a <Popover>`)
  return context
}
