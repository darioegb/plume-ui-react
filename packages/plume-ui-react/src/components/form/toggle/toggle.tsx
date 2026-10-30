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
import { joinClasses } from '../../../overlay/class-names'
import styles from './toggle.module.css'

export interface ToggleOwnProps {
  /**
   * Color scheme from the theme palette, custom schemes included.
   * @default 'primary'
   */
  colorScheme?: ColorScheme
  /**
   * Shows the state without letting the user change it. It also silences `onChange`.
   * @default false
   */
  readOnly?: boolean
  /**
   * Size of the toggle.
   * @default 'md'
   */
  size?: Size
  /**
   * Visual variant. `solid` fills the track when on, `outline` only colors its border and thumb,
   * and `raised` floats a bigger thumb with a shadow over a thin track. `unstyled` leaves the
   * native switch so you can bring your own styles.
   * @default 'solid'
   */
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
      className,
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

    const preventWhenReadOnly = (event: MouseEvent<HTMLInputElement>): void => {
      if (readOnly) event.preventDefault()
    }

    const ignoreWhenReadOnly = (event: ChangeEvent<HTMLInputElement>): void => {
      if (!readOnly) onChange?.(event)
    }

    return (
      <input
        aria-readonly={readOnly || undefined}
        className={joinClasses(
          isStyled && styles.toggle,
          isStyled && styles[size],
          isStyled && styles[variant],
          isStyled && isInvalid && styles.invalid,
          className,
        )}
        data-disabled={disabled ? '' : undefined}
        data-invalid={isInvalid ? '' : undefined}
        data-plume-toggle=""
        data-readonly={readOnly ? '' : undefined}
        disabled={disabled}
        onChange={onChange ? ignoreWhenReadOnly : undefined}
        onClick={preventWhenReadOnly}
        ref={ref}
        role="switch"
        style={toggleColorVars(isInvalid ? 'error' : colorScheme, style)}
        type="checkbox"
        {...rest}
      />
    )
  },
)

Toggle.displayName = 'Toggle'
