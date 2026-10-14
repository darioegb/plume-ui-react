import { useState, type ReactNode } from 'react'
import { getDaysOfWeekByLanguage, getMonthsByLanguage } from '@plume-ui-react/date-utils'
import { Button } from '@plume-ui-react/button'
import { useDatePicker } from './use-datepicker'
import styles from './datepicker.module.css'

function DayOfWeek({ day }: { day: string }): ReactNode {
  return <span className={styles.dayOfWeek}>{day}</span>
}

interface MonthSelectorProps {
  selectedMonth: number
  months: string[]
  onChange: (selectedMonth: number) => void
}

function MonthSelector({ selectedMonth, months, onChange }: MonthSelectorProps): ReactNode {
  const handleMonthClick = (month: number): void => {
    onChange(month)
  }

  return (
    <div className={styles.monthSelectorGrid}>
      {months.map((currentMonth, index) => (
        <Button
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

function YearSelector({ selectedYear, startYear, onChange }: YearSelectorProps): ReactNode {
  const handleYearClick = (year: number): void => {
    onChange(year)
  }

  const renderYears = (): ReactNode => {
    const years = []
    for (let i = startYear; i < startYear + 20; i++) {
      years.push(
        <Button
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
}: CalendarProps): ReactNode {
  const { state } = useDatePicker()
  const [selector, setSelector] = useState<SelectorType>('day')
  const [startYear, setStartYear] = useState(isSecondCalendar ? state.secondYear : state.year)

  const dateButtons = isSecondCalendar
    ? getCalendarDays(state.secondYear, state.secondMonth)
    : getCalendarDays(state.year, state.month)
  const months = getMonthsByLanguage(language)

  const handleHoverEffect = (id: string): void => {
    const buttons = document.querySelectorAll<HTMLButtonElement>(`.${styles.day}:enabled`)
    const hoveredIndex = Array.from(buttons).findIndex((button) => button.id === id)
    const selectedButton = document.querySelector<HTMLButtonElement>(`.${styles.selected}`)
    const isRangeAndStartSelected = isRange && state.tempValue.startDate && !state.tempValue.endDate && selectedButton

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

  function getCalendarDays(year: number, month: number): ReactNode {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDay = firstDay.getDay()
    const lastDateOfMonth = lastDay.getDate()

    minDate?.setHours(0, 0, 0)
    maxDate?.setHours(0, 0, 0)
    const minDateTime = minDate?.getTime() || Number.MIN_VALUE
    const maxDateTime = maxDate?.getTime() || Number.MAX_VALUE

    const days = Array.from({ length: lastDateOfMonth }, (_, i) => {
      const day = i + 1
      const date = new Date(year, month, day)
      const isCurrentMonth = true
      const dateTime = date.getTime()
      const isDisabled = dateTime < minDateTime || dateTime > maxDateTime
      const isToday = day === new Date().getDate() && !isSecondCalendar
      return { day, date, isCurrentMonth, isDisabled, isToday }
    })

    const prevMonth = month === 0 ? 11 : month - 1
    const prevYear = month === 0 ? year - 1 : year
    const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate()
    const daysFromPrevMonth = startDay === 0 ? 6 : startDay - 1

    const prevMonthDays = Array.from({ length: daysFromPrevMonth }, (_, i) => {
      const day = daysInPrevMonth - daysFromPrevMonth + i + 1
      const date = new Date(prevYear, prevMonth, day)
      const isCurrentMonth = false
      const isDisabled = true
      const isToday = false
      return { day, date, isCurrentMonth, isDisabled, isToday }
    })

    const nextMonth = month === 11 ? 0 : month + 1
    const nextYear = month === 11 ? year + 1 : year
    const daysFromNextMonth = 42 - lastDateOfMonth - daysFromPrevMonth

    const nextMonthDays = Array.from({ length: daysFromNextMonth }, (_, i) => {
      const day = i + 1
      const date = new Date(nextYear, nextMonth, day)
      const isCurrentMonth = false
      const isDisabled = true
      const isToday = false
      return { day, date, isCurrentMonth, isDisabled, isToday }
    })

    const allDays = [...prevMonthDays, ...days, ...nextMonthDays]

    return allDays.map(({ day, date, isCurrentMonth, isDisabled, isToday }) => {
      const isStartDate =
        state.tempValue.startDate && isCurrentMonth && date.toDateString() === state.tempValue.startDate.toDateString()
      const isEndDate =
        state.tempValue.endDate && isCurrentMonth && date.toDateString() === state.tempValue.endDate.toDateString()
      const isInRange = state.rangeDays.some(
        (rangeDate) => date.toDateString() === rangeDate.toDateString(),
      )

      return (
        <Button
          className={`${styles.day} ${!isCurrentMonth ? styles.disabledDay : ''} ${
            isStartDate || isEndDate ? styles.selected : ''
          } ${
            isInRange && !isStartDate && !isEndDate && isCurrentMonth ? styles.rangeItem : ''
          } ${isCurrentMonth && isDisabled ? styles.outOfRangeDay : ''} ${
            isToday ? styles.today : ''
          }`}
          disabled={isDisabled}
          id={date.toString()}
          key={date.toString()}
          onClick={() => {
            if (isCurrentMonth) onSelectDate(day, isSecondCalendar)
          }}
          onMouseEnter={() => {
            if (isCurrentMonth) handleHoverEffect(date.toString())
          }}
          variant="unstyled"
        >
          <span className={styles.dayText}>{day}</span>
        </Button>
      )
    })
  }

  return (
    <div className={styles.calendar}>
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
