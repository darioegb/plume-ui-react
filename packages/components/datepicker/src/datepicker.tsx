import type { CSSProperties, ForwardedRef, InputHTMLAttributes, ReactNode } from 'react'
import { forwardRef, useEffect, useRef, useReducer } from 'react'
import { getDarkenColor, getLightenColor } from '@plume-ui-react/color-utils'
import type { ColorPalette, ComponentProps, Shape, Size } from '@plume-ui-react/core'
import { getMergedConfig } from '@plume-ui-react/core'
import { getDateFormatByLanguage } from '@plume-ui-react/date-utils'
import { Button } from '@plume-ui-react/button'
import { DatePickerContext } from './use-datepicker'
import { datePickerReducer } from './datepicker-reducer'
import { Calendar } from './calendar'
import { DatePickerInput } from './datepicker-input'
import styles from './datepicker.module.css'

export interface DatePickerOwnProps {
  startDate?: Date
  endDate?: Date
  isRange?: boolean
  colorScheme?: keyof ColorPalette
  displayFormat?: string
  maxDate?: Date
  minDate?: Date
  showFooter?: boolean
  config?: DatePickerConfig
  shape?: Shape
  size?: Size
  variant?: DatePickerVariant
  onChange?: (value: { startDate: Date; endDate?: Date }) => void
  onBlur?: (value?: { startDate?: Date; endDate?: Date }) => void
}

interface DatePickerConfig {
  language: string
  footer: FooterLabels
}

interface FooterLabels {
  cancel: string
  apply: string
}

interface FooterActionsProps {
  labels: FooterLabels
  onApply: () => void
  onCancel: () => void
  colorScheme?: keyof ColorPalette
}

export type DatePickerVariant = 'outline' | 'filled' | 'underline' | 'unstyled'
export type DatePickerRootAttributes = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  'disabled' | 'id' | 'required' | 'placeholder'
>

export type DatePickerProps = ComponentProps & DatePickerRootAttributes & DatePickerOwnProps

const createDatePickerStyles = (
  color: string,
  rangeItemColor: string,
  hoverColor: string,
  selectedHoverColor: string,
  style?: CSSProperties,
): Record<string, unknown> => ({
  '--datepicker-scheme': color,
  '--datepicker-range-item-color': rangeItemColor,
  '--datepicker-hover-color': hoverColor,
  '--datepicker-selected-hover-color': selectedHoverColor,
  ...(style ?? {}),
})

function FooterActions({
  colorScheme,
  labels: { cancel, apply },
  onApply,
  onCancel,
}: FooterActionsProps): ReactNode {
  return (
    <div className={styles.footerActions}>
      <Button className={styles.footerButton} label={cancel} onClick={onCancel} variant="ghost" />
      <Button
        className={styles.footerButtonApply}
        colorScheme={colorScheme}
        label={apply}
        onClick={onApply}
      />
    </div>
  )
}

const generateDatePickerAttributes = (
  variant: string,
  className: string,
  disabled: boolean,
  colorScheme?: keyof ColorPalette,
  size?: Size,
  shape?: Shape,
): Record<string, string> => {
  const color = (colorScheme && getMergedConfig().colors[colorScheme]) || '#d3d3d3'
  const hoverColor = getLightenColor(color, 80)
  const rangeItemColor = getLightenColor(color, 70)
  const selectedHoverColor = getDarkenColor(color)
  const sizeClass = size && (size !== 'md' || variant === 'unstyled') ? styles[size] : ''
  const shapeClass = shape && (shape !== 'rounded' || variant === 'unstyled') ? styles[shape] : ''
  const variantClass = variant !== 'unstyled' ? styles[variant] : ''
  const disabledClass = disabled ? styles.disabled : ''
  const datePickerInputClasses =
    `${styles.datePickerInputText} ${sizeClass} ${shapeClass} ${variantClass} 
    ${disabledClass} ${className}`.trim()

  return { color, hoverColor, rangeItemColor, selectedHoverColor, datePickerInputClasses }
}

