import { createContext, useContext } from 'react'
import type { DatePickerAction, DatePickerState } from './datepicker-reducer'

interface DatePickerContextProps {
  state: DatePickerState
  dispatch: React.Dispatch<DatePickerAction>
}

export const DatePickerContext = createContext<DatePickerContextProps | undefined>(undefined)

export const useDatePicker = (): DatePickerContextProps => {
  const context = useContext(DatePickerContext)
  if (!context) {
    throw new Error('useDatePicker must be used within a DatePickerProvider')
  }
  return context
}
