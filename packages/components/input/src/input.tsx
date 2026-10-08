import type { InputHTMLAttributes, ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import type { ColorScheme, ComponentProps, Shape, Size } from '@plume-ui-react/core'
import { createStyles, getColorFromTheme } from '@plume-ui-react/core'
import { getLightenColor } from '@plume-ui-react/color-utils'
import styles from './input.module.css'

export interface InputOwnProps {
  addonBefore?: ReactNode
  addonAfter?: ReactNode
  elementBefore?: ReactNode
  elementAfter?: ReactNode
  colorScheme?: ColorScheme
  errorMessage?: string
  isRequired?: boolean
  shape?: Shape
  size?: Size
  variant?: InputVariant
}

type InputRootAttributes = Pick<
  InputHTMLAttributes<HTMLInputElement>,
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

const generateInputAttributes = (
  className: string,
  disabled: boolean,
  isStyled: boolean,
  shape: Shape,
  size: Size,
  variant: string,
  colorScheme: ColorScheme,
): Record<string, string> => {
  const color = getColorFromTheme(colorScheme)
  const hoverColor = getLightenColor(color, 70)
  const disabledClass = disabled ? styles.disabled : ''
  const shapeClass = isStyled ? styles[shape] : ''
  const sizeClass = isStyled ? styles[size] : ''
  const variantClass = isStyled ? styles[variant] : ''
  const inputClasses = `${sizeClass} ${shapeClass} ${variantClass} 
      ${disabledClass} ${className}`.trim()

  return { color, hoverColor, inputClasses }
}

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
      ...rest
    }: InputProps,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const isStyled = variant !== 'unstyled'
    const { color, hoverColor, inputClasses } = generateInputAttributes(
      className,
      disabled,
      isStyled,
      shape,
      size,
      variant,
      colorScheme,
    )
    const hasInputGroup = addonBefore || addonAfter || elementBefore || elementAfter

    if (!hasInputGroup) {
      return (
        <input
          className={inputClasses}
          disabled={disabled}
          readOnly={readOnly}
          ref={ref}
          style={createStyles({ color, hoverColor, prefix: 'input', style })}
          type={type}
          {...rest}
        />
      )
    }

    return (
      <div
        className={isStyled ? styles.inputGroup : ''}
        style={createStyles({ color, hoverColor, prefix: 'input', style })}
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