export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      onChange,
      onBlur,
      displayFormat,
      colorScheme,
      style,
      showFooter,
      minDate,
      maxDate,
      placeholder,
      disabled = false,
      className = '',
      variant = 'outline',
      startDate: initialStartDate,
      endDate: initialEndDate,
      config = {
        language: 'en',
        footer: {
          cancel: 'Cancel',
          apply: 'Apply',
        },
      },
      isRange = false,
      ...rest
    }: DatePickerProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const { language, footer: footerLabels } = config
    const [state, dispatch] = useReducer(datePickerReducer, {
      startDate: initialStartDate ?? null,
      endDate: initialEndDate ?? null,
      modalOpen: false,
      year: new Date().getFullYear(),
      secondYear: new Date().getFullYear(),
      month: new Date().getMonth(),
      secondMonth: new Date().getMonth() + 1,
      rangeDays: [],
    })
    const datePickerRef = useRef<HTMLDivElement>(null)
    const isFirstRender = useRef(true)

    const {
      size = variant !== 'unstyled' ? 'md' : undefined,
      shape = variant !== 'unstyled' ? 'rounded' : undefined,
    } = rest
    const { color, hoverColor, rangeItemColor, selectedHoverColor, datePickerInputClasses } =
      generateDatePickerAttributes(variant, className, disabled, colorScheme, size, shape)

    useEffect(() => {
      const handleOutsideClick = (event: MouseEvent): void => {
        if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
          dispatch({ type: 'TOGGLE_MODAL' })
        }
      }

      if (state.modalOpen) {
        document.addEventListener('mousedown', handleOutsideClick)
      }

      return () => {
        document.removeEventListener('mousedown', handleOutsideClick)
      }
    }, [state.modalOpen])

    useEffect(() => {
      if (!state.modalOpen) return
      if (isRange && state.startDate && state.endDate) {
        const daysInRange = []
        const currentDate = new Date(state.startDate)
        while (currentDate <= state.endDate) {
          daysInRange.push(new Date(currentDate))
          currentDate.setDate(currentDate.getDate() + 1)
        }
        dispatch({ type: 'SET_RANGE_DAYS', payload: daysInRange })
      } else {
        dispatch({ type: 'SET_RANGE_DAYS', payload: [] })
      }
    }, [isRange, state.startDate, state.endDate, state.modalOpen])

    useEffect(() => {
      if (isFirstRender.current) {
        isFirstRender.current = false
        return
      }
      const startDate = initialStartDate ?? null
      const endDate = initialEndDate ?? null
      if (onChange && startDate && endDate) {
        onChange({ startDate, endDate })
      }
      dispatch({ type: 'SET_START_DATE', payload: startDate })
      dispatch({ type: 'SET_END_DATE', payload: endDate })
    }, [initialStartDate, initialEndDate, isRange, language, onChange])

    const handleToggleModal = (): void => {
      dispatch({ type: 'TOGGLE_MODAL' })
    }

    const handleYearChange = (newYear: number): void => {
      if (newYear > state.secondYear) {
        dispatch({ type: 'SET_YEAR', payload: newYear })
        dispatch({ type: 'SET_SECOND_YEAR', payload: newYear })
      } else {
        dispatch({ type: 'SET_YEAR', payload: newYear })
      }
    }

    const handleMonthChange = (newMonth: number): void => {
      if (
        state.year < state.secondYear ||
        (state.year === state.secondYear && newMonth < state.secondMonth)
      ) {
        dispatch({ type: 'SET_MONTH', payload: newMonth })
      } else {
        dispatch({ type: 'SET_MONTH', payload: newMonth })
        if (newMonth === 11) {
          dispatch({ type: 'SET_SECOND_MONTH', payload: 0 })
          dispatch({ type: 'SET_SECOND_YEAR', payload: state.secondYear + 1 })
        } else {
          dispatch({ type: 'SET_SECOND_MONTH', payload: newMonth + 1 })
        }
      }
    }

    const handleSecondYearChange = (newYear: number): void => {
      if (newYear < state.year) {
        dispatch({ type: 'SET_SECOND_YEAR', payload: newYear })
        dispatch({ type: 'SET_YEAR', payload: newYear })
      } else {
        dispatch({ type: 'SET_SECOND_YEAR', payload: newYear })
      }
    }

    const handleSecondMonthChange = (newMonth: number): void => {
      if (
        state.secondYear > state.year ||
        (state.secondYear === state.year && newMonth > state.month)
      ) {
        dispatch({ type: 'SET_SECOND_MONTH', payload: newMonth })
      } else {
        dispatch({ type: 'SET_SECOND_MONTH', payload: newMonth })
        if (state.secondYear === state.year && newMonth === 0) {
          dispatch({ type: 'SET_YEAR', payload: state.year - 1 })
          dispatch({ type: 'SET_MONTH', payload: 11 })
        } else {
          dispatch({ type: 'SET_MONTH', payload: state.month - 1 })
        }
      }
    }

    const handleApply = (): void => {
      if (onChange && state.startDate) {
        onChange({ startDate: state.startDate, ...state.endDate })
      }
      handleToggleModal()
    }

    const resetCalendarStyles = (): void => {
      document.querySelectorAll<HTMLButtonElement>(`.${styles.day}:enabled`).forEach((item) => {
        item.classList.remove(`${styles.rangeItem}`)
      })
    }

    const handleDateSelection = (day: number, isSecondCalendar?: boolean): void => {
      const selectedDate = new Date(
        isSecondCalendar ? state.secondYear : state.year,
        isSecondCalendar ? state.secondMonth : state.month,
        day,
      )

      if (!isRange) {
        dispatch({ type: 'SET_START_DATE', payload: selectedDate })
        if (!showFooter) {
          if (onChange) {
            onChange({ startDate: selectedDate })
          }
          handleToggleModal()
        }
      } else if (!state.startDate || state.endDate) {
        dispatch({ type: 'SET_START_DATE', payload: selectedDate })
        dispatch({ type: 'SET_END_DATE', payload: null })
        resetCalendarStyles()
      } else if (selectedDate < state.startDate) {
        dispatch({ type: 'SET_START_DATE', payload: selectedDate })
      } else {
        dispatch({ type: 'SET_END_DATE', payload: selectedDate })
        if (!showFooter) {
          if (onChange) {
            onChange({ startDate: state.startDate, endDate: selectedDate })
          }
          handleToggleModal()
        }
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
          ref={ref}
          style={createDatePickerStyles(
            color,
            rangeItemColor,
            hoverColor,
            selectedHoverColor,
            style,
          )}
        >
          <DatePickerInput
            className={datePickerInputClasses}
            disabled={disabled}
            displayFormat={displayFormat}
            isRange={isRange}
            language={language}
            onBlur={onBlur}
            onClick={handleToggleModal}
            placeholder={placeholder ?? getDefaultPlaceholder()}
            {...rest}
          />
          {state.modalOpen ? (
            <div className={styles.datePickerModal} ref={datePickerRef} role="dialog">
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
                  onCancel={handleToggleModal}
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
