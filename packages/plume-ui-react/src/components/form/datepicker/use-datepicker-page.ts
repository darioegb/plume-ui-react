'use client'

import type { KeyboardEvent, RefObject } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  formatDate,
  getDateFromDateString,
  getDaysOfWeekByLanguage,
  getMonthsByLanguage,
} from '../../../utils/dates'
import {
  DATA_DATE_FORMAT,
  KEY_MOVES,
  YEARS_PER_PAGE,
  buildCalendarDays,
  startOfDay,
  type DatePickerDayData,
} from './calendar-utils'
import type { DatePickerPageContextProps, DatePickerViewName } from './datepicker-page-context'
import { useDatePicker } from './use-datepicker'
import styles from './datepicker.module.css'

const formatKey = (date: Date): string => formatDate(date, DATA_DATE_FORMAT)

export function useDatePickerPage(
  second: boolean,
  calendarRef: RefObject<HTMLDivElement | null>,
): DatePickerPageContextProps {
  const {
    isRange,
    language,
    maxDate,
    minDate,
    onFirstMonthChange,
    onFirstYearChange,
    onSecondMonthChange,
    onSecondYearChange,
    onSelectDate,
    state,
  } = useDatePicker('DatePickerPage')
  const year = second ? state.secondYear : state.year
  const month = second ? state.secondMonth : state.month
  const onMonthChange = second ? onSecondMonthChange : onFirstMonthChange
  const onYearChange = second ? onSecondYearChange : onFirstYearChange
  const { endDate, startDate } = state.tempValue
  const [view, setView] = useState<DatePickerViewName>('day')
  const [startYear, setStartYear] = useState(year)
  const [focusedDate, setFocusedDate] = useState<Date | null>(null)
  const shouldMoveFocus = useRef(false)

  useEffect(() => {
    if (!shouldMoveFocus.current || !focusedDate) return
    shouldMoveFocus.current = false
    calendarRef.current
      ?.querySelector<HTMLButtonElement>(`[data-date="${formatKey(focusedDate)}"]:enabled`)
      ?.focus()
  })

  const months = useMemo(() => getMonthsByLanguage(language), [language])
  const weekdays = useMemo(() => getDaysOfWeekByLanguage(language), [language])
  const days = useMemo(
    () =>
      buildCalendarDays({
        endDate,
        focusedDate,
        formatKey,
        language,
        maxDate,
        minDate,
        month,
        rangeDays: state.rangeDays,
        startDate,
        year,
      }),
    [endDate, focusedDate, language, maxDate, minDate, month, startDate, state.rangeDays, year],
  )
  const monthOptions = useMemo(
    () => months.map((label, index) => ({ index, label, selected: index === month })),
    [month, months],
  )
  const yearOptions = useMemo(
    () =>
      Array.from({ length: YEARS_PER_PAGE }, (_, offset) => ({
        selected: year === startYear + offset,
        value: startYear + offset,
      })),
    [startYear, year],
  )

  const hover = useCallback(
    (dataDate: string): void => {
      const scope = calendarRef.current?.closest('[role="dialog"]') ?? document
      const buttons = scope.querySelectorAll<HTMLButtonElement>(`.${styles.day}:enabled`)
      const hoveredIndex = Array.from(buttons).findIndex(
        (button) => button.dataset.date === dataDate,
      )
      const selectedButton = scope.querySelector<HTMLButtonElement>(
        `.${styles.day}.${styles.selected}`,
      )
      const isRangeAndStartSelected = isRange && startDate && !endDate && selectedButton

      buttons.forEach((button, index) => {
        const isSelected = button.classList.contains(styles.selected)
        const isHovered = index === hoveredIndex

        if (isRangeAndStartSelected) {
          const selectedIndex = Array.from(buttons).indexOf(selectedButton)
          const [first, last] = [
            Math.min(selectedIndex, hoveredIndex),
            Math.max(selectedIndex, hoveredIndex),
          ]

          button.classList.toggle(styles.rangeItem, index >= first && index <= last)
          button.classList.toggle(styles.selectedHover, isHovered)
        } else {
          button.classList.toggle(styles.selectedHover, isSelected && isHovered)
          button.classList.toggle(styles.hovered, !isSelected && isHovered)
        }
      })
    },
    [calendarRef, endDate, isRange, startDate],
  )

  const onDayKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>): void => {
      const current = event.currentTarget.dataset.date
      const move = KEY_MOVES[event.key]
      if (!current || !move) return
      event.preventDefault()

      const next = move(getDateFromDateString(current, DATA_DATE_FORMAT))
      const nextTime = next.getTime()
      if (
        (minDate && nextTime < startOfDay(minDate)) ||
        (maxDate && nextTime > startOfDay(maxDate))
      ) {
        return
      }

      const monthOffset = (next.getFullYear() - year) * 12 + next.getMonth() - month
      if (monthOffset !== 0) onMonthChange(month + monthOffset)
      shouldMoveFocus.current = true
      setFocusedDate(next)
    },
    [maxDate, minDate, month, onMonthChange, year],
  )

  const selectDay = useCallback(
    (day: DatePickerDayData): void => {
      if (day.isCurrentMonth) onSelectDate(day.date.getDate(), second)
    },
    [onSelectDate, second],
  )

  const selectMonth = useCallback(
    (selectedMonth: number): void => {
      onMonthChange(selectedMonth)
      setView('day')
    },
    [onMonthChange],
  )

  const selectYear = useCallback(
    (selectedYear: number): void => {
      onYearChange(selectedYear)
      setView('day')
    },
    [onYearChange],
  )

  const toggleView = useCallback((target: DatePickerViewName): void => {
    setView((current) => (current !== 'day' && current === target ? 'day' : target))
  }, [])

  const previous = useCallback((): void => {
    if (view === 'year') setStartYear(startYear - YEARS_PER_PAGE)
    else onMonthChange(month - 1)
  }, [month, onMonthChange, startYear, view])

  const next = useCallback((): void => {
    if (view === 'year') setStartYear(startYear + YEARS_PER_PAGE)
    else onMonthChange(month + 1)
  }, [month, onMonthChange, startYear, view])

  return useMemo(
    () => ({
      days,
      hover,
      month,
      monthLabel: months[month],
      monthOptions,
      next,
      onDayKeyDown,
      previous,
      second,
      selectDay,
      selectMonth,
      selectYear,
      toggleView,
      view,
      weekdays,
      year,
      yearOptions,
    }),
    [
      days,
      hover,
      month,
      monthOptions,
      months,
      next,
      onDayKeyDown,
      previous,
      second,
      selectDay,
      selectMonth,
      selectYear,
      toggleView,
      view,
      weekdays,
      year,
      yearOptions,
    ],
  )
}
