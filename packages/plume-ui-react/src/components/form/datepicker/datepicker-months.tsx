'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { renderItems, type DatePickerMonthData, type DatePickerYearData } from './calendar-utils'
import { useDatePickerContext } from './datepicker-context'
import { useDatePickerPageContext } from './datepicker-page-context'
import styles from './datepicker.module.css'

type PartProps = Omit<ComponentProps, 'index'>

export type DatePickerMonthsProps = PartProps & {
  /**
   * A node, or a function of the month that returns each `DatePickerMonthOption`. Without it the twelve months are rendered.
   */
  children?: ((month: DatePickerMonthData) => ReactNode) | ReactNode
}
export type DatePickerMonthOptionProps = PartProps &
  Pick<HTMLAttributes<HTMLButtonElement>, 'children'> & {
    /** The month this option stands for, as `DatePickerMonths` gives it to its function. */
    month: DatePickerMonthData
  }
export type DatePickerYearsProps = PartProps & {
  /**
   * A node, or a function of the year that returns each `DatePickerYearOption`. Without it the years of the page are rendered.
   */
  children?: ((year: DatePickerYearData) => ReactNode) | ReactNode
}
export type DatePickerYearOptionProps = PartProps &
  Pick<HTMLAttributes<HTMLButtonElement>, 'children'> & {
    /** The year this option stands for, as `DatePickerYears` gives it to its function. */
    year: DatePickerYearData
  }

/** One month of the month view. */
export const DatePickerMonthOption = forwardRef<HTMLButtonElement, DatePickerMonthOptionProps>(
  (
    { children, className, month, style }: DatePickerMonthOptionProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactNode => {
    const { variant } = useDatePickerContext('DatePickerMonthOption')
    const { selectMonth } = useDatePickerPageContext('DatePickerMonthOption')
    const isStyled = variant !== 'unstyled'

    return (
      <button
        aria-pressed={month.selected}
        className={joinClasses(
          isStyled && month.selected && styles.selected,
          isStyled && styles.month,
          className,
        )}
        data-plume-datepicker-month-option=""
        data-selected={month.selected ? '' : undefined}
        onClick={() => {
          selectMonth(month.index)
        }}
        ref={ref}
        style={style}
        type="button"
      >
        {children ?? month.label}
      </button>
    )
  },
)

DatePickerMonthOption.displayName = 'DatePickerMonthOption'

/** The list of months shown in the month view. */
export const DatePickerMonths = forwardRef<HTMLDivElement, DatePickerMonthsProps>(
  (
    { children, className, style }: DatePickerMonthsProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { variant } = useDatePickerContext('DatePickerMonths')
    const { monthOptions } = useDatePickerPageContext('DatePickerMonths')
    return (
      <div
        className={joinClasses(variant !== 'unstyled' && styles.monthSelectorGrid, className)}
        data-plume-datepicker-months=""
        ref={ref}
        style={style}
      >
        {renderItems(monthOptions, children, (month) => (
          <DatePickerMonthOption key={month.label} month={month} />
        ))}
      </div>
    )
  },
)

DatePickerMonths.displayName = 'DatePickerMonths'

/** One year of the year view. */
export const DatePickerYearOption = forwardRef<HTMLButtonElement, DatePickerYearOptionProps>(
  (
    { children, className, style, year }: DatePickerYearOptionProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactNode => {
    const { variant } = useDatePickerContext('DatePickerYearOption')
    const { selectYear } = useDatePickerPageContext('DatePickerYearOption')
    const isStyled = variant !== 'unstyled'

    return (
      <button
        aria-pressed={year.selected}
        className={joinClasses(
          isStyled && year.selected && styles.selected,
          isStyled && styles.year,
          className,
        )}
        data-plume-datepicker-year-option=""
        data-selected={year.selected ? '' : undefined}
        onClick={() => {
          selectYear(year.value)
        }}
        ref={ref}
        style={style}
        type="button"
      >
        {children ?? year.value}
      </button>
    )
  },
)

DatePickerYearOption.displayName = 'DatePickerYearOption'

/** The list of years shown in the year view. */
export const DatePickerYears = forwardRef<HTMLDivElement, DatePickerYearsProps>(
  (
    { children, className, style }: DatePickerYearsProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { variant } = useDatePickerContext('DatePickerYears')
    const { yearOptions } = useDatePickerPageContext('DatePickerYears')
    return (
      <div
        className={joinClasses(variant !== 'unstyled' && styles.yearSelectorGrid, className)}
        data-plume-datepicker-years=""
        ref={ref}
        style={style}
      >
        {renderItems(yearOptions, children, (year) => (
          <DatePickerYearOption key={year.value} year={year} />
        ))}
      </div>
    )
  },
)

DatePickerYears.displayName = 'DatePickerYears'
