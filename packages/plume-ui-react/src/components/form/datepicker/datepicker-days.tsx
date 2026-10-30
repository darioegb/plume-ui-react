'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { renderItems, type DatePickerDayData } from './calendar-utils'
import { useDatePickerContext } from './datepicker-context'
import { useDatePickerPageContext } from './datepicker-page-context'
import styles from './datepicker.module.css'

type PartProps = Omit<ComponentProps, 'index'>

export type DatePickerWeekdaysProps = PartProps & {
  /**
   * A node, or a function of the weekday and its index that returns each `DatePickerWeekday`. Without it every weekday is rendered.
   */
  children?: ((weekday: string, index: number) => ReactNode) | ReactNode
}
export type DatePickerWeekdayProps = PartProps & Pick<HTMLAttributes<HTMLSpanElement>, 'children'>
export type DatePickerGridProps = PartProps & {
  /**
   * A node, or a function of the day that returns each `DatePickerDay`. Without it every day of the month is rendered.
   */
  children?: ((day: DatePickerDayData) => ReactNode) | ReactNode
}
export type DatePickerDayNumberProps = PartProps & Pick<HTMLAttributes<HTMLSpanElement>, 'children'>
export type DatePickerDayProps = PartProps &
  Pick<HTMLAttributes<HTMLButtonElement>, 'children'> & {
    /** The day this button stands for, as the `DatePickerGrid` gives it to its function. */
    day: DatePickerDayData
  }

/** The name of one weekday. */
export const DatePickerWeekday = forwardRef<HTMLSpanElement, DatePickerWeekdayProps>(
  (
    { children, className, style }: DatePickerWeekdayProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { variant } = useDatePickerContext('DatePickerWeekday')
    useDatePickerPageContext('DatePickerWeekday')

    return (
      <span
        className={joinClasses(variant !== 'unstyled' && styles.dayOfWeek, className)}
        data-plume-datepicker-weekday=""
        ref={ref}
        style={style}
      >
        {children}
      </span>
    )
  },
)

DatePickerWeekday.displayName = 'DatePickerWeekday'

/** The row of weekday names above the days. */
export const DatePickerWeekdays = forwardRef<HTMLDivElement, DatePickerWeekdaysProps>(
  (
    { children, className, style }: DatePickerWeekdaysProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { variant } = useDatePickerContext('DatePickerWeekdays')
    const { weekdays } = useDatePickerPageContext('DatePickerWeekdays')
    return (
      <div
        className={joinClasses(variant !== 'unstyled' && styles.daysOfWeek, className)}
        data-plume-datepicker-weekdays=""
        ref={ref}
        style={style}
      >
        {renderItems(weekdays, children, (weekday) => (
          <DatePickerWeekday key={weekday}>{weekday}</DatePickerWeekday>
        ))}
      </div>
    )
  },
)

DatePickerWeekdays.displayName = 'DatePickerWeekdays'

/** The number of a day, inside its `DatePickerDay`. */
export const DatePickerDayNumber = forwardRef<HTMLSpanElement, DatePickerDayNumberProps>(
  (
    { children, className, style }: DatePickerDayNumberProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    useDatePickerPageContext('DatePickerDayNumber')

    return (
      <span className={className} data-plume-datepicker-day-number="" ref={ref} style={style}>
        {children}
      </span>
    )
  },
)

DatePickerDayNumber.displayName = 'DatePickerDayNumber'

/** One day of the grid. `children` replace its `DatePickerDayNumber`. */
export const DatePickerDay = forwardRef<HTMLButtonElement, DatePickerDayProps>(
  (
    { children, className, day, style }: DatePickerDayProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactNode => {
    const { variant } = useDatePickerContext('DatePickerDay')
    const { hover, onDayKeyDown, selectDay } = useDatePickerPageContext('DatePickerDay')
    const { isCurrentMonth, isDisabled, isInRange, isSelected, isToday } = day
    const isStyled = variant !== 'unstyled'

    return (
      <button
        aria-current={isToday ? 'date' : undefined}
        aria-hidden={isCurrentMonth ? undefined : true}
        aria-label={day.label}
        aria-pressed={isCurrentMonth ? isSelected : undefined}
        className={joinClasses(
          isStyled && styles.day,
          isStyled && !isCurrentMonth && styles.disabledDay,
          isStyled && isSelected && styles.selected,
          isStyled && isInRange && !isSelected && isCurrentMonth && styles.rangeItem,
          isStyled && isCurrentMonth && isDisabled && styles.outOfRangeDay,
          isStyled && isToday && styles.today,
          className,
        )}
        data-date={day.dataDate}
        data-disabled={isDisabled ? '' : undefined}
        data-in-range={isInRange && isCurrentMonth ? '' : undefined}
        data-outside={isCurrentMonth ? undefined : ''}
        data-plume-datepicker-day=""
        data-selected={isSelected ? '' : undefined}
        data-today={isToday ? '' : undefined}
        disabled={isDisabled}
        onClick={() => {
          selectDay(day)
        }}
        onFocus={() => {
          if (isCurrentMonth) hover(day.dataDate)
        }}
        onKeyDown={onDayKeyDown}
        onMouseEnter={() => {
          if (isCurrentMonth) hover(day.dataDate)
        }}
        ref={ref}
        style={style}
        tabIndex={day.tabIndex}
        type="button"
      >
        {children ?? <DatePickerDayNumber>{day.date.getDate()}</DatePickerDayNumber>}
      </button>
    )
  },
)

DatePickerDay.displayName = 'DatePickerDay'

/** The grid of days of the month. */
export const DatePickerGrid = forwardRef<HTMLDivElement, DatePickerGridProps>(
  (
    { children, className, style }: DatePickerGridProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { variant } = useDatePickerContext('DatePickerGrid')
    const { days } = useDatePickerPageContext('DatePickerGrid')
    return (
      <div
        className={joinClasses(variant !== 'unstyled' && styles.calendarGrid, className)}
        data-plume-datepicker-grid=""
        ref={ref}
        style={style}
      >
        {renderItems(days, children, (day) => (
          <DatePickerDay day={day} key={day.dataDate} />
        ))}
      </div>
    )
  },
)

DatePickerGrid.displayName = 'DatePickerGrid'
