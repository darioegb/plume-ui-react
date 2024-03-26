import type { DateRange } from './datepicker'

export const DEFAULT_DATE_PICKER_VALUE = { startDate: null, endDate: null }

export interface DatePickerState {
  value: DateRange
  modalOpen: boolean
  year: number
  secondYear: number
  month: number
  secondMonth: number
  rangeDays: Date[]
  tempValue: DateRange
}

export type DatePickerAction =
  | { type: 'SET_VALUE'; payload: DateRange }
  | { type: 'SET_TEMP_VALUE'; payload: DateRange }
  | { type: 'TOGGLE_MODAL' }
  | { type: 'SET_YEAR'; payload: number }
  | { type: 'SET_SECOND_YEAR'; payload: number }
  | { type: 'SET_MONTH'; payload: number }
  | { type: 'SET_SECOND_MONTH'; payload: number }
  | { type: 'SET_RANGE_DAYS'; payload: Date[] }

export const datePickerReducer = (
  state: DatePickerState,
  action: DatePickerAction,
): DatePickerState => {
  switch (action.type) {
    case 'SET_VALUE':
      return { ...state, value: action.payload }
      case 'SET_TEMP_VALUE':
      return { ...state, tempValue: action.payload }
    case 'TOGGLE_MODAL':
      return { ...state, modalOpen: !state.modalOpen }
    case 'SET_YEAR':
      return { ...state, year: action.payload }
    case 'SET_SECOND_YEAR':
      return { ...state, secondYear: action.payload }
    case 'SET_MONTH':
      return { ...state, month: action.payload }
    case 'SET_SECOND_MONTH':
      return { ...state, secondMonth: action.payload }
    case 'SET_RANGE_DAYS':
      return { ...state, rangeDays: action.payload }
    default:
      return state
  }
}
