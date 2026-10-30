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
import { joinClasses } from '../../../overlay/class-names'
import styles from './checkbox.module.css'

export interface CheckboxOwnProps {
  /**
   * Color scheme from the theme palette, including custom schemes added to it.
   *
   * @default 'primary'
   */
  colorScheme?: ColorScheme
  /**
   * Shows a mixed state, for a parent that selects some of its children.
   *
   * @default false
   */
  indeterminate?: boolean
  /**
   * Shows the state without letting the user change it. It also silences `onChange`.
   *
   * @default false
   */
  readOnly?: boolean
  /**
   * Size of the box.
   *
   * @default 'md'
   */
  size?: Size
  /**
   * Visual variant. `solid` fills the box when checked and `outline` only colors its border and mark. `unstyled` leaves the native checkbox so you can bring your own styles.
   *
   * @default 'solid'
   */
  variant?: CheckboxVariant
}

export type CheckboxVariant = 'solid' | 'outline' | 'unstyled'

type CheckboxRootAttributes = Pick<
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
      className,
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
          isStyled && styles.checkbox,
          isStyled && styles[size],
          isStyled && styles[variant],
          isStyled && isInvalid && styles.invalid,
          className,
        )}
        data-disabled={disabled ? '' : undefined}
        data-indeterminate={indeterminate ? '' : undefined}
        data-invalid={isInvalid ? '' : undefined}
        data-plume-checkbox=""
        data-readonly={readOnly ? '' : undefined}
        disabled={disabled}
        onChange={onChange ? ignoreWhenReadOnly : undefined}
        onClick={preventWhenReadOnly}
        ref={inputRef}
        style={checkboxColorVars(isInvalid ? 'error' : colorScheme, style)}
        type="checkbox"
        {...rest}
      />
    )
  },
)

Checkbox.displayName = 'Checkbox'
