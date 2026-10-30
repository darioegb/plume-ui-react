'use client'

import type { ChangeEvent, FocusEvent, ForwardedRef, InputHTMLAttributes, ReactNode } from 'react'
import { forwardRef, useMemo } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { mergeRefs } from '../../../overlay/trigger'
import type { ComponentProps } from '../../../theme'
import { inputColorVars, useInputContext } from './input-context'
import styles from './input.module.css'

export type InputFieldAttributes = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  | 'aria-describedby'
  | 'aria-invalid'
  | 'aria-label'
  | 'aria-labelledby'
  | 'autoComplete'
  | 'defaultValue'
  | 'disabled'
  | 'id'
  | 'inputMode'
  | 'max'
  | 'maxLength'
  | 'min'
  | 'minLength'
  | 'name'
  | 'onBlur'
  | 'onChange'
  | 'pattern'
  | 'placeholder'
  | 'readOnly'
  | 'required'
  | 'type'
  | 'value'
>

export type InputFieldProps = Omit<ComponentProps, 'index'> & InputFieldAttributes

const chain =
  <E,>(first?: (event: E) => void, second?: (event: E) => void) =>
  (event: E): void => {
    first?.(event)
    second?.(event)
  }

/** The native `<input>`. It takes the native props of an input. */
export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    { className, disabled, onBlur, onChange, readOnly, style, type, ...own }: InputFieldProps,
    ref: ForwardedRef<HTMLInputElement>,
  ): ReactNode => {
    const context = useInputContext('InputField')
    const { colorScheme, fieldProps, isStyled, revealed, shape, size, variant } = context
    const setRef = useMemo(() => mergeRefs(context.fieldRef, ref), [context.fieldRef, ref])
    const resolvedType = type ?? fieldProps.type ?? 'text'
    const ariaInvalid = own['aria-invalid'] ?? fieldProps['aria-invalid']
    const invalid = ariaInvalid === true || ariaInvalid === 'true' || context.invalid
    const isDisabled = disabled ?? context.disabled
    const fieldStyle =
      invalid === context.invalid
        ? style
        : { ...inputColorVars(invalid ? 'error' : colorScheme), ...style }

    return (
      <input
        {...fieldProps}
        {...own}
        aria-invalid={ariaInvalid}
        className={joinClasses(
          isStyled && styles[size],
          isStyled && styles[shape],
          isStyled && styles[variant],
          isStyled && isDisabled && styles.disabled,
          isStyled && invalid && styles.invalid,
          className,
        )}
        data-disabled={isDisabled ? '' : undefined}
        data-invalid={invalid ? '' : undefined}
        data-plume-input-field=""
        disabled={isDisabled}
        onBlur={chain<FocusEvent<HTMLInputElement>>(fieldProps.onBlur, onBlur)}
        onChange={chain<ChangeEvent<HTMLInputElement>>(fieldProps.onChange, onChange)}
        readOnly={readOnly ?? context.readOnly}
        ref={setRef}
        style={fieldStyle}
        type={revealed && resolvedType === 'password' ? 'text' : resolvedType}
      />
    )
  },
)

InputField.displayName = 'InputField'
