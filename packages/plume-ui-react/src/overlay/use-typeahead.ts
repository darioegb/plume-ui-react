'use client'

import { useCallback, useEffect, useRef } from 'react'

export function matchTypeahead(
  labels: readonly string[],
  query: string,
  from: number,
  isDisabled: (index: number) => boolean = () => false,
): number {
  const text = query.toLowerCase()
  const repeated = text.length > 1 && [...text].every((character) => character === text[0])
  const needle = repeated ? text[0] : text
  const start = repeated || text.length === 1 ? from + 1 : from
  for (let step = 0; step < labels.length; step += 1) {
    const index = (Math.max(start, 0) + step) % labels.length
    if (!isDisabled(index) && labels[index].trim().toLowerCase().startsWith(needle)) return index
  }
  return -1
}

export function useTypeahead(timeout = 500): (key: string) => string {
  const query = useRef('')
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  return useCallback(
    (key: string): string => {
      window.clearTimeout(timer.current)
      query.current += key
      timer.current = window.setTimeout(() => {
        query.current = ''
      }, timeout)
      return query.current
    },
    [timeout],
  )
}

export function isTypeaheadKey(event: {
  altKey: boolean
  ctrlKey: boolean
  key: string
  metaKey: boolean
}): boolean {
  return (
    event.key.length === 1 && event.key !== ' ' && !event.altKey && !event.ctrlKey && !event.metaKey
  )
}
