'use client'

import { useEffect, useRef } from 'react'

export type DismissReason = 'escape' | 'outside' | 'tab'

export interface UseDismissOptions {
  enabled: boolean
  onDismiss: (reason: DismissReason) => void
  elements: (HTMLElement | null)[]
  isTopmost?: () => boolean
  escapeKey?: boolean
  outsidePress?: boolean
}

export function useDismiss({
  enabled,
  onDismiss,
  elements,
  isTopmost = () => true,
  escapeKey = true,
  outsidePress = true,
}: UseDismissOptions): void {
  const latest = useRef({ onDismiss, elements, isTopmost })

  useEffect(() => {
    latest.current = { onDismiss, elements, isTopmost }
  })

  useEffect(() => {
    if (!enabled) return undefined

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== 'Escape' || !latest.current.isTopmost()) return
      latest.current.onDismiss('escape')
    }

    const handlePointerDown = (event: PointerEvent): void => {
      if (!latest.current.isTopmost()) return
      const target = event.target as Node | null
      const inside = latest.current.elements.some((element) => element?.contains(target))
      if (!inside) latest.current.onDismiss('outside')
    }

    if (escapeKey) document.addEventListener('keydown', handleKeyDown)
    if (outsidePress) document.addEventListener('pointerdown', handlePointerDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [enabled, escapeKey, outsidePress])
}
