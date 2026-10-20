'use client'

import type {
  ChangeEvent,
  CSSProperties,
  ForwardedRef,
  InputHTMLAttributes,
  MouseEvent,
} from 'react'
import { forwardRef } from 'react'
import type { ColorScheme, ComponentProps, Size } from '../../../theme'
import styles from './toggle.module.css'

export interface ToggleOwnProps {
  colorScheme?: ColorScheme
  readOnly?: boolean
  size?: Size
  variant?: ToggleVariant
}

export type ToggleVariant = 'solid' | 'outline' | 'raised' | 'unstyled'

type ToggleRootAttributes = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  | 'aria-describedby'
  | 'aria-invalid'
  | 'aria-label'
  | 'aria-labelledby'
  | 'checked'
  | 'children'
  | 'defaultChecked'
  | 'disabled'
  | 'id'
  | 'name'
  | 'onBlur'
  | 'onChange'
  | 'onFocus'
  | 'required'
  | 'value'
>

export type ToggleProps = Omit<ComponentProps, 'index'> & ToggleRootAttributes & ToggleOwnProps

const toggleColorVars = (colorScheme: ColorScheme, style?: CSSProperties): CSSProperties =>
  ({
    '--toggle-solid': `var(--plume-color-${colorScheme}-solid)`,
    '--toggle-contrast': `var(--plume-color-${colorScheme}-solid-contrast)`,
    '--toggle-text': `var(--plume-color-${colorScheme}-text)`,
    ...style,
  }) as CSSProperties

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      children,
      className = '',
      colorScheme = 'primary',
      disabled = false,
      onChange,
      readOnly = false,
      size = 'md',
      style,
      variant = 'solid',
      ...rest
    }: ToggleProps,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const isStyled = variant !== 'unstyled'
    const isInvalid = rest['aria-invalid'] === true || rest['aria-invalid'] === 'true'
    const rootClasses = [
      isStyled && styles.root,
      isStyled && styles[size],
      disabled && styles.disabled,
      className,
    ]
      .filter(Boolean)
      .join(' ')
    const inputClasses = isStyled
      ? [styles.toggle, styles[variant], isInvalid && styles.invalid].filter(Boolean).join(' ')
      : undefined

    const preventWhenReadOnly = (event: MouseEvent<HTMLInputElement>): void => {
      if (readOnly) event.preventDefault()
    }

    const ignoreWhenReadOnly = (event: ChangeEvent<HTMLInputElement>): void => {
      if (!readOnly) onChange?.(event)
    }

    return (
      <label
        className={rootClasses}
        style={toggleColorVars(isInvalid ? 'error' : colorScheme, style)}
      >
        <input
          aria-readonly={readOnly || undefined}
          className={inputClasses}
          disabled={disabled}
          onChange={onChange ? ignoreWhenReadOnly : undefined}
          onClick={preventWhenReadOnly}
          ref={ref}
          role="switch"
          type="checkbox"
          {...rest}
        />
        {children ? <span className={isStyled ? styles.label : undefined}>{children}</span> : null}
      </label>
    )
  },
)

Toggle.displayName = 'Toggle'
