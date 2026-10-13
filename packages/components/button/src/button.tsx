import type { ButtonHTMLAttributes, CSSProperties, ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import type { ColorScheme, ComponentProps, Shape, Size } from '@plume-ui-react/core'
import { Spinner } from '@plume-ui-react/spinner'
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
  | 'aria-expanded'
  | 'aria-haspopup'
  | 'aria-label'
  | 'aria-labelledby'
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
  | 'title'
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

const generateButtonClasses = (
  variant: string,
  className: string,
  disabled: boolean,
  isBusy: boolean,
  size: Size,
  shape: Shape,
): string => {
  const disabledClass = disabled || isBusy ? styles.disabled : ''
  const shapeClass = variant !== 'unstyled' ? styles[shape] : ''
  const sizeClass = variant !== 'unstyled' ? styles[size] : ''
  const variantClass = variant !== 'unstyled' ? styles[variant] : ''
  return `${sizeClass} ${shapeClass} ${variantClass} 
    ${disabledClass} ${className}`.trim()
}

// Maps the color scheme to the palette CSS variables emitted by <ThemeProvider>.
const buttonColorVars = (colorScheme: ColorScheme): CSSProperties =>
  ({
    '--button-color': `var(--plume-color-${colorScheme}-text)`,
    '--button-contrast-color': `var(--plume-color-${colorScheme}-solid-contrast)`,
    '--button-solid-bg': `var(--plume-color-${colorScheme}-solid)`,
    '--button-solid-hover': `var(--plume-color-${colorScheme}-solid-hover)`,
    '--button-solid-active': `var(--plume-color-${colorScheme}-solid-active)`,
    '--button-hover-color': `var(--plume-color-${colorScheme}-text-hover)`,
    '--button-focus-color': `var(--plume-color-${colorScheme}-text-active)`,
    '--button-hover-alt-color': `var(--plume-color-${colorScheme}-tint)`,
    '--button-focus-alt-color': `var(--plume-color-${colorScheme}-tint-strong)`,
  }) as CSSProperties

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
    const buttonClasses = generateButtonClasses(variant, className, disabled, isBusy, size, shape)

    return (
      <button
        className={buttonClasses}
        disabled={disabled || isBusy}
        ref={ref}
        style={{ ...buttonColorVars(colorScheme), ...style }}
        type={type}
        {...rest}
      >
        {renderContent(busyText, isBusy, iconLeft, iconRight, variant === 'unstyled', label)}
        {children}
        {isBusy ? (
          <Spinner
            style={{ '--spinner-scheme': 'var(--button-contrast-color)' } as CSSProperties}
            {...(busyText && { className: styles.spinnerMargin })}
            size='sm'
          />
        ) : null}
      </button>
    )
  },
)

Button.displayName = 'Button'
