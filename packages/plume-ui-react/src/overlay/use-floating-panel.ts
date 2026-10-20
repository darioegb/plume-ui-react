'use client'

import { useState } from 'react'
import { useLayer } from './layer'
import type { Placement } from './position'
import { useDismiss, type DismissReason } from './use-dismiss'
import { usePosition, type UsePositionResult } from './use-position'

export interface UseFloatingPanelOptions {
  anchor: HTMLElement | null
  enabled: boolean
  flip?: boolean
  offset?: number
  onDismiss: (reason: DismissReason) => void
  placement?: Placement
  shift?: boolean
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

  return { isTopmost, panel, position, setPanel }
}
