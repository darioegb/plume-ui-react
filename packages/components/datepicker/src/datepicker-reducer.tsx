import type { DateRange } from './datepicker'

 export const DEFAULT_DATE_PICKER_VALUE = { startDate: null, endDate: null }

export const DATE_PICKER_INITIAL_STATE = {
  value: DEFAULT_DATE_PICKER_VALUE,
  tempValue: DEFAULT_DATE_PICKER_VALUE,
  modalOpen: false,
  year: new Date().getFullYear(),
  secondYear: new Date().getFullYear(),
  month: new Date().getMonth(),
  secondMonth: new Date().getMonth() + 1,
  rangeDays: [],
}

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
    case 'SET_VALUE': {
      const { startDate, endDate } = action.payload
      const year = startDate?.getFullYear() ?? state.year
      const month = startDate?.getMonth() ?? state.month
      const secondYear = endDate?.getFullYear() ?? state.secondYear
      const secondMonth =
        endDate &&
        (endDate.getMonth() > state.secondMonth || (startDate && startDate.getMonth() === 11))
          ? endDate.getMonth()
          : state.secondMonth

      return {
        ...state,
        value: action.payload,
        tempValue: action.payload,
        year,
        month,
        secondYear,
        secondMonth,
      }
    }
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
    case 'SET_TEMP_VALUE':
    default:
      return { ...state, tempValue: action.payload }
  }
}
