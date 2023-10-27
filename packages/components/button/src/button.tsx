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
  busy?: boolean
  busyText?: string
  colorScheme?: DefaultColorPalette | keyof CustomColorPalette
  iconLeft?: ReactNode
  iconRight?: ReactNode
  label?: string
  shape?: ButtonShape
  size?: Size
  variant?: ButtonVariant
}

type ButtonVariant = 'solid' | 'outline' | 'link' | 'icon' | 'unstyled'
type ButtonShape = 'pill' | 'rounded'
type ButtonRootAttributes = Pick<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'disabled' | 'hidden' | 'id' | 'onBlur' | 'onClick' | 'onFocus' | 'tabIndex' | 'type'
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
  busy: boolean,
  busyText: string,
  iconLeft?: ReactNode,
  label?: string,
  iconRight?: ReactNode,
): JSX.Element => (
  <>
    {iconLeft ? <span className={styles.iconMargin}>{iconLeft}</span> : null}
    {Boolean(label) || busyText ? (
      <span className={busy && !busyText ? styles.hidden : styles.iconMargin}>
        {busyText || label}
      </span>
    ) : null}
    {iconRight ? <span className={styles.iconMargin}>{iconRight}</span> : null}
  </>
)

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      label,
      iconLeft,
      iconRight,
      customStyles,
      colorScheme,
      busy = false,
      busyText = '',
      customClasses = '',
      disabled = false,
      type = 'button',
      variant = 'solid',
      ...props
    }: ButtonProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ) => {
    const {
      size = variant !== 'unstyled' && 'md',
      shape = variant !== 'unstyled' && 'rounded',
    } = props
    const color = (colorScheme && getMergedConfig().colors[`${colorScheme}`]) || '#d3d3d3'
    const contrastColor = getContrastColor(color)
    const sizeClass = size && (size !== 'md' || variant === 'unstyled') ? styles[size] : ''
    const shapeClass = shape && (shape !== 'rounded' || variant === 'unstyled') ? styles[shape] : ''
    const variantClass = variant !== 'unstyled' ? styles[variant] : ''
    const buttonClassNames = `${sizeClass} ${shapeClass} ${variantClass} ${customClasses}`.trim()

    return (
      <button
        className={buttonClassNames}
        disabled={disabled || busy}
        ref={ref}
        style={createButtonStyles(color, contrastColor, customStyles)}
        type={type}
        {...props}
      >
        {renderContent(busy, busyText, iconLeft, label, iconRight)}
        {children}
        {busy ? (
          <Spinner
            borderColor={contrastColor}
            {...(busyText && { customClasses: styles.spinnerMargin })}
            size="sm"
          />
        ) : null}
      </button>
    )
  },
)

Button.displayName = 'Button'
