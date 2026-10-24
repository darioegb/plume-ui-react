'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ComponentProps } from '../../../theme'
import { DatePickerPage } from './datepicker-page'
import { useDatePicker } from './use-datepicker'
import styles from './datepicker.module.css'

export type DatePickerPagesProps = Omit<ComponentProps, 'index'> &
  Pick<HTMLAttributes<HTMLDivElement>, 'children'>

export const DatePickerPages = forwardRef<HTMLDivElement, DatePickerPagesProps>(
  (
    { children, className, style }: DatePickerPagesProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { isRange } = useDatePicker('DatePickerPages')

    return (
      <div
        className={joinClasses(
          isRange ? styles.calendarContainerDouble : styles.calendarContainer,
          className,
        )}
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
