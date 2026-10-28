'use client'

import type { ReactNode } from 'react'
import { useId, useMemo, useRef } from 'react'
import { useControllableState } from '../../../overlay/use-controllable-state'
import { useMediaQuery } from '../../../overlay/use-media-query'
import { SidebarContext, sidebarQueries, type SidebarBreakpoint } from './sidebar-context'

export interface SidebarProviderProps {
  /**
   * Below this width the sidebar is a panel that opens over the page: `sm` is 640px, `md` 768px and
   * `lg` 1024px. `never` keeps it always docked.
   *
   * @default 'md'
   */
  breakpoint?: SidebarBreakpoint
  /** What goes in the sidebar, usually a `SidebarContent`, and the rest of your layout. */
  children?: ReactNode
  /**
   * Whether the sidebar is collapsed to its rail on a wide screen. Makes the collapsed state
   * controlled: pass `onCollapsedChange` too.
   */
  collapsed?: boolean
  /**
   * Whether the sidebar starts collapsed, when the collapsed state is not controlled.
   *
   * @default false
   */
  defaultCollapsed?: boolean
  /**
   * Whether the panel starts open on a small screen, when the open state is not controlled.
   *
   * @default false
   */
  defaultOpen?: boolean
  /**
   * The id of the panel, which the toggle points to with `aria-controls`. It is generated when
   * missing.
   */
  id?: string
  /** Called with the new state when the sidebar collapses or expands. */
  onCollapsedChange?: (collapsed: boolean) => void
  /** Called with the new state when the panel opens or closes on a small screen. */
  onOpenChange?: (open: boolean) => void
  /**
   * Whether the panel is open on a small screen. Makes the open state controlled: pass
   * `onOpenChange` too.
   */
  open?: boolean
}

/**
 * The state of the sidebar. It renders no element, so the layout is yours. `id` is the id of the
 * panel.
 */
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
