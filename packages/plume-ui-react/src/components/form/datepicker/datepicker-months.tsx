'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { Button } from '../../interaction/button'
import { renderItems, type DatePickerMonthData, type DatePickerYearData } from './calendar-utils'
import { useDatePickerPage } from './datepicker-page-context'
import styles from './datepicker.module.css'

type PartProps = Omit<ComponentProps, 'index'>

export type DatePickerMonthsProps = PartProps & {
  children?: ((month: DatePickerMonthData) => ReactNode) | ReactNode
}
export type DatePickerMonthOptionProps = PartProps &
  Pick<HTMLAttributes<HTMLButtonElement>, 'children'> & { month: DatePickerMonthData }
export type DatePickerYearsProps = PartProps & {
  children?: ((year: DatePickerYearData) => ReactNode) | ReactNode
}
export type DatePickerYearOptionProps = PartProps &
  Pick<HTMLAttributes<HTMLButtonElement>, 'children'> & { year: DatePickerYearData }

export const DatePickerMonthOption = forwardRef<HTMLButtonElement, DatePickerMonthOptionProps>(
  (
    { children, className, month, style }: DatePickerMonthOptionProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactNode => {
    const { selectMonth } = useDatePickerPage('DatePickerMonthOption')

    return (
      <Button
        aria-pressed={month.selected}
        className={joinClasses(month.selected && styles.selected, styles.month, className)}
        data-plume-datepicker-month-option=""
        data-selected={month.selected ? '' : undefined}
        label={children ? undefined : month.label}
        onClick={() => {
          selectMonth(month.index)
        }}
        ref={ref}
        style={style}
        variant="unstyled"
      >
        {children}
      </Button>
    )
  },
)

DatePickerMonthOption.displayName = 'DatePickerMonthOption'

export const DatePickerMonths = forwardRef<HTMLDivElement, DatePickerMonthsProps>(
  (
    { children, className, style }: DatePickerMonthsProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { monthOptions } = useDatePickerPage('DatePickerMonths')
    return (
      <div
        className={joinClasses(styles.monthSelectorGrid, className)}
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

export const DatePickerYearOption = forwardRef<HTMLButtonElement, DatePickerYearOptionProps>(
  (
    { children, className, style, year }: DatePickerYearOptionProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactNode => {
    const { selectYear } = useDatePickerPage('DatePickerYearOption')

    return (
      <Button
        aria-pressed={year.selected}
        className={joinClasses(year.selected && styles.selected, styles.year, className)}
        data-plume-datepicker-year-option=""
        data-selected={year.selected ? '' : undefined}
        onClick={() => {
          selectYear(year.value)
        }}
        ref={ref}
        style={style}
        variant="unstyled"
      >
        {children ?? year.value}
      </Button>
    )
  },
)

DatePickerYearOption.displayName = 'DatePickerYearOption'

export const DatePickerYears = forwardRef<HTMLDivElement, DatePickerYearsProps>(
  (
    { children, className, style }: DatePickerYearsProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { yearOptions } = useDatePickerPage('DatePickerYears')
    return (
      <div
        className={joinClasses(styles.yearSelectorGrid, className)}
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
