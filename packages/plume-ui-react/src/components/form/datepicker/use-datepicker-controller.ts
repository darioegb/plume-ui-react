'use client'

import type { FocusEvent } from 'react'
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import type { ColorScheme, Shape, Size } from '../../../theme'
import { useDismiss } from '../../../overlay/use-dismiss'
import { usePosition } from '../../../overlay/use-position'
import type { DatePickerContextProps } from './use-datepicker'
import {
  DATE_PICKER_INITIAL_STATE,
  DEFAULT_DATE_PICKER_VALUE,
  datePickerReducer,
} from './datepicker-reducer'
import type {
  DatePickerConfig,
  DateRange,
  DatePickerLabels,
  DatePickerVariant,
  FooterLabels,
} from './datepicker-types'

const DEFAULT_LANGUAGE = 'en'
const DEFAULT_FOOTER_LABELS: FooterLabels = { apply: 'Apply', cancel: 'Cancel' }
const DEFAULT_LABELS: DatePickerLabels = { calendar: 'Calendar', openCalendar: 'Open calendar' }

interface DatePickerControllerOptions {
  colorScheme: ColorScheme
  config?: DatePickerConfig
  displayFormat?: string
  isCalendar: boolean
  isRange: boolean
  maxDate?: Date
  minDate?: Date
  onChange: (value: DateRange) => void
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
  config,
  displayFormat,
  isCalendar,
  isRange,
  maxDate,
  minDate,
  onChange,
  root,
  shape,
  showFooter,
  size,
  value,
  variant,
}: Readonly<DatePickerControllerOptions>): DatePickerController {
  const language = config?.language ?? DEFAULT_LANGUAGE
  const footerApply = config?.footer?.apply ?? DEFAULT_FOOTER_LABELS.apply
  const footerCancel = config?.footer?.cancel ?? DEFAULT_FOOTER_LABELS.cancel
  const labelCalendar = config?.labels?.calendar ?? DEFAULT_LABELS.calendar
  const labelOpenCalendar = config?.labels?.openCalendar ?? DEFAULT_LABELS.openCalendar
  const [state, dispatch] = useReducer(datePickerReducer, value, (initialValue?: DateRange) =>
    initialValue
      ? datePickerReducer(DATE_PICKER_INITIAL_STATE, { type: 'SET_VALUE', payload: initialValue })
      : DATE_PICKER_INITIAL_STATE,
  )
  const [panel, setPanel] = useState<HTMLDivElement | null>(null)
  const isFirstRender = useRef(true)
  const popoverOpen = !isCalendar && state.modalOpen

  const position = usePosition({
    anchor: root,
    enabled: popoverOpen,
    floating: panel,
    offset: 8,
    placement: 'bottom-start',
  })

  const focusInput = useCallback((): void => {
    root?.querySelector('input')?.focus()
  }, [root])

  useDismiss({
    elements: [root],
    enabled: popoverOpen,
    onDismiss: (reason) => {
      dispatch({ type: 'CLOSE_MODAL' })
      if (reason === 'escape') focusInput()
    },
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

  useEffect(() => {
    if (!modalOpen) return
    root?.querySelector<HTMLButtonElement>('[role="dialog"] [data-date][tabindex="0"]')?.focus()
  }, [modalOpen, root])

  const toggle = useCallback((): void => dispatch({ type: 'TOGGLE_MODAL' }), [])

  const closeAndRestoreFocus = useCallback((): void => {
    if (isCalendar) return
    dispatch({ type: 'CLOSE_MODAL' })
    focusInput()
  }, [focusInput, isCalendar])

  const handleBlur = useCallback((event: FocusEvent<HTMLDivElement>): void => {
    const next = event.relatedTarget
    if (next && !event.currentTarget.contains(next)) {
      dispatch({ type: 'CLOSE_MODAL' })
    }
  }, [])

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
      closeAndRestoreFocus,
      colorScheme,
      dispatch,
      displayFormat,
      footerLabels: { apply: footerApply, cancel: footerCancel },
      isCalendar,
      isRange,
      labels: { calendar: labelCalendar, openCalendar: labelOpenCalendar },
      language,
      maxDate,
      minDate,
      onApply,
      onFirstMonthChange,
      onFirstYearChange,
      onSecondMonthChange,
      onSecondYearChange,
      onSelectDate,
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
      closeAndRestoreFocus,
      colorScheme,
      displayFormat,
      footerApply,
      footerCancel,
      isCalendar,
      isRange,
      labelCalendar,
      labelOpenCalendar,
      language,
      maxDate,
      minDate,
      onApply,
      onFirstMonthChange,
      onFirstYearChange,
      onSecondMonthChange,
      onSecondYearChange,
      onSelectDate,
      position,
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
