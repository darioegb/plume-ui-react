'use client'

import { createContext, useContext } from 'react'
import type { Size } from '../../../theme'

export type AccordionVariant = 'outline' | 'filled' | 'unstyled'

export interface AccordionContextValue {
  disabled: boolean
  isOpen: (value: string) => boolean
  isStyled: boolean
  size: Size
  toggle: (value: string) => void
  variant: AccordionVariant
}

export interface AccordionItemContextValue {
  contentId: string
  disabled: boolean
  open: boolean
  triggerId: string
  value: string
}

export const AccordionContext = createContext<AccordionContextValue | undefined>(undefined)

export const AccordionItemContext = createContext<AccordionItemContextValue | undefined>(undefined)

export function useAccordionContext(part: string): AccordionContextValue {
  const context = useContext(AccordionContext)
  if (!context) throw new Error(`${part} must be used within a <Accordion>`)
  return context
}

export function useAccordionItemContext(part: string): AccordionItemContextValue {
  const context = useContext(AccordionItemContext)
  if (!context) throw new Error(`${part} must be used within an <AccordionItem>`)
  return context
}
