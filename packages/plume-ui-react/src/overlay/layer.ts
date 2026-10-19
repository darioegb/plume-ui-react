'use client'

import { useCallback, useEffect, useRef } from 'react'

const stack: object[] = []

export function useLayer(active: boolean): () => boolean {
  const idRef = useRef<object>({})

  useEffect(() => {
    if (!active) return undefined
    const id = idRef.current
    stack.push(id)
    return () => {
      const index = stack.indexOf(id)
      if (index !== -1) stack.splice(index, 1)
    }
  }, [active])

  return useCallback(() => stack[stack.length - 1] === idRef.current, [])
}
