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

export const DatePickerTrigger = forwardRef<HTMLButtonElement, DatePickerTriggerProps>(
  (
    { children, className, style }: DatePickerTriggerProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ): ReactNode => {
    const {
      labels,
      state: { modalOpen },
      variant,
    } = useDatePicker('DatePickerTrigger')
    const { disabled, onTriggerClick } = useDatePickerInput('DatePickerTrigger')

    return (
      <PickerTrigger
        className={className}
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
