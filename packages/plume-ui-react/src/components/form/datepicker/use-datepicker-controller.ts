'use client'

import type { CSSProperties, FocusEvent } from 'react'
import { useCallback, useEffect, useId, useMemo, useReducer, useRef } from 'react'
import type { ColorScheme, Shape, Size } from '../../../theme'
import { useLabels, useLocale } from '../../../locale/locale-provider'
import { useFloatingPanel } from '../../../overlay/use-floating-panel'
import { useFocusTrap } from '../../../overlay/use-focus-trap'
import type { DatePickerContextProps } from './use-datepicker'
import {
  DATE_PICKER_INITIAL_STATE,
  DEFAULT_DATE_PICKER_VALUE,
  datePickerReducer,
} from './datepicker-reducer'
import type {
  DateRange,
  DatePickerLabels,
  DatePickerVariant,
} from './datepicker-types'

const DEFAULT_LANGUAGE = 'en'
const DEFAULT_LABELS: DatePickerLabels = {
  apply: 'Apply',
  calendar: 'Calendar',
  cancel: 'Cancel',
  format: (format) => `Format: ${format}`,
  nextMonth: 'Next month',
  nextYears: 'Next years',
  openCalendar: 'Open calendar',
  previousMonth: 'Previous month',
  previousYears: 'Previous years',
}

interface DatePickerControllerOptions {
  colorScheme: ColorScheme
  locale?: string
  displayFormat?: string
  isPanel: boolean
  isRange: boolean
  labels?: Partial<DatePickerLabels>
  maxDate?: Date
  minDate?: Date
  onChange: (value: DateRange) => void
  panelVars: CSSProperties
  root: HTMLDivElement | null
  shape?: Shape
  showFooter: boolean
  size?: Size
  value?: DateRange
  variant: DatePickerVariant
}

interface DatePickerController {
  context: DatePickerContextProps
  handleBlur: (event: FocusEvent<HTMLDivElement>) => void
}

const toMonthIndex = (year: number, month: number): number => year * 12 + month

const daysBetween = (start: Date, end: Date): Date[] => {
  const days: Date[] = []
  const current = new Date(start)
  while (current <= end) {
    days.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }
  return days
}

