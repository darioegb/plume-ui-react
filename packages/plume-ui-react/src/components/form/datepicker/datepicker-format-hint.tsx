'use client'

import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { visuallyHidden } from '../../../overlay/visually-hidden'
import type { ComponentProps } from '../../../theme'
import { useDatePickerInputContext } from './datepicker-input-context'

export type DatePickerFormatHintProps = Omit<ComponentProps, 'index'> &
  Pick<HTMLAttributes<HTMLSpanElement>, 'children'>

/**
 * The visually hidden text that tells the expected format (`labels.format`) and describes the input.
 * `children` replace the text. As a direct child of the `DatePickerInput` it takes the place of the default one.
 */
export const DatePickerFormatHint = forwardRef<HTMLSpanElement, DatePickerFormatHintProps>(
  (
    { children, className, style }: DatePickerFormatHintProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ): ReactNode => {
    const { hint, hintId } = useDatePickerInputContext('DatePickerFormatHint')

    return (
      <span
        className={className}
        data-plume-datepicker-format-hint=""
        id={hintId}
        ref={ref}
        style={{ ...visuallyHidden, ...style }}
      >
        {children ?? hint}
      </span>
    )
  },
)

DatePickerFormatHint.displayName = 'DatePickerFormatHint'
