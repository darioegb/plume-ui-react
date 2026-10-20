'use client'

import type { RefObject } from 'react'
import { createContext, useContext } from 'react'
import type { Size } from '../../../theme'

export interface ModalContextValue {
  bodyId: string
  closeOnEscape: boolean
  closeOnOutside: boolean
  contentId: string
  initialFocus: RefObject<HTMLElement | null> | undefined
  isStyled: boolean
  open: boolean
  setOpen: (open: boolean) => void
  setTrigger: (element: HTMLElement | null) => void
  size: Size
  titleId: string
  trigger: HTMLElement | null
}

export const ModalContext = createContext<ModalContextValue | undefined>(undefined)

export function useModalContext(part: string): ModalContextValue {
  const context = useContext(ModalContext)
  if (!context) throw new Error(`${part} must be used within a <Modal>`)
  return context
}
