'use client'

import type { CSSProperties, Dispatch } from 'react'
import { createContext, useContext } from 'react'
import type { ColorScheme, Shape, Size } from '../../../theme'
import type { UsePositionResult } from '../../../overlay/use-position'
import type { DatePickerAction, DatePickerState } from './datepicker-reducer'
import type { DatePickerLabels, DatePickerVariant, DateRange } from './datepicker-types'

export interface DatePickerContextProps {
  calendarId: string
  closeAndRestoreFocus: () => void
  commitTypedValue: (value: DateRange) => void
  colorScheme: ColorScheme
  dispatch: Dispatch<DatePickerAction>
  displayFormat?: string
  isPanel: boolean
  isRange: boolean
  labels: DatePickerLabels
  language: string
  maxDate?: Date
  minDate?: Date
  onApply: () => void
  onFirstMonthChange: (month: number) => void
  onFirstYearChange: (year: number) => void
  onSecondMonthChange: (month: number) => void
  onSecondYearChange: (year: number) => void
  onSelectDate: (day: number, isSecondCalendar?: boolean) => void
  panelVars: CSSProperties
  position: UsePositionResult
  setPanel: (element: HTMLDivElement | null) => void
  shape?: Shape
  showFooter: boolean
  size?: Size
  state: DatePickerState
  toggle: () => void
  variant: DatePickerVariant
}

export const DatePickerContext = createContext<DatePickerContextProps | undefined>(undefined)

export const useDatePicker = (part = 'useDatePicker'): DatePickerContextProps => {
  const context = useContext(DatePickerContext)
  if (!context) {
    throw new Error(`${part} must be used within a <DatePicker>`)
  }
  return context
}
