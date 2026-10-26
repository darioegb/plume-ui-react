import type { ReactNode } from 'react'
import type { ComponentProps } from '../../../theme'
import type { TimePickerOptionData } from './timepicker-option'
import { toTwelveHour } from './time-utils'

export type TimePickerColumnProps<T extends number | string> = Omit<ComponentProps, 'index'> & {
  /**
   * Accessible name of the list. By default it is the matching text of `labels` (`hours`, `minutes`
   * or `period`).
   */
  'aria-label'?: string
  /**
   * A function that gets each option of the list (`{ value, label }`) and returns what to render
   * for it, usually a `TimePickerOption`.
   */
  children?: (option: TimePickerOptionData<T>) => ReactNode
}

const pad = (value: number): string => String(value).padStart(2, '0')

export const toOptions = (values: number[]): TimePickerOptionData<number>[] =>
  values.map((option) => ({ label: pad(option), value: option }))

export const selectedHour = (hours: number | undefined, hour12: boolean): number | undefined => {
  if (hours === undefined) return undefined
  return hour12 ? toTwelveHour(hours).hour : hours
}
