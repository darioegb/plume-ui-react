'use client'

import type { ChangeEvent, ReactNode, Ref } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { ComponentProps, Shape, Size } from '../../../theme'
import { Button } from '../../interaction/button'
import { Input } from '../input'
import {
  getDateFormatByLanguage,
  getDateFromDateString,
  getDateStringByLanguage,
  validateFormatDate,
} from '../../../utils/dates'
import { useDebounce } from '../../../hooks/use-debounce'
import type { DatePickerRootAttributes, DateRange } from './datepicker-types'
import { useDatePicker } from './use-datepicker'
import styles from './datepicker.module.css'

export interface DatePickerInputOwnProps {
  inputRef?: Ref<HTMLInputElement>
  onBlur?: (value?: DateRange) => void
}

export type DatePickerInputProps = Omit<ComponentProps, 'index' | 'style'> &
  DatePickerRootAttributes &
  DatePickerInputOwnProps

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

const sameTime = (a: Date | null, b: Date | null): boolean => a?.getTime() === b?.getTime()

export function DatePickerInput({
  className = '',
  disabled = false,
  inputRef,
  onBlur,
  placeholder,
  readOnly,
  ...rest
}: Readonly<DatePickerInputProps>): ReactNode {
  const {
    state: {
      modalOpen,
      value: { startDate, endDate },
    },
    commitTypedValue,
    displayFormat,
    isCalendar,
    isRange,
    labels,
    language,
    shape,
    size,
    toggle,
    variant,
  } = useDatePicker('DatePickerInput')
  const [inputValue, setInputValue] = useState<string>(
    getDateStringByLanguage({
      displayFormat,
      isRange,
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
      language,
    }),
  )
  const [isButtonClick, setIsButtonClick] = useState(true)
  const debouncedValue = useDebounce({ value: inputValue, delay: 500 })

  const ref = useRef<HTMLInputElement>(null)
  const setRef = useCallback(
    (node: HTMLInputElement | null): void => {
      ref.current = node
      if (typeof inputRef === 'function') inputRef(node)
      else if (inputRef) inputRef.current = node
    },
    [inputRef],
  )

  const commitIfChanged = useCallback(
    (typed: DateRange): void => {
      if (sameTime(typed.startDate, startDate) && sameTime(typed.endDate, endDate)) return
      commitTypedValue(typed)
    },
    [commitTypedValue, endDate, startDate],
  )

  useEffect(() => {
    if (![10, 23].includes(debouncedValue.length) || isButtonClick) {
      return
    }
    const format = displayFormat ?? getDateFormatByLanguage(language)

    if (
      debouncedValue.length === 10 &&
      !isRange &&
      validateFormatDate(debouncedValue, language, displayFormat)
    ) {
      commitIfChanged({ startDate: getDateFromDateString(debouncedValue, format), endDate: null })
    } else if (
      debouncedValue.length === 23 &&
      validateFormatDate(debouncedValue.split(' - ')[0], language, displayFormat) &&
      validateFormatDate(debouncedValue.split(' - ')[1], language, displayFormat)
    ) {
      const [startDateString, endDateString] = debouncedValue.split(' - ')
      commitIfChanged({
        startDate: getDateFromDateString(startDateString, format),
        endDate: getDateFromDateString(endDateString, format),
      })
    }
  }, [commitIfChanged, debouncedValue, displayFormat, isButtonClick, isRange, language])

  useEffect(() => {
    setInputValue(
      getDateStringByLanguage({
        displayFormat,
        isRange,
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        language,
      }),
    )
  }, [startDate, endDate, displayFormat, isRange, language])

  const handleButtonClick = (): void => {
    setIsButtonClick(true)
    ref.current?.focus()
    toggle()
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setIsButtonClick(false)
    setInputValue(e.target.value)
  }

  const singleMask = (displayFormat ?? getDateFormatByLanguage(language)).replace(/[a-zA-Z]/g, '#')
  const mask = isRange ? `${singleMask} - ${singleMask}` : singleMask
  const currentFormat = displayFormat ?? getDateFormatByLanguage(language)
  const inputClasses = generateDatePickerInputClasses(
    className,
    disabled,
    rest['aria-invalid'] === true || rest['aria-invalid'] === 'true',
    variant,
    shape,
    size,
  )

  if (isCalendar) return null

  return (
    <>
      <Input
        className={inputClasses}
        disabled={disabled}
        inputMode="numeric"
        mask={mask}
        onBlur={() => {
          onBlur?.({ startDate, endDate })
        }}
        onChange={handleChange}
        placeholder={
          placeholder ?? (isRange ? `${currentFormat} - ${currentFormat}` : currentFormat)
        }
        readOnly={readOnly}
        ref={setRef}
        type="text"
        value={inputValue}
        variant="unstyled"
        {...rest}
      />

      <Button
        aria-expanded={modalOpen}
        aria-haspopup="dialog"
        aria-label={labels.openCalendar}
        className={styles.inputButton}
        disabled={disabled || readOnly}
        onClick={handleButtonClick}
        shape="pill"
        variant="icon"
      >
        <svg
          aria-hidden="true"
          className={styles.inputButtonIcon}
          focusable="false"
          viewBox="0 -960 960 960"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z" />
        </svg>
      </Button>
    </>
  )
}
