'use client'

import type { RefObject } from 'react'
import { useEffect, useRef } from 'react'

export interface UseClickOutsideProps {
  callback: () => void
}

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
