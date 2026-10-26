'use client'

import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { TimeColumn } from './time-column'
import { parseTime, range } from './time-utils'
import { selectedHour, toOptions, type TimePickerColumnProps } from './timepicker-options'
import { useTimePicker } from './use-timepicker'

export type TimePickerHoursProps = TimePickerColumnProps<number>

/** The list of hours. With `hour12` it lists 1 to 12. */
export const TimePickerHours = forwardRef<HTMLDivElement, TimePickerHoursProps>(
  (
    { 'aria-label': ariaLabel, children, className, style }: TimePickerHoursProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { hour12, labels, pickHours, value } = useTimePicker('TimePickerHours')

    return (
      <TimeColumn
        className={className}
        columnRef={ref}
        kind="hours"
        label={ariaLabel ?? labels.hours}
        onSelect={pickHours}
        options={toOptions(hour12 ? range(12, 1, 1) : range(24))}
        selected={selectedHour(parseTime(value)?.hours, hour12)}
        style={style}
      >
        {children}
      </TimeColumn>
    )
  },
)

TimePickerHours.displayName = 'TimePickerHours'
