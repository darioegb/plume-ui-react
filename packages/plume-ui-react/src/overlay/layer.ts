'use client'

import { useCallback, useEffect, useRef } from 'react'

interface Layer {
  id: object
  ownsFocus: boolean
}

const stack: Layer[] = []

export interface LayerCheck {
  (): boolean
  /** True when no layer that handles Tab sits above this one. */
  ownsFocus: () => boolean
}

/**
 * Registers an overlay in the layer stack. Pass `ownsFocus: false` for popups that never
 * move the focus into themselves (Select, Tooltip), so they do not stop a Modal below from
 * trapping Tab.
 */
export function useLayer(active: boolean, ownsFocus = true): LayerCheck {
  const idRef = useRef<object>({})

  useEffect(() => {
    if (!active) return undefined
    const layer = { id: idRef.current, ownsFocus }
    stack.push(layer)
    return () => {
      const index = stack.indexOf(layer)
      if (index !== -1) stack.splice(index, 1)
    }
  }, [active, ownsFocus])

  const isTopmost = useCallback(() => stack[stack.length - 1]?.id === idRef.current, [])
  const isFocusTopmost = useCallback(() => {
    const top = [...stack].reverse().find((layer) => layer.ownsFocus)
    return top === undefined || top.id === idRef.current
  }, [])

  return Object.assign(isTopmost, { ownsFocus: isFocusTopmost })
}
