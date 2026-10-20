'use client'

import { useCallback, useRef, useState } from 'react'
import type { SelectOptionRecord } from './select-context'

export interface SelectRegistry {
  options: readonly SelectOptionRecord[]
  register: (record: SelectOptionRecord) => () => void
}

export function useSelectRegistry(): SelectRegistry {
  const records = useRef(new Map<string, SelectOptionRecord>())
  const [version, setVersion] = useState(0)

  const register = useCallback((record: SelectOptionRecord): (() => void) => {
    records.current.set(record.value, record)
    setVersion((current) => current + 1)
    return () => {
      if (records.current.get(record.value) !== record) return
      records.current.delete(record.value)
      setVersion((current) => current + 1)
    }
  }, [])

  const cache = useRef<{ list: SelectOptionRecord[]; version: number } | undefined>(undefined)
  if (cache.current?.version !== version) {
    cache.current = { list: Array.from(records.current.values()), version }
  }
  const options = cache.current.list

  return { options, register }
}
