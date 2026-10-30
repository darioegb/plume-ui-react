'use client'

import type { ButtonHTMLAttributes, ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { Button } from '../../interaction/button'
import { DatePickerIcon } from './datepicker-icons'
import { useDatePickerPageContext } from './datepicker-page-context'
import { useDatePickerContext } from './datepicker-context'
import styles from './datepicker.module.css'

type PartProps = Omit<ComponentProps, 'index'>
type ContainerAttributes = Pick<HTMLAttributes<HTMLElement>, 'children'>
type ButtonAttributes = Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label' | 'children'>

export type DatePickerHeaderProps = PartProps & ContainerAttributes
export type DatePickerNavProps = PartProps & ContainerAttributes
export type DatePickerSeparatorProps = PartProps & ContainerAttributes
export type DatePickerPreviousProps = PartProps & ButtonAttributes
export type DatePickerNextProps = PartProps & ButtonAttributes
export type DatePickerMonthButtonProps = PartProps & ButtonAttributes
export type DatePickerYearButtonProps = PartProps & ButtonAttributes

const isText = (children: ReactNode): boolean =>
  typeof children === 'string' || typeof children === 'number'

/** The top row of a page. */
export const DatePickerHeader = forwardRef<HTMLDivElement, DatePickerHeaderProps>(
  (
    { children, className, style }: DatePickerHeaderProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { variant } = useDatePickerContext('DatePickerHeader')
    useDatePickerPageContext('DatePickerHeader')

    return (
      <div
        className={joinClasses(variant !== 'unstyled' && styles.calendarHeader, className)}
        data-plume-datepicker-header=""
        ref={ref}
        style={style}
      >
        {children ?? <DatePickerNav />}
      </div>
    )
  },
)

DatePickerHeader.displayName = 'DatePickerHeader'

/** The row of controls inside the header. */
export const DatePickerNav = forwardRef<HTMLDivElement, DatePickerNavProps>(
  (
    { children, className, style }: DatePickerNavProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { variant } = useDatePickerContext('DatePickerNav')
    useDatePickerPageContext('DatePickerNav')

    return (
      <div
        className={joinClasses(variant !== 'unstyled' && styles.monthYearSelectors, className)}
        data-plume-datepicker-nav=""
        ref={ref}
        style={style}
      >
        {children ?? (
          <>
            <DatePickerPrevious />
            <DatePickerMonthButton />
            <DatePickerSeparator />
            <DatePickerYearButton />
            <DatePickerNext />
          </>
        )}
      </div>
    )
  },
)

DatePickerNav.displayName = 'DatePickerNav'

/** The `/` between the month and the year in the header. */
export const DatePickerSeparator = forwardRef<HTMLElement, DatePickerSeparatorProps>(
  (
    { children, className, style }: DatePickerSeparatorProps,
    ref: ForwardedRef<HTMLElement>,
  ): ReactNode => {
    useDatePickerPageContext('DatePickerSeparator')

    return (
      <strong className={className} data-plume-datepicker-separator="" ref={ref} style={style}>
        {children ?? '/'}
      </strong>
    )
  },
)

DatePickerSeparator.displayName = 'DatePickerSeparator'

/**
 * The button that goes back a month, or 20 years in the year view. Its name is `labels.previousMonth`
 * or `labels.previousYears`, unless `children` are text, which then name it.
 */
export const DatePickerPrevious = forwardRef<HTMLButtonElement, DatePickerPreviousProps>(
  (
    { 'aria-label': ariaLabel, children, className, style }: DatePickerPreviousProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactNode => {
    const { labels, variant } = useDatePickerContext('DatePickerPrevious')
    const { previous, view } = useDatePickerPageContext('DatePickerPrevious')
    const years = view === 'year'
    const fallback = years ? labels.previousYears : labels.previousMonth

    return (
      <Button
        aria-label={ariaLabel ?? (isText(children) ? undefined : fallback)}
        className={className}
        data-plume-datepicker-previous=""
        onClick={previous}
        ref={ref}
        style={style}
        variant={variant === 'unstyled' ? 'unstyled' : 'icon'}
      >
        {children ?? <DatePickerIcon name={years ? 'previousYears' : 'previous'} />}
      </Button>
    )
  },
)

DatePickerPrevious.displayName = 'DatePickerPrevious'

/**
 * The button that goes forward a month, or 20 years in the year view. Its name is `labels.nextMonth`
 * or `labels.nextYears`, unless `children` are text, which then name it.
 */
export const DatePickerNext = forwardRef<HTMLButtonElement, DatePickerNextProps>(
  (
    { 'aria-label': ariaLabel, children, className, style }: DatePickerNextProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactNode => {
    const { labels, variant } = useDatePickerContext('DatePickerNext')
    const { next, view } = useDatePickerPageContext('DatePickerNext')
    const years = view === 'year'
    const fallback = years ? labels.nextYears : labels.nextMonth

    return (
      <Button
        aria-label={ariaLabel ?? (isText(children) ? undefined : fallback)}
        className={className}
        data-plume-datepicker-next=""
        onClick={next}
        ref={ref}
        style={style}
        variant={variant === 'unstyled' ? 'unstyled' : 'icon'}
      >
        {children ?? <DatePickerIcon name={years ? 'nextYears' : 'next'} />}
      </Button>
    )
  },
)

DatePickerNext.displayName = 'DatePickerNext'

/** The button that opens the list of months. */
export const DatePickerMonthButton = forwardRef<HTMLButtonElement, DatePickerMonthButtonProps>(
  (
    { 'aria-label': ariaLabel, children, className, style }: DatePickerMonthButtonProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactNode => {
    const { variant } = useDatePickerContext('DatePickerMonthButton')
    const { monthLabel, toggleView, view } = useDatePickerPageContext('DatePickerMonthButton')

    return (
      <button
        aria-expanded={view === 'month'}
        aria-label={ariaLabel}
        className={joinClasses(variant !== 'unstyled' && styles.monthSelector, className)}
        data-active={view === 'month' ? '' : undefined}
        data-plume-datepicker-month-button=""
        onClick={() => {
          toggleView('month')
        }}
        ref={ref}
        style={style}
        type="button"
      >
        {children ?? monthLabel}
      </button>
    )
  },
)

DatePickerMonthButton.displayName = 'DatePickerMonthButton'

/** The button that opens the list of years. */
export const DatePickerYearButton = forwardRef<HTMLButtonElement, DatePickerYearButtonProps>(
  (
    { 'aria-label': ariaLabel, children, className, style }: DatePickerYearButtonProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactNode => {
    const { variant } = useDatePickerContext('DatePickerYearButton')
    const { toggleView, view, year } = useDatePickerPageContext('DatePickerYearButton')

    return (
      <button
        aria-expanded={view === 'year'}
        aria-label={ariaLabel}
        className={joinClasses(variant !== 'unstyled' && styles.yearSelector, className)}
        data-active={view === 'year' ? '' : undefined}
        data-plume-datepicker-year-button=""
        onClick={() => {
          toggleView('year')
        }}
        ref={ref}
        style={style}
        type="button"
      >
        {children ?? year}
      </button>
    )
  },
)

DatePickerYearButton.displayName = 'DatePickerYearButton'
