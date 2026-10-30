'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { visuallyHidden } from '../../../overlay/visually-hidden'
import type { ComponentProps } from '../../../theme'
import { useTimePickerInputContext } from './timepicker-input-context'

export type TimePickerFormatHintProps = Omit<ComponentProps, 'index'> &
  Pick<HTMLAttributes<HTMLSpanElement>, 'children'>

/**
 * The visually hidden text that tells the expected format (`labels.format`) and describes the input.
 * `children` replace the text. As a direct child of the `TimePickerInput` it takes the place of the default one.
 */
export const TimePickerFormatHint = forwardRef<HTMLSpanElement, TimePickerFormatHintProps>(
  (
    { children, className, style }: TimePickerFormatHintProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { hint, hintId } = useTimePickerInputContext('TimePickerFormatHint')

    return (
      <span
        className={className}
        data-plume-timepicker-format-hint=""
        id={hintId}
        ref={ref}
        style={{ ...visuallyHidden, ...style }}
      >
        {children ?? hint}
      </span>
    )
  },
)

TimePickerFormatHint.displayName = 'TimePickerFormatHint'
