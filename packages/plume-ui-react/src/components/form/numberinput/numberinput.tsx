'use client'

import type { CSSProperties, ForwardedRef, InputHTMLAttributes, ReactNode, RefObject } from 'react'
import { forwardRef, useRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { useLabels } from '../../../locale/locale-provider'
import type { ColorScheme, ComponentProps, Shape, Size } from '../../../theme'
import { NumberInputContext } from './numberinput-context'
import { NumberInputDecrement } from './numberinput-decrement'
import { NumberInputField } from './numberinput-field'
import { NumberInputIncrement } from './numberinput-increment'
import { DEFAULT_LABELS } from './numberinput-labels'
import type { NumberInputLabels } from './numberinput-labels'
import styles from './numberinput.module.css'
import { useNumberInput } from './use-number-input'

export type { NumberInputLabels }

export type NumberInputVariant = 'outline' | 'filled' | 'underline' | 'unstyled'

export interface NumberInputOwnProps {
  children?: ReactNode
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
      children,
      className,
      colorScheme = 'secondary',
      defaultValue,
      disabled = false,
      format,
      labels,
      largeStep,
      max,
      min,
      name,
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
    const inputRef: RefObject<HTMLInputElement | null> = useRef(null)
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
    const text = useLabels('numberInput', DEFAULT_LABELS, labels)
    const colorVars = {
      '--numberinput-color': `var(--plume-color-${colorScheme}-text)`,
      ...style,
    } as CSSProperties
    const context = {
      disabled,
      fieldProps: rest,
      forwardedRef: ref,
      inputRef,
      invalid,
      isStyled,
      labels: text,
      max,
      min,
      number,
      precision,
      readOnly,
    }

    return (
      <NumberInputContext.Provider value={context}>
        <div
          className={controlClasses(className, disabled, invalid, shape, size, variant)}
          data-disabled={disabled ? '' : undefined}
          data-invalid={invalid ? '' : undefined}
          data-plume-numberinput-control=""
          style={colorVars}
        >
          {children ?? (
            <>
              {steppers ? <NumberInputDecrement /> : null}
              <NumberInputField />
              {steppers ? <NumberInputIncrement /> : null}
            </>
          )}
          {name ? <input name={name} type="hidden" value={number.value ?? ''} /> : null}
        </div>
      </NumberInputContext.Provider>
    )
  },
)

NumberInput.displayName = 'NumberInput'
