'use client'

import type { RefObject } from 'react'
import { useEffect, useRef } from 'react'

export interface UseClickOutsideProps {
  callback: () => void
}

/**
 * @deprecated It will be removed before 1.0. The overlays of the library close with `useDismiss`, which also
 * handles Escape. Use your own `pointerdown` listener if you need a press outside of an element.
 */
export function useClickOutside({ callback }: UseClickOutsideProps): RefObject<HTMLDivElement | null> {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, callback])

  return ref
}
