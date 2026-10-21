'use client'

import type { Ref } from 'react'
import { createContext, useContext } from 'react'

export type NavbarVariant = 'outline' | 'filled' | 'solid' | 'unstyled'
export type NavbarBreakpoint = 'sm' | 'md' | 'lg' | 'never'

export interface NavbarContextValue {
  contentId: string
  isStyled: boolean
  open: boolean
  setOpen: (open: boolean) => void
  toggleRef: Ref<HTMLButtonElement>
}

export const NavbarContext = createContext<NavbarContextValue | undefined>(undefined)

export function useNavbarContext(part: string): NavbarContextValue {
  const context = useContext(NavbarContext)
  if (!context) throw new Error(`${part} must be used within a <Navbar>`)
  return context
}
