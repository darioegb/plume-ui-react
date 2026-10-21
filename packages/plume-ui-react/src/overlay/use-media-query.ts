'use client'

import { useCallback, useSyncExternalStore } from 'react'

const supportsMatchMedia = (): boolean =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'

export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void): (() => void) => {
      if (!supportsMatchMedia()) return () => undefined
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    [query],
  )
  const getSnapshot = useCallback(
    (): boolean => supportsMatchMedia() && window.matchMedia(query).matches,
    [query],
  )
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
