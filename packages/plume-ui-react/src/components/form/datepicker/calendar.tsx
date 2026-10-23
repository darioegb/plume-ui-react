'use client'

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import {
  formatDate,
  getDateFromDateString,
  getDaysOfWeekByLanguage,
  getMonthsByLanguage,
} from '../../../utils/dates'
import { Button } from '../../interaction/button'
import { useDatePicker } from './use-datepicker'
import styles from './datepicker.module.css'

const DATA_DATE_FORMAT = 'yyyy-mm-dd'

const addDays = (date: Date, days: number): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)

const addMonths = (date: Date, months: number): Date => {
  const lastDay = new Date(date.getFullYear(), date.getMonth() + months + 1, 0).getDate()
  return new Date(date.getFullYear(), date.getMonth() + months, Math.min(date.getDate(), lastDay))
}

const daysFromMonday = (date: Date): number => (date.getDay() + 6) % 7

const KEY_MOVES: Record<string, (date: Date) => Date> = {
  ArrowLeft: (date) => addDays(date, -1),
  ArrowRight: (date) => addDays(date, 1),
  ArrowUp: (date) => addDays(date, -7),
  ArrowDown: (date) => addDays(date, 7),
  Home: (date) => addDays(date, -daysFromMonday(date)),
  End: (date) => addDays(date, 6 - daysFromMonday(date)),
  PageUp: (date) => addMonths(date, -1),
  PageDown: (date) => addMonths(date, 1),
}

const startOfDay = (date: Date): number =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()

function DayOfWeek({ day }: Readonly<{ day: string }>): ReactNode {
  return <span className={styles.dayOfWeek}>{day}</span>
}

interface MonthSelectorProps {
  selectedMonth: number
  months: string[]
  onChange: (selectedMonth: number) => void
}

function MonthSelector({
  selectedMonth,
  months,
  onChange,
}: Readonly<MonthSelectorProps>): ReactNode {
  const handleMonthClick = (month: number): void => {
    onChange(month)
  }

  return (
    <div className={styles.monthSelectorGrid}>
      {months.map((currentMonth, index) => (
        <Button
          aria-pressed={index === selectedMonth}
          className={`${index === selectedMonth ? styles.selected : ''} ${styles.month}`}
          key={currentMonth}
          label={currentMonth}
          onClick={() => {
            handleMonthClick(index)
          }}
          variant="unstyled"
        />
      ))}
    </div>
  )
}

interface YearSelectorProps {
  selectedYear: number
  startYear: number
  onChange: (selectedYear: number) => void
}

function YearSelector({
  selectedYear,
  startYear,
  onChange,
}: Readonly<YearSelectorProps>): ReactNode {
  const handleYearClick = (year: number): void => {
    onChange(year)
  }

  const renderYears = (): ReactNode => {
    const years = []
    for (let i = startYear; i < startYear + 20; i++) {
      years.push(
        <Button
          aria-pressed={selectedYear === i}
          className={`${selectedYear === i ? styles.selected : ''} ${styles.year}`}
          key={i}
          onClick={() => {
            handleYearClick(i)
          }}
          variant="unstyled"
        >
          {i}
        </Button>,
      )
    }
    return years
  }

  return <div className={styles.yearSelectorGrid}>{renderYears()}</div>
}

interface CalendarProps {
  language: string
  isRange: boolean
  onMonthChange: (value: number) => void
  onSelectDate: (day: number, isSecondCalendar?: boolean) => void
  onYearChange: (value: number) => void
  maxDate?: Date
  minDate?: Date
  isSecondCalendar?: boolean
}

type SelectorType = 'day' | 'month' | 'year'

