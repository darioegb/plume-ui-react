'use client'

import type { ForwardedRef, InputHTMLAttributes, ReactNode } from 'react'
import { forwardRef, useId, useMemo } from 'react'
import type { ComponentProps } from '../../../theme'
import { hasPart } from '../../../overlay/has-part'
import { mergeRefs } from '../../../overlay/trigger'
import { Input, InputControl, InputElement, InputField } from '../input'
import { TimePickerFormatHint } from './timepicker-format-hint'
import { TimePickerInputContext } from './timepicker-input-context'
import { TimePickerTrigger } from './timepicker-trigger'
import { useTimePickerContext } from './timepicker-context'
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
   * and the trigger. A `TimePickerFormatHint` among them takes the place of the default one.
   */
  children?: ReactNode
  /** Called with the current value when the input loses focus, after applying the typed text. */
  onBlur?: (value: string) => void
}

export type TimePickerInputProps = Omit<ComponentProps, 'index' | 'style'> &
  TimePickerRootAttributes &
  TimePickerInputOwnProps

const TIME_MASK = '##:##'

/**
 * The field and the button that opens the panel. It is an `Input`: given children, compose
 * `InputControl`, `InputField`, `InputElement` and `TimePickerTrigger` in any order. Its `ref` goes to
 * the native `<input>`. It renders nothing when the picker is `panel`.
 */
export const TimePickerInput = forwardRef<HTMLInputElement, TimePickerInputProps>(
  (
    {
      children,
      className,
      disabled = false,
      onBlur,
      placeholder,
      readOnly,
      ...rest
    }: TimePickerInputProps,
    ref: ForwardedRef<HTMLInputElement>,
  ): ReactNode => {
    const {
      colorScheme,
      hour12,
      inputRef,
      isPanel,
      labels,
      setInput,
      setValue,
      shape,
      size,
      value,
      variant,
    } = useTimePickerContext('TimePickerInput')
    const { commit, handleChange, text } = useTimeText({ hour12, labels, setValue, value })
    const hintId = useId()
    const format = placeholder ?? labels.placeholder(hour12 ? labels.am : undefined)
    const setRef = useMemo(() => mergeRefs(setInput, inputRef, ref), [inputRef, ref, setInput])
    const inputContext = useMemo(
      () => ({ hint: labels.format(format), hintId }),
      [format, hintId, labels],
    )

    if (isPanel) return null

    return (
      <TimePickerInputContext.Provider value={inputContext}>
        <Input
          {...rest}
          aria-describedby={[rest['aria-describedby'], hintId].filter(Boolean).join(' ')}
          autoComplete="off"
          className={className}
          colorScheme={colorScheme}
          data-plume-timepicker-input=""
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
          ref={setRef}
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
        {hasPart(children, [TimePickerFormatHint]) ? null : <TimePickerFormatHint />}
      </TimePickerInputContext.Provider>
    )
  },
)

TimePickerInput.displayName = 'TimePickerInput'
