'use client'

import type { ChangeEvent, CSSProperties, ForwardedRef, InputHTMLAttributes, Ref } from 'react'
import { forwardRef, useCallback, useEffect, useState } from 'react'
import type { ColorScheme, ComponentProps, Shape, Size } from '../../../theme'
import { joinClasses } from '../../../overlay/class-names'
import { ClockIcon } from '../../../overlay/icons'
import { useControllableState } from '../../../overlay/use-controllable-state'
import { useDismiss } from '../../../overlay/use-dismiss'
import { usePosition } from '../../../overlay/use-position'
import { mergeRefs } from '../../../overlay/trigger'
import { Button } from '../../interaction/button'
import { Input } from '../input'
import { pickerPanelClasses, type PickerVariant } from '../shared/picker-panel'
import { TimeColumn } from './time-column'
import {
  displayTime,
  formatTime,
  fromTwelveHour,
  parseDisplayTime,
  parseTime,
  range,
  toTwelveHour,
  type Period,
} from './time-utils'
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

const pad = (value: number): string => String(value).padStart(2, '0')

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
      shape = variant === 'unstyled' ? undefined : 'rounded',
      size = variant === 'unstyled' ? undefined : 'md',
      ...inputProps
    }: TimePickerProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const labels = { ...DEFAULT_LABELS, ...config?.labels }
    const [value, setValue] = useControllableState({
      defaultValue,
      onChange,
      value: valueProp,
    })
    const display = displayTime(value, hour12, labels)
    const [text, setText] = useState(display)
    const [open, setOpen] = useState(false)
    const [root, setRoot] = useState<HTMLDivElement | null>(null)
    const [panel, setPanel] = useState<HTMLDivElement | null>(null)
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
    const position = usePosition({
      anchor: root,
      enabled: open,
      floating: panel,
      offset: 8,
      placement: 'bottom-start',
    })

    useEffect(() => {
      setText(display)
    }, [display])

    useEffect(() => {
      if (open) panel?.querySelector<HTMLElement>('[role="option"][tabindex="0"]')?.focus()
    }, [open, panel])

    useDismiss({
      elements: [root],
      enabled: open,
      onDismiss: (reason) => {
        setOpen(false)
        if (reason === 'escape') input?.focus()
      },
    })

    const commit = (typed: string): string => {
      if (!typed.trim()) {
        setValue('')
        return ''
      }
      const parsed = parseDisplayTime(typed, hour12, labels)
      if (parsed === null) {
        setText(display)
        return value
      }
      setValue(parsed)
      setText(displayTime(parsed, hour12, labels))
      return parsed
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
      setText(event.target.value)
      if (hour12) return
      const parsed = parseDisplayTime(event.target.value, false, labels)
      if (parsed) setValue(parsed)
    }

    const current = parseTime(value) ?? { hours: 0, minutes: 0 }
    const { hour, period } = toTwelveHour(current.hours)
    const pickHours = (hours: number): void => {
      setValue(formatTime({ ...current, hours }))
    }
    const pickMinutes = (minutes: number): void => {
      setValue(formatTime({ ...current, minutes }))
      setOpen(false)
      input?.focus()
    }
    const pickPeriod = (next: Period): void => {
      pickHours(fromTwelveHour(hour, next))
    }

    const hourOptions = hour12 ? range(12, 1, 1) : range(24)
    const hourValue = parseTime(value) ? (hour12 ? hour : current.hours) : undefined
    const singleMask = '##:##'

    return (
      <div
        className={styles.timePicker}
        onBlur={(event) => {
          const next = event.relatedTarget
          if (next && !event.currentTarget.contains(next)) setOpen(false)
        }}
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
              aria-expanded={open}
              aria-haspopup="dialog"
              aria-label={labels.openTimePicker}
              disabled={disabled || readOnly}
              onClick={() => {
                setOpen((isOpen) => !isOpen)
              }}
              shape="pill"
              variant="icon"
            >
              <ClockIcon />
            </Button>
          }
          inputMode="numeric"
          mask={hour12 ? undefined : singleMask}
          onBlur={() => {
            const committed = commit(text)
            onBlur?.(committed)
          }}
          onChange={handleChange}
          placeholder={placeholder ?? (hour12 ? `hh:mm ${labels.am}` : 'hh:mm')}
          readOnly={readOnly}
          ref={setInputRef}
          shape={shape}
          size={size}
          type="text"
          value={text}
          variant={variant}
        />
        {open ? (
          <div
            aria-label={labels.timePicker}
            className={joinClasses(
              styles.panel,
              pickerPanelClasses(variant, size, shape),
              panelClassName,
            )}
            ref={setPanel}
            role="dialog"
            style={{
              ...position.style,
              opacity: position.isPositioned ? undefined : 0,
            }}
          >
            <TimeColumn
              label={labels.hours}
              onSelect={(selectedHour: number) => {
                pickHours(hour12 ? fromTwelveHour(selectedHour, period) : selectedHour)
              }}
              options={hourOptions.map((option) => ({
                label: pad(option),
                value: option,
              }))}
              selected={hourValue}
            />
            <TimeColumn
              label={labels.minutes}
              onSelect={pickMinutes}
              options={range(60, minuteStep).map((option) => ({
                label: pad(option),
                value: option,
              }))}
              selected={parseTime(value)?.minutes}
            />
            {hour12 ? (
              <TimeColumn
                label={labels.period}
                onSelect={pickPeriod}
                options={[
                  { label: labels.am, value: 'am' },
                  { label: labels.pm, value: 'pm' },
                ]}
                selected={parseTime(value) ? period : undefined}
              />
            ) : null}
          </div>
        ) : null}
      </div>
    )
  },
)

TimePicker.displayName = 'TimePicker'
