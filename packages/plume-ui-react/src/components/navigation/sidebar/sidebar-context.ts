'use client'

import { createContext, useContext } from 'react'
import { defaultTheme } from '../../../theme/config'

export type SidebarVariant = 'plain' | 'filled' | 'solid' | 'unstyled'
export type SidebarBreakpoint = 'sm' | 'md' | 'lg' | 'never'
export type SidebarSide = 'left' | 'right'

const { sm, md, lg } = defaultTheme.breakpoints

export const sidebarQueries: Record<SidebarBreakpoint, string> = {
  sm: `(width < ${sm})`,
  md: `(width < ${md})`,
  lg: `(width < ${lg})`,
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
  setToggle: (toggle: HTMLElement | null) => void
  toggle: HTMLElement | null
}

export const SidebarContext = createContext<SidebarContextValue | undefined>(undefined)

export interface SidebarStyleContextValue {
  isStyled: boolean
}

export const SidebarStyleContext = createContext<SidebarStyleContextValue | undefined>(undefined)

export function useSidebarContext(part: string): SidebarContextValue {
  const context = useContext(SidebarContext)
  if (!context) throw new Error(`${part} must be used within a <SidebarProvider>`)
  return context
}

export function useSidebarStyle(part: string): SidebarStyleContextValue {
  const context = useContext(SidebarStyleContext)
  if (!context) throw new Error(`${part} must be used within a <Sidebar>`)
  return context
}
