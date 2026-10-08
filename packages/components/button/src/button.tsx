import type { ButtonHTMLAttributes, ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import type { ColorScheme, ComponentProps, Shape, Size } from '@plume-ui-react/core'
import { createStyles, getColorFromTheme, getColorWithShadeFromTheme } from '@plume-ui-react/core'
import { Spinner } from '@plume-ui-react/spinner'
import { getContrastColor } from '@plume-ui-react/color-utils'
import styles from './button.module.css'

export interface ButtonOwnProps {
  busyText?: string
  colorScheme?: ColorScheme
  iconLeft?: ReactNode
  iconRight?: ReactNode
  isBusy?: boolean
  label?: string
  shape?: Shape
  size?: Size
  variant?: ButtonVariant
}

type ButtonVariant = 'solid' | 'outline' | 'link' | 'icon' | 'ghost' | 'unstyled'
type ButtonRootAttributes = Pick<
  ButtonHTMLAttributes<HTMLButtonElement>,
  | 'children'
  | 'disabled'
  | 'hidden'
  | 'id'
  | 'onBlur'
  | 'onClick'
  | 'onFocus'
  | 'onMouseEnter'
  | 'role'
  | 'tabIndex'
  | 'type'
>

export type ButtonProps = ComponentProps & ButtonRootAttributes & ButtonOwnProps

const renderContent = (
  busyText: string,
  isBusy: boolean,
  iconLeft?: ReactNode,
  iconRight?: ReactNode,
  isUnstyled?: boolean,
  label?: string,
): ReactNode => {
  const iconMarginClass = isUnstyled ? styles.iconMarginNone : styles.iconMargin
  const contentClass = isBusy && busyText.length < 1 ? styles.hidden : iconMarginClass

  return (
    <>
      {iconLeft ? <span className={iconMarginClass}>{iconLeft}</span> : null}
      {Boolean(label) || busyText ? (
        <span className={contentClass}>{busyText || label}</span>
      ) : null}
      {iconRight ? <span className={iconMarginClass}>{iconRight}</span> : null}
    </>
  )
}

const generateButtonAttributes = (
  variant: string,
  className: string,
  colorScheme: ColorScheme,
  disabled: boolean,
  isBusy: boolean,
  size: Size,
  shape: Shape,
): Record<string, string> => {
  const color = getColorFromTheme(colorScheme)
  const contrastColor = getContrastColor(color)
  const hoverColor = getColorWithShadeFromTheme(colorScheme, 600)
  const focusColor = getColorWithShadeFromTheme(colorScheme, 700)
  const hoverAltColor = getColorWithShadeFromTheme(colorScheme, 100)
  const focusAltColor = getColorWithShadeFromTheme(colorScheme, 200)
  const disabledClass = disabled || isBusy ? styles.disabled : ''
  const shapeClass = variant !== 'unstyled' ? styles[shape] : ''
  const sizeClass = variant !== 'unstyled' ? styles[size] : ''
  const variantClass = variant !== 'unstyled' ? styles[variant] : ''
  const buttonClasses = `${sizeClass} ${shapeClass} ${variantClass} 
    ${disabledClass} ${className}`.trim()

  return {
    color,
    contrastColor,
    hoverColor,
    focusColor,
    hoverAltColor,
    focusAltColor,
    buttonClasses,
  }
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      iconLeft,
      iconRight,
      label,
      style,
      busyText = '',
      className = '',
      colorScheme ='secondary',
      disabled = false,
      isBusy = false,
      shape = 'rounded',
      size = 'md',
      type = 'button',
      variant = 'solid',
      ...rest
    }: ButtonProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ) => {
    const {
      color,
      contrastColor,
      hoverColor,
      focusColor,
      hoverAltColor,
      focusAltColor,
      buttonClasses,
    } = generateButtonAttributes(variant, className, colorScheme, disabled, isBusy, size, shape)

    return (
      <button
        className={buttonClasses}
        disabled={disabled || isBusy}
        ref={ref}
        style={createStyles({
          color,
          contrastColor,
          hoverColor,
          focusColor,
          hoverAltColor,
          focusAltColor,
          style,
          prefix: 'button',
        })}
        type={type}
        {...rest}
      >
        {renderContent(busyText, isBusy, iconLeft, iconRight, variant === 'unstyled', label)}
        {children}
        {isBusy ? (
          <Spinner
            color={contrastColor !== '#ffffff' ? `${colorScheme}.900` : `${colorScheme}.50`}
            {...(busyText && { className: styles.spinnerMargin })}
            size='sm'
          />
        ) : null}
      </button>
    )
  },
)

Button.displayName = 'Button'
