'use client'

import type { CSSProperties, ForwardedRef, ReactNode } from 'react'
import { forwardRef, useCallback, useState } from 'react'
import type { ColorScheme, ComponentProps, Shape, Size } from '../../../theme'
import { joinClasses } from '../../../overlay/class-names'
import { mergeRefs } from '../../../overlay/trigger'
import { customProperties } from '../shared/picker-panel'
import { DatePickerCalendar } from './datepicker-calendar'
import { DatePickerInput, type DatePickerInputProps } from './datepicker-input'
import type { DatePickerConfig, DatePickerVariant, DateRange } from './datepicker-types'
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

export type DatePickerPart = 'calendar' | 'input'

export interface DatePickerOwnProps {
  children?: ReactNode
  classNames?: Partial<Record<DatePickerPart, string>>
  colorScheme?: ColorScheme
  config?: DatePickerConfig
  displayFormat?: string
  isCalendar?: boolean
  isRange?: boolean
  maxDate?: Date
  minDate?: Date
  onChange: (value: DateRange) => void
  shape?: Shape
  showFooter?: boolean
  size?: Size
  value?: DateRange
  variant?: DatePickerVariant
}

export type DatePickerProps = Omit<ComponentProps, 'index'> &
  Omit<DatePickerInputProps, 'classNames' | 'style'> &
  DatePickerOwnProps

const datePickerColorVars = (colorScheme: ColorScheme, style?: CSSProperties): CSSProperties =>
  ({
    '--datepicker-scheme': `var(--plume-color-${colorScheme}-text)`,
    '--picker-scheme': 'var(--datepicker-scheme)',
    '--datepicker-solid': `var(--plume-color-${colorScheme}-solid)`,
    '--datepicker-contrast': `var(--plume-color-${colorScheme}-solid-contrast)`,
    '--datepicker-range-item-color': `var(--plume-color-${colorScheme}-200)`,
    '--datepicker-range-item-text': `var(--plume-color-${colorScheme}-900)`,
    '--datepicker-hover-color': `color-mix(in srgb, var(--plume-color-${colorScheme}-solid) 18%, transparent)`,
    '--datepicker-selected-hover-color': `var(--plume-color-${colorScheme}-solid-hover)`,
    ...style,
  }) as CSSProperties

export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      children,
      className,
      classNames,
      colorScheme = 'secondary',
      config,
      displayFormat,
      isCalendar = false,
      isRange = false,
      maxDate,
      minDate,
      onChange,
      shape,
      showFooter = false,
      size,
      style,
      value,
      variant = 'outline',
      ...inputProps
    }: DatePickerProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const [root, setRoot] = useState<HTMLDivElement | null>(null)
    const setRootRef = useCallback(
      (node: HTMLDivElement | null): void => mergeRefs<HTMLDivElement>(setRoot, ref)(node),
      [ref],
    )
    const colorVars = datePickerColorVars(colorScheme, customProperties(style))
    const { context, handleBlur } = useDatePickerController({
      colorScheme,
      config,
      displayFormat,
      isCalendar,
      isRange,
      maxDate,
      minDate,
      onChange,
      panelVars: colorVars,
      root,
      shape: shape ?? (variant === 'unstyled' ? undefined : 'rounded'),
      showFooter,
      size: size ?? (variant === 'unstyled' ? undefined : 'md'),
      value,
      variant,
    })

    return (
      <DatePickerContext.Provider value={context}>
        <div
          className={joinClasses(styles.datePicker, className)}
          onBlur={handleBlur}
          ref={setRootRef}
          style={{ ...colorVars, ...style }}
        >
          {children ?? (
            <>
              <DatePickerInput classNames={{ input: classNames?.input }} {...inputProps} />
              <DatePickerCalendar className={classNames?.calendar} />
            </>
          )}
        </div>
      </DatePickerContext.Provider>
    )
  },
)

DatePicker.displayName = 'DatePicker'
