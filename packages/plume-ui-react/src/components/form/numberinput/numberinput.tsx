'use client'

import type { CSSProperties, ForwardedRef, InputHTMLAttributes, ReactNode, RefObject } from 'react'
import { forwardRef, useRef, useMemo } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { hasPart } from '../../../overlay/has-part'
import { useLabels } from '../../../locale/locale-provider'
import type { ColorScheme, ComponentProps, Shape, Size } from '../../../theme'
import { useShallowStable } from '../shared/use-shallow-stable'
import { NumberInputContext } from './numberinput-context'
import { NumberInputDecrement } from './numberinput-decrement'
import { NumberInputField } from './numberinput-field'
import { NumberInputHidden } from './numberinput-hidden'
import { NumberInputIncrement } from './numberinput-increment'
import { DEFAULT_LABELS } from './numberinput-labels'
import type { NumberInputLabels } from './numberinput-labels'
import styles from './numberinput.module.css'
import { useNumberInput } from './use-number-input'

export type { NumberInputLabels }

export type NumberInputVariant = 'outline' | 'filled' | 'underline' | 'unstyled'

export interface NumberInputOwnProps {
  /**
   * The parts of the field, to change what it shows or their order. Without them it renders the field between the two steppers. With a `name` the `NumberInputHidden` is added unless the parts already have one.
   */
  children?: ReactNode
  /**
   * Color scheme for the focus ring, from the theme palette (custom schemes included).
   *
   * @default 'secondary'
   */
  colorScheme?: ColorScheme
  /** The number the field starts with, when it is not controlled. */
  defaultValue?: number | null
  /**
   * How a number is shown when the field is not being edited: a currency, a unit, thousands separators. It is exposed to screen readers as `aria-valuetext`.
   */
  format?: (value: number) => string
  /**
   * The texts of the NumberInput, for other languages: `increment` and `decrement` are the accessible names of the buttons (`Increase` and `Decrease` by default).
   */
  labels?: Partial<NumberInputLabels>
  /** How much <kbd>PageUp</kbd> and <kbd>PageDown</kbd> add or subtract. Ten steps by default. */
  largeStep?: number
  /**
   * The highest number. A value over it is lowered to it on blur, and the increase button is disabled at it.
   */
  max?: number
  /**
   * The lowest number. A value under it is raised to it on blur, and the decrease button is disabled at it.
   */
  min?: number
  /**
   * Name of the field in a form. The plain number goes in a hidden input, an empty string when the field is empty, and the visible input has no name.
   */
  name?: string
  /**
   * Called with the new number, or `null` when the field is empty. It is called while the user types, with what was typed; the clamped and rounded number comes when the field is committed.
   */
  onValueChange?: (value: number | null) => void
  /**
   * Turns the text of the field into a number, or `null`. The default accepts a dot or a comma as the decimal separator. Use it with `format` so what `format` shows can be read back.
   */
  parse?: (text: string) => number | null
  /**
   * Decimals to keep. A typed number is rounded to them on blur and the text is padded with zeros. Without it a typed number keeps its decimals, and a step keeps those of the step. `0` allows only whole numbers and asks for the numeric keyboard.
   */
  precision?: number
  /**
   * Corners of the NumberInput.
   *
   * @default 'rounded'
   */
  shape?: Shape
  /**
   * Size of the NumberInput.
   *
   * @default 'md'
   */
  size?: Size
  /**
   * How much the arrows and the buttons add or subtract.
   *
   * @default 1
   */
  step?: number
  /**
   * Shows the buttons to subtract and add. The keyboard keeps working without them.
   *
   * @default true
   */
  steppers?: boolean
  /**
   * The number, or `null` when it is empty. Makes the NumberInput controlled: pass `onValueChange` to update it.
   */
  value?: number | null
  /**
   * Visual variant, the same as the `Input`. `unstyled` drops the Plume styles so you can bring your own; the row of the input and the buttons stays.
   *
   * @default 'outline'
   */
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
    const fieldProps = useShallowStable(rest)
    const isStyled = variant !== 'unstyled'
    const invalid = fieldProps['aria-invalid'] === true || fieldProps['aria-invalid'] === 'true'
    const text = useLabels('numberInput', DEFAULT_LABELS, labels)
    const colorVars = {
      '--numberinput-color': `var(--plume-color-${colorScheme}-text)`,
      ...style,
    } as CSSProperties
    const context = useMemo(
      () => ({
        disabled,
        fieldProps,
        forwardedRef: ref,
        inputRef,
        invalid,
        isStyled,
        labels: text,
        max,
        min,
        name,
        number,
        precision,
        readOnly,
      }),
      [disabled, fieldProps, invalid, isStyled, max, min, name, number, precision, readOnly, ref, text],
    )

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
          {name && !hasPart(children, [NumberInputHidden]) ? <NumberInputHidden /> : null}
        </div>
      </NumberInputContext.Provider>
    )
  },
)

NumberInput.displayName = 'NumberInput'
