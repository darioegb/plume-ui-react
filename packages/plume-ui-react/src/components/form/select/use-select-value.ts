'use client'

import { useCallback, useState } from 'react'

export interface UseSelectValueOptions {
  defaultValue?: string | string[]
  multiple: boolean
  onValueChange?: (value: never) => void
  value?: string | string[]
}

export interface SelectValueState {
  commit: (next: string[]) => void
  selected: readonly string[]
}

const toArray = (value: string | string[] | undefined): string[] => {
  if (Array.isArray(value)) return value
  return value ? [value] : []
}

export function useSelectValue({
  defaultValue,
  multiple,
  onValueChange,
  value,
}: UseSelectValueOptions): SelectValueState {
  const [internal, setInternal] = useState<string[]>(() => toArray(defaultValue))
  const isControlled = value !== undefined
  const selected = isControlled ? toArray(value) : internal

  const commit = useCallback(
    (next: string[]): void => {
      if (!isControlled) setInternal(next)
      const payload = multiple ? next : (next[0] ?? '')
      ;(onValueChange as ((value: string | string[]) => void) | undefined)?.(payload)
    },
    [isControlled, multiple, onValueChange],
  )

  return { commit, selected }
}
