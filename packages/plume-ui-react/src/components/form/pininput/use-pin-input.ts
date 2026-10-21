'use client'

import type { ClipboardEvent, KeyboardEvent, RefObject } from 'react'
import { useEffect, useRef } from 'react'
import { useControllableState } from '../../../overlay/use-controllable-state'
import { extractTyped, insertAt, removeAt, sanitize, type PinInputType } from './pin-utils'

export interface UsePinInputOptions {
  focusOnMount?: boolean
  defaultValue?: string
  length: number
  onComplete?: (value: string) => void
  onValueChange?: (value: string) => void
  readOnly: boolean
  type: PinInputType
  value?: string
}

export interface PinInputState {
  cells: RefObject<(HTMLInputElement | null)[]>
  onChange: (index: number, text: string) => void
  onKeyDown: (index: number, event: KeyboardEvent<HTMLInputElement>) => void
  onPaste: (index: number, event: ClipboardEvent<HTMLInputElement>) => void
  tabbable: number
  value: string
}

export function usePinInput({
  focusOnMount = false,
  defaultValue = '',
  length,
  onComplete,
  onValueChange,
  readOnly,
  type,
  value: valueProp,
}: UsePinInputOptions): PinInputState {
  const cells = useRef<(HTMLInputElement | null)[]>([])
  const [value, setValue] = useControllableState<string>({
    defaultValue: defaultValue.slice(0, length),
    onChange: onValueChange,
    value: valueProp,
  })

  useEffect(() => {
    if (focusOnMount) cells.current[0]?.focus()
  }, [focusOnMount])

  const focusCell = (index: number): void => {
    const target = Math.min(Math.max(index, 0), length - 1)
    cells.current[target]?.focus()
  }

  const commit = (next: string): void => {
    if (next === value) return
    setValue(next)
    if (next.length === length) onComplete?.(next)
  }

  const insert = (index: number, text: string): void => {
    const chars = sanitize(text, type).slice(0, length)
    if (!chars) return
    commit(insertAt(value, index, chars, length))
    focusCell(Math.min(index, value.length) + chars.length)
  }

  const onChange = (index: number, text: string): void => {
    if (readOnly) return
    if (text === '') {
      commit(removeAt(value, index))
      return
    }
    insert(index, extractTyped(value[index] ?? '', text))
  }

  const onPaste = (index: number, event: ClipboardEvent<HTMLInputElement>): void => {
    event.preventDefault()
    if (!readOnly) insert(index, event.clipboardData.getData('text'))
  }

  const moves: Record<string, (index: number) => number> = {
    ArrowLeft: (index) => index - 1,
    ArrowRight: (index) => index + 1,
    End: () => length - 1,
    Home: () => 0,
  }

  const onKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>): void => {
    const move = moves[event.key]
    if (move) {
      event.preventDefault()
      focusCell(move(index))
    } else if (event.key === 'Backspace' && !readOnly && !value[index]) {
      event.preventDefault()
      commit(removeAt(value, index - 1))
      focusCell(index - 1)
    } else if (event.key === 'Delete' && !readOnly) {
      event.preventDefault()
      commit(removeAt(value, index))
    }
  }

  return {
    cells,
    onChange,
    onKeyDown,
    onPaste,
    tabbable: Math.min(value.length, length - 1),
    value,
  }
}
