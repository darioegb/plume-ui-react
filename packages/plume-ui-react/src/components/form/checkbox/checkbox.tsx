'use client'

import type {
  ChangeEvent,
  CSSProperties,
  ForwardedRef,
  InputHTMLAttributes,
  MouseEvent,
} from 'react'
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import type { ColorScheme, ComponentProps, Size } from '../../../theme'
import styles from './checkbox.module.css'

export interface CheckboxOwnProps {
  colorScheme?: ColorScheme
  indeterminate?: boolean
  readOnly?: boolean
  size?: Size
  variant?: CheckboxVariant
}

export type CheckboxVariant = 'solid' | 'unstyled'

type CheckboxRootAttributes = Pick<
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

export type CheckboxProps = Omit<ComponentProps, 'index'> &
  CheckboxRootAttributes &
  CheckboxOwnProps

const checkboxColorVars = (colorScheme: ColorScheme, style?: CSSProperties): CSSProperties =>
  ({
    '--checkbox-solid': `var(--plume-color-${colorScheme}-solid)`,
    '--checkbox-contrast': `var(--plume-color-${colorScheme}-solid-contrast)`,
    '--checkbox-text': `var(--plume-color-${colorScheme}-text)`,
    ...style,
  }) as CSSProperties

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      children,
      className = '',
      colorScheme = 'primary',
      disabled = false,
      onChange,
      indeterminate = false,
      readOnly = false,
      size = 'md',
      style,
      variant = 'solid',
      ...rest
    }: CheckboxProps,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const isStyled = variant !== 'unstyled'
    const isInvalid = rest['aria-invalid'] === true || rest['aria-invalid'] === 'true'

    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)

    useEffect(() => {
      if (inputRef.current) inputRef.current.indeterminate = indeterminate
    }, [indeterminate])

    const rootClasses = `${isStyled ? `${styles.root} ${styles[size]}` : ''} ${
      disabled ? styles.disabled : ''
    } ${className}`.trim()
    const inputClasses = isStyled
      ? `${styles.checkbox} ${isInvalid ? styles.invalid : ''}`.trim()
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
        style={checkboxColorVars(isInvalid ? 'error' : colorScheme, style)}
      >
        <input
          aria-readonly={readOnly || undefined}
          className={inputClasses}
          disabled={disabled}
          onChange={onChange ? ignoreWhenReadOnly : undefined}
          onClick={preventWhenReadOnly}
          ref={inputRef}
          type="checkbox"
          {...rest}
        />
        {children ? <span className={isStyled ? styles.label : undefined}>{children}</span> : null}
      </label>
    )
  },
)

Checkbox.displayName = 'Checkbox'
