'use client'

import type { KeyboardEvent } from 'react'
import { createContext, useContext } from 'react'
import type { DatePickerDayData, DatePickerMonthData, DatePickerYearData } from './calendar-utils'

export type DatePickerViewName = 'day' | 'month' | 'year'

export interface DatePickerPageContextProps {
  days: DatePickerDayData[]
  hover: (dataDate: string) => void
  month: number
  monthLabel: string
  monthOptions: DatePickerMonthData[]
  next: () => void
  onDayKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void
  previous: () => void
  second: boolean
  selectDay: (day: DatePickerDayData) => void
  selectMonth: (month: number) => void
  selectYear: (year: number) => void
  toggleView: (view: DatePickerViewName) => void
  view: DatePickerViewName
  weekdays: string[]
  year: number
  yearOptions: DatePickerYearData[]
}

export const DatePickerPageContext = createContext<DatePickerPageContextProps | undefined>(
  undefined,
)

export const useDatePickerPageContext = (part: string): DatePickerPageContextProps => {
  const context = useContext(DatePickerPageContext)
  if (!context) {
    throw new Error(`${part} must be used within a <DatePickerPage>`)
  }
  return context
}
