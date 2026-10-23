'use client'

import type { CSSProperties, ReactNode } from 'react'
import { Portal } from '../../../overlay'
import { TimeColumn } from './time-column'
import { parseTime, range, toTwelveHour, type Period } from './time-utils'
import type { TimePickerLabels } from './timepicker-types'

export interface TimePanelProps {
  className?: string
  hour12: boolean
  labels: TimePickerLabels
  minuteStep: number
  onPickHours: (hours: number) => void
  onPickMinutes: (minutes: number) => void
  onPickPeriod: (period: Period) => void
  panelRef: (node: HTMLDivElement | null) => void
  style: CSSProperties
  value: string
}

const dialogRole = 'dialog'

const pad = (value: number): string => String(value).padStart(2, '0')

const toOptions = (values: number[]): { label: string; value: number }[] =>
  values.map((option) => ({ label: pad(option), value: option }))

const selectedHour = (hours: number | undefined, hour12: boolean): number | undefined => {
  if (hours === undefined) return undefined
  return hour12 ? toTwelveHour(hours).hour : hours
}

export function TimePanel({
  className,
  hour12,
  labels,
  minuteStep,
  onPickHours,
  onPickMinutes,
  onPickPeriod,
  panelRef,
  style,
  value,
}: Readonly<TimePanelProps>): ReactNode {
  const parts = parseTime(value)
  const period = parts ? toTwelveHour(parts.hours).period : undefined

  return (
    <Portal>
      <div
        aria-label={labels.timePicker}
        className={className}
        ref={panelRef}
        role={dialogRole}
        style={style}
      >
        <TimeColumn
          label={labels.hours}
          onSelect={onPickHours}
          options={toOptions(hour12 ? range(12, 1, 1) : range(24))}
          selected={selectedHour(parts?.hours, hour12)}
        />
        <TimeColumn
          label={labels.minutes}
          onSelect={onPickMinutes}
          options={toOptions(range(60, minuteStep))}
          selected={parts?.minutes}
        />
        {hour12 ? (
          <TimeColumn
            label={labels.period}
            onSelect={onPickPeriod}
            options={[
              { label: labels.am, value: 'am' as const },
              { label: labels.pm, value: 'pm' as const },
            ]}
            selected={period}
          />
        ) : null}
      </div>
    </Portal>
  )
}
