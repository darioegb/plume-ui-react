'use client'

import { useEffect, useState } from 'react'
import { useLayer } from './layer'
import type { Placement } from './position'
import { useDismiss, type DismissReason } from './use-dismiss'
import { getTabbableElements } from './use-focus-trap'
import { usePosition, type UsePositionResult } from './use-position'

export interface UseFloatingPanelOptions {
  anchor: HTMLElement | null
  enabled: boolean
  flip?: boolean
  offset?: number
  onDismiss: (reason: DismissReason) => void
  placement?: Placement
  shift?: boolean
  tabOut?: boolean
}

export interface FloatingPanel {
  isTopmost: () => boolean
  panel: HTMLElement | null
  position: UsePositionResult
  setPanel: (element: HTMLElement | null) => void
}

export function useFloatingPanel({
  anchor,
  enabled,
  flip,
  offset,
  onDismiss,
  placement,
  shift,
  tabOut = false,
}: UseFloatingPanelOptions): FloatingPanel {
  const [panel, setPanel] = useState<HTMLElement | null>(null)
  const isTopmost = useLayer(enabled)
  const position = usePosition({
    anchor,
    floating: panel,
    enabled,
    placement,
    offset,
    flip,
    shift,
  })

  useDismiss({ enabled, onDismiss, elements: [anchor, panel], isTopmost })

  useEffect(() => {
    if (!enabled || !tabOut || !panel) return undefined
    const handleKeyDown = (event: KeyboardEvent): void => {
      const current = document.activeElement
      if (event.key !== 'Tab' || !isTopmost() || !current || !panel.contains(current)) return
      const tabbables = getTabbableElements(panel)
      const edge = event.shiftKey ? tabbables[0] : tabbables[tabbables.length - 1]
      const leaving = tabbables.length === 0 || (current === panel ? event.shiftKey : current === edge)
      if (!leaving) return
      event.preventDefault()
      onDismiss('tab')
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [enabled, isTopmost, onDismiss, panel, tabOut])

  return { isTopmost, panel, position, setPanel }
}
