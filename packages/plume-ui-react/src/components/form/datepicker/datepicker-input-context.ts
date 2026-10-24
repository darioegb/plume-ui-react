'use client'

import { createContext, useContext } from 'react'

export interface DatePickerInputContextProps {
  disabled: boolean
  onTriggerClick: () => void
  setRef: (node: HTMLInputElement | null) => void
}

export const DatePickerInputContext = createContext<DatePickerInputContextProps | undefined>(
  undefined,
)

export const useDatePickerInput = (part: string): DatePickerInputContextProps => {
  const context = useContext(DatePickerInputContext)
  if (!context) {
    throw new Error(`${part} must be used within a <DatePickerInput>`)
  }
  return context
}
