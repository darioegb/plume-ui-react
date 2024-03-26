import type { CSSProperties, ForwardedRef, InputHTMLAttributes, ReactNode } from 'react'
import { forwardRef, useEffect, useRef, useReducer } from 'react'
import { getDarkenColor, getLightenColor } from '@plume-ui-react/color-utils'
import type { ColorPalette, ComponentProps, Shape, Size } from '@plume-ui-react/core'
import { getMergedConfig } from '@plume-ui-react/core'
import { getDateFormatByLanguage } from '@plume-ui-react/date-utils'
import { Button } from '@plume-ui-react/button'
import { DatePickerContext } from './use-datepicker'
import { DEFAULT_DATE_PICKER_VALUE, datePickerReducer } from './datepicker-reducer'
import { Calendar } from './calendar'
import { DatePickerInput } from './datepicker-input'
import styles from './datepicker.module.css'

export interface DatePickerOwnProps {
  colorScheme?: keyof ColorPalette
  config?: DatePickerConfig
  displayFormat?: string
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

interface DatePickerConfig {
  footer: FooterLabels
  language: string
}

interface FooterLabels {
  apply: string
  cancel: string
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
  'disabled' | 'readOnly' | 'id' | 'required' | 'placeholder'
>

export type DatePickerProps = ComponentProps & DatePickerRootAttributes & DatePickerOwnProps

const createDatePickerStyles = (
  color: string,
  hoverColor: string,
  rangeItemColor: string,
  selectedHoverColor: string,
  style?: CSSProperties,
): CSSProperties => ({
  '--datepicker-scheme': color,
  '--datepicker-range-item-color': rangeItemColor,
  '--datepicker-hover-color': hoverColor,
  '--datepicker-selected-hover-color': selectedHoverColor,
  ...(style ?? {}),
} as CSSProperties)

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
  className: string,
  disabled: boolean,
  variant: string,
  colorScheme?: keyof ColorPalette,
  shape?: Shape,
  size?: Size,
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
      value,
      disabled = false,
      className = '',
      variant = 'outline',
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
      value: value ?? DEFAULT_DATE_PICKER_VALUE,
      tempValue: value ?? DEFAULT_DATE_PICKER_VALUE,
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
      generateDatePickerAttributes(className, disabled, variant, colorScheme, shape, size)

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
      if (value?.startDate && value.endDate) {
        onChange(value)
      }
      dispatch({ type: 'SET_VALUE', payload: value ?? value ?? DEFAULT_DATE_PICKER_VALUE })
      dispatch({ type: 'SET_TEMP_VALUE', payload: value ?? value ?? DEFAULT_DATE_PICKER_VALUE })
    }, [value, isRange, language, onChange])

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
      dispatch({ type: 'SET_VALUE', payload: state.tempValue })
      if (state.value.startDate) {
        onChange({ startDate: state.value.startDate, endDate: state.value.endDate })
      }
      handleToggleModal()
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
        if (!isRange) {
          dispatch({ type: 'SET_VALUE', payload: newValue })
          handleToggleModal()
        } else {
          dispatch({ type: 'SET_VALUE', payload: newValue })
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
