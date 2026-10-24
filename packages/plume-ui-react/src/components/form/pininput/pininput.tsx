'use client'

import type { CSSProperties, ForwardedRef, InputHTMLAttributes, ReactNode } from 'react'
import { forwardRef, useMemo } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { useLabels } from '../../../locale/locale-provider'
import type { ColorScheme, ComponentProps, Shape, Size } from '../../../theme'
import { useFieldContext } from '../field/field-context'
import { PinInputCell } from './pininput-cell'
import { PinInputContext } from './pininput-context'
import { PinInputHidden } from './pininput-hidden'
import type { PinInputType } from './pin-utils'
import styles from './pininput.module.css'
import { usePinInput } from './use-pin-input'

export interface PinInputLabels {
  input: (index: number, length: number) => string
}

export type PinInputVariant = 'outline' | 'filled' | 'underline' | 'unstyled'

export interface PinInputOwnProps {
  autoComplete?: string
  children?: ReactNode
  focusOnMount?: boolean
  colorScheme?: ColorScheme
  defaultValue?: string
  labels?: Partial<PinInputLabels>
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

const defaultLabels = (type: PinInputType): PinInputLabels => ({
  input: (index, length) => `${type === 'numeric' ? 'Digit' : 'Character'} ${index} of ${length}`,
})

export const PinInput = forwardRef<HTMLFieldSetElement, PinInputProps>(
  (
    {
      'aria-describedby': describedBy,
      'aria-invalid': ariaInvalid,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      autoComplete = 'one-time-code',
      children,
      focusOnMount = false,
      className,
      colorScheme = 'secondary',
      defaultValue,
      disabled = false,
      labels,
      id,
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
    const defaults = useMemo(() => defaultLabels(type), [type])
    const text = useLabels('pinInput', defaults, labels)
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
    const context = useMemo(
      () => ({
        autoComplete,
        disabled,
        id,
        invalid,
        isStyled,
        labels: text,
        length,
        mask,
        name,
        pin,
        placeholder,
        readOnly,
        required,
        type,
      }),
      [
        autoComplete,
        disabled,
        id,
        invalid,
        isStyled,
        length,
        mask,
        name,
        pin,
        placeholder,
        readOnly,
        required,
        text,
        type,
      ],
    )

    return (
      <PinInputContext.Provider value={context}>
        <fieldset
          aria-describedby={describedBy}
          aria-label={ariaLabel}
          aria-labelledby={labelledBy}
          className={classes}
          data-disabled={disabled ? '' : undefined}
          data-invalid={invalid ? '' : undefined}
          data-plume-pininput=""
          disabled={disabled}
          ref={ref}
          style={colorVars}
          {...rest}
        >
          {children ?? (
            <>
              {[...new Array(length).keys()].map((index) => (
                <PinInputCell index={index} key={index} />
              ))}
              {name ? <PinInputHidden /> : null}
            </>
          )}
        </fieldset>
      </PinInputContext.Provider>
    )
  },
)

PinInput.displayName = 'PinInput'
