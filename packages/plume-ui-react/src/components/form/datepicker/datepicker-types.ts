import type { InputHTMLAttributes } from 'react'

export interface DateRange {
  endDate: Date | null
  startDate: Date | null
}

export interface DatePickerLabels {
  apply: string
  calendar: string
  cancel: string
  nextMonth: string
  nextYears: string
  openCalendar: string
  previousMonth: string
  previousYears: string
}

export interface DatePickerConfig {
  language?: string
}

export type DatePickerVariant = 'outline' | 'filled' | 'underline' | 'unstyled'

export type DatePickerRootAttributes = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  | 'aria-describedby'
  | 'aria-invalid'
  | 'disabled'
  | 'readOnly'
  | 'id'
  | 'name'
  | 'required'
  | 'placeholder'
>
