export interface TimePickerLabels {
  am: string
  hours: string
  minutes: string
  openTimePicker: string
  period: string
  pm: string
  timePicker: string
}

export interface TimePickerConfig {
  labels?: Partial<TimePickerLabels>
}
