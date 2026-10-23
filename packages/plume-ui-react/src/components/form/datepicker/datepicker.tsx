'use client'

import type { CSSProperties, ForwardedRef, ReactNode } from 'react'
import { forwardRef, useCallback, useState } from 'react'
import type { ColorScheme, ComponentProps } from '../../../theme'
import { mergeRefs } from '../../../overlay/trigger'
import { DatePickerCalendar } from './datepicker-calendar'
import { DatePickerInput, type DatePickerInputProps } from './datepicker-input'
import type { DatePickerConfig, DateRange } from './datepicker-types'
import { DatePickerContext } from './use-datepicker'
import { useDatePickerController } from './use-datepicker-controller'
import styles from './datepicker.module.css'

export type {
  DatePickerConfig,
  DatePickerLabels,
  DatePickerRootAttributes,
  DatePickerVariant,
  DateRange,
  FooterLabels,
} from './datepicker-types'

export interface DatePickerOwnProps {
  children?: ReactNode
  colorScheme?: ColorScheme
  config?: DatePickerConfig
  displayFormat?: string
  isCalendar?: boolean
  isRange?: boolean
  maxDate?: Date
  minDate?: Date
  onChange: (value: DateRange) => void
  showFooter?: boolean
  value?: DateRange
}

export type DatePickerProps = Omit<ComponentProps, 'index'> &
  Omit<DatePickerInputProps, 'style'> &
  DatePickerOwnProps

const datePickerColorVars = (colorScheme: ColorScheme, style?: CSSProperties): CSSProperties =>
  ({
    '--datepicker-scheme': `var(--plume-color-${colorScheme}-text)`,
    '--datepicker-solid': `var(--plume-color-${colorScheme}-solid)`,
    '--datepicker-contrast': `var(--plume-color-${colorScheme}-solid-contrast)`,
    '--datepicker-range-item-color': `var(--plume-color-${colorScheme}-200)`,
    '--datepicker-range-item-text': `var(--plume-color-${colorScheme}-900)`,
    '--datepicker-hover-color': `var(--plume-color-${colorScheme}-100)`,
    '--datepicker-selected-hover-color': `var(--plume-color-${colorScheme}-solid-hover)`,
    ...style,
  }) as CSSProperties

export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      children,
      colorScheme = 'secondary',
      config,
      displayFormat,
      isCalendar = false,
      isRange = false,
      maxDate,
      minDate,
      onChange,
      showFooter = false,
      style,
      value,
      ...inputProps
    }: DatePickerProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const [root, setRoot] = useState<HTMLDivElement | null>(null)
    const setRootRef = useCallback(
      (node: HTMLDivElement | null): void => mergeRefs<HTMLDivElement>(setRoot, ref)(node),
      [ref],
    )
    const { context, handleBlur } = useDatePickerController({
      colorScheme,
      config,
      displayFormat,
      isCalendar,
      isRange,
      maxDate,
      minDate,
      onChange,
      root,
      showFooter,
      value,
    })

    return (
      <DatePickerContext.Provider value={context}>
        <div
          className={styles.datePicker}
          onBlur={handleBlur}
          ref={setRootRef}
          style={datePickerColorVars(colorScheme, style)}
        >
          {children ?? (
            <>
              <DatePickerInput {...inputProps} />
              <DatePickerCalendar />
            </>
          )}
        </div>
      </DatePickerContext.Provider>
    )
  },
)

DatePicker.displayName = 'DatePicker'
