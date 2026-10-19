import type {
  CSSProperties,
  FocusEvent,
  ForwardedRef,
  InputHTMLAttributes,
  ReactNode,
  Ref,
} from 'react'
import { forwardRef, useEffect, useRef, useReducer } from 'react'
import type { ColorScheme, ComponentProps, Shape, Size } from '../../../theme'
import { getDateFormatByLanguage } from '../../../utils/dates'
import { Button } from '../../interaction/button'
import { useClickOutside } from '../../../hooks/use-click-outside'
import { DatePickerContext } from './use-datepicker'
import {
  DEFAULT_DATE_PICKER_VALUE,
  DATE_PICKER_INITIAL_STATE,
  datePickerReducer,
} from './datepicker-reducer'
import { Calendar } from './calendar'
import { DatePickerInput } from './datepicker-input'
import styles from './datepicker.module.css'

export interface DatePickerOwnProps {
  colorScheme?: ColorScheme
  config?: DatePickerConfig
  displayFormat?: string
  inputRef?: Ref<HTMLInputElement>
  isCalendar?: boolean
  isRange?: boolean
  maxDate?: Date
  minDate?: Date
  onBlur?: (value?: DateRange) => void
  onChange: (value: DateRange) => void
  shape?: Shape
  showFooter?: boolean
  size?: Size
  value?: DateRange
  variant?: DatePickerVariant
}

export interface DateRange {
  endDate: Date | null
  startDate: Date | null
}

export interface DatePickerConfig {
  footer?: Partial<FooterLabels>
  language?: string
}

interface FooterLabels {
  apply: string
  cancel: string
}

const DEFAULT_LANGUAGE = 'en'
const DEFAULT_FOOTER_LABELS: FooterLabels = { apply: 'Apply', cancel: 'Cancel' }

