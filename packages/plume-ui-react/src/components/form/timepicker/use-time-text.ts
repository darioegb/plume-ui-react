'use client'

import type { ChangeEvent } from 'react'
import { useEffect, useState } from 'react'
import { displayTime, parseDisplayTime, type PeriodLabels } from './time-utils'

interface UseTimeTextOptions {
  hour12: boolean
  labels: PeriodLabels
  setValue: (value: string) => void
  value: string
}

interface UseTimeTextResult {
  commit: () => string
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void
  text: string
}

export function useTimeText({
  hour12,
  labels,
  setValue,
  value,
}: Readonly<UseTimeTextOptions>): UseTimeTextResult {
  const display = displayTime(value, hour12, labels)
  const [text, setText] = useState(display)

  useEffect(() => {
    setText(display)
  }, [display])

  const commit = (): string => {
    if (!text.trim()) {
      setValue('')
      return ''
    }
    const parsed = parseDisplayTime(text, hour12, labels)
    if (parsed === null) {
      setText(display)
      return value
    }
    setValue(parsed)
    setText(displayTime(parsed, hour12, labels))
    return parsed
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setText(event.target.value)
    if (hour12) return
    const parsed = parseDisplayTime(event.target.value, false, labels)
    if (parsed) setValue(parsed)
  }

  return { commit, handleChange, text }
}
