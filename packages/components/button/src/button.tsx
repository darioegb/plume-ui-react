import type { ButtonHTMLAttributes, CSSProperties, ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import type {
  DefaultColorPalette,
  CustomColorPalette,
  ComponentProps,
  Size,
} from '@plume-ui-react/core'
import { getMergedConfig } from '@plume-ui-react/core'
import { Spinner } from '@plume-ui-react/spinner'
import { getContrastColor } from '@plume-ui-react/color-utils'
import styles from './button.module.css'

export interface ButtonOwnProps {
  busyText?: string
  colorScheme?: DefaultColorPalette | keyof CustomColorPalette
  iconLeft?: ReactNode
  iconRight?: ReactNode
  isBusy?: boolean
  label?: string
  shape?: ButtonShape
  size?: Size
  variant?: ButtonVariant
}

type ButtonVariant = 'solid' | 'outline' | 'link' | 'icon' | 'unstyled'
type ButtonShape = 'pill' | 'rounded'
type ButtonRootAttributes = Pick<
  ButtonHTMLAttributes<HTMLButtonElement>,
  | 'children'
  | 'disabled'
  | 'hidden'
  | 'id'
  | 'onBlur'
  | 'onClick'
  | 'onFocus'
  | 'tabIndex'
  | 'type'
  | 'role'
>

export type ButtonProps = ComponentProps & ButtonRootAttributes & ButtonOwnProps

const createButtonStyles = (
  color: string,
  contrastColor: string,
  style?: CSSProperties,
): Record<string, unknown> => ({
  '--button-scheme': color,
  '--button-text-color': contrastColor,
  ...(style ?? {}),
})

const renderContent = (
  isBusy: boolean,
  busyText: string,
  iconLeft?: ReactNode,
  label?: string,
  iconRight?: ReactNode,
  isUnstyled?: boolean,
): JSX.Element => {
  const iconMarginClass = isUnstyled ? styles.iconMarginNone : styles.iconMargin
  const contentClass = isBusy && !busyText ? styles.hidden : iconMarginClass

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

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      label,
      iconLeft,
      iconRight,
      customStyles,
      colorScheme,
      busyText = '',
      customClasses = '',
      disabled = false,
      isBusy = false,
      type = 'button',
      variant = 'solid',
      ...rest
    }: ButtonProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ) => {
    const { size = variant !== 'unstyled' && 'md', shape = variant !== 'unstyled' && 'rounded' } =
      rest
    const color = (colorScheme && getMergedConfig().colors[colorScheme]) || '#d3d3d3'
    const contrastColor = getContrastColor(color)
    const sizeClass = size && (size !== 'md' || variant === 'unstyled') ? styles[size] : ''
    const shapeClass = shape && (shape !== 'rounded' || variant === 'unstyled') ? styles[shape] : ''
    const variantClass = variant !== 'unstyled' ? styles[variant] : ''
    const disabledClass = disabled || isBusy ? styles.disabled : ''
    const buttonClassNames = `${sizeClass} ${shapeClass} ${variantClass} 
    ${disabledClass} ${customClasses}`.trim()

    return (
      <button
        className={buttonClassNames}
        disabled={disabled || isBusy}
        ref={ref}
        style={createButtonStyles(color, contrastColor, customStyles)}
        type={type}
        {...rest}
      >
        {renderContent(isBusy, busyText, iconLeft, label, iconRight, variant === 'unstyled')}
        {children}
        {isBusy ? (
          <Spinner
            colorScheme={contrastColor !== '#ffffff' ? 'dark' : 'light'}
            {...(busyText && { customClasses: styles.spinnerMargin })}
            size="sm"
          />
        ) : null}
      </button>
    )
  },
)

Button.displayName = 'Button'
