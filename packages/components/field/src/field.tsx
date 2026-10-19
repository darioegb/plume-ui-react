import * as React from 'react'
import { Children, cloneElement, forwardRef, useState } from 'react'
import type { ForwardedRef, ReactElement, ReactNode } from 'react'
import type { ComponentProps } from '@plume-ui-react/core'
import styles from './field.module.css'

export interface FieldOwnProps {
  disabled?: boolean
  errorText?: ReactNode
  helperText?: ReactNode
  invalid?: boolean
  label?: ReactNode
  optionalText?: ReactNode
  orientation?: FieldOrientation
  readOnly?: boolean
  required?: boolean
}

export type FieldOrientation = 'vertical' | 'horizontal'

export interface FieldControlProps {
  'aria-describedby'?: string
  'aria-invalid'?: boolean | 'true' | 'false'
  disabled?: boolean
  id?: string
  readOnly?: boolean
  required?: boolean
}

type FieldRootAttributes = { children: ReactElement<FieldControlProps> }

export type FieldProps = Omit<ComponentProps, 'index'> & FieldRootAttributes & FieldOwnProps

let fieldCount = 0
const reactUseId = (React as { useId?: () => string }).useId

function useFieldId(): string {
  const reactId = reactUseId ? reactUseId() : undefined
  const [fallbackId] = useState(() => `plume-field-${++fieldCount}`)
  return reactId ?? fallbackId
}

export const Field = forwardRef<HTMLDivElement, FieldProps>(
  (
    {
      children,
      className = '',
      disabled = false,
      errorText,
      helperText,
      invalid = Boolean(errorText),
      label,
      optionalText,
      orientation = 'vertical',
      readOnly = false,
      required = false,
      style,
    }: FieldProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const baseId = useFieldId()
    const control = Children.only(children)
    const controlProps = control.props
    const controlId = controlProps.id ?? `${baseId}-control`
    const helperId = `${baseId}-helper`
    const errorId = `${baseId}-error`
    const showError = invalid && Boolean(errorText)

    const describedBy =
      [controlProps['aria-describedby'], showError ? errorId : null, helperText ? helperId : null]
        .filter(Boolean)
        .join(' ') || undefined

    const fieldClasses = `${styles.field} ${styles[orientation]} ${
      disabled ? styles.disabled : ''
    } ${className}`.trim()

    return (
      <div className={fieldClasses} ref={ref} style={style}>
        {label ? (
          <label className={styles.label} htmlFor={controlId}>
            {label}
            {required ? (
              <span aria-hidden="true" className={styles.requiredIndicator}>
                *
              </span>
            ) : null}
            {!required && optionalText ? (
              <span className={styles.optionalText}>{optionalText}</span>
            ) : null}
          </label>
        ) : null}
        {cloneElement(control, {
          id: controlId,
          'aria-describedby': describedBy,
          'aria-invalid': invalid || controlProps['aria-invalid'] || undefined,
          disabled: disabled || controlProps.disabled,
          readOnly: readOnly || controlProps.readOnly,
          required: required || controlProps.required,
        })}
        {helperText ? (
          <p className={styles.helperText} id={helperId}>
            {helperText}
          </p>
        ) : null}
        {showError ? (
          <p className={styles.errorText} id={errorId}>
            {errorText}
          </p>
        ) : null}
      </div>
    )
  },
)

Field.displayName = 'Field'
