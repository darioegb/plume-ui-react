'use client'

import type { KeyboardEvent } from 'react'
import { useState } from 'react'
import { useControllableState } from '../../../overlay/use-controllable-state'
import {
  clamp,
  decimalsOf,
  defaultParse,
  isPartialNumber,
  roundTo,
  sameNumber,
} from './number-format'

export interface UseNumberInputOptions {
  defaultValue?: number | null
  format?: (value: number) => string
  largeStep?: number
  max?: number
  min?: number
  onValueChange?: (value: number | null) => void
  parse?: (text: string) => number | null
  precision?: number
  readOnly: boolean
  step?: number
  value?: number | null
}

export interface NumberInputState {
  canDecrement: boolean
  canIncrement: boolean
  commit: () => void
  display: string
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void
  onTextChange: (text: string) => void
  stepBy: (direction: 1 | -1, large?: boolean) => void
  value: number | null
  valueText: string | undefined
}

export function useNumberInput({
  defaultValue = null,
  format,
  largeStep,
  max = Number.POSITIVE_INFINITY,
  min = Number.NEGATIVE_INFINITY,
  onValueChange,
  parse,
  precision,
  readOnly,
  step = 1,
  value: valueProp,
}: UseNumberInputOptions): NumberInputState {
  const [value, setValue] = useControllableState<number | null>({
    defaultValue,
    onChange: onValueChange,
    value: valueProp,
  })
  const [draft, setDraft] = useState<string | null>(null)
  const read = parse ?? defaultParse
  const formatValue = (next: number): string => {
    if (format) return format(next)
    return precision === undefined ? String(next) : next.toFixed(precision)
  }

  const normalize = (next: number, digits: number | undefined): number => {
    const bounded = clamp(next, min, max)
    return digits === undefined ? bounded : roundTo(bounded, digits)
  }

  const stepBy = (direction: 1 | -1, large = false): void => {
    if (readOnly) return
    const amount = large ? (largeStep ?? step * 10) : step
    const base = value ?? 0
    const digits = precision ?? Math.max(decimalsOf(amount), decimalsOf(base))
    setDraft(null)
    setValue(normalize(base + direction * amount, digits))
  }

  const onTextChange = (text: string): void => {
    if (readOnly || (!parse && !isPartialNumber(text, precision))) return
    setDraft(text)
    setValue(read(text))
  }

  const commit = (): void => {
    if (draft === null) return
    const parsed = read(draft)
    setDraft(null)
    setValue(parsed === null ? null : normalize(parsed, precision))
  }

  const jumpTo = (target: number): void => {
    if (readOnly || !Number.isFinite(target)) return
    setDraft(null)
    setValue(target)
  }

  const keyActions: Record<string, () => void> = {
    ArrowDown: () => stepBy(-1),
    ArrowUp: () => stepBy(1),
    End: () => jumpTo(max),
    Enter: commit,
    Home: () => jumpTo(min),
    PageDown: () => stepBy(-1, true),
    PageUp: () => stepBy(1, true),
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    const action = keyActions[event.key]
    if (!action) return
    if (event.key !== 'Enter') event.preventDefault()
    action()
  }

  const showsDraft = draft !== null && sameNumber(read(draft), value)
  const formatted = value === null ? '' : formatValue(value)

  return {
    canDecrement: !readOnly && (value === null || value > min),
    canIncrement: !readOnly && (value === null || value < max),
    commit,
    display: showsDraft ? draft : formatted,
    onKeyDown,
    onTextChange,
    stepBy,
    value,
    valueText: format && value !== null ? formatted : undefined,
  }
}
