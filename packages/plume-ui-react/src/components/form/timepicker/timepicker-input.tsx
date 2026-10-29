'use client'

import type { InputHTMLAttributes, ReactNode, Ref } from 'react'
import { useCallback, useId } from 'react'
import type { ComponentProps } from '../../../theme'
import { mergeRefs } from '../../../overlay/trigger'
import { visuallyHidden } from '../../../overlay/visually-hidden'
import { Input, InputControl, InputElement, InputField } from '../input'
import { TimePickerTrigger } from './timepicker-trigger'
import { useTimePicker } from './use-timepicker'
import { useTimeText } from './use-time-text'

export type TimePickerRootAttributes = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  | 'aria-describedby'
  | 'aria-invalid'
  | 'aria-label'
  | 'aria-labelledby'
  | 'disabled'
  | 'id'
  | 'name'
  | 'placeholder'
  | 'readOnly'
  | 'required'
>

export interface TimePickerInputOwnProps {
  /**
   * The parts of the input, in the order they should appear. Without children it renders the field
   * and the trigger.
   */
  children?: ReactNode
  /**
   * Ref to the `<input>`. The `ref` of the picker points to its wrapper, so pass a form library ref
   * here (such as `field.ref` of react-hook-form) to let it focus the field on errors.
   */
  inputRef?: Ref<HTMLInputElement>
  /** Called with the current value when the input loses focus, after applying the typed text. */
  onBlur?: (value: string) => void
}

export type TimePickerInputProps = Omit<ComponentProps, 'index' | 'style'> &
  TimePickerRootAttributes &
  TimePickerInputOwnProps

const TIME_MASK = '##:##'

const defaultPlaceholder = (hour12: boolean, am: string): string =>
  hour12 ? `hh:mm ${am}` : 'hh:mm'

/**
 * The field and the button that opens the panel. It is an `Input`: given children, compose
 * `InputControl`, `InputField`, `InputElement` and `TimePickerTrigger` in any order. It renders
 * nothing when the picker is `panel`.
 */
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
  const hintId = useId()
  const format = placeholder ?? defaultPlaceholder(hour12, labels.am)
  const setInputRef = useCallback(
    (node: HTMLInputElement | null): void => mergeRefs<HTMLInputElement>(setInput, inputRef)(node),
    [inputRef, setInput],
  )

  if (isPanel) return null

  return (
    <>
      <Input
        {...rest}
        aria-describedby={[rest['aria-describedby'], hintId].filter(Boolean).join(' ')}
        autoComplete="off"
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
        placeholder={format}
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
      <span id={hintId} style={visuallyHidden}>
        {labels.format(format)}
      </span>
    </>
  )
}

TimePickerInput.displayName = 'TimePickerInput'
