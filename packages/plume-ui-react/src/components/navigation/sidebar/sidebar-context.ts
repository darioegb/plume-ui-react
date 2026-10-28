'use client'

import type { RefObject } from 'react'
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
