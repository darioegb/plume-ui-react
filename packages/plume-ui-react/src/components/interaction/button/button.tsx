'use client'

import type {
  ButtonHTMLAttributes,
  CSSProperties,
  ForwardedRef,
  MouseEvent,
  ReactNode,
} from 'react'
import { forwardRef } from 'react'
import { useLabels } from '../../../locale/locale-provider'
import type { ColorScheme, ComponentProps, Shape, Size } from '../../../theme'
import { Spinner } from '../../presentation/spinner'
import styles from './button.module.css'

export interface ButtonLabels {
  busy: string
}

export interface ButtonOwnProps {
  /**
   * Text shown instead of the label while `isBusy` is set.
   *
   * @default ''
   */
  busyText?: string
  /**
   * Color scheme from the theme palette, including custom schemes added to it.
   *
   * @default 'secondary'
   */
  colorScheme?: ColorScheme
  /** Icon to be displayed on the left side of the Button. */
  iconLeft?: ReactNode
  /** Icon to be displayed on the right side of the Button. */
  iconRight?: ReactNode
  /**
   * Shows a spinner and makes the Button ignore its clicks, so it keeps the focus. It is announced
   * as busy and disabled. Without `busyText` the label is hidden while busy, but still names the
   * Button.
   *
   * @default false
   */
  isBusy?: boolean
  /** Text of the Button. When `children` are also set, they render after the label. */
  label?: string
  /**
   * The texts the Button adds, to translate them: `busy` is the accessible name of the spinner
   * shown while `isBusy` is set.
   */
  labels?: Partial<ButtonLabels>
  /**
   * Shape style of the Button.
   *
   * @default 'rounded'
   */
  shape?: Shape
  /**
   * Size of the Button.
   *
   * @default 'md'
   */
  size?: Size
  /**
   * Visual style variant of the Button.
   *
   * @default 'solid'
   */
  variant?: ButtonVariant
}

type ButtonVariant = 'solid' | 'outline' | 'link' | 'icon' | 'ghost' | 'unstyled'
type ButtonRootAttributes = Pick<
  ButtonHTMLAttributes<HTMLButtonElement>,
  | 'aria-current'
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
  | 'onKeyDown'
  | 'onMouseEnter'
  | 'role'
  | 'tabIndex'
  | 'title'
  | 'type'
>

export type ButtonProps = ComponentProps & ButtonRootAttributes & ButtonOwnProps

const DEFAULT_LABELS: ButtonLabels = { busy: 'Loading' }

const ignoreClick = (event: MouseEvent<HTMLButtonElement>): void => {
  event.preventDefault()
  event.stopPropagation()
  // stopPropagation only blocks React handlers; the native one stops any DOM listener too.
  event.nativeEvent.stopImmediatePropagation()
}

const renderContent = (
  busyText: string,
  isBusy: boolean,
  iconLeft?: ReactNode,
  iconRight?: ReactNode,
  isUnstyled?: boolean,
  label?: string,
): ReactNode => {
  const iconMarginClass = isUnstyled ? styles.iconMarginNone : styles.iconMargin
  const contentClass = isBusy && !busyText ? styles.hidden : iconMarginClass
  const text = isBusy && busyText ? busyText : label

  return (
    <>
      {iconLeft ? <span className={iconMarginClass}>{iconLeft}</span> : null}
      {text ? <span className={contentClass}>{text}</span> : null}
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
    '--button-tint-text': `var(--plume-color-${colorScheme}-tint-text)`,
  }) as CSSProperties

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      iconLeft,
      iconRight,
      label,
      labels,
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
    const text = useLabels('button', DEFAULT_LABELS, labels)
    const buttonClasses = generateButtonClasses(variant, className, disabled, isBusy, size, shape)

    return (
      <button
        aria-busy={isBusy || undefined}
        aria-disabled={isBusy && !disabled ? true : undefined}
        className={buttonClasses}
        disabled={disabled}
        ref={ref}
        style={{ ...buttonColorVars(colorScheme), ...style }}
        type={type}
        {...rest}
        onClick={isBusy ? ignoreClick : rest.onClick}
      >
        {renderContent(busyText, isBusy, iconLeft, iconRight, variant === 'unstyled', label)}
        {children}
        {isBusy ? (
          <Spinner
            aria-label={text.busy}
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
