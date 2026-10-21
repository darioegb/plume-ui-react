'use client'

import { useState } from 'react'
import { useControllableState } from '../../../overlay/use-controllable-state'

export interface UseRatingOptions {
  allowHalf: boolean
  defaultValue?: number
  max: number
  onValueChange?: (value: number) => void
  value?: number
}

export interface RatingState {
  hover: number | undefined
  preview: number
  setHover: (value: number | undefined) => void
  setValue: (value: number) => void
  value: number
}

export const snap = (value: number, max: number, allowHalf: boolean): number => {
  const step = allowHalf ? 0.5 : 1
  const bounded = Math.min(Math.max(Number.isFinite(value) ? value : 0, 0), max)
  return Math.round(bounded / step) * step
}

export function useRating({
  allowHalf,
  defaultValue = 0,
  max,
  onValueChange,
  value: valueProp,
}: UseRatingOptions): RatingState {
  const [raw, setRaw] = useControllableState<number>({
    defaultValue: snap(defaultValue, max, allowHalf),
    onChange: onValueChange,
    value: valueProp,
  })
  const [hover, setHover] = useState<number | undefined>(undefined)
  const value = snap(raw, max, allowHalf)

  return {
    hover,
    preview: hover ?? value,
    setHover,
    setValue: (next) => setRaw(snap(next, max, allowHalf)),
    value,
  }
}
