'use client'

import type { ReactNode } from 'react'
import type { ComponentProps } from '../../../theme'
import { Portal } from '../../../overlay'
import { joinClasses } from '../../../overlay/class-names'
import { pickerPanelClasses } from '../shared/picker-panel'
import { TimeColumn } from './time-column'
import { parseTime, range, toTwelveHour } from './time-utils'
import { useTimePicker } from './use-timepicker'
import styles from './timepicker.module.css'

export type TimePickerPanelProps = Omit<ComponentProps, 'index'> & {
  'aria-label'?: string
}

const dialogRole = 'dialog'

const VARIANT_CLASS = {
  filled: 'variantFilled',
  outline: 'variantOutline',
  underline: 'variantUnderline',
} as const

const pad = (value: number): string => String(value).padStart(2, '0')

const toOptions = (values: number[]): { label: string; value: number }[] =>
  values.map((option) => ({ label: pad(option), value: option }))

const selectedHour = (hours: number | undefined, hour12: boolean): number | undefined => {
  if (hours === undefined) return undefined
  return hour12 ? toTwelveHour(hours).hour : hours
}

export function TimePickerPanel({
  'aria-label': ariaLabel,
  className,
  style,
}: Readonly<TimePickerPanelProps>): ReactNode {
  const {
    hour12,
    isPanel,
    labels,
    minuteStep,
    open,
    panelStyle,
    pickHours,
    pickMinutes,
    pickPeriod,
    setPanel,
    shape,
    size,
    value,
    variant,
  } = useTimePicker('TimePickerPanel')

  if (!isPanel && !open) return null

  const parts = parseTime(value)
  const period = parts ? toTwelveHour(parts.hours).period : undefined

  const panel = (
    <div
      aria-label={ariaLabel ?? labels.timePicker}
      className={joinClasses(
        styles.panel,
        pickerPanelClasses(variant, size, shape),
        variant !== 'unstyled' && styles[VARIANT_CLASS[variant]],
        isPanel && styles.inline,
        className,
      )}
      ref={setPanel}
      role={dialogRole}
      style={{ ...panelStyle, ...style }}
    >
      <TimeColumn
        label={labels.hours}
        onSelect={pickHours}
        options={toOptions(hour12 ? range(12, 1, 1) : range(24))}
        selected={selectedHour(parts?.hours, hour12)}
      />
      <TimeColumn
        label={labels.minutes}
        onSelect={pickMinutes}
        options={toOptions(range(60, minuteStep))}
        selected={parts?.minutes}
      />
      {hour12 ? (
        <TimeColumn
          label={labels.period}
          onSelect={pickPeriod}
          options={[
            { label: labels.am, value: 'am' as const },
            { label: labels.pm, value: 'pm' as const },
          ]}
          selected={period}
        />
      ) : null}
    </div>
  )

  return isPanel ? panel : <Portal>{panel}</Portal>
}
