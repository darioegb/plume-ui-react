export interface TimePickerLabels {
  am: string
  format: (format: string) => string
  hours: string
  minutes: string
  openTimePicker: string
  period: string
  placeholder: (period?: string) => string
  pm: string
  timePicker: string
}

export type TimePickerVariant = 'outline' | 'filled' | 'underline' | 'unstyled'