export function useDatePickerController({
  colorScheme,
  locale: localeProp,
  displayFormat,
  isPanel,
  isRange,
  labels,
  maxDate,
  minDate,
  onChange,
  panelVars,
  root,
  shape,
  showFooter,
  size,
  value,
  variant,
}: Readonly<DatePickerControllerOptions>): DatePickerController {
  const providerLocale = useLocale()
  const language = localeProp ?? providerLocale ?? DEFAULT_LANGUAGE
  const mergedLabels = useLabels('datePicker', DEFAULT_LABELS, labels)
  const [state, dispatch] = useReducer(datePickerReducer, value, (initialValue?: DateRange) =>
    initialValue
      ? datePickerReducer(DATE_PICKER_INITIAL_STATE, { type: 'SET_VALUE', payload: initialValue })
      : DATE_PICKER_INITIAL_STATE,
  )
  const isFirstRender = useRef(true)
  const popoverOpen = !isPanel && state.modalOpen
  const calendarId = useId()

  const focusInput = useCallback((): void => {
    root?.querySelector('input')?.focus()
  }, [root])

  const { isTopmost, panel, position, setPanel } = useFloatingPanel({
    anchor: root,
    enabled: popoverOpen,
    offset: 8,
    onDismiss: (reason) => {
      dispatch({ type: 'CLOSE_MODAL' })
      if (reason === 'escape') focusInput()
    },
    placement: 'bottom-start',
  })

  const { modalOpen, tempValue } = state
  useEffect(() => {
    if (!modalOpen) return
    const { startDate, endDate } = tempValue
    const days = isRange && startDate && endDate ? daysBetween(startDate, endDate) : []
    dispatch({ type: 'SET_RANGE_DAYS', payload: days })
  }, [isRange, tempValue, modalOpen])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    dispatch({ type: 'SET_VALUE', payload: value ?? DEFAULT_DATE_PICKER_VALUE })
  }, [value])

  const initialDay = popoverOpen
    ? (panel?.querySelector<HTMLButtonElement>('[data-date][tabindex="0"]') ?? null)
    : null
  useFocusTrap(panel, {
    active: popoverOpen,
    initialFocus: initialDay,
    isTopmost,
    restoreFocus: false,
  })

  const latestOnChange = useRef(onChange)
  useEffect(() => {
    latestOnChange.current = onChange
  })

  const commitTypedValue = useCallback((typed: DateRange): void => {
    dispatch({ type: 'SET_VALUE', payload: typed })
    latestOnChange.current(typed)
  }, [])

  const toggle = useCallback((): void => dispatch({ type: 'TOGGLE_MODAL' }), [])

  const closeAndRestoreFocus = useCallback((): void => {
    if (isPanel) return
    dispatch({ type: 'CLOSE_MODAL' })
    focusInput()
  }, [focusInput, isPanel])

  const handleBlur = useCallback(
    (event: FocusEvent<HTMLDivElement>): void => {
      const next = event.relatedTarget as Node | null
      if (next && !event.currentTarget.contains(next) && !panel?.contains(next)) {
        dispatch({ type: 'CLOSE_MODAL' })
      }
    },
    [panel],
  )

  const showMonths = useCallback((first: number, second: number): void => {
    dispatch({ type: 'SET_YEAR', payload: Math.floor(first / 12) })
    dispatch({ type: 'SET_MONTH', payload: first % 12 })
    dispatch({ type: 'SET_SECOND_YEAR', payload: Math.floor(second / 12) })
    dispatch({ type: 'SET_SECOND_MONTH', payload: second % 12 })
  }, [])

  const { month, secondMonth, secondYear, year } = state

  const showFirstMonth = useCallback(
    (newYear: number, newMonth: number): void => {
      const first = toMonthIndex(newYear, newMonth)
      showMonths(first, Math.max(toMonthIndex(secondYear, secondMonth), first + 1))
    },
    [secondMonth, secondYear, showMonths],
  )

  const showSecondMonth = useCallback(
    (newYear: number, newMonth: number): void => {
      const second = toMonthIndex(newYear, newMonth)
      showMonths(Math.min(toMonthIndex(year, month), second - 1), second)
    },
    [month, showMonths, year],
  )

  const onFirstYearChange = useCallback(
    (newYear: number): void => showFirstMonth(newYear, month),
    [month, showFirstMonth],
  )
  const onFirstMonthChange = useCallback(
    (newMonth: number): void => showFirstMonth(year, newMonth),
    [showFirstMonth, year],
  )
  const onSecondYearChange = useCallback(
    (newYear: number): void => showSecondMonth(newYear, secondMonth),
    [secondMonth, showSecondMonth],
  )
  const onSecondMonthChange = useCallback(
    (newMonth: number): void => showSecondMonth(secondYear, newMonth),
    [secondYear, showSecondMonth],
  )

  const onApply = useCallback((): void => {
    dispatch({ type: 'SET_VALUE', payload: tempValue })
    if (tempValue.startDate) {
      onChange({ startDate: tempValue.startDate, endDate: tempValue.endDate })
    }
    closeAndRestoreFocus()
  }, [closeAndRestoreFocus, onChange, tempValue])

  const onSelectDate = useCallback(
    (day: number, isSecondCalendar?: boolean): void => {
      const selectedDate = new Date(
        isSecondCalendar ? secondYear : year,
        isSecondCalendar ? secondMonth : month,
        day,
      )
      const newValue: DateRange = { ...tempValue }

      if (showFooter || !isRange || !newValue.startDate || newValue.endDate) {
        newValue.startDate = selectedDate
        newValue.endDate = null
      } else if (selectedDate < newValue.startDate) {
        newValue.endDate = newValue.startDate
        newValue.startDate = selectedDate
      } else {
        newValue.endDate = selectedDate
      }

      dispatch({ type: 'SET_TEMP_VALUE', payload: newValue })
      if (showFooter) return

      if (!isRange || newValue.endDate) {
        onChange({ startDate: newValue.startDate, endDate: newValue.endDate })
        dispatch({ type: 'SET_VALUE', payload: newValue })
        closeAndRestoreFocus()
      }
    },
    [
      closeAndRestoreFocus,
      isRange,
      month,
      onChange,
      secondMonth,
      secondYear,
      showFooter,
      tempValue,
      year,
    ],
  )

  const context = useMemo<DatePickerContextProps>(
    () => ({
      calendarId,
      closeAndRestoreFocus,
      commitTypedValue,
      colorScheme,
      dispatch,
      displayFormat,
      isPanel,
      isRange,
      labels: mergedLabels,
      language,
      maxDate,
      minDate,
      onApply,
      onFirstMonthChange,
      onFirstYearChange,
      onSecondMonthChange,
      onSecondYearChange,
      onSelectDate,
      panelVars,
      position,
      setPanel,
      shape,
      showFooter,
      size,
      state,
      toggle,
      variant,
    }),
    [
      calendarId,
      closeAndRestoreFocus,
      commitTypedValue,
      colorScheme,
      displayFormat,
      isPanel,
      isRange,
      mergedLabels,
      language,
      maxDate,
      minDate,
      onApply,
      onFirstMonthChange,
      onFirstYearChange,
      onSecondMonthChange,
      onSecondYearChange,
      onSelectDate,
      panelVars,
      position,
      setPanel,
      shape,
      showFooter,
      size,
      state,
      toggle,
      variant,
    ],
  )

  return { context, handleBlur }
}
