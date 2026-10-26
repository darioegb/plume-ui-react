'use client'

import { Children, cloneElement, forwardRef, useId, useMemo } from 'react'
import type { ForwardedRef, ReactElement, ReactNode } from 'react'
import type { ComponentProps } from '../../../theme'
import { FieldContext } from './field-context'
import styles from './field.module.css'

export interface FieldOwnProps {
  /**
   * Disables the control and dims the label.
   *
   * @default false
   */
  disabled?: boolean
  /**
   * Error message shown below the control while the field is invalid. Setting it makes the field invalid unless `invalid` says otherwise.
   */
  errorText?: ReactNode
  /** Hint shown below the control and read as part of its description. */
  helperText?: ReactNode
  /**
   * Marks the field invalid: the control gets `aria-invalid` and error colors, and `errorText` is shown. It is on
   * when `errorText` is set, unless you pass `false`.
   */
  invalid?: boolean
  /** Label rendered above the control (beside it when horizontal) and linked to it. */
  label?: ReactNode
  /** Text shown next to the label when the field is not required, e.g. `(optional)`. */
  optionalText?: ReactNode
  /**
   * Places the label above the control (`vertical`), beside it in a column (`horizontal`, whose width comes from `--field-label-width`, default `8rem`), or right after it (`inline`, for `Checkbox`, `Radio` and `Toggle`; the helper and error texts go under the label).
   *
   * @default 'vertical'
   */
  orientation?: FieldOrientation
  /**
   * Passes `readOnly` to the control.
   *
   * @default false
   */
  readOnly?: boolean
  /**
   * Shows the required mark next to the label and passes `required` to the control.
   *
   * @default false
   */
  required?: boolean
}

export type FieldOrientation = 'vertical' | 'horizontal' | 'inline'

export interface FieldControlProps {
  'aria-describedby'?: string
  'aria-invalid'?: boolean | 'true' | 'false'
  children?: ReactNode
  disabled?: boolean
  id?: string
  readOnly?: boolean
  required?: boolean
}

type FieldRootAttributes = {
  /** The form control: a single element such as `Input` or `DatePicker`. */
  children: ReactElement<FieldControlProps>
}

export type FieldProps = Omit<ComponentProps, 'index'> & FieldRootAttributes & FieldOwnProps

interface FieldLabelProps {
  children: ReactNode
  htmlFor: string | undefined
  id: string | undefined
  optionalText: ReactNode
  required: boolean
}

function FieldLabel({
  children,
  htmlFor,
  id,
  optionalText,
  required,
}: Readonly<FieldLabelProps>): ReactElement {
  return (
    <label className={styles.label} htmlFor={htmlFor} id={id}>
      {children}
      {required ? (
        <span aria-hidden="true" className={styles.requiredIndicator}>
          *
        </span>
      ) : null}
      {!required && optionalText ? (
        <>
          {' '}
          <span className={styles.optionalText}>{optionalText}</span>
        </>
      ) : null}
    </label>
  )
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
    const baseId = useId()
    const control = Children.only(children)
    const controlProps = control.props
    const controlId = controlProps.id ?? `${baseId}-control`
    const labelId = label ? `${baseId}-label` : undefined
    const helperId = `${baseId}-helper`
    const errorId = `${baseId}-error`
    const showError = invalid && Boolean(errorText)

    const describedBy =
      [controlProps['aria-describedby'], showError ? errorId : null, helperText ? helperId : null]
        .filter(Boolean)
        .join(' ') || undefined

    const context = useMemo(() => ({ controlId, labelId }), [controlId, labelId])

    const fieldClasses = `${styles.field} ${styles[orientation]} ${
      disabled ? styles.disabled : ''
    } ${className}`.trim()

    return (
      <FieldContext.Provider value={context}>
        <div className={fieldClasses} ref={ref} style={style}>
          {label ? (
            <FieldLabel
              htmlFor={controlId}
              id={labelId}
              optionalText={optionalText}
              required={required}
            >
              {label}
            </FieldLabel>
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
            <p className={styles.errorText} id={errorId} role="alert">
              {errorText}
            </p>
          ) : null}
        </div>
      </FieldContext.Provider>
    )
  },
)

Field.displayName = 'Field'
