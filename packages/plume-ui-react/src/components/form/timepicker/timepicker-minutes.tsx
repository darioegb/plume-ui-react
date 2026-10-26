'use client'

import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { TimeColumn } from './time-column'
import { parseTime, range } from './time-utils'
import { toOptions, type TimePickerColumnProps } from './timepicker-options'
import { useTimePicker } from './use-timepicker'

export type TimePickerMinutesProps = TimePickerColumnProps<number>

/** The list of minutes, spaced by `minuteStep`. */
export const TimePickerMinutes = forwardRef<HTMLDivElement, TimePickerMinutesProps>(
  (
    { 'aria-label': ariaLabel, children, className, style }: TimePickerMinutesProps,
    ref: ForwardedRef<HTMLDivElement>,
  ): ReactNode => {
    const { labels, minuteStep, pickMinutes, value } = useTimePicker('TimePickerMinutes')

    return (
      <TimeColumn
        className={className}
        columnRef={ref}
        kind="minutes"
        label={ariaLabel ?? labels.minutes}
        onSelect={pickMinutes}
        options={toOptions(range(60, minuteStep))}
        selected={parseTime(value)?.minutes}
        style={style}
      >
        {children}
      </TimeColumn>
    )
  },
)

TimePickerMinutes.displayName = 'TimePickerMinutes'
