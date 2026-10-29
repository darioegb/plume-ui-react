'use client'

import type { ChangeEvent, ReactNode, Ref } from 'react'
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import type { ComponentProps } from '../../../theme'
import { visuallyHidden } from '../../../overlay/visually-hidden'
import { Input, InputControl, InputElement } from '../input'
import {
  getDateFormatByLanguage,
  getDateFromDateString,
  getDateStringByLanguage,
  validateFormatDate,
} from '../../../utils/dates'
import type { DatePickerRootAttributes, DateRange } from './datepicker-types'
import { DatePickerField } from './datepicker-field'
import { DatePickerInputContext } from './datepicker-input-context'
import { DatePickerTrigger } from './datepicker-trigger'
import { useDatePicker } from './use-datepicker'

export interface DatePickerInputOwnProps {
  /**
   * The `Input` parts to show instead of the default field and button, for example a `DatePickerField` and a `DatePickerTrigger` inside an `InputControl`.
   */
  children?: ReactNode
  /**
   * Ref to the `<input>`. The component `ref` points to the wrapper, so pass a form library ref here (e.g. `field.ref` from react-hook-form) to let it focus the field on errors.
   */
  inputRef?: Ref<HTMLInputElement>
  /** Called with the current value when the input loses focus. */
  onBlur?: (value?: DateRange) => void
}

export type DatePickerInputProps = Omit<ComponentProps, 'index' | 'style'> &
  DatePickerRootAttributes &
  DatePickerInputOwnProps

const sameTime = (a: Date | null, b: Date | null): boolean => a?.getTime() === b?.getTime()

/** The field with its button. It renders nothing when the `DatePicker` is `calendar`. */
export function DatePickerInput({
  children,
  className,
  disabled = false,
  inputRef,
  onBlur,
  placeholder,
  readOnly,
  ...rest
}: Readonly<DatePickerInputProps>): ReactNode {
  const {
    state: {
      value: { startDate, endDate },
    },
    commitTypedValue,
    displayFormat,
    isPanel,
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
      range: isRange,
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
      language,
    }),
  )
  const [isButtonClick, setIsButtonClick] = useState(true)

  const hintId = useId()
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

  // Only a complete text with a valid format commits, so there is no partial value to wait out.
  useEffect(() => {
    if (![10, 23].includes(inputValue.length) || isButtonClick) {
      return
    }
    const format = displayFormat ?? getDateFormatByLanguage(language)

    if (
      inputValue.length === 10 &&
      !isRange &&
      validateFormatDate(inputValue, language, displayFormat)
    ) {
      commitIfChanged({ startDate: getDateFromDateString(inputValue, format), endDate: null })
    } else if (
      inputValue.length === 23 &&
      validateFormatDate(inputValue.split(' - ')[0], language, displayFormat) &&
      validateFormatDate(inputValue.split(' - ')[1], language, displayFormat)
    ) {
      const [startDateString, endDateString] = inputValue.split(' - ')
      commitIfChanged({
        startDate: getDateFromDateString(startDateString, format),
        endDate: getDateFromDateString(endDateString, format),
      })
    }
  }, [commitIfChanged, displayFormat, inputValue, isButtonClick, isRange, language])

  useEffect(() => {
    setInputValue(
      getDateStringByLanguage({
        displayFormat,
        range: isRange,
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        language,
      }),
    )
  }, [startDate, endDate, displayFormat, isRange, language])

  const handleButtonClick = useCallback((): void => {
    setIsButtonClick(true)
    ref.current?.focus()
    toggle()
  }, [toggle])

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setIsButtonClick(false)
    setInputValue(e.target.value)
  }

  const currentFormat = displayFormat ?? getDateFormatByLanguage(language)
  const singleMask = currentFormat.replace(/[a-zA-Z]/g, '#')
  const mask = isRange ? `${singleMask} - ${singleMask}` : singleMask
  const describedBy = [rest['aria-describedby'], hintId].filter(Boolean).join(' ')

  const inputContext = useMemo(
    () => ({
      disabled: disabled || Boolean(readOnly),
      onTriggerClick: handleButtonClick,
      setRef,
    }),
    [disabled, handleButtonClick, readOnly, setRef],
  )

  if (isPanel) return null

  return (
    <DatePickerInputContext.Provider value={inputContext}>
      <Input
        autoComplete="off"
        className={className}
        colorScheme={colorScheme}
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
        shape={shape}
        size={size}
        type="text"
        value={inputValue}
        variant={variant}
        {...rest}
        aria-describedby={describedBy}
      >
        {children ?? (
          <InputControl>
            <DatePickerField />
            <InputElement position="after">
              <DatePickerTrigger />
            </InputElement>
          </InputControl>
        )}
      </Input>
      <span id={hintId} style={visuallyHidden}>
        {labels.format(isRange ? `${currentFormat} - ${currentFormat}` : currentFormat)}
      </span>
    </DatePickerInputContext.Provider>
  )
}

DatePickerInput.displayName = 'DatePickerInput'
