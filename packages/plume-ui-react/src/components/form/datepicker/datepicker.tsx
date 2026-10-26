'use client'

import type { CSSProperties, ForwardedRef, ReactNode } from 'react'
import { forwardRef, useCallback, useState } from 'react'
import type { ColorScheme, ComponentProps, Shape, Size } from '../../../theme'
import { joinClasses } from '../../../overlay/class-names'
import { mergeRefs } from '../../../overlay/trigger'
import { customProperties } from '../shared/picker-panel'
import { DatePickerCalendar } from './datepicker-calendar'
import { DatePickerInput, type DatePickerInputProps } from './datepicker-input'
import type {
  DatePickerLabels,
  DatePickerVariant,
  DateRange,
} from './datepicker-types'
import { DatePickerContext } from './use-datepicker'
import { useDatePickerController } from './use-datepicker-controller'
import styles from './datepicker.module.css'

export type {
  DatePickerLabels,
  DatePickerRootAttributes,
  DatePickerVariant,
  DateRange,
} from './datepicker-types'

export interface DatePickerOwnProps {
  /**
   * The parts of the DatePicker, to change what it shows or their order: a `DatePickerInput` and a `DatePickerCalendar`. Without them it renders both.
   */
  children?: ReactNode
  /**
   * Color scheme from the theme palette, including custom schemes added to it.
   *
   * @default 'secondary'
   */
  colorScheme?: ColorScheme
  /**
   * Format of the typed and displayed date, built from the `dd`, `mm` and `yyyy` tokens in any order and case (e.g. `dd/mm/yyyy`, `YYYY-MM-DD`). Defaults to the format of `locale`.
   */
  displayFormat?: string
  /**
   * BCP 47 tag (`es`, `es-AR`, `en-US`) that sets the month and weekday names, the default `displayFormat` and the day labels read by screen readers. Falls back to the `locale` of the `LocaleProvider`, then to `en`.
   */
  locale?: string
  /**
   * Renders only the calendar, always visible, without the input.
   *
   * @default false
   */
  panel?: boolean
  /**
   * Selects a start and an end date, showing two consecutive months.
   *
   * @default false
   */
  range?: boolean
  /**
   * `labels` sets every text the component shows or announces: the buttons of the footer (`apply`, `cancel`), the name of the calendar (`calendar`) and of the button that opens it (`openCalendar`), and the navigation buttons (`previousMonth`, `nextMonth`, `previousYears`, `nextYears`). Every key is optional and falls back to its default.
   */
  labels?: Partial<DatePickerLabels>
  /** Last selectable date. Later days are disabled. */
  maxDate?: Date
  /** First selectable date. Earlier days are disabled. */
  minDate?: Date
  /**
   * Called with the new `{ startDate, endDate }` when a date is picked or typed, when a range is complete, or on Apply when `showFooter` is set.
   */
  onValueChange: (value: DateRange) => void
  /**
   * Shape style of the DatePicker. `pill` rounds the `outline` input and the corners of the calendar.
   */
  shape?: Shape
  /**
   * Shows Cancel and Apply buttons, so the selection is only applied (and `onValueChange` called) on Apply.
   *
   * @default false
   */
  showFooter?: boolean
  /** Size of the input and of the calendar days. */
  size?: Size
  /** Selected date or range as `{ startDate, endDate }`. In single mode `endDate` is `null`. */
  value?: DateRange
  /**
   * Visual style variant of the input and of the calendar. `outline` has a bordered calendar, `filled` a tinted one with an accent line, `underline` a square one with an accent line and `unstyled` none of them.
   *
   * @default 'outline'
   */
  variant?: DatePickerVariant
}

export type DatePickerProps = Omit<ComponentProps, 'index'> &
  Omit<DatePickerInputProps, 'children' | 'style'> &
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
      colorScheme = 'secondary',
      locale,
      displayFormat,
      panel: isPanel = false,
      range: isRange = false,
      labels,
      maxDate,
      minDate,
      onValueChange: onChange,
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
      locale,
      displayFormat,
      isPanel,
      isRange,
      labels,
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
