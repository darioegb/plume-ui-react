import type { InputHTMLAttributes } from 'react'

export interface DateRange {
  endDate: Date | null
  startDate: Date | null
}

export interface FooterLabels {
  apply: string
  cancel: string
}

export interface DatePickerLabels {
  calendar: string
  openCalendar: string
}

export interface DatePickerConfig {
  footer?: Partial<FooterLabels>
  labels?: Partial<DatePickerLabels>
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
