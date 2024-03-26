import type { ReactNode } from 'react'
import { useRef } from 'react'
import type { ComponentProps } from '@plume-ui-react/core'
import { Button } from '@plume-ui-react/button'
import { getDateStringByLanguage } from '@plume-ui-react/date-utils'
import { useDatePicker } from './use-datepicker'
import styles from './datepicker.module.css'
import type { DatePickerRootAttributes, DateRange } from './datepicker'

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
      value: { startDate, endDate },
    },
  } = useDatePicker()

  const ref = useRef<HTMLInputElement>(null)

  const handleButtonClick = (): void => {
    ref.current?.focus()
    onClick()
  }

  return (
    <>
      <input
        defaultValue={getDateStringByLanguage({
          displayFormat,
          isRange,
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
          language,
        })}
        disabled={disabled}
        onBlur={() => {
          onBlur && onBlur({ startDate, endDate })
        }}
        onClick={onClick}
        readOnly
        ref={ref}
        type="text"
        {...rest}
      />
      <Button
        className={styles.inputButton}
        disabled={disabled}
        onClick={handleButtonClick}
        variant="unstyled"
      >
        <svg
          className={`${styles.inputButtonIcon}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Button>
    </>
  )
}
