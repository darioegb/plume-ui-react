'use client'

import type {
  ButtonHTMLAttributes,
  CSSProperties,
  ElementType,
  ForwardedRef,
  MouseEvent,
  ReactNode,
} from 'react'
import { forwardRef, useMemo } from 'react'
import { useLabels } from '../../../locale/locale-provider'
import { joinClasses } from '../../../overlay/class-names'
import { hasPart } from '../../../overlay/has-part'
import type { ColorScheme, ComponentProps, Shape, Size } from '../../../theme'
import { ButtonContext, type ButtonLabels } from './button-context'
import { ButtonIcon } from './button-icon'
import { ButtonLabel } from './button-label'
import { ButtonSpinner } from './button-spinner'
import styles from './button.module.css'

export type { ButtonLabels } from './button-context'

export interface ButtonOwnProps {
  /**
   * Text shown instead of the label while `busy` is set.
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
  busy?: boolean
  /**
   * Text of the Button. When `children` are also set, they render after the label, unless they
   * hold Button parts (`ButtonIcon`, `ButtonLabel`, `ButtonSpinner`): then they replace the default
   * composition.
   */
  label?: string
  /**
   * The texts the Button adds, to translate them: `busy` is the accessible name of the spinner
   * shown while `busy` is set.
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

export type ButtonVariant = 'solid' | 'outline' | 'link' | 'icon' | 'ghost' | 'unstyled'
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

export type ButtonProps = Omit<ComponentProps, 'index'> & ButtonRootAttributes & ButtonOwnProps

const DEFAULT_LABELS: ButtonLabels = { busy: 'Loading' }

const ignoreClick = (event: MouseEvent<HTMLButtonElement>): void => {
  event.preventDefault()
  event.stopPropagation()
  // stopPropagation only blocks React handlers; the native one stops any DOM listener too.
  event.nativeEvent.stopImmediatePropagation()
}

const BUTTON_PARTS: readonly ElementType[] = [ButtonIcon, ButtonLabel, ButtonSpinner]

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

function buttonContent(
  children: ReactNode,
  { iconLeft, iconRight, label }: Pick<ButtonOwnProps, 'iconLeft' | 'iconRight' | 'label'>,
): ReactNode {
  if (hasPart(children, BUTTON_PARTS)) return children
  return (
    <>
      {iconLeft ? <ButtonIcon>{iconLeft}</ButtonIcon> : null}
      {label ? <ButtonLabel>{label}</ButtonLabel> : null}
      {iconRight ? <ButtonIcon>{iconRight}</ButtonIcon> : null}
      {children}
      <ButtonSpinner />
    </>
  )
}

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
      colorScheme = 'secondary',
      disabled = false,
      busy: isBusy = false,
      shape = 'rounded',
      size = 'md',
      type = 'button',
      variant = 'solid',
      ...rest
    }: ButtonProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ) => {
    const text = useLabels('button', DEFAULT_LABELS, labels)
    const isStyled = variant !== 'unstyled'
    const context = useMemo(
      () => ({ busy: isBusy, busyText, isStyled, labels: text }),
      [busyText, isBusy, isStyled, text],
    )
    const classes = joinClasses(
      isStyled && styles[size],
      isStyled && styles[shape],
      isStyled && styles[variant],
      isStyled && (disabled || isBusy) && styles.disabled,
      className,
    )

    return (
      <ButtonContext.Provider value={context}>
        <button
          aria-busy={isBusy || undefined}
          aria-disabled={isBusy && !disabled ? true : undefined}
          className={classes}
          data-busy={isBusy ? '' : undefined}
          data-disabled={disabled || isBusy ? '' : undefined}
          data-plume-button=""
          disabled={disabled}
          ref={ref}
          style={{ ...buttonColorVars(colorScheme), ...style }}
          type={type}
          {...rest}
          onClick={isBusy ? ignoreClick : rest.onClick}
        >
          {buttonContent(children, { iconLeft, iconRight, label })}
        </button>
      </ButtonContext.Provider>
    )
  },
)

Button.displayName = 'Button'
