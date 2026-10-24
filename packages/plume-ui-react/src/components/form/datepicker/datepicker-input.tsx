'use client'

import type { ChangeEvent, ReactNode, Ref } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { ComponentProps } from '../../../theme'
import { CalendarIcon } from '../../../overlay/icons'
import { PickerTrigger } from '../shared/picker-trigger'
import { Input, InputControl, InputElement, InputField } from '../input'
import {
  getDateFormatByLanguage,
  getDateFromDateString,
  getDateStringByLanguage,
  validateFormatDate,
} from '../../../utils/dates'
import { useDebounce } from '../../../hooks/use-debounce'
import type { DatePickerRootAttributes, DateRange } from './datepicker-types'
import { useDatePicker } from './use-datepicker'

export interface DatePickerInputOwnProps {
  classNames?: Partial<Record<'input', string>>
  inputRef?: Ref<HTMLInputElement>
  onBlur?: (value?: DateRange) => void
}

export type DatePickerInputProps = Omit<ComponentProps, 'index' | 'style'> &
  DatePickerRootAttributes &
  DatePickerInputOwnProps

const sameTime = (a: Date | null, b: Date | null): boolean => a?.getTime() === b?.getTime()

export function DatePickerInput({
  className,
  classNames,
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
    colorScheme,
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

  const currentFormat = displayFormat ?? getDateFormatByLanguage(language)
  const singleMask = currentFormat.replace(/[a-zA-Z]/g, '#')
  const mask = isRange ? `${singleMask} - ${singleMask}` : singleMask

  if (isCalendar) return null

  return (
    <Input
      className={className}
      colorScheme={colorScheme}
      disabled={disabled}
      inputMode="numeric"
      mask={mask}
      onBlur={() => {
        onBlur?.({ startDate, endDate })
      }}
      onChange={handleChange}
      placeholder={placeholder ?? (isRange ? `${currentFormat} - ${currentFormat}` : currentFormat)}
      readOnly={readOnly}
      shape={shape}
      size={size}
      type="text"
      value={inputValue}
      variant={variant}
      {...rest}
    >
      <InputControl>
        <InputField className={classNames?.input} ref={setRef} />
        <InputElement position="after">
          <PickerTrigger
            disabled={disabled || Boolean(readOnly)}
            icon={<CalendarIcon />}
            label={labels.openCalendar}
            onClick={handleButtonClick}
            open={modalOpen}
            unstyled={variant === 'unstyled'}
          />
        </InputElement>
      </InputControl>
    </Input>
  )
}
