'use client'

import { Children, cloneElement, forwardRef, isValidElement, useId, useMemo } from 'react'
import type { ForwardedRef, HTMLAttributes, ReactElement, ReactNode } from 'react'
import { joinClasses } from '../../../overlay/class-names'
import { hasPart } from '../../../overlay/has-part'
import type { ComponentProps } from '../../../theme'
import { FieldContext } from './field-context'
import {
  FIELD_PARTS,
  FieldErrorText,
  FieldHelperText,
  FieldLabel,
  isFieldPart,
} from './field-parts'
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
  /**
   * `unstyled` drops the Plume styles of the field and of its parts, so you can lay it out yourself. A field has
   * no other look: its control has the variants.
   *
   * @default 'default'
   */
  variant?: FieldVariant
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

export type FieldVariant = 'default' | 'unstyled'

type FieldRootAttributes = Pick<HTMLAttributes<HTMLDivElement>, 'hidden' | 'id' | 'title'> & {
  /**
   * The form control, a single element such as `Input` or `DatePicker`. Put `FieldLabel`, `FieldHelperText` and
   * `FieldErrorText` next to it to compose the field yourself.
   */
  children: ReactNode
}

export type FieldProps = Omit<ComponentProps, 'index'> & FieldRootAttributes & FieldOwnProps

interface WireState {
  controlId: string
  describedBy: string | undefined
  disabled: boolean
  invalid: boolean
  readOnly: boolean
  required: boolean
}

function wireControl(
  element: ReactElement<FieldControlProps>,
  { controlId, describedBy, disabled, invalid, readOnly, required }: WireState,
): ReactElement {
  return cloneElement(element, {
    id: controlId,
    'aria-describedby': describedBy,
    'aria-invalid': invalid || element.props['aria-invalid'] || undefined,
    disabled: disabled || element.props.disabled,
    readOnly: readOnly || element.props.readOnly,
    required: required || element.props.required,
  })
}

function presentParts(
  children: ReactNode,
  { errorText, helperText, label }: Pick<FieldOwnProps, 'errorText' | 'helperText' | 'label'>,
): { hasError: boolean; hasHelper: boolean; hasLabel: boolean } {
  if (!hasPart(children, FIELD_PARTS)) {
    return {
      hasError: Boolean(errorText),
      hasHelper: Boolean(helperText),
      hasLabel: Boolean(label),
    }
  }
  return {
    hasError: hasPart(children, [FieldErrorText]),
    hasHelper: hasPart(children, [FieldHelperText]),
    hasLabel: hasPart(children, [FieldLabel]),
  }
}

export const Field = forwardRef<HTMLDivElement, FieldProps>(
  (
    {
      children,
      className,
      disabled = false,
      errorText,
      helperText,
      invalid = Boolean(errorText),
      label,
      optionalText,
      orientation = 'vertical',
      readOnly = false,
      required = false,
      variant = 'default',
      ...rest
    }: FieldProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const baseId = useId()
    const isStyled = variant !== 'unstyled'
    const composed = hasPart(children, FIELD_PARTS)
    const items = Children.toArray(children)
    const control = items.find(
      (child): child is ReactElement<FieldControlProps> =>
        isValidElement(child) && !isFieldPart(child),
    )
    const controlProps = control?.props ?? {}
    const controlId = controlProps.id ?? `${baseId}-control`
    const present = presentParts(children, { errorText, helperText, label })
    const { hasHelper, hasLabel } = present
    const hasError = invalid && present.hasError
    const labelId = hasLabel ? `${baseId}-label` : undefined
    const helperId = `${baseId}-helper`
    const errorId = `${baseId}-error`

    const describedBy =
      [controlProps['aria-describedby'], hasError ? errorId : null, hasHelper ? helperId : null]
        .filter(Boolean)
        .join(' ') || undefined

    const context = useMemo(
      () => ({
        controlId,
        disabled,
        errorId,
        helperId,
        invalid,
        isStyled,
        labelId,
        optionalText,
        required,
      }),
      [controlId, disabled, errorId, helperId, invalid, isStyled, labelId, optionalText, required],
    )

    const wire = (element: ReactElement<FieldControlProps>): ReactElement =>
      wireControl(element, {
        controlId,
        describedBy,
        disabled,
        invalid,
        readOnly,
        required,
      })

    return (
      <FieldContext.Provider value={context}>
        <div
          className={joinClasses(
            isStyled && styles.field,
            isStyled && styles[orientation],
            className,
          )}
          data-disabled={disabled ? '' : undefined}
          data-invalid={invalid ? '' : undefined}
          data-orientation={orientation}
          data-plume-field=""
          data-required={required ? '' : undefined}
          ref={ref}
          {...rest}
        >
          {composed ? (
            items.map((child) => (child === control ? wire(control) : child))
          ) : (
            <>
              {label ? <FieldLabel>{label}</FieldLabel> : null}
              {control ? wire(control) : null}
              {helperText ? <FieldHelperText>{helperText}</FieldHelperText> : null}
              {errorText ? <FieldErrorText>{errorText}</FieldErrorText> : null}
            </>
          )}
        </div>
      </FieldContext.Provider>
    )
  },
)

Field.displayName = 'Field'