export function Calendar({
  language,
  isRange,
  isSecondCalendar,
  minDate,
  maxDate,
  onMonthChange,
  onSelectDate,
  onYearChange,
}: Readonly<CalendarProps>): ReactNode {
  const { state } = useDatePicker()
  const [selector, setSelector] = useState<SelectorType>('day')
  const [startYear, setStartYear] = useState(isSecondCalendar ? state.secondYear : state.year)
  const [focusedDate, setFocusedDate] = useState<Date | null>(null)
  const shouldMoveFocus = useRef(false)
  const calendarRef = useRef<HTMLDivElement>(null)

  const year = isSecondCalendar ? state.secondYear : state.year
  const month = isSecondCalendar ? state.secondMonth : state.month
  const dateButtons = getCalendarDays()
  const months = getMonthsByLanguage(language)

  useEffect(() => {
    if (!shouldMoveFocus.current || !focusedDate) return
    shouldMoveFocus.current = false
    calendarRef.current
      ?.querySelector<HTMLButtonElement>(
        `[data-date="${formatDate(focusedDate, DATA_DATE_FORMAT)}"]:enabled`,
      )
      ?.focus()
  })

  const handleHoverEffect = (dataDate: string): void => {
    const scope = calendarRef.current?.closest('[role="dialog"]') ?? document
    const buttons = scope.querySelectorAll<HTMLButtonElement>(`.${styles.day}:enabled`)
    const hoveredIndex = Array.from(buttons).findIndex((button) => button.dataset.date === dataDate)
    const selectedButton = scope.querySelector<HTMLButtonElement>(
      `.${styles.day}.${styles.selected}`,
    )
    const isRangeAndStartSelected =
      isRange && state.tempValue.startDate && !state.tempValue.endDate && selectedButton

    buttons.forEach((button, index) => {
      const isSelected = button.classList.contains(styles.selected)
      const isHovered = index === hoveredIndex

      if (isRangeAndStartSelected) {
        const selectedIndex = Array.from(buttons).indexOf(selectedButton)
        const [start, end] = [
          Math.min(selectedIndex, hoveredIndex),
          Math.max(selectedIndex, hoveredIndex),
        ]

        button.classList.toggle(styles.rangeItem, index >= start && index <= end)
        button.classList.toggle(styles.selectedHover, isHovered)
      } else {
        button.classList.toggle(styles.selectedHover, isSelected && isHovered)
        button.classList.toggle(styles.hovered, !isSelected && isHovered)
      }
    })
  }

  const getSelector = (): ReactNode => {
    if (selector === 'month') {
      return (
        <MonthSelector
          months={months}
          onChange={handleMonthChange}
          selectedMonth={isSecondCalendar ? state.secondMonth : state.month}
        />
      )
    } else if (selector === 'year') {
      return (
        <YearSelector
          onChange={handleYearChange}
          selectedYear={isSecondCalendar ? state.secondYear : state.year}
          startYear={startYear}
        />
      )
    }

    return (
      <>
        <div className={styles.daysOfWeek}>
          {getDaysOfWeekByLanguage(language).map((day) => (
            <DayOfWeek day={day} key={day} />
          ))}
        </div>
        <div className={styles.calendarGrid}>{dateButtons}</div>
      </>
    )
  }

  const handleMonthChange = (selectedMonth: number): void => {
    onMonthChange(selectedMonth)
    setSelector('day')
  }

  const handleYearChange = (selectedYear: number): void => {
    onYearChange(selectedYear)
    setSelector('day')
  }

  const toggleSelector = (selectedSelector: SelectorType): void => {
    setSelector(selector !== 'day' && selector === selectedSelector ? 'day' : selectedSelector)
  }

  const handlePrev = (): void => {
    setStartYear(startYear - 20)
  }

  const handleNext = (): void => {
    setStartYear(startYear + 20)
  }

  function getCalendarDays(): ReactNode {
    const daysFromPrevMonth = daysFromMonday(new Date(year, month, 1))
    const minTime = minDate ? startOfDay(minDate) : -Infinity
    const maxTime = maxDate ? startOfDay(maxDate) : Infinity
    const today = new Date().toDateString()
    const dateLabel = new Intl.DateTimeFormat(language, { dateStyle: 'full' })
    const isSameDay = (a: Date | null, b: Date): boolean => a?.toDateString() === b.toDateString()

    const allDays = Array.from({ length: 42 }, (_, i) => {
      const date = new Date(year, month, i - daysFromPrevMonth + 1)
      const isCurrentMonth = date.getMonth() === month
      const isDisabled = !isCurrentMonth || date.getTime() < minTime || date.getTime() > maxTime
      return { date, isCurrentMonth, isDisabled }
    })

    const enabledDays = allDays.filter(({ isDisabled }) => !isDisabled).map(({ date }) => date)
    const tabStop =
      [focusedDate, state.tempValue.startDate, new Date()]
        .map((candidate) => enabledDays.find((date) => isSameDay(candidate, date)))
        .find(Boolean) ?? enabledDays[0]

    return allDays.map(({ date, isCurrentMonth, isDisabled }) => {
      const dataDate = formatDate(date, DATA_DATE_FORMAT)
      const isStartDate = isCurrentMonth && isSameDay(state.tempValue.startDate, date)
      const isEndDate = isCurrentMonth && isSameDay(state.tempValue.endDate, date)
      const isSelected = isStartDate || isEndDate
      const isInRange = state.rangeDays.some((rangeDate) => isSameDay(rangeDate, date))
      const isToday = isCurrentMonth && date.toDateString() === today

      return (
        <Button
          aria-current={isToday ? 'date' : undefined}
          aria-hidden={isCurrentMonth ? undefined : true}
          aria-label={dateLabel.format(date)}
          aria-pressed={isCurrentMonth ? isSelected : undefined}
          className={`${styles.day} ${!isCurrentMonth ? styles.disabledDay : ''} ${
            isSelected ? styles.selected : ''
          } ${isInRange && !isSelected && isCurrentMonth ? styles.rangeItem : ''} ${
            isCurrentMonth && isDisabled ? styles.outOfRangeDay : ''
          } ${isToday ? styles.today : ''}`}
          data-date={dataDate}
          disabled={isDisabled}
          key={dataDate}
          onClick={() => {
            if (isCurrentMonth) onSelectDate(date.getDate(), isSecondCalendar)
          }}
          onFocus={() => {
            if (isCurrentMonth) handleHoverEffect(dataDate)
          }}
          onKeyDown={handleDayKeyDown}
          onMouseEnter={() => {
            if (isCurrentMonth) handleHoverEffect(dataDate)
          }}
          tabIndex={tabStop && isSameDay(tabStop, date) ? 0 : -1}
          variant="unstyled"
        >
          <span className={styles.dayText}>{date.getDate()}</span>
        </Button>
      )
    })
  }

  function handleDayKeyDown(event: KeyboardEvent<HTMLButtonElement>): void {
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
  }

  return (
    <div className={styles.calendar} ref={calendarRef}>
      <div className={styles.calendarHeader}>
        <div className={styles.monthYearSelectors}>
          {selector !== 'year' ? (
            <Button
              aria-label="Previous month"
              onClick={() => {
                onMonthChange((isSecondCalendar ? state.secondMonth : state.month) - 1)
              }}
              variant="icon"
            >
              <svg
                aria-hidden="true"
                fill="currentColor"
                height="16"
                stroke="currentColor"
                strokeWidth="10"
                viewBox="0 0 256 256"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z" />
              </svg>
            </Button>
          ) : (
            <Button aria-label="Previous years" onClick={handlePrev} variant="icon">
              <svg
                aria-hidden="true"
                fill="currentColor"
                height="16"
                stroke="currentColor"
                strokeWidth="10"
                viewBox="0 0 256 256"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M205.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L131.31,128ZM51.31,128l74.35-74.34a8,8,0,0,0-11.32-11.32l-80,80a8,8,0,0,0,0,11.32l80,80a8,8,0,0,0,11.32-11.32Z" />
              </svg>
            </Button>
          )}
          <Button
            className={styles.monthSelector}
            label={months[isSecondCalendar ? state.secondMonth : state.month]}
            onClick={() => {
              toggleSelector('month')
            }}
            variant="unstyled"
          />
          <strong>/</strong>
          <Button
            className={styles.yearSelector}
            label={`${isSecondCalendar ? state.secondYear : state.year}`}
            onClick={() => {
              toggleSelector('year')
            }}
            variant="unstyled"
          />
          {selector !== 'year' ? (
            <Button
              aria-label="Next month"
              onClick={() => {
                onMonthChange((isSecondCalendar ? state.secondMonth : state.month) + 1)
              }}
              variant="icon"
            >
              <svg
                aria-hidden="true"
                fill="currentColor"
                height="16"
                stroke="currentColor"
                strokeWidth="10"
                viewBox="0 0 256 256"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
              </svg>
            </Button>
          ) : (
            <Button aria-label="Next years" onClick={handleNext} variant="icon">
              <svg
                aria-hidden="true"
                fill="currentColor"
                height="16"
                stroke="currentColor"
                strokeWidth="10"
                viewBox="0 0 256 256"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M141.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L124.69,128,50.34,53.66A8,8,0,0,1,61.66,42.34l80,80A8,8,0,0,1,141.66,133.66Zm80-11.32-80-80a8,8,0,0,0-11.32,11.32L204.69,128l-74.35,74.34a8,8,0,0,0,11.32,11.32l80-80A8,8,0,0,0,221.66,122.34Z" />
              </svg>
            </Button>
          )}
        </div>
      </div>
      {getSelector()}
    </div>
  )
}
