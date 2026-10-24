import type { ReactNode } from 'react'

export const DATA_DATE_FORMAT = 'yyyy-mm-dd'

export const YEARS_PER_PAGE = 20

export interface DatePickerDayData {
  dataDate: string
  date: Date
  isCurrentMonth: boolean
  isDisabled: boolean
  isInRange: boolean
  isSelected: boolean
  isToday: boolean
  label: string
  tabIndex: 0 | -1
}

export interface DatePickerMonthData {
  index: number
  label: string
  selected: boolean
}

export interface DatePickerYearData {
  selected: boolean
  value: number
}

export const addDays = (date: Date, days: number): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)

export const addMonths = (date: Date, months: number): Date => {
  const lastDay = new Date(date.getFullYear(), date.getMonth() + months + 1, 0).getDate()
  return new Date(date.getFullYear(), date.getMonth() + months, Math.min(date.getDate(), lastDay))
}

export const daysFromMonday = (date: Date): number => (date.getDay() + 6) % 7

export const KEY_MOVES: Record<string, (date: Date) => Date> = {
  ArrowLeft: (date) => addDays(date, -1),
  ArrowRight: (date) => addDays(date, 1),
  ArrowUp: (date) => addDays(date, -7),
  ArrowDown: (date) => addDays(date, 7),
  Home: (date) => addDays(date, -daysFromMonday(date)),
  End: (date) => addDays(date, 6 - daysFromMonday(date)),
  PageUp: (date) => addMonths(date, -1),
  PageDown: (date) => addMonths(date, 1),
}

export const startOfDay = (date: Date): number =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()

const isSameDay = (a: Date | null, b: Date): boolean => a?.toDateString() === b.toDateString()

interface BuildDaysOptions {
  endDate: Date | null
  focusedDate: Date | null
  formatKey: (date: Date) => string
  language: string
  maxDate?: Date
  minDate?: Date
  month: number
  rangeDays: Date[]
  startDate: Date | null
  year: number
}

export function buildCalendarDays({
  endDate,
  focusedDate,
  formatKey,
  language,
  maxDate,
  minDate,
  month,
  rangeDays,
  startDate,
  year,
}: Readonly<BuildDaysOptions>): DatePickerDayData[] {
  const daysFromPrevMonth = daysFromMonday(new Date(year, month, 1))
  const minTime = minDate ? startOfDay(minDate) : -Infinity
  const maxTime = maxDate ? startOfDay(maxDate) : Infinity
  const today = new Date().toDateString()
  const dateLabel = new Intl.DateTimeFormat(language, { dateStyle: 'full' })

  const allDays = Array.from({ length: 42 }, (_, i) => {
    const date = new Date(year, month, i - daysFromPrevMonth + 1)
    const isCurrentMonth = date.getMonth() === month
    const isDisabled = !isCurrentMonth || date.getTime() < minTime || date.getTime() > maxTime
    return { date, isCurrentMonth, isDisabled }
  })

  const enabledDays = allDays.filter(({ isDisabled }) => !isDisabled).map(({ date }) => date)
  const tabStop =
    [focusedDate, startDate, new Date()]
      .map((candidate) => enabledDays.find((date) => isSameDay(candidate, date)))
      .find(Boolean) ?? enabledDays[0]

  return allDays.map(({ date, isCurrentMonth, isDisabled }) => {
    const isSelected = isCurrentMonth && (isSameDay(startDate, date) || isSameDay(endDate, date))
    return {
      dataDate: formatKey(date),
      date,
      isCurrentMonth,
      isDisabled,
      isInRange: rangeDays.some((rangeDate) => isSameDay(rangeDate, date)),
      isSelected,
      isToday: isCurrentMonth && date.toDateString() === today,
      label: dateLabel.format(date),
      tabIndex: tabStop && isSameDay(tabStop, date) ? 0 : -1,
    }
  })
}

export function renderItems<T>(
  items: T[],
  children: ((item: T, index: number) => ReactNode) | ReactNode,
  fallback: (item: T) => ReactNode,
): ReactNode {
  if (typeof children === 'function') return items.map((item, index) => children(item, index))
  return children === undefined ? items.map(fallback) : children
}
