import type { CSSProperties, InputHTMLAttributes, ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import type { ColorScheme, ComponentProps, Shape, Size } from '../../../theme'
import { useMask } from '../../../hooks/use-mask'
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
  | 'aria-describedby'
  | 'aria-invalid'
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
  isInvalid: boolean,
  isStyled: boolean,
  shape: Shape,
  size: Size,
  variant: string,
): string => {
  const disabledClass = disabled ? styles.disabled : ''
  const invalidClass = isInvalid && isStyled ? styles.invalid : ''
  const shapeClass = isStyled ? styles[shape] : ''
  const sizeClass = isStyled ? styles[size] : ''
  const variantClass = isStyled ? styles[variant] : ''
  return `${styles.base} ${sizeClass} ${shapeClass} ${variantClass}
      ${disabledClass} ${invalidClass} ${className}`.trim()
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
    const isInvalid = rest['aria-invalid'] === true || rest['aria-invalid'] === 'true'
    const inputClasses = generateInputClasses(
      className,
      disabled,
      isInvalid,
      isStyled,
      shape,
      size,
      variant,
    )
    const inputStyle = { ...inputColorVars(isInvalid ? 'error' : colorScheme), ...style }
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