interface FooterActionsProps {
  labels: FooterLabels
  onApply: () => void
  onCancel: () => void
  colorScheme?: ColorScheme
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

export type DatePickerProps = ComponentProps & DatePickerRootAttributes & DatePickerOwnProps

const datePickerColorVars = (colorScheme: ColorScheme, style?: CSSProperties): CSSProperties =>
  ({
    '--datepicker-scheme': `var(--plume-color-${colorScheme}-text)`,
    '--datepicker-solid': `var(--plume-color-${colorScheme}-solid)`,
    '--datepicker-contrast': `var(--plume-color-${colorScheme}-solid-contrast)`,
    '--datepicker-range-item-color': `var(--plume-color-${colorScheme}-200)`,
    '--datepicker-range-item-text': `var(--plume-color-${colorScheme}-900)`,
    '--datepicker-hover-color': `var(--plume-color-${colorScheme}-100)`,
    '--datepicker-selected-hover-color': `var(--plume-color-${colorScheme}-solid-hover)`,
    ...(style ?? {}),
  }) as CSSProperties

function FooterActions({
  colorScheme,
  labels: { cancel, apply },
  onApply,
  onCancel,
}: FooterActionsProps): ReactNode {
  return (
    <div className={styles.footerActions}>
      <Button className={styles.footerButton} label={cancel} onClick={onCancel} variant='ghost' />
      <Button
        className={styles.footerButtonApply}
        colorScheme={colorScheme}
        label={apply}
        onClick={onApply}
      />
    </div>
  )
}

const generateDatePickerInputClasses = (
  className: string,
  disabled: boolean,
  isInvalid: boolean,
  variant: string,
  shape?: Shape,
  size?: Size,
): string => {
  const sizeClass = size && (size !== 'md' || variant === 'unstyled') ? styles[size] : ''
  const shapeClass = shape && (shape !== 'rounded' || variant === 'unstyled') ? styles[shape] : ''
  const variantClass = variant !== 'unstyled' ? styles[variant] : ''
  const disabledClass = disabled ? styles.disabled : ''
  const invalidClass = isInvalid && variant !== 'unstyled' ? styles.invalid : ''
  return `${sizeClass} ${shapeClass} ${variantClass} 
    ${disabledClass} ${invalidClass} ${className}`.trim()
}

export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      onChange,
      onBlur,
      inputRef,
      displayFormat,
      style,
      showFooter,
      minDate,
      maxDate,
      placeholder,
      value,
      disabled = false,
      className = '',
      colorScheme = 'secondary',
      variant = 'outline',
      config,
      isCalendar = false,
      isRange = false,
      ...rest
    }: DatePickerProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const language = config?.language ?? DEFAULT_LANGUAGE
    const footerLabels: FooterLabels = {
      apply: config?.footer?.apply ?? DEFAULT_FOOTER_LABELS.apply,
      cancel: config?.footer?.cancel ?? DEFAULT_FOOTER_LABELS.cancel,
    }
    const [state, dispatch] = useReducer(
      datePickerReducer,
      value,
      (initialValue?: DateRange) =>
        initialValue
          ? datePickerReducer(DATE_PICKER_INITIAL_STATE, { type: 'SET_VALUE', payload: initialValue })
          : DATE_PICKER_INITIAL_STATE,
    )
    const isFirstRender = useRef(true)
    const rootRef = useClickOutside({
      callback: (): void => {
        dispatch({ type: 'CLOSE_MODAL' })
      },
    })
    const setRootRef = (node: HTMLDivElement | null): void => {
      rootRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) ref.current = node
    }

    const {
      size = variant !== 'unstyled' ? 'md' : undefined,
      shape = variant !== 'unstyled' ? 'rounded' : undefined,
    } = rest
    const datePickerInputClasses = generateDatePickerInputClasses(
      className,
      disabled,
      rest['aria-invalid'] === true || rest['aria-invalid'] === 'true',
      variant,
      shape,
      size,
    )

    useEffect(() => {
      if (!state.modalOpen) return
      if (isRange && state.tempValue.startDate && state.tempValue.endDate) {
        const daysInRange = []
        const currentDate = new Date(state.tempValue.startDate)
        while (currentDate <= state.tempValue.endDate) {
          daysInRange.push(new Date(currentDate))
          currentDate.setDate(currentDate.getDate() + 1)
        }
        dispatch({ type: 'SET_RANGE_DAYS', payload: daysInRange })
      } else {
        dispatch({ type: 'SET_RANGE_DAYS', payload: [] })
      }
    }, [isRange, state.tempValue, state.modalOpen])

    useEffect(() => {
      if (isFirstRender.current) {
        isFirstRender.current = false
        return
      }
      dispatch({ type: 'SET_VALUE', payload: value ?? DEFAULT_DATE_PICKER_VALUE })
    }, [value])

    useEffect(() => {
      if (!state.modalOpen) return
      rootRef.current
        ?.querySelector<HTMLButtonElement>('[role="dialog"] [data-date][tabindex="0"]')
        ?.focus()
    }, [state.modalOpen, rootRef])

    const handleToggleModal = (): void => {
      dispatch({ type: 'TOGGLE_MODAL' })
    }

    const closeAndRestoreFocus = (): void => {
      if (isCalendar) return
      dispatch({ type: 'CLOSE_MODAL' })
      rootRef.current?.querySelector('input')?.focus()
    }

    useEffect(() => {
      if (!state.modalOpen || isCalendar) return
      const handleEscape = (event: KeyboardEvent): void => {
        if (event.key !== 'Escape' || !rootRef.current?.contains(event.target as Node)) return
        dispatch({ type: 'CLOSE_MODAL' })
        rootRef.current.querySelector('input')?.focus()
      }
      document.addEventListener('keydown', handleEscape)
      return () => {
        document.removeEventListener('keydown', handleEscape)
      }
    }, [state.modalOpen, isCalendar, rootRef])

    const handleBlur = (event: FocusEvent<HTMLDivElement>): void => {
      const next = event.relatedTarget
      if (next && !event.currentTarget.contains(next)) {
        dispatch({ type: 'CLOSE_MODAL' })
      }
    }

    const toMonthIndex = (year: number, month: number): number => year * 12 + month

    const showMonths = (first: number, second: number): void => {
      dispatch({ type: 'SET_YEAR', payload: Math.floor(first / 12) })
      dispatch({ type: 'SET_MONTH', payload: first % 12 })
      dispatch({ type: 'SET_SECOND_YEAR', payload: Math.floor(second / 12) })
      dispatch({ type: 'SET_SECOND_MONTH', payload: second % 12 })
    }

    const showFirstMonth = (year: number, month: number): void => {
      const first = toMonthIndex(year, month)
      showMonths(first, Math.max(toMonthIndex(state.secondYear, state.secondMonth), first + 1))
    }

    const showSecondMonth = (year: number, month: number): void => {
      const second = toMonthIndex(year, month)
      showMonths(Math.min(toMonthIndex(state.year, state.month), second - 1), second)
    }

    const handleYearChange = (newYear: number): void => {
      showFirstMonth(newYear, state.month)
    }

    const handleMonthChange = (newMonth: number): void => {
      showFirstMonth(state.year, newMonth)
    }

    const handleSecondYearChange = (newYear: number): void => {
      showSecondMonth(newYear, state.secondMonth)
    }

    const handleSecondMonthChange = (newMonth: number): void => {
      showSecondMonth(state.secondYear, newMonth)
    }

    const handleApply = (): void => {
      dispatch({ type: 'SET_VALUE', payload: state.tempValue })
      if (state.tempValue.startDate) {
        onChange({ startDate: state.tempValue.startDate, endDate: state.tempValue.endDate })
      }
      closeAndRestoreFocus()
    }

    const handleDateSelection = (day: number, isSecondCalendar?: boolean): void => {
      const selectedDate = new Date(
        isSecondCalendar ? state.secondYear : state.year,
        isSecondCalendar ? state.secondMonth : state.month,
        day,
      )

      const newValue: DateRange = { ...state.tempValue }

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

      if (showFooter) {
        return
      }

      if (!isRange || newValue.endDate) {
        onChange({ startDate: newValue.startDate, endDate: newValue.endDate })
        dispatch({ type: 'SET_VALUE', payload: newValue })
        closeAndRestoreFocus()
      }
    }

    const getDefaultPlaceholder = (): string => {
      const currentDisplayFormat = displayFormat ?? getDateFormatByLanguage(language)
      return isRange ? `${currentDisplayFormat} - ${currentDisplayFormat}` : currentDisplayFormat
    }

    return (
      <DatePickerContext.Provider value={{ state, dispatch }}>
        <div
          className={styles.datePicker}
          onBlur={handleBlur}
          ref={setRootRef}
          style={datePickerColorVars(colorScheme, style)}
        >
          {!isCalendar && (
            <DatePickerInput
              className={datePickerInputClasses}
              disabled={disabled}
              displayFormat={displayFormat}
              inputRef={inputRef}
              isRange={isRange}
              language={language}
              onBlur={onBlur}
              onClick={handleToggleModal}
              placeholder={placeholder ?? getDefaultPlaceholder()}
              {...rest}
            />
          )}
          {isCalendar || state.modalOpen ? (
            <div
              aria-label='Calendar'
              className={styles.datePickerModal}
              role='dialog'
            >
              <div className={isRange ? styles.calendarContainerDouble : styles.calendarContainer}>
                <Calendar
                  isRange={isRange}
                  language={language}
                  maxDate={maxDate}
                  minDate={minDate}
                  onMonthChange={handleMonthChange}
                  onSelectDate={handleDateSelection}
                  onYearChange={handleYearChange}
                />
                {isRange ? (
                  <Calendar
                    isRange={isRange}
                    isSecondCalendar
                    language={language}
                    maxDate={maxDate}
                    minDate={minDate}
                    onMonthChange={handleSecondMonthChange}
                    onSelectDate={handleDateSelection}
                    onYearChange={handleSecondYearChange}
                  />
                ) : null}
              </div>
              {showFooter ? (
                <FooterActions
                  colorScheme={colorScheme}
                  labels={footerLabels}
                  onApply={handleApply}
                  onCancel={closeAndRestoreFocus}
                />
              ) : null}
            </div>
          ) : null}
        </div>
      </DatePickerContext.Provider>
    )
  },
)

DatePicker.displayName = 'DatePicker'
