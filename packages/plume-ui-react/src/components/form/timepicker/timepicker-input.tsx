'use client'

import type { InputHTMLAttributes, ReactNode, Ref } from 'react'
import { useCallback } from 'react'
import type { ComponentProps } from '../../../theme'
import { mergeRefs } from '../../../overlay/trigger'
import { Input, InputControl, InputElement, InputField } from '../input'
import { TimePickerTrigger } from './timepicker-trigger'
import { useTimePicker } from './use-timepicker'
import { useTimeText } from './use-time-text'

export type TimePickerRootAttributes = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  | 'aria-describedby'
  | 'aria-invalid'
  | 'disabled'
  | 'id'
  | 'name'
  | 'placeholder'
  | 'readOnly'
  | 'required'
>

export interface TimePickerInputOwnProps {
  children?: ReactNode
  inputRef?: Ref<HTMLInputElement>
  onBlur?: (value: string) => void
}

export type TimePickerInputProps = Omit<ComponentProps, 'index' | 'style'> &
  TimePickerRootAttributes &
  TimePickerInputOwnProps

const TIME_MASK = '##:##'

const defaultPlaceholder = (hour12: boolean, am: string): string =>
  hour12 ? `hh:mm ${am}` : 'hh:mm'

export function TimePickerInput({
  children,
  className,
  disabled = false,
  inputRef,
  onBlur,
  placeholder,
  readOnly,
  ...rest
}: Readonly<TimePickerInputProps>): ReactNode {
  const { colorScheme, hour12, isPanel, labels, setInput, setValue, shape, size, value, variant } =
    useTimePicker('TimePickerInput')
  const { commit, handleChange, text } = useTimeText({ hour12, labels, setValue, value })
  const setInputRef = useCallback(
    (node: HTMLInputElement | null): void => mergeRefs<HTMLInputElement>(setInput, inputRef)(node),
    [inputRef, setInput],
  )

  if (isPanel) return null

  return (
    <Input
      {...rest}
      className={className}
      colorScheme={colorScheme}
      disabled={disabled}
      inputMode="numeric"
      mask={hour12 ? undefined : TIME_MASK}
      onBlur={() => {
        const committed = commit()
        onBlur?.(committed)
      }}
      onChange={handleChange}
      placeholder={placeholder ?? defaultPlaceholder(hour12, labels.am)}
      readOnly={readOnly}
      ref={setInputRef}
      shape={shape}
      size={size}
      type="text"
      value={text}
      variant={variant}
    >
      {children ?? (
        <InputControl>
          <InputField />
          <InputElement position="after">
            <TimePickerTrigger />
          </InputElement>
        </InputControl>
      )}
    </Input>
  )
}
