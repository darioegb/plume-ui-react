import type {
  ButtonHTMLAttributes,
  CSSProperties,
  ForwardedRef,
  ReactNode,
} from 'react'
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

type ButtonVariant = 'solid' | 'outline' | 'link' | 'icon'
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
>

export type ButtonProps = ComponentProps & ButtonRootAttributes & ButtonOwnProps

const MARGIN_STYLE = { margin: '0 .25rem' }

const createButtonStyles = (
  color: string,
  contrastColor: string,
  style?: CSSProperties,
): Record<string, unknown> => ({
  '--button-scheme': color,
  '--button-text-color': contrastColor,
  ...(style || {}),
})

const renderContent = (
  busy: boolean,
  busyText: string,
  iconLeft?: ReactNode,
  label?: string,
  iconRight?: ReactNode,
): JSX.Element => (
  <>
    {iconLeft ? <span style={MARGIN_STYLE}>{iconLeft}</span> : null}
    {Boolean(label) || busy ? (
      <span style={MARGIN_STYLE}>{busy ? busyText : label}</span>
    ) : null}
    {iconRight ? <span style={MARGIN_STYLE}>{iconRight}</span> : null}
  </>
)

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      customClasses,
      children,
      label,
      iconLeft,
      iconRight,
      customStyles,
      colorScheme,
      disabled = false,
      busy = false,
      busyText = '',
      shape = 'rounded',
      size = 'md',
      type = 'button',
      variant = 'solid',
      ...restProps
    }: ButtonProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ) => {
    const color =
      (colorScheme && getMergedConfig().colors[`${colorScheme}`]) || '#d3d3d3'
    const contrastColor = getContrastColor(color)

    const buttonClassNames = `
      ${
        customClasses ??
        `${size !== 'md' ? styles[`${size}`] : ''} ${
          shape !== 'rounded' ? styles[`${shape}`] : ''
        } ${styles[`${variant}`]}`
      }
    `.trim()

    return (
      <button
        className={buttonClassNames}
        disabled={disabled || busy}
        ref={ref}
        style={createButtonStyles(color, contrastColor, customStyles)}
        type={type}
        {...restProps}
      >
        {renderContent(busy, busyText, iconLeft, label, iconRight)}
        {children}
        {busy ? <Spinner borderColor={contrastColor} size="sm" /> : null}
      </button>
    )
  },
)

Button.displayName = 'Button'