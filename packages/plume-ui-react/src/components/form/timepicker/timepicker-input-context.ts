'use client'

import { createContext, useContext } from 'react'

export interface TimePickerInputContextProps {
  hint: string
  hintId: string
}

export const TimePickerInputContext = createContext<TimePickerInputContextProps | undefined>(
  undefined,
)

export const useTimePickerInputContext = (part: string): TimePickerInputContextProps => {
  const context = useContext(TimePickerInputContext)
  if (!context) {
    throw new Error(`${part} must be used within a <TimePickerInput>`)
  }
  return context
}
