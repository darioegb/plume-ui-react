'use client'

import type { ForwardedRef, ReactNode } from 'react'
import { forwardRef, useCallback, useState } from 'react'
import type { ColorScheme, ComponentProps, Shape, Size } from '../../../theme'
import { joinClasses } from '../../../overlay/class-names'
import { mergeRefs } from '../../../overlay/trigger'
import type { PickerVariant } from '../shared/picker-panel'
import { TimePickerInput, type TimePickerInputProps } from './timepicker-input'
import { TimePickerPanel } from './timepicker-panel'
import { TimePickerContext } from './use-timepicker'
import { timePickerColorVars, useTimePickerController } from './use-timepicker-controller'
import type { TimePickerLabels } from './timepicker-types'
import styles from './timepicker.module.css'

export type { TimePickerLabels } from './timepicker-types'

export interface TimePickerOwnProps {
  /**
   * The parts of the picker (`TimePickerInput` and `TimePickerPanel`), in the order they should
   * appear. Without children it renders the input and the panel.
   */
  children?: ReactNode
  /**
   * Color scheme from the theme palette, custom schemes included.
   * @default 'secondary'
   */
  colorScheme?: ColorScheme
  /**
   * Initial time of the uncontrolled picker, in `HH:mm`.
   * @default ''
   */
  defaultValue?: string
  /**
   * Shows and accepts the time as `hh:mm AM/PM` and adds a list for the period. The value stays in
   * 24 hours.
   * @default false
   */
  hour12?: boolean
  /**
   * Renders only the lists of hours and minutes, always visible, without the input.
   * @default false
   */
  isPanel?: boolean
  /**
   * Every text the picker shows or announces: the names of the popup (`timePicker`), of its lists
   * (`hours`, `minutes`, `period`) and of the button that opens it (`openTimePicker`), and the `am`
   * and `pm` texts. Every key is optional and falls back to its default.
   */
  labels?: Partial<TimePickerLabels>
  /**
   * Distance between the minutes of the list: `15` lists 00, 15, 30 and 45.
   * @default 1
   */
  minuteStep?: number
  /**
   * Called with the new `HH:mm` value when a complete valid time is typed or an option is picked,
   * or with `""` when the input is cleared.
   */
  onChange?: (value: string) => void
  /**
   * Shape of the corners. `pill` rounds the `outline` input and the corners of the popup.
   * @default 'rounded'
   */
  shape?: Shape
  /**
   * Size of the input and of the popup text.
   * @default 'md'
   */
  size?: Size
  /**
   * Selected time in `HH:mm` (24 hours), or `""` when empty. Makes the picker controlled; use
   * `defaultValue` otherwise.
   */
  value?: string
  /**
   * Visual variant of the input and of the popup. `outline` has a bordered popup, `filled` a tinted
   * one with an accent line, `underline` a square one with an accent line, and `unstyled` none of
   * them.
   * @default 'outline'
   */
  variant?: PickerVariant
}

export type TimePickerProps = Omit<ComponentProps, 'index'> &
  Omit<TimePickerInputProps, 'children' | 'style'> &
  TimePickerOwnProps

export const TimePicker = forwardRef<HTMLDivElement, TimePickerProps>(
  (
    {
      children,
      className,
      colorScheme = 'secondary',
      defaultValue = '',
      hour12 = false,
      isPanel = false,
      labels,
      minuteStep = 1,
      onChange,
      shape,
      size,
      style,
      value,
      variant = 'outline',
      ...inputProps
    }: TimePickerProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const [root, setRoot] = useState<HTMLDivElement | null>(null)
    const setRootRef = useCallback(
      (node: HTMLDivElement | null): void => mergeRefs<HTMLDivElement>(setRoot, ref)(node),
      [ref],
    )
    const { context, handleBlur } = useTimePickerController({
      colorScheme,
      defaultValue,
      hour12,
      isPanel,
      labels,
      minuteStep,
      onChange,
      root,
      shape: shape ?? (variant === 'unstyled' ? undefined : 'rounded'),
      size: size ?? (variant === 'unstyled' ? undefined : 'md'),
      style,
      value,
      variant,
    })

    return (
      <TimePickerContext.Provider value={context}>
        <div
          className={joinClasses(styles.timePicker, className)}
          data-open={context.open ? '' : undefined}
          data-plume-timepicker=""
          onBlur={handleBlur}
          ref={setRootRef}
          style={{ ...timePickerColorVars(colorScheme), ...style }}
        >
          {children ?? (
            <>
              <TimePickerInput {...inputProps} />
              <TimePickerPanel />
            </>
          )}
        </div>
      </TimePickerContext.Provider>
    )
  },
)

TimePicker.displayName = 'TimePicker'
