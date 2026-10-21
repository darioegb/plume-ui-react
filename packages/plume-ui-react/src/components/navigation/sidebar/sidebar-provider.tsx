'use client'

import type { ReactNode } from 'react'
import { useId, useMemo, useRef } from 'react'
import { useControllableState } from '../../../overlay/use-controllable-state'
import { useMediaQuery } from '../../../overlay/use-media-query'
import { SidebarContext, sidebarQueries, type SidebarBreakpoint } from './sidebar-context'

export interface SidebarProviderProps {
  breakpoint?: SidebarBreakpoint
  children?: ReactNode
  collapsed?: boolean
  defaultCollapsed?: boolean
  defaultOpen?: boolean
  id?: string
  onCollapsedChange?: (collapsed: boolean) => void
  onOpenChange?: (open: boolean) => void
  open?: boolean
}

export function SidebarProvider({
  breakpoint = 'md',
  children,
  collapsed: collapsedProp,
  defaultCollapsed = false,
  defaultOpen = false,
  id,
  onCollapsedChange,
  onOpenChange,
  open: openProp,
}: Readonly<SidebarProviderProps>): ReactNode {
  const generatedId = useId()
  const [open, setOpen] = useControllableState({
    defaultValue: defaultOpen,
    onChange: onOpenChange,
    value: openProp,
  })
  const [collapsed, setCollapsed] = useControllableState({
    defaultValue: defaultCollapsed,
    onChange: onCollapsedChange,
    value: collapsedProp,
  })
  const isMobile = useMediaQuery(sidebarQueries[breakpoint])
  const toggleRef = useRef<HTMLElement | null>(null)
  const panelId = id ?? `${generatedId}-sidebar`

  const context = useMemo(
    () => ({ breakpoint, collapsed, isMobile, open, panelId, setCollapsed, setOpen, toggleRef }),
    [breakpoint, collapsed, isMobile, open, panelId, setCollapsed, setOpen],
  )

  return <SidebarContext.Provider value={context}>{children}</SidebarContext.Provider>
}
