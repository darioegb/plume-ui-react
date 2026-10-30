'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { DatePickerPage } from './datepicker-page'
import { useDatePickerContext } from './datepicker-context'
import styles from './datepicker.module.css'

export type DatePickerPagesProps = Omit<ComponentProps, 'index'> &
  Pick<HTMLAttributes<HTMLDivElement>, 'children'>

/** Holds one `DatePickerPage`, or two in a range. */
export const DatePickerPages = forwardRef<HTMLDivElement, DatePickerPagesProps>(
  (
    { children, className, style }: DatePickerPagesProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { isRange, variant } = useDatePickerContext('DatePickerPages')

    return (
      <div
        className={joinClasses(
          variant !== 'unstyled' &&
            (isRange ? styles.calendarContainerDouble : styles.calendarContainer),
          className,
        )}
        data-range={isRange ? '' : undefined}
        data-plume-datepicker-pages=""
        ref={ref}
        style={style}
      >
        {children ?? (
          <>
            <DatePickerPage />
            {isRange ? <DatePickerPage second /> : null}
          </>
        )}
      </div>
    )
  },
)

DatePickerPages.displayName = 'DatePickerPages'
