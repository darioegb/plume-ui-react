'use client'

import { useRef } from 'react'

const shallowEqual = (a: object, b: object): boolean => {
  const keys = Object.keys(a) as (keyof typeof a)[]
  return (
    keys.length === Object.keys(b).length && keys.every((key) => Object.is(a[key], b[key]))
  )
}

export function useShallowStable<T extends object>(value: T): T {
  const stable = useRef(value)
  if (!shallowEqual(stable.current, value)) stable.current = value
  return stable.current
}
