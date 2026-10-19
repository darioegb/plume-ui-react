'use client'

import type { ChangeEvent, CSSProperties, ForwardedRef, InputHTMLAttributes, MouseEvent } from 'react'
import { forwardRef } from 'react'
import type { ColorScheme, ComponentProps, Size } from '../../../theme'
import styles from './radio.module.css'

export interface RadioOwnProps {
  colorScheme?: ColorScheme
  readOnly?: boolean
  size?: Size
  variant?: RadioVariant
}

export type RadioVariant = 'solid' | 'unstyled'

type RadioRootAttributes = Pick<
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

export type RadioProps = Omit<ComponentProps, 'index'> & RadioRootAttributes & RadioOwnProps

const radioColorVars = (colorScheme: ColorScheme, style?: CSSProperties): CSSProperties =>
  ({
    '--radio-solid': `var(--plume-color-${colorScheme}-solid)`,
    '--radio-contrast': `var(--plume-color-${colorScheme}-solid-contrast)`,
    '--radio-text': `var(--plume-color-${colorScheme}-text)`,
    ...style,
  }) as CSSProperties

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
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
    }: RadioProps,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const isStyled = variant !== 'unstyled'
    const isInvalid = rest['aria-invalid'] === true || rest['aria-invalid'] === 'true'
    const rootClasses = `${isStyled ? `${styles.root} ${styles[size]}` : ''} ${
      disabled ? styles.disabled : ''
    } ${className}`.trim()
    const inputClasses = isStyled
      ? `${styles.radio} ${isInvalid ? styles.invalid : ''}`.trim()
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
        style={radioColorVars(isInvalid ? 'error' : colorScheme, style)}
      >
        <input
          className={inputClasses}
          disabled={disabled}
          onChange={onChange ? ignoreWhenReadOnly : undefined}
          onClick={preventWhenReadOnly}
          ref={ref}
          type="radio"
          {...rest}
        />
        {children ? <span className={isStyled ? styles.label : undefined}>{children}</span> : null}
      </label>
    )
  },
)

Radio.displayName = 'Radio'
