'use client'

import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef, useMemo } from 'react'
import { mergeRefs } from '../../../overlay/trigger'
import { InputField, type InputFieldProps } from '../input'
import { useDatePickerInputContext } from './datepicker-input-context'

export type DatePickerFieldProps = InputFieldProps

/** The `<input>` inside a `DatePickerInput`. It takes the props of `InputField`. */
export const DatePickerField = forwardRef<HTMLInputElement, DatePickerFieldProps>(
  (props: DatePickerFieldProps, ref: ForwardedRef<HTMLInputElement>): ReactNode => {
    const { setRef } = useDatePickerInputContext('DatePickerField')
    const mergedRef = useMemo(() => mergeRefs(setRef, ref), [ref, setRef])

    return <InputField data-plume-datepicker-field="" {...props} ref={mergedRef} />
  },
)

DatePickerField.displayName = 'DatePickerField'
