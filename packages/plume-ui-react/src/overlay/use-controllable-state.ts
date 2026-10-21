'use client'

import { useCallback, useRef, useState } from 'react'

export interface UseControllableStateOptions<T> {
  defaultValue: T
  onChange?: (next: T) => void
  value?: T
}

export function useControllableState<T>({
  defaultValue,
  onChange,
  value,
}: UseControllableStateOptions<T>): [T, (next: T) => void] {
  const [internal, setInternal] = useState<T>(defaultValue)
  const isControlled = value !== undefined
  const current = isControlled ? value : internal
  const latest = useRef({ current, isControlled, onChange })
  latest.current = { current, isControlled, onChange }

  const setValue = useCallback((next: T): void => {
    const state = latest.current
    if (!state.isControlled) setInternal(next)
    if (!Object.is(next, state.current)) state.onChange?.(next)
  }, [])

  return [current, setValue]
}
