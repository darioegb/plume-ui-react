'use client'

import type { KeyboardEvent } from 'react'
import { createContext, useContext } from 'react'

export interface TimeColumnContextValue {
  isSelected: (value: number | string) => boolean
  isTabStop: (value: number | string) => boolean
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void
  select: (value: number | string) => void
}

export const TimeColumnContext = createContext<TimeColumnContextValue | undefined>(undefined)

export const useTimeColumn = (part: string): TimeColumnContextValue => {
  const context = useContext(TimeColumnContext)
  if (!context) {
    throw new Error(
      `${part} must be used within a <TimePickerHours>, <TimePickerMinutes> or <TimePickerPeriod>`,
    )
  }
  return context
}
