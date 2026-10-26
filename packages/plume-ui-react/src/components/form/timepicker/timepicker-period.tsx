'use client'

import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { TimeColumn } from './time-column'
import { parseTime, toTwelveHour, type Period } from './time-utils'
import type { TimePickerColumnProps } from './timepicker-options'
import { useTimePicker } from './use-timepicker'

export type TimePickerPeriodProps = TimePickerColumnProps<Period>

/** The list of the period (AM and PM). It only exists with `hour12`. */
export const TimePickerPeriod = forwardRef<HTMLDivElement, TimePickerPeriodProps>(
  (
    { 'aria-label': ariaLabel, children, className, style }: TimePickerPeriodProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { hour12, labels, pickPeriod, value } = useTimePicker('TimePickerPeriod')
    const parts = parseTime(value)

    if (!hour12) return null

    return (
      <TimeColumn
        className={className}
        columnRef={ref}
        kind="period"
        label={ariaLabel ?? labels.period}
        onSelect={pickPeriod}
        options={[
          { label: labels.am, value: 'am' as const },
          { label: labels.pm, value: 'pm' as const },
        ]}
        selected={parts ? toTwelveHour(parts.hours).period : undefined}
        style={style}
      >
        {children}
      </TimeColumn>
    )
  },
)

TimePickerPeriod.displayName = 'TimePickerPeriod'
