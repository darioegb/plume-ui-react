'use client'

import type { CSSProperties } from 'react'
import { createContext, useContext } from 'react'
import type { ColorScheme, Shape, Size } from '../../../theme'
import type { PickerVariant } from '../shared/picker-panel'
import type { Period } from './time-utils'
import type { TimePickerLabels } from './timepicker-types'

export interface TimePickerContextProps {
  colorScheme: ColorScheme
  hour12: boolean
  isPanel: boolean
  labels: TimePickerLabels
  minuteStep: number
  open: boolean
  panelId: string
  panelStyle: CSSProperties
  pickHours: (hours: number) => void
  pickMinutes: (minutes: number) => void
  pickPeriod: (period: Period) => void
  setInput: (node: HTMLInputElement | null) => void
  setPanel: (node: HTMLElement | null) => void
  setValue: (value: string) => void
  shape?: Shape
  size?: Size
  toggle: () => void
  value: string
  variant: PickerVariant
}

export const TimePickerContext = createContext<TimePickerContextProps | undefined>(undefined)

export const useTimePicker = (part = 'useTimePicker'): TimePickerContextProps => {
  const context = useContext(TimePickerContext)
  if (!context) {
    throw new Error(`${part} must be used within a <TimePicker>`)
  }
  return context
}
