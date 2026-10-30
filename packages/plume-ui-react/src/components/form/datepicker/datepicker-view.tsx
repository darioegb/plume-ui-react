'use client'

import type { ReactNode } from 'react'
import { DatePickerGrid, DatePickerWeekdays } from './datepicker-days'
import { DatePickerMonths, DatePickerYears } from './datepicker-months'
import { useDatePickerPageContext, type DatePickerViewName } from './datepicker-page-context'

export interface DatePickerViewProps {
  /**
   * A node, or a function of the current view (`day`, `month` or `year`) that returns what to render. Without it the view is rendered with its default parts.
   */
  children?: ((view: DatePickerViewName) => ReactNode) | ReactNode
}

/** Renders the current view of the page: days, months or years. */
export function DatePickerView({ children }: Readonly<DatePickerViewProps>): ReactNode {
  const { view } = useDatePickerPageContext('DatePickerView')

  if (typeof children === 'function') return children(view)
  if (children !== undefined) return children
  if (view === 'month') return <DatePickerMonths />
  if (view === 'year') return <DatePickerYears />
  return (
    <>
      <DatePickerWeekdays />
      <DatePickerGrid />
    </>
  )
}

DatePickerView.displayName = 'DatePickerView'
