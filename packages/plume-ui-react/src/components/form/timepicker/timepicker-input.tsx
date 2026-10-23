'use client'

import type { InputHTMLAttributes, ReactNode, Ref } from 'react'
import { useCallback } from 'react'
import type { ComponentProps } from '../../../theme'
import { ClockIcon } from '../../../overlay/icons'
import { mergeRefs } from '../../../overlay/trigger'
import { Input } from '../input'
import { PickerTrigger } from '../shared/picker-trigger'
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
  classNames?: Partial<Record<'input', string>>
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
  className,
  classNames,
  disabled = false,
  inputRef,
  onBlur,
  placeholder,
  readOnly,
  ...rest
}: Readonly<TimePickerInputProps>): ReactNode {
  const {
    colorScheme,
    hour12,
    isPanel,
    labels,
    open,
    setInput,
    setValue,
    shape,
    size,
    toggle,
    value,
    variant,
  } = useTimePicker('TimePickerInput')
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
      classNames={classNames}
      colorScheme={colorScheme}
      disabled={disabled}
      elementAfter={
        <PickerTrigger
          disabled={disabled || Boolean(readOnly)}
          icon={<ClockIcon />}
          label={labels.openTimePicker}
          onClick={toggle}
          open={open}
          unstyled={variant === 'unstyled'}
        />
      }
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
    />
  )
}
