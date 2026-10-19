import type { CSSProperties, InputHTMLAttributes, ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import type { ColorScheme, ComponentProps, Shape, Size } from '@plume-ui-react/core'
import { useMask } from '@plume-ui-react/use-mask'
import styles from './input.module.css'

export interface InputOwnProps {
  addonBefore?: ReactNode
  addonAfter?: ReactNode
  elementBefore?: ReactNode
  elementAfter?: ReactNode
  colorScheme?: ColorScheme
  mask?: string
  shape?: Shape
  size?: Size
  variant?: InputVariant
}

type InputRootAttributes = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  | 'defaultValue'
  | 'disabled'
  | 'id'
  | 'inputMode'
  | 'max'
  | 'maxLength'
  | 'min'
  | 'minLength'
  | 'name'
  | 'onBlur'
  | 'onChange'
  | 'pattern'
  | 'placeholder'
  | 'readOnly'
  | 'required'
  | 'type'
  | 'value'
>

export type InputVariant = 'outline' | 'filled' | 'underline' | 'unstyled'
export type InputProps = ComponentProps & InputRootAttributes & InputOwnProps

const generateInputClasses = (
  className: string,
  disabled: boolean,
  isStyled: boolean,
  shape: Shape,
  size: Size,
  variant: string,
): string => {
  const disabledClass = disabled ? styles.disabled : ''
  const shapeClass = isStyled ? styles[shape] : ''
  const sizeClass = isStyled ? styles[size] : ''
  const variantClass = isStyled ? styles[variant] : ''
  return `${styles.base} ${sizeClass} ${shapeClass} ${variantClass}
      ${disabledClass} ${className}`.trim()
}

const inputColorVars = (colorScheme: ColorScheme): CSSProperties =>
  ({
    '--input-color': `var(--plume-color-${colorScheme}-text)`,
  }) as CSSProperties

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      addonBefore,
      addonAfter,
      elementBefore,
      elementAfter,
      style,
      className = '',
      colorScheme = 'secondary',
      disabled = false,
      readOnly = false,
      shape = 'rounded',
      size = 'md',
      type = 'text',
      variant = 'outline',
      mask,
      value,
      defaultValue,
      onChange,
      ...rest
    }: InputProps,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const isStyled = variant !== 'unstyled'
    const inputClasses = generateInputClasses(className, disabled, isStyled, shape, size, variant)
    const inputStyle = { ...inputColorVars(colorScheme), ...style }
    const hasInputGroup = addonBefore || addonAfter || elementBefore || elementAfter
    const { value: maskedValue, onChange: maskedOnChange } = useMask({
      mask,
      value: typeof value === 'string' ? value : undefined,
      defaultValue: typeof defaultValue === 'string' ? defaultValue : undefined,
      onChange,
    })
    const valueProps = {
      onChange: maskedOnChange,
      value: mask ? maskedValue : value,
      defaultValue: mask ? undefined : defaultValue,
    }

    if (!hasInputGroup) {
      return (
        <input
          className={inputClasses}
          disabled={disabled}
          readOnly={readOnly}
          ref={ref}
          style={inputStyle}
          type={type}
          {...valueProps}
          {...rest}
        />
      )
    }

    return (
      <div
        className={isStyled ? styles.inputGroup : ''}
        style={inputStyle}
      >
        {addonBefore ? <span className={isStyled ? styles.addOn : ''}>{addonBefore}</span> : null}
        {elementBefore ? (
          <span className={isStyled ? styles.element : ''}>{elementBefore}</span>
        ) : null}
        <input
          className={inputClasses}
          disabled={disabled}
          readOnly={readOnly}
          ref={ref}
          type={type}
          {...valueProps}
          {...rest}
        />
        {addonAfter ? <span className={isStyled ? styles.addOn : ''}>{addonAfter}</span> : null}
        {elementAfter ? (
          <span className={isStyled ? styles.element : ''}>{elementAfter}</span>
        ) : null}
      </div>
    )
  },
)

Input.displayName = 'Input'
