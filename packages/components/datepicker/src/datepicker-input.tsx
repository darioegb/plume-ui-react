import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import type { ComponentProps } from '@plume-ui-react/core'
import { Button } from '@plume-ui-react/button'
import { Input } from '@plume-ui-react/input'
import {
  getDateFormatByLanguage,
  getDateFromDateString,
  getDateStringByLanguage,
  validateFormatDate,
} from '@plume-ui-react/date-utils'
import { useDebounce } from '@plume-ui-react/use-debounce'
import type { DatePickerRootAttributes, DateRange } from './datepicker'
import { useDatePicker } from './use-datepicker'
import styles from './datepicker.module.css'

interface DatePickerInputOwnProps {
  onClick: () => void
  isRange: boolean
  language: string
  displayFormat?: string
  onBlur?: (value?: DateRange) => void
}

type DatePickerInputProps = ComponentProps & DatePickerRootAttributes & DatePickerInputOwnProps

export function DatePickerInput({
  disabled,
  displayFormat,
  isRange,
  language,
  onClick,
  onBlur,
  ...rest
}: DatePickerInputProps): ReactNode {
  const {
    state: {
      modalOpen,
      value: { startDate, endDate },
    },
    dispatch,
  } = useDatePicker()
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

  useEffect(() => {
    if (![10, 23].includes(debouncedValue.length) || isButtonClick) {
      return
    }

    if (
      debouncedValue.length === 10 &&
      !isRange &&
      validateFormatDate(debouncedValue, language, displayFormat)
    ) {
      const newStartDate = getDateFromDateString(debouncedValue)
      dispatch({
        type: 'SET_VALUE',
        payload: {
          startDate: newStartDate,
          endDate: null,
        },
      })
    } else if (
      debouncedValue.length === 23 &&
      validateFormatDate(debouncedValue.split(' - ')[0], language, displayFormat) &&
      validateFormatDate(debouncedValue.split(' - ')[1], language, displayFormat)
    ) {
      const [startDateString, endDateString] = debouncedValue.split(' - ')
      dispatch({
        type: 'SET_VALUE',
        payload: {
          startDate: getDateFromDateString(startDateString),
          endDate: getDateFromDateString(endDateString),
        },
      })
    }
  }, [debouncedValue, dispatch, displayFormat, isButtonClick, isRange, language])

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
    onClick()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setIsButtonClick(false)
    setInputValue(e.target.value)
  }

  const singleMask = (displayFormat ?? getDateFormatByLanguage(language)).replace(/[a-zA-Z]/g, '#')
  const mask = isRange ? `${singleMask} - ${singleMask}` : singleMask

  return (
    <>
      <Input
        disabled={disabled}
        mask={mask}
        onBlur={() => {
          onBlur && onBlur({ startDate, endDate })
        }}
        onChange={handleChange}
        ref={ref}
        type='text'
        value={inputValue}
        variant='unstyled'
        {...rest}
      />

      <Button
        aria-expanded={modalOpen}
        aria-haspopup='dialog'
        aria-label='Open calendar'
        className={styles.inputButton}
        disabled={disabled}
        onClick={handleButtonClick}
        shape='pill'
        variant='icon'
      >
        <svg
          className={styles.inputButtonIcon}
          viewBox='0 -960 960 960'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path d='M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z' />
        </svg>
      </Button>
    </>
  )
}
