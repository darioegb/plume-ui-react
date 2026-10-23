'use client'

import type { CSSProperties, ForwardedRef, InputHTMLAttributes, Ref } from 'react'
import { forwardRef, useCallback, useState } from 'react'
import type { ColorScheme, ComponentProps, Shape, Size } from '../../../theme'
import { joinClasses } from '../../../overlay/class-names'
import { ClockIcon } from '../../../overlay/icons'
import { useControllableState } from '../../../overlay/use-controllable-state'
import { mergeRefs } from '../../../overlay/trigger'
import { Button } from '../../interaction/button'
import { Input } from '../input'
import { pickerPanelClasses, type PickerVariant } from '../shared/picker-panel'
import { TimePanel } from './time-panel'
import { useTimePicks } from './use-time-picks'
import { useTimePopup } from './use-time-popup'
import { useTimeText } from './use-time-text'
import type { TimePickerConfig, TimePickerLabels } from './timepicker-types'
import styles from './timepicker.module.css'

export type { TimePickerConfig, TimePickerLabels } from './timepicker-types'

const DEFAULT_LABELS: TimePickerLabels = {
  am: 'AM',
  hours: 'Hours',
  minutes: 'Minutes',
  openTimePicker: 'Open time picker',
  period: 'Period',
  pm: 'PM',
  timePicker: 'Time picker',
}

type TimePickerRootAttributes = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  | 'aria-describedby'
  | 'aria-invalid'
  | 'disabled'
  | 'id'
  | 'name'
  | 'placeholder'
  | 'readOnly'
  | 'required'
>

export interface TimePickerOwnProps {
  colorScheme?: ColorScheme
  config?: TimePickerConfig
  defaultValue?: string
  hour12?: boolean
  inputRef?: Ref<HTMLInputElement>
  minuteStep?: number
  onBlur?: (value: string) => void
  onChange?: (value: string) => void
  panelClassName?: string
  shape?: Shape
  size?: Size
  value?: string
  variant?: PickerVariant
}

export type TimePickerProps = Omit<ComponentProps, 'index'> &
  TimePickerRootAttributes &
  TimePickerOwnProps

const timePickerColorVars = (colorScheme: ColorScheme, style?: CSSProperties): CSSProperties =>
  ({
    '--picker-scheme': `var(--plume-color-${colorScheme}-text)`,
    '--timepicker-solid': `var(--plume-color-${colorScheme}-solid)`,
    '--timepicker-contrast': `var(--plume-color-${colorScheme}-solid-contrast)`,
    '--timepicker-hover': `var(--plume-color-${colorScheme}-100)`,
    '--timepicker-selected-hover': `var(--plume-color-${colorScheme}-solid-hover)`,
    ...style,
  }) as CSSProperties

const TIME_MASK = '##:##'

const defaultPlaceholder = (hour12: boolean, am: string): string =>
  hour12 ? `hh:mm ${am}` : 'hh:mm'

const resolveLook = (
  variant: PickerVariant,
  shape?: Shape,
  size?: Size,
): { shape?: Shape; size?: Size } =>
  variant === 'unstyled' ? { shape, size } : { shape: shape ?? 'rounded', size: size ?? 'md' }

export const TimePicker = forwardRef<HTMLDivElement, TimePickerProps>(
  (
    {
      className,
      colorScheme = 'secondary',
      config,
      defaultValue = '',
      disabled = false,
      hour12 = false,
      inputRef,
      minuteStep = 1,
      onBlur,
      onChange,
      panelClassName,
      placeholder,
      readOnly,
      style,
      value: valueProp,
      variant = 'outline',
      shape: shapeProp,
      size: sizeProp,
      ...inputProps
    }: TimePickerProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const labels = { ...DEFAULT_LABELS, ...config?.labels }
    const { shape, size } = resolveLook(variant, shapeProp, sizeProp)
    const [value, setValue] = useControllableState({
      defaultValue,
      onChange,
      value: valueProp,
    })
    const { commit, handleChange, text } = useTimeText({ hour12, labels, setValue, value })
    const [root, setRoot] = useState<HTMLDivElement | null>(null)
    const [input, setInput] = useState<HTMLInputElement | null>(null)
    const setRootRef = useCallback(
      (node: HTMLDivElement | null): void => mergeRefs<HTMLDivElement>(setRoot, ref)(node),
      [ref],
    )
    const setInputRef = useCallback(
      (node: HTMLInputElement | null): void =>
        mergeRefs<HTMLInputElement>(setInput, inputRef)(node),
      [inputRef],
    )
    const popup = useTimePopup({ input, root })
    const { close } = popup
    const { pickHours, pickMinutes, pickPeriod } = useTimePicks({
      hour12,
      onMinutesPicked: () => {
        close()
        input?.focus()
      },
      setValue,
      value,
    })

    return (
      <div
        className={styles.timePicker}
        onBlur={popup.handleBlur}
        ref={setRootRef}
        style={timePickerColorVars(colorScheme, style)}
      >
        <Input
          {...inputProps}
          className={className}
          colorScheme={colorScheme}
          disabled={disabled}
          elementAfter={
            <Button
              aria-expanded={popup.open}
              aria-haspopup="dialog"
              aria-label={labels.openTimePicker}
              disabled={disabled || readOnly}
              onClick={popup.toggle}
              shape="pill"
              variant="icon"
            >
              <ClockIcon />
            </Button>
          }
          inputMode="numeric"
          mask={hour12 ? undefined : TIME_MASK}
          onBlur={() => {
            const committed = commit()
            onBlur?.(committed)
          }}
          onChange={handleChange}
          placeholder={placeholder ?? defaultPlaceholder(hour12, labels.am)}
          readOnly={readOnly}
          ref={setInputRef}
          shape={shape}
          size={size}
          type="text"
          value={text}
          variant={variant}
        />
        {popup.open ? (
          <TimePanel
            className={joinClasses(
              styles.panel,
              pickerPanelClasses(variant, size, shape),
              panelClassName,
            )}
            hour12={hour12}
            labels={labels}
            minuteStep={minuteStep}
            onPickHours={pickHours}
            onPickMinutes={pickMinutes}
            onPickPeriod={pickPeriod}
            panelRef={popup.setPanel}
            style={popup.panelStyle}
            value={value}
          />
        ) : null}
      </div>
    )
  },
)

TimePicker.displayName = 'TimePicker'
