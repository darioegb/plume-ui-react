'use client'

import type { CSSProperties, ForwardedRef, InputHTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import type { ColorScheme, ComponentProps, Shape, Size } from '../../../theme'
import { useFieldContext } from '../field/field-context'
import type { PinInputType } from './pin-utils'
import styles from './pininput.module.css'
import { usePinInput } from './use-pin-input'

export type PinInputVariant = 'outline' | 'filled' | 'underline' | 'unstyled'

export interface PinInputOwnProps {
  autoComplete?: string
  focusOnMount?: boolean
  colorScheme?: ColorScheme
  defaultValue?: string
  getInputLabel?: (index: number, length: number) => string
  inputClassName?: string
  length?: number
  mask?: boolean
  name?: string
  onComplete?: (value: string) => void
  onValueChange?: (value: string) => void
  placeholder?: string
  shape?: Shape
  size?: Size
  type?: PinInputType
  value?: string
  variant?: PinInputVariant
}

type PinInputRootAttributes = Pick<
  InputHTMLAttributes<HTMLFieldSetElement>,
  | 'aria-describedby'
  | 'aria-invalid'
  | 'aria-label'
  | 'aria-labelledby'
  | 'disabled'
  | 'hidden'
  | 'id'
  | 'readOnly'
  | 'required'
  | 'title'
>

export type PinInputProps = Omit<ComponentProps, 'index'> &
  PinInputRootAttributes &
  PinInputOwnProps

const defaultLabel =
  (type: PinInputType) =>
  (index: number, length: number): string =>
    `${type === 'numeric' ? 'Digit' : 'Character'} ${index} of ${length}`

export const PinInput = forwardRef<HTMLFieldSetElement, PinInputProps>(
  (
    {
      'aria-describedby': describedBy,
      'aria-invalid': ariaInvalid,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      autoComplete = 'one-time-code',
      focusOnMount = false,
      className,
      colorScheme = 'secondary',
      defaultValue,
      disabled = false,
      getInputLabel,
      id,
      inputClassName,
      length = 6,
      mask = false,
      name,
      onComplete,
      onValueChange,
      placeholder,
      readOnly = false,
      required = false,
      shape = 'rounded',
      size = 'md',
      style,
      type = 'numeric',
      value,
      variant = 'outline',
      ...rest
    }: PinInputProps,
    ref: ForwardedRef<HTMLFieldSetElement>,
  ): ReactNode => {
    const field = useFieldContext()
    const pin = usePinInput({
      focusOnMount,
      defaultValue,
      length,
      onComplete,
      onValueChange,
      readOnly,
      type,
      value,
    })
    const isStyled = variant !== 'unstyled'
    const invalid = ariaInvalid === true || ariaInvalid === 'true'
    const fieldLabel = field?.controlId === id ? field?.labelId : undefined
    const labelledBy = ariaLabelledby ?? (ariaLabel ? undefined : fieldLabel)
    const label = getInputLabel ?? defaultLabel(type)
    const colorVars = {
      '--pininput-color': `var(--plume-color-${invalid ? 'error' : colorScheme}-text)`,
      ...style,
    } as CSSProperties
    const classes = joinClasses(
      isStyled && styles.pin,
      isStyled && styles[variant],
      isStyled && styles[size],
      isStyled && styles[shape],
      isStyled && invalid && styles.invalid,
      className,
    )

    return (
      <fieldset
        aria-describedby={describedBy}
        aria-label={ariaLabel}
        aria-labelledby={labelledBy}
        className={classes}
        data-plume-pininput=""
        disabled={disabled}
        ref={ref}
        style={colorVars}
        {...rest}
      >
        {[...new Array(length).keys()].map((index) => (
          <input
            aria-invalid={invalid || undefined}
            aria-label={label(index + 1, length)}
            aria-required={required || undefined}
            autoComplete={autoComplete}
            className={joinClasses(isStyled && styles.cell, inputClassName)}
            data-filled={pin.value[index] ? '' : undefined}
            data-plume-pininput-cell=""
            disabled={disabled}
            id={index === 0 ? id : undefined}
            inputMode={type === 'numeric' ? 'numeric' : 'text'}
            key={index}
            onChange={(event) => pin.onChange(index, event.target.value)}
            onFocus={(event) => event.target.select()}
            onKeyDown={(event) => pin.onKeyDown(index, event)}
            onPaste={(event) => pin.onPaste(index, event)}
            placeholder={placeholder}
            readOnly={readOnly}
            ref={(element) => {
              pin.cells.current[index] = element
            }}
            tabIndex={index === pin.tabbable ? 0 : -1}
            type={mask ? 'password' : 'text'}
            value={pin.value[index] ?? ''}
          />
        ))}
        {name ? <input name={name} type="hidden" value={pin.value} /> : null}
      </fieldset>
    )
  },
)

PinInput.displayName = 'PinInput'
