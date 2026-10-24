'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useMemo, useRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { mergeRefs } from '../../../overlay/trigger'
import type { ComponentProps } from '../../../theme'
import { DatePickerHeader } from './datepicker-header'
import { DatePickerPageContext } from './datepicker-page-context'
import { DatePickerView } from './datepicker-view'
import { useDatePickerPage } from './use-datepicker-page'
import styles from './datepicker.module.css'

export interface DatePickerPageOwnProps {
  second?: boolean
}

export type DatePickerPageProps = Omit<ComponentProps, 'index'> &
  Pick<HTMLAttributes<HTMLDivElement>, 'children'> &
  DatePickerPageOwnProps

export const DatePickerPage = forwardRef<HTMLDivElement, DatePickerPageProps>(
  (
    { children, className, second = false, style }: DatePickerPageProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const calendarRef = useRef<HTMLDivElement>(null)
    const setRef = useMemo(() => mergeRefs(calendarRef, ref), [ref])
    const page = useDatePickerPage(second, calendarRef)

    return (
      <DatePickerPageContext.Provider value={page}>
        <div
          className={joinClasses(styles.calendar, className)}
          data-plume-datepicker-page=""
          ref={setRef}
          style={style}
        >
          {children ?? (
            <>
              <DatePickerHeader />
              <DatePickerView />
            </>
          )}
        </div>
      </DatePickerPageContext.Provider>
    )
  },
)

DatePickerPage.displayName = 'DatePickerPage'
