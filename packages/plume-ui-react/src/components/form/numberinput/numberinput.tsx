'use client'

import type { CSSProperties, ForwardedRef, InputHTMLAttributes, ReactNode, RefObject } from 'react'
import { forwardRef, useRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { mergeLabels } from '../../../overlay/labels'
import { mergeRefs } from '../../../overlay/trigger'
import type { ColorScheme, ComponentProps, Shape, Size } from '../../../theme'
import { NumberInputStepper } from './numberinput-stepper'
import styles from './numberinput.module.css'
import { useNumberInput } from './use-number-input'

export type NumberInputPart = 'decrement' | 'increment' | 'input'

export interface NumberInputLabels {
  decrement: string
  increment: string
}

const DEFAULT_LABELS: NumberInputLabels = { decrement: 'Decrease', increment: 'Increase' }

export type NumberInputVariant = 'outline' | 'filled' | 'underline' | 'unstyled'

export interface NumberInputOwnProps {
  classNames?: Partial<Record<NumberInputPart, string>>
  colorScheme?: ColorScheme
  defaultValue?: number | null
  format?: (value: number) => string
  labels?: Partial<NumberInputLabels>
  largeStep?: number
  max?: number
  min?: number
  name?: string
  onValueChange?: (value: number | null) => void
  parse?: (text: string) => number | null
  precision?: number
  shape?: Shape
  size?: Size
  step?: number
  steppers?: boolean
  value?: number | null
  variant?: NumberInputVariant
}

type NumberInputRootAttributes = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  | 'aria-describedby'
  | 'aria-invalid'
  | 'aria-label'
  | 'aria-labelledby'
  | 'disabled'
  | 'id'
  | 'onBlur'
  | 'onFocus'
  | 'placeholder'
  | 'readOnly'
  | 'required'
  | 'title'
>

export type NumberInputProps = Omit<ComponentProps, 'index'> &
  NumberInputRootAttributes &
  NumberInputOwnProps

const controlClasses = (
  className: string | undefined,
  disabled: boolean,
  invalid: boolean,
  shape: Shape,
  size: Size,
  variant: NumberInputVariant,
): string | undefined => {
  const isStyled = variant !== 'unstyled'
  return joinClasses(
    isStyled && styles.control,
    isStyled && styles[variant],
    isStyled && styles[size],
    isStyled && styles[shape],
    isStyled && invalid && styles.invalid,
    isStyled && disabled && styles.disabled,
    className,
  )
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      className,
      classNames,
      colorScheme = 'secondary',
      defaultValue,
      disabled = false,
      format,
      labels,
      largeStep,
      max,
      min,
      name,
      onBlur,
      onValueChange,
      parse,
      precision,
      readOnly = false,
      shape = 'rounded',
      size = 'md',
      step = 1,
      steppers = true,
      style,
      value,
      variant = 'outline',
      ...rest
    }: NumberInputProps,
    ref: ForwardedRef<HTMLInputElement>,
  ): ReactNode => {
    const input: RefObject<HTMLInputElement | null> = useRef(null)
    const number = useNumberInput({
      defaultValue,
      format,
      largeStep,
      max,
      min,
      onValueChange,
      parse,
      precision,
      readOnly,
      step,
      value,
    })
    const isStyled = variant !== 'unstyled'
    const invalid = rest['aria-invalid'] === true || rest['aria-invalid'] === 'true'
    const canStep = steppers && !disabled
    const text = mergeLabels(DEFAULT_LABELS, labels)
    const colorVars = {
      '--numberinput-color': `var(--plume-color-${colorScheme}-text)`,
      ...style,
    } as CSSProperties
    const focusInput = (): void => input.current?.focus()

    return (
      <div
        className={controlClasses(className, disabled, invalid, shape, size, variant)}
        data-plume-numberinput-control=""
        style={colorVars}
      >
        {steppers ? (
          <NumberInputStepper
            className={joinClasses(isStyled && styles.stepper, classNames?.decrement)}
            direction={-1}
            disabled={!canStep || !number.canDecrement}
            label={text.decrement}
            onStep={() => {
              focusInput()
              number.stepBy(-1)
            }}
          />
        ) : null}
        <input
          aria-valuemax={max}
          aria-valuemin={min}
          aria-valuenow={number.value ?? undefined}
          aria-valuetext={number.valueText}
          autoComplete="off"
          className={joinClasses(isStyled && styles.input, classNames?.input)}
          data-plume-numberinput-input=""
          disabled={disabled}
          inputMode={precision === 0 ? 'numeric' : 'decimal'}
          onBlur={(event) => {
            number.commit()
            onBlur?.(event)
          }}
          onChange={(event) => number.onTextChange(event.target.value)}
          onKeyDown={number.onKeyDown}
          readOnly={readOnly}
          ref={mergeRefs<HTMLInputElement>(input, ref)}
          role="spinbutton"
          type="text"
          value={number.display}
          {...rest}
        />
        {steppers ? (
          <NumberInputStepper
            className={joinClasses(isStyled && styles.stepper, classNames?.increment)}
            direction={1}
            disabled={!canStep || !number.canIncrement}
            label={text.increment}
            onStep={() => {
              focusInput()
              number.stepBy(1)
            }}
          />
        ) : null}
        {name ? <input name={name} type="hidden" value={number.value ?? ''} /> : null}
      </div>
    )
  },
)

NumberInput.displayName = 'NumberInput'
