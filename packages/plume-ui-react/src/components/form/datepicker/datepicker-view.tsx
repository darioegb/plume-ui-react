'use client'

import type { ReactNode } from 'react'
import { DatePickerGrid, DatePickerWeekdays } from './datepicker-days'
import { DatePickerMonths, DatePickerYears } from './datepicker-months'
import { useDatePickerPage, type DatePickerViewName } from './datepicker-page-context'

export interface DatePickerViewProps {
  children?: ((view: DatePickerViewName) => ReactNode) | ReactNode
}

export function DatePickerView({ children }: Readonly<DatePickerViewProps>): ReactNode {
  const { view } = useDatePickerPage('DatePickerView')

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
