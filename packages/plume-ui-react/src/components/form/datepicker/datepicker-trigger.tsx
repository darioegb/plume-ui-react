'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { CalendarIcon } from '../../../overlay/icons'
import type { ComponentProps } from '../../../theme'
import { PickerTrigger } from '../shared/picker-trigger'
import { useDatePickerInput } from './datepicker-input-context'
import { useDatePicker } from './use-datepicker'

export type DatePickerTriggerProps = Omit<ComponentProps, 'index'> &
  Pick<HTMLAttributes<HTMLButtonElement>, 'children'>

/** The button that opens the calendar, inside a `DatePickerInput`. `children` replace the icon. */
export const DatePickerTrigger = forwardRef<HTMLButtonElement, DatePickerTriggerProps>(
  (
    { children, className, style }: DatePickerTriggerProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactNode => {
    const {
      calendarId,
      labels,
      state: { modalOpen },
      variant,
    } = useDatePicker('DatePickerTrigger')
    const { disabled, onTriggerClick } = useDatePickerInput('DatePickerTrigger')

    return (
      <PickerTrigger
        className={className}
        controls={calendarId}
        data-plume-datepicker-trigger=""
        disabled={disabled}
        icon={children ?? <CalendarIcon />}
        label={labels.openCalendar}
        onClick={onTriggerClick}
        open={modalOpen}
        ref={ref}
        style={style}
        unstyled={variant === 'unstyled'}
      />
    )
  },
)

DatePickerTrigger.displayName = 'DatePickerTrigger'
