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

export type TimePickerPart = 'input' | 'panel'

export type { TimePickerLabels } from './timepicker-types'

export interface TimePickerOwnProps {
  children?: ReactNode
  colorScheme?: ColorScheme
  defaultValue?: string
  hour12?: boolean
  isPanel?: boolean
  labels?: Partial<TimePickerLabels>
  minuteStep?: number
  onChange?: (value: string) => void
  classNames?: Partial<Record<TimePickerPart, string>>
  shape?: Shape
  size?: Size
  value?: string
  variant?: PickerVariant
}

export type TimePickerProps = Omit<ComponentProps, 'index'> &
  Omit<TimePickerInputProps, 'classNames' | 'style'> &
  TimePickerOwnProps

export const TimePicker = forwardRef<HTMLDivElement, TimePickerProps>(
  (
    {
      children,
      className,
      classNames,
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
          onBlur={handleBlur}
          ref={setRootRef}
          style={{ ...timePickerColorVars(colorScheme), ...style }}
        >
          {children ?? (
            <>
              <TimePickerInput classNames={{ input: classNames?.input }} {...inputProps} />
              <TimePickerPanel className={classNames?.panel} />
            </>
          )}
        </div>
      </TimePickerContext.Provider>
    )
  },
)

TimePicker.displayName = 'TimePicker'
