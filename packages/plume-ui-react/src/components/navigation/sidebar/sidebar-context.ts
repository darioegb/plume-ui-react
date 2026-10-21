'use client'

import type { RefObject } from 'react'
import { createContext, useContext } from 'react'

export type SidebarVariant = 'plain' | 'filled' | 'solid' | 'unstyled'
export type SidebarBreakpoint = 'sm' | 'md' | 'lg' | 'never'
export type SidebarSide = 'left' | 'right'

export const sidebarQueries: Record<SidebarBreakpoint, string> = {
  sm: '(width < 40rem)',
  md: '(width < 48rem)',
  lg: '(width < 64rem)',
  never: 'not all',
}

export interface SidebarContextValue {
  breakpoint: SidebarBreakpoint
  collapsed: boolean
  isMobile: boolean
  open: boolean
  panelId: string
  setCollapsed: (collapsed: boolean) => void
  setOpen: (open: boolean) => void
  toggleRef: RefObject<HTMLElement | null>
}

export const SidebarContext = createContext<SidebarContextValue | undefined>(undefined)

export interface SidebarStyleContextValue {
  isStyled: boolean
}

export const SidebarStyleContext = createContext<SidebarStyleContextValue>({ isStyled: true })

export function useSidebarContext(part: string): SidebarContextValue {
  const context = useContext(SidebarContext)
  if (!context) throw new Error(`${part} must be used within a <SidebarProvider>`)
  return context
}
